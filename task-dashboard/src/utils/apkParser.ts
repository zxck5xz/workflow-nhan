import JSZip from 'jszip';

export interface ApkAnalysisResult {
  packageName: string;
  versionName: string;
  permissions: string[];
  activities: string[];
  apiEndpoints: string[];
  suspiciousKeys: string[];
}

export class ClientSideApkParser {
  static async parse(file: File, onProgress?: (step: string) => void): Promise<ApkAnalysisResult> {
    onProgress?.('Đang giải nén file APK...');
    const zip = await JSZip.loadAsync(file);
    const result: ApkAnalysisResult = {
      packageName: 'Unknown',
      versionName: 'Unknown',
      permissions: [],
      activities: [],
      apiEndpoints: [],
      suspiciousKeys: [],
    };

    // 1. Process Manifest (Basic attempt - AXML is binary, so we'll use string scanning for now)
    onProgress?.('Đang đọc AndroidManifest.xml...');
    const manifestFile = zip.file('AndroidManifest.xml');
    if (manifestFile) {
      const manifestBuffer = await manifestFile.async('arraybuffer');
      const manifestString = this.decodeBinaryXml(new Uint8Array(manifestBuffer));

      // Basic regex extraction from the decoded (rough) string
      const pkgMatch = manifestString.match(/package="([^"]+)"/);
      if (pkgMatch) result.packageName = pkgMatch[1];

      const verMatch = manifestString.match(/versionName="([^"]+)"/);
      if (verMatch) result.versionName = verMatch[1];

      const perms = manifestString.match(/android\.permission\.([A-Z_]+)/g);
      if (perms) result.permissions = [...new Set(perms)];

      // This is complex for regex, so we'll just grab all activity-like names
      const allActivities = manifestString.match(/activity[\s\S]*?android:name="([^"]+)"/g);
      if (allActivities) {
        result.activities = allActivities
          .map((a) => {
            const m = a.match(/android:name="([^"]+)"/);
            return m ? m[1] : '';
          })
          .filter(Boolean);
      }
    }

    // 2. Process DEX files for strings (API keys, endpoints)
    const dexFiles = Object.keys(zip.files).filter((name) => name.endsWith('.dex'));
    let dexIndex = 0;
    for (const dexName of dexFiles) {
      dexIndex++;
      onProgress?.(`Đang quét file DEX (${dexIndex}/${dexFiles.length})...`);
      const dexFile = zip.file(dexName);
      if (dexFile) {
        const dexBuffer = await dexFile.async('arraybuffer');
        const strings = this.extractDexStrings(new Uint8Array(dexBuffer));

        for (const s of strings) {
          if (s.includes('://') && s.length < 200) {
            if (/api|cloud|firebase|aws|google|http/i.test(s)) {
              result.apiEndpoints.push(s);
            }
          }
          if (/api_key|secret|token|password|aws_access/i.test(s)) {
            if (s.length > 8 && s.length < 100) {
              result.suspiciousKeys.push(s);
            }
          }
        }
      }
    }

    onProgress?.('Đang tổng hợp kết quả...');
    result.apiEndpoints = [...new Set(result.apiEndpoints)];
    result.suspiciousKeys = [...new Set(result.suspiciousKeys)];

    return result;
  }

  /**
   * Extremely simplified Binary XML (AXML) to string conversion.
   * Real AXML parsing is complex, but for security analysis,
   * we can often extract identifying strings.
   */
  private static decodeBinaryXml(uint8: Uint8Array): string {
    let out = '';
    for (let i = 0; i < uint8.length; i++) {
      const charCode = uint8[i];
      // Keep only printable ASCII for basic analysis
      if (charCode >= 32 && charCode <= 126) {
        out += String.fromCharCode(charCode);
      } else {
        out += ' ';
      }
    }
    return out;
  }

  /**
   * Scans DEX files for printable strings.
   */
  private static extractDexStrings(uint8: Uint8Array): string[] {
    const strings: string[] = [];
    let current = '';
    for (let i = 0; i < uint8.length; i++) {
      const charCode = uint8[i];
      if (charCode >= 32 && charCode <= 126) {
        current += String.fromCharCode(charCode);
      } else {
        if (current.length > 4) {
          strings.push(current);
        }
        current = '';
      }
    }
    return strings;
  }
}
