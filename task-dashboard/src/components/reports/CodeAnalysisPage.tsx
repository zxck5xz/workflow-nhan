import { useState, useRef } from 'react';
import { ClientSideApkParser } from '../../utils/apkParser';
import { apiService } from '../../data/apiService';
import { buildStandardReportMarkdown } from '../../data/reportTemplate';
import './CodeAnalysisPage.css';

export function CodeAnalysisPage() {
  const [mode, setMode] = useState<'apk' | 'link'>('apk');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const logsRef = useRef<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [productUrl, setProductUrl] = useState('');
  const [linkResult, setLinkResult] = useState<{
    found: boolean;
    info: Record<string, unknown>;
    packageName?: string;
  } | null>(null);

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

      addLog(`[Báo cáo] Đang tạo báo cáo chuẩn hóa...`);

      addLog(
        `[Hoàn tất] Tìm thấy ${result.permissions.length} permissions, ${result.activities.length} activities, ${result.apiEndpoints.length} API endpoints, ${result.suspiciousKeys.length} keys`,
      );

      addLog(`[Tra cứu] Đang tìm thông tin về package ${result.packageName}...`);
      let appInfo: Record<string, unknown> | null = null;
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

      const info: Record<string, unknown> = {
        name: appInfo?.name || result.packageName,
        packageName: result.packageName,
        developer: appInfo?.developer || 'N/A',
        category: appInfo?.category || 'N/A',
        rating: appInfo?.rating || 'N/A',
        installs: appInfo?.installs || 'N/A',
        updated: appInfo?.updated || 'N/A',
        size: appInfo?.size || `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
        description: appInfo?.description || '',
        activities: result.activities.length,
        permissions: result.permissions.length,
        apiEndpoints: result.apiEndpoints.length,
        suspiciousKeys: result.suspiciousKeys.length,
      };
      let md = buildStandardReportMarkdown(info, 'apk');

      md += `\n\n---\n\n## Phân tích kỹ thuật từ APK\n\n`;
      md += `*Dựa trên phân tích file APK (v${result.versionName}) — xử lý trên trình duyệt.*\n\n`;

      md += `### Entry Points (Activities)\n\n`;
      md += `APK khai báo **${result.activities.length}** activity components:\n\n`;
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

      md += `### Permission Model\n\n`;
      md += `Ứng dụng yêu cầu **${result.permissions.length}** Android permissions:\n\n`;
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
          md += `🌐 **Networking permissions (${networking.length}):** Network access detected.\n\n`;
        }
      } else {
        md += `- No permissions declared.\n\n`;
      }

      md += `### Network & API Surface\n\n`;
      if (result.apiEndpoints.length > 0) {
        md += `DEX bytecode scan phát hiện **${result.apiEndpoints.length}** API endpoints:\n\n`;
        md += '```\n';
        result.apiEndpoints.slice(0, 20).forEach((ep) => (md += `${ep}\n`));
        if (result.apiEndpoints.length > 20)
          md += `... and ${result.apiEndpoints.length - 20} more.\n`;
        md += '```\n\n';
      } else {
        md += `- No API endpoints extracted.\n\n`;
      }

      md += `### Security Analysis\n\n`;
      if (result.suspiciousKeys.length > 0) {
        md += `Phát hiện **${result.suspiciousKeys.length}** potential secrets/API keys:\n\n`;
        md += '```\n';
        result.suspiciousKeys.slice(0, 20).forEach((k) => (md += `${k}\n`));
        if (result.suspiciousKeys.length > 20)
          md += `... and ${result.suspiciousKeys.length - 20} more.\n`;
        md += '```\n\n';
      } else {
        md += `- No suspicious keys or secrets found.\n\n`;
      }

      setReport(md);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog(`[Lỗi] ${msg}`);
      setError(`Client-side analysis error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkSearch = async () => {
    if (!productUrl.trim()) {
      setError('Vui lòng nhập link sản phẩm (Google Play URL).');
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);
    setLinkResult(null);
    logsRef.current = [];
    setLogs([]);

    addLog(`[Tra cứu] Đang xử lý URL: ${productUrl}`);

    try {
      const res = await apiService.searchByUrl(productUrl);
      if (res.found && res.info) {
        addLog(`[Tra cứu] Tìm thấy: ${res.info.name} (${res.packageName || 'N/A'})`);
        setLinkResult({ found: true, info: res.info, packageName: res.packageName });

        const info: Record<string, unknown> = {
          name: res.info.name,
          packageName: res.packageName || 'N/A',
          developer: res.info.developer || 'N/A',
          category: res.info.category || 'N/A',
          rating: res.info.rating || 'N/A',
          installs: res.info.installs || 'N/A',
          updated: res.info.updated || 'N/A',
          size: res.info.size || 'N/A',
          description: res.info.description || '',
        };
        let md = buildStandardReportMarkdown(info, 'link');

        md += `\n\n---\n\n## 🔍 Thông tin tra cứu\n\n`;
        md += `- **Nguồn:** Google Play Store\n`;
        md += `- **Link:** ${productUrl}\n`;
        md += `- **Phân tích thêm:** Tải APK của sản phẩm này để phân tích kỹ thuật đầy đủ (permissions, activities, API endpoints, security scan).\n`;

        setReport(md);
      } else {
        addLog(`[Tra cứu] Không tìm thấy thông tin từ URL này`);
        setError(
          res.error ||
            'Không tìm thấy thông tin sản phẩm từ URL này. Vui lòng kiểm tra lại link Google Play.',
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog(`[Lỗi] ${msg}`);
      setError(`Lỗi tra cứu: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    if (!report) return;

    const fileName =
      mode === 'apk'
        ? selectedFile?.name.replace('.apk', '') || 'unknown'
        : linkResult?.info?.name?.replace(/\s+/g, '_') || 'product_info';
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

      <div className="mode-selector">
        <button
          className={`mode-tab ${mode === 'apk' ? 'active' : ''}`}
          onClick={() => {
            setMode('apk');
            setError(null);
            setReport(null);
            setLinkResult(null);
          }}
        >
          📱 APK Analysis
        </button>
        <button
          className={`mode-tab ${mode === 'link' ? 'active' : ''}`}
          onClick={() => {
            setMode('link');
            setError(null);
            setReport(null);
            setLinkResult(null);
          }}
        >
          🔗 Product Link Search
        </button>
      </div>

      {mode === 'apk' && (
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
      )}

      {mode === 'link' && (
        <div className="analysis-controls">
          <div className="control-group">
            <p>
              Tra cứu thông tin sản phẩm từ link Google Play. Nhập URL ứng dụng để lấy thông tin
              tổng quan (tên, nhà phát triển, thể loại, đánh giá, v.v.).
            </p>
            <div className="link-search-zone">
              <input
                type="url"
                className="url-input"
                placeholder="https://play.google.com/store/apps/details?id=com.example.app"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                disabled={loading}
              />
              <button
                className={`analyze-button ${loading ? 'loading' : ''}`}
                onClick={handleLinkSearch}
                disabled={loading || !productUrl.trim()}
              >
                {loading ? 'Đang tra cứu...' : 'Tra cứu thông tin'}
              </button>
            </div>
          </div>
        </div>
      )}

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
            <div className="empty-icon">{mode === 'apk' ? '🛡️' : '🔗'}</div>
            <h3>{mode === 'apk' ? 'Sẵn sàng phân tích' : 'Tra cứu sản phẩm'}</h3>
            <p>
              {mode === 'apk'
                ? 'Chọn file APK và nhấn "Phân tích APK (Local)" để bắt đầu.'
                : 'Nhập link Google Play và nhấn "Tra cứu thông tin" để xem thông tin sản phẩm.'}
            </p>
          </div>
        )}

        {report && (
          <div className="report-container">
            <div className="report-card">
              <div className="report-header">
                <h2>{mode === 'apk' ? 'Báo cáo APK Mobile (Local)' : 'Thông tin sản phẩm'}</h2>
                <div className="report-actions">
                  <span className="badge">
                    {mode === 'apk' ? 'Browser Analyzed' : 'Play Store'}
                  </span>
                  <button className="download-btn" onClick={downloadReport}>
                    📥 Download Report
                  </button>
                </div>
              </div>
              <pre className="report-body">{report}</pre>
            </div>

            {logs.length > 0 && (
              <div className="terminal-output">
                <h3>{mode === 'apk' ? 'Analysis Log' : 'Search Log'}</h3>
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
