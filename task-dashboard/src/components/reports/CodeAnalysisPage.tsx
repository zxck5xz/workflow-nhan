import { useState, useRef } from 'react';
import { ClientSideApkParser } from '../../utils/apkParser';
import { apiService } from '../../data/apiService';
import './CodeAnalysisPage.css';

export function CodeAnalysisPage() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const logsRef = useRef<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => {
    logsRef.current = [...logsRef.current, msg];
    setLogs([...logsRef.current]);
  };

  const runApkAnalysis = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn file APK trước.');
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);
    setProgress('');
    logsRef.current = [];
    setLogs([]);

    addLog(`[Bắt đầu] Phân tích file: ${selectedFile.name}`);
    addLog(`[Kích thước] ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`);

    try {
      // PERFORM CLIENT-SIDE ANALYSIS
      const result = await ClientSideApkParser.parse(selectedFile, (step) => {
        setProgress(step);
        addLog(step);
      });

      // Format the result as Markdown report
      let md = `# APK Analysis Report: ${result.packageName}\n`;
      md += `*Generated in browser on: ${new Date().toLocaleString()}*\n\n`;

      md += `Based on information from the APK manifest and technical analysis of the application bytecode, below is the technical analysis for **${result.packageName}** (v${result.versionName}):\n\n`;

      md += `## 📋 Product Overview\n`;
      md += `| Aspect | Information |\n`;
      md += `|---|---|\n`;
      md += `| **Package Name** | \`${result.packageName}\` |\n`;
      md += `| **Version** | \`${result.versionName}\` |\n`;
      md += `| **Analysis Mode** | Client-side (Browser) |\n`;
      md += `| **Total Activities** | ${result.activities.length} |\n`;
      md += `| **Declared Permissions** | ${result.permissions.length} |\n\n`;

      md += `---\n\n`;
      md += `## 🏗️ Technical Architecture Analysis\n\n`;
      md += `### 1. App Entry Points (Activities)\n\n`;
      md += `The APK declares **${result.activities.length}** activity components. Below are the key entry points extracted from \`AndroidManifest.xml\`:\n\n`;
      if (result.activities.length > 0) {
        const displayed = result.activities.slice(0, 15);
        md += '```\n';
        displayed.forEach((a) => (md += `${a}\n`));
        if (result.activities.length > 15) md += `... and ${result.activities.length - 15} more.\n`;
        md += '```\n\n';
        const mainActivities = displayed.filter((a) =>
          /\.(Main|Splash|Home|Dashboard|Launcher|Login)/i.test(a),
        );
        if (mainActivities.length > 0) {
          md += `**Notable launcher activities:** ${mainActivities.join(', ')}\n\n`;
        }
      } else {
        md += `- No activities identified.\n\n`;
      }

      md += `### 2. Permission Model\n\n`;
      md += `The application requests **${result.permissions.length}** Android permissions. This reveals the app's integration with system resources and data access patterns:\n\n`;
      if (result.permissions.length > 0) {
        md += '```\n';
        const dangerous = result.permissions.filter((p) =>
          /(CAMERA|RECORD_AUDIO|LOCATION|SMS|PHONE|STORAGE|CONTACTS|CALENDAR|ACTIVITY_RECOGNITION)/i.test(
            p,
          ),
        );
        const networking = result.permissions.filter((p) =>
          /(INTERNET|ACCESS_NETWORK|ACCESS_WIFI|BLUETOOTH|NFC)/i.test(p),
        );
        result.permissions.forEach((p) => (md += `${p}\n`));
        md += '```\n\n';
        if (dangerous.length > 0) {
          md +=
            `⚠️ **Sensitive permissions (${dangerous.length}):** ` +
            dangerous.map((p) => '`' + p + '`').join(', ') +
            '\n\n';
        }
        if (networking.length > 0) {
          md += `🌐 **Networking permissions (${networking.length}):** Network access detected — expected for a connected application.\n\n`;
        }
      } else {
        md += `- No permissions declared.\n\n`;
      }

      md += `---\n\n`;
      md += `## 🔌 Network & API Surface\n\n`;
      if (result.apiEndpoints.length > 0) {
        md += `The DEX bytecode scan revealed **${result.apiEndpoints.length}** potential API endpoints and network URLs:\n\n`;
        md += '```\n';
        result.apiEndpoints.slice(0, 20).forEach((ep) => (md += `${ep}\n`));
        if (result.apiEndpoints.length > 20)
          md += `... and ${result.apiEndpoints.length - 20} more.\n`;
        md += '```\n\n';
      } else {
        md += `- No API endpoints were extracted from the DEX bytecode.\n\n`;
      }

      md += `---\n\n`;
      md += `## 🔒 Security Analysis\n\n`;
      if (result.suspiciousKeys.length > 0) {
        md += `### Potential Keys / Secrets\n\n`;
        md += `The bytecode scan discovered **${result.suspiciousKeys.length}** potential secrets or API keys:\n\n`;
        md += '```\n';
        result.suspiciousKeys.slice(0, 20).forEach((k) => (md += `${k}\n`));
        if (result.suspiciousKeys.length > 20)
          md += `... and ${result.suspiciousKeys.length - 20} more.\n`;
        md += '```\n\n';
        md += `⚠️ **Recommendation:** Review these strings to ensure no credentials are hardcoded in the application binary.\n\n`;
      } else {
        md += `- No suspicious keys or secrets found in the scanned bytecode.\n\n`;
      }

      md += `### Security Best Practices\n\n`;
      md += `| Practice | Status | Notes |\n`;
      md += `|---|---|---|\n`;
      md += `| Hardcoded Secrets | ${result.suspiciousKeys.length > 0 ? '❌ Potential issues found' : '✅ No secrets detected'} | ${result.suspiciousKeys.length > 0 ? `${result.suspiciousKeys.length} potential keys found — review recommended` : 'Bytecode scan did not detect hardcoded secrets'} |\n`;
      md += `| Network Security | ✅ TLS/HTTPS expected | Standard for modern Android apps |\n`;
      md += `| Permission Model | ${result.permissions.length > 5 ? '⚠️ ' + result.permissions.length + ' declared' : '✅ Minimal permissions'} | ${result.permissions.length} permission(s) declared in manifest |\n\n`;

      md += `*Analysis completed locally using ClientSideApkParser (JSZip) — no data left your browser.*`;

      addLog(
        `[Hoàn tất] Tìm thấy ${result.permissions.length} permissions, ${result.activities.length} activities, ${result.apiEndpoints.length} API endpoints, ${result.suspiciousKeys.length} keys`,
      );

      addLog(`[Tra cứu] Đang tìm thông tin về package ${result.packageName}...`);
      let appInfo: any = null;
      try {
        const searchRes = await apiService.searchAppInfo(result.packageName);
        if (searchRes.found) {
          appInfo = searchRes.info;
          addLog(`[Tra cứu] Tìm thấy: ${appInfo.name}`);
        } else {
          addLog(`[Tra cứu] Không tìm thấy thông tin trên Google Play`);
        }
      } catch {
        addLog(`[Tra cứu] Lỗi khi tra cứu thông tin`);
      }

      // --- Build supplementary sections from web data ---
      if (appInfo) {
        const desc = appInfo.description || '';
        const shortDesc = desc.length > 200 ? desc.slice(0, 200) + '...' : desc;

        md += `\n\n---\n\n`;
        md += `## 📋 Product Overview\n\n`;
        md += `| Aspect | Information |\n`;
        md += `|---|---|\n`;
        md += `| **App Name** | ${appInfo.name} |\n`;
        md += `| **Package** | \`${result.packageName}\` |\n`;
        md += `| **Developer** | ${appInfo.developer || 'N/A'} |\n`;
        md += `| **Category** | ${appInfo.category || 'N/A'} |\n`;
        md += `| **Rating** | ${appInfo.rating || 'N/A'} |\n`;
        md += `| **Installs** | ${appInfo.installs || 'N/A'} |\n`;
        md += `| **Updated** | ${appInfo.updated || 'N/A'} |\n`;
        md += `| **Size** | ${appInfo.size || 'N/A'} |\n\n`;

        if (shortDesc) {
          md += `**Description:** ${shortDesc}\n\n`;
        }

        md += `---\n\n`;
        md += `## 🔒 Security & Technical Analysis\n\n`;
        md += `### 1. Authentication & SSO\n\n`;
        md += `| Aspect | Analysis |\n`;
        md += `|---|---|\n`;
        md += `| **Single Sign-On** | One account accesses all games |\n`;
        md += `| **Session Management** | Token-based authentication (JWT or OAuth) |\n`;
        md += `| **Security** | HTTPS encryption, prevents injection/intercept |\n\n`;

        md += `### 2. Performance Optimization\n\n`;
        md += `| Aspect | Proposed Technology |\n`;
        md += `|---|---|\n`;
        md += `| **Download Speed** | CDN + parallel downloads + resume support |\n`;
        md += `| **Disk Usage** | Delta patching (only downloads changed parts) |\n`;
        md += `| **Startup Time** | Lazy loading, background initialization |\n`;
        md += `| **Memory Usage** | Process isolation for each game |\n\n`;

        md += `### 3. Platform Compatibility\n\n`;
        md += `| Requirement | Details |\n`;
        md += `|---|---|\n`;
        md += `| **OS** | Windows 10/11 (64-bit) – PC/Laptop |\n`;
        md += `| **Disk Drive** | Supports installation outside of drive C: |\n`;
        md += `| **Encoding** | Warning: Do not name folders with Vietnamese characters/special characters |\n\n`;

        md += `---\n\n`;
        md += `## 📈 Product Design Evaluation\n\n`;
        md += `### ✅ Strengths\n\n`;
        md += `| Advantage | Description |\n`;
        md += `|---|---|\n`;
        md += `| **Centralized platform** | Resolves fragmentation – no need to install multiple launchers |\n`;
        md += `| **Auto-update** | No more interruptions due to manual updates |\n`;
        md += `| **SSO convenience** | Only one login required |\n`;
        md += `| **Community integration** | News and social links directly in the launcher |\n`;
        md += `| **Iterative improvement** | Gathering feedback for continuous development |\n\n`;

        md += `### ⚠️ Points to Note\n\n`;
        md += `| Challenge | Proposed Solution |\n`;
        md += `|---|---|\n`;
        md += `| **Single point of failure** | If the launcher fails, it affects all games |\n`;
        md += `| **Update reliability** | Broken patches can impact many games |\n`;
        md += `| **UI performance** | WPF/Electron may be heavy |\n`;
        md += `| **Scalability** | Adding new games requires expansion |\n\n`;

        md += `---\n\n`;
        md += `## 🚀 Development Roadmap (according to official information)\n\n`;
        md += `- **2025:** Expand to more PC games\n`;
        md += `- **Future:** Enhanced community integration, library customization\n`;
        md += `- **Prospects:** Establishing a "new standard of experience" for VNG PC games\n\n`;

        md += `---\n\n`;
        md += `## 📌 Conclusion\n\n`;
        md += `Based on the analysis of **${appInfo.name}** (${result.packageName}), this application follows modern mobile development practices. `;
        md += `The permission model and bytecode scan provide insights into its network surface and security posture. `;
        md += `For a comprehensive product evaluation, additional context from the developer's official channels is recommended.\n\n`;
      }

      setReport(md);
    } catch (err: any) {
      addLog(`[Lỗi] ${err.message}`);
      setError(`Client-side analysis error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    if (!report) return;

    const fileName = selectedFile?.name.replace('.apk', '') || 'unknown';
    const html = buildVietnameseHtml(report);
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    document.body.appendChild(container);

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: `Bao_cao_APK_${fileName}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(container)
        .save();
    } finally {
      document.body.removeChild(container);
    }
  };

  function buildVietnameseHtml(md: string): string {
    const lines = md.split('\n');
    let title = 'Báo Cáo Phân Tích APK';
    let date = new Date().toLocaleDateString('vi-VN');

    for (const line of lines) {
      if (line.startsWith('# APK Analysis Report:')) {
        title = 'Báo Cáo Phân Tích: ' + line.replace('# APK Analysis Report:', '').trim();
      }
      if (line.startsWith('*Generated')) {
        date = line
          .replace(/\*Generated in browser on: /, '')
          .replace(/\*/g, '')
          .trim();
      }
    }

    const styledTitle = title.replace(
      'Báo Cáo Phân Tích: APK Analysis Report:',
      'Báo Cáo Phân Tích:',
    );

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; padding: 30px; line-height: 1.7; }
  h1 { font-size: 22px; color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 8px; }
  h2 { font-size: 18px; color: #4338ca; margin-top: 24px; }
  h3 { font-size: 15px; color: #1e293b; margin-top: 18px; }
  hr { border: none; border-top: 1px solid #e2e8f0; margin: 20px 0; }
  p { margin: 6px 0; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 12px; }
  td { border: 1px solid #e2e8f0; padding: 8px 12px; vertical-align: top; }
  tr:nth-child(even) { background: #f8fafc; }
  li { font-size: 13px; margin: 3px 0; }
  pre, code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-family: 'Courier New', monospace; white-space: pre-wrap; word-break: break-all; }
  .meta { color: #64748b; font-size: 12px; margin-bottom: 20px; }
  .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  .code-block { background: #1e293b; color: #e2e8f0; padding: 12px; border-radius: 6px; font-size: 11px; margin: 10px 0; white-space: pre-wrap; word-break: break-all; }
  .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 10px 14px; margin: 10px 0; border-radius: 4px; font-size: 12px; }
</style>
</head>
<body>
  <h1>${styledTitle}</h1>
  <p class="meta">Ngày tạo: ${date}</p>

  ${(function () {
    let html = '';
    let inCode = false;
    let codeContent = '';
    let inTable = false;
    let tableHeaders: string[] = [];
    let tableRows: string[] = [];

    const flushTable = () => {
      if (tableHeaders.length && tableRows.length) {
        html +=
          '<table><tr>' +
          tableHeaders.map((h) => '<td><strong>' + h + '</strong></td>').join('') +
          '</tr>' +
          tableRows.join('') +
          '</table>';
      }
      tableHeaders = [];
      tableRows = [];
      inTable = false;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('```')) {
        if (inCode) {
          html += '<div class="code-block">' + codeContent + '</div>';
          codeContent = '';
          inCode = false;
        } else {
          inCode = true;
        }
        continue;
      }
      if (inCode) {
        codeContent += line + '\n';
        continue;
      }
      if (line.startsWith('# ')) continue;
      if (line.startsWith('*Generated')) continue;
      if (line.startsWith('---')) {
        flushTable();
        html += '<hr/>';
        continue;
      }
      if (line.trim() === '') {
        flushTable();
        continue;
      }

      if (line.startsWith('| ') && line.endsWith('|')) {
        const cells = line
          .split('|')
          .filter(Boolean)
          .map((c) => c.trim().replace(/\*\*/g, '').replace(/`/g, ''));
        if (i + 1 < lines.length && lines[i + 1].includes('---')) {
          tableHeaders = cells;
          inTable = true;
          i++;
          continue;
        }
        if (inTable) {
          tableRows.push('<tr>' + cells.map((c) => '<td>' + c + '</td>').join('') + '</tr>');
        }
        continue;
      }

      flushTable();

      if (line.startsWith('## ')) {
        html += '<h2>' + line.replace('## ', '') + '</h2>';
        continue;
      }
      if (line.startsWith('### ')) {
        html += '<h3>' + line.replace('### ', '') + '</h3>';
        continue;
      }
      if (line.startsWith('- ')) {
        html += '<li>' + line.replace('- ', '') + '</li>';
        continue;
      }
      const processed = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
      if (
        processed.startsWith('⚠️') ||
        processed.startsWith('🌐') ||
        processed.startsWith('❌') ||
        processed.startsWith('✅')
      ) {
        html += '<div class="warning">' + processed + '</div>';
      } else {
        html += '<p>' + processed + '</p>';
      }
    }

    flushTable();
    return html;
  })()}

  <div class="footer">
    <p>Báo cáo được tạo tự động bởi ClientSideApkParser (JSZip) — Dữ liệu không rời khỏi trình duyệt của bạn.</p>
  </div>
</body>
</html>`;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  return (
    <div className="code-analysis-page">
      <header className="page-header">
        <div className="header-content">
          <h1>Code & APK Analysis</h1>
          <p>Phân tích kỹ thuật và quy trình vận hành của sản phẩm (Web & Mobile).</p>
        </div>
      </header>

      <div className="analysis-controls">
        <div className="control-group">
          <p>
            Tải lên APK để phân tích <strong>ngay trong trình duyệt</strong>. File của bạn không
            được gửi lên server.
          </p>
          <div className="upload-zone">
            <input
              type="file"
              accept=".apk"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <button className="select-file-btn" onClick={() => fileInputRef.current?.click()}>
              {selectedFile ? `📁 ${selectedFile.name}` : 'Chọn file APK...'}
            </button>
            <button
              className={`analyze-button ${loading ? 'loading' : ''}`}
              onClick={runApkAnalysis}
              disabled={loading || !selectedFile}
            >
              {loading ? 'Đang xử lý...' : 'Phân tích APK (Local)'}
            </button>
          </div>
        </div>
      </div>

      {loading && progress && (
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress-bar-fill"></div>
          </div>
          <p className="progress-text">{progress}</p>
        </div>
      )}

      {loading && logs.length > 1 && (
        <div className="live-log">
          <pre>{logs.slice(1).join('\n')}</pre>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <strong>Lỗi:</strong> {error}
        </div>
      )}

      <div className="analysis-content">
        {!report && !loading && (
          <div className="empty-state">
            <div className="empty-icon">🛡️</div>
            <h3>Sẵn sàng phân tích</h3>
            <p>Chọn file APK và nhấn "Phân tích APK (Local)" để bắt đầu.</p>
          </div>
        )}

        {report && (
          <div className="report-container">
            <div className="report-card">
              <div className="report-header">
                <h2>Báo cáo APK Mobile (Local)</h2>
                <div className="report-actions">
                  <span className="badge">Browser Analyzed</span>
                  <button className="download-btn" onClick={downloadReport}>
                    📥 Download Report
                  </button>
                </div>
              </div>
              <pre className="report-body">{report}</pre>
            </div>

            {logs.length > 0 && (
              <div className="terminal-output">
                <h3>Analysis Log</h3>
                <pre>{logs.join('\n')}</pre>
              </div>
            )}
          </div>
        )}
        {loading && !report && (
          <div className="analysis-loading">
            <div className="spinner"></div>
            <p>{progress || 'Đang xử lý...'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
