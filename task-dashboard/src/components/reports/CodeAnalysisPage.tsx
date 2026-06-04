import { useState, useRef } from 'react';
import { ClientSideApkParser } from '../../utils/apkParser';
import { apiService } from '../../data/apiService';
import { buildStandardReportMarkdown, buildVietnameseHtml } from '../../data/reportTemplate';
import './CodeAnalysisPage.css';

export function CodeAnalysisPage() {
  const [mode, setMode] = useState<'apk' | 'product'>('apk');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const logsRef = useRef<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [productQuery, setProductQuery] = useState('');
  const [productResult, setProductResult] = useState<{
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
        if (searchRes.found && searchRes.info) {
          appInfo = searchRes.info;
          addLog(`[Tra cứu] Tìm thấy: ${String(appInfo.name || '')}`);
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

  const handleProductSearch = async () => {
    if (!productQuery.trim()) {
      setError('Vui lòng nhập tên sản phẩm, link Google Play hoặc link quảng cáo.');
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);
    setProductResult(null);
    logsRef.current = [];
    setLogs([]);

    addLog(`[Tra cứu] Đang xử lý truy vấn: ${productQuery}`);

    try {
      const res = await apiService.searchProduct(productQuery);
      if (res.found && res.info) {
        const ri = res.info;
        addLog(`[Tra cứu] Tìm thấy: ${String(ri.name || '')} (${res.packageName || 'N/A'})`);
        setProductResult({ found: true, info: ri, packageName: res.packageName });

        const info: Record<string, unknown> = {
          name: ri.name,
          packageName: res.packageName || 'N/A',
          developer: ri.developer,
          category: ri.category,
          rating: ri.rating,
          installs: ri.installs,
          updated: ri.updated,
          size: ri.size,
          description: ri.description,
        };
        let md = buildStandardReportMarkdown(info, 'product');
        const src = res.sourceInfo as Record<string, unknown> | undefined;
        const sourceType = src?.type as string | undefined;

        let sourceLabel: string;
        if (sourceType === 'google_play') {
          sourceLabel = 'Google Play Store (direct link)';
        } else if (sourceType === 'promo_link') {
          sourceLabel = 'Promotional link (resolved & matched)';
        } else {
          sourceLabel = 'Google Play Search (by name)';
        }

        md += `\n\n---\n\n## 🔍 Thông tin tra cứu\n\n`;
        md += `- **Nguồn:** ${sourceLabel}\n`;
        md += `- **Truy vấn:** ${productQuery}\n`;
        if (src?.resolvedUrl && String(src.resolvedUrl) !== productQuery.trim()) {
          md += `- **URL thực tế:** ${src.resolvedUrl}\n`;
        }
        if (src?.title && String(src.title) !== String(ri.name || '')) {
          md += `- **Tiêu đề trang:** ${src.title}\n`;
        }
        if (src?.siteName) {
          md += `- **Trang nguồn:** ${src.siteName}\n`;
        }
        md += `- **Phân tích thêm:** Tải APK của sản phẩm này để phân tích kỹ thuật đầy đủ (permissions, activities, API endpoints, security scan).\n`;

        setReport(md);
      } else {
        addLog(`[Tra cứu] Không tìm thấy thông tin`);
        setError(
          res.error ||
            'Không tìm thấy thông tin sản phẩm. Vui lòng thử với tên sản phẩm khác hoặc link Google Play.',
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

    const productName = productResult?.info?.name;
    const fileName =
      mode === 'apk'
        ? selectedFile?.name.replace('.apk', '') || 'unknown'
        : typeof productName === 'string'
          ? productName.replace(/\s+/g, '_')
          : 'product_info';
    const html = buildVietnameseHtml(report);
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.position = 'absolute';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '800px';
    container.style.zIndex = '-1000';
    container.style.background = '#fff';
    document.body.appendChild(container);

    try {
      await new Promise((r) => setTimeout(r, 300));
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: `Bao_cao_APK_${fileName}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false, width: 800 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(container)
        .save();
    } finally {
      document.body.removeChild(container);
    }
  };

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
            setProductResult(null);
          }}
        >
          📱 APK Analysis
        </button>
        <button
          className={`mode-tab ${mode === 'product' ? 'active' : ''}`}
          onClick={() => {
            setMode('product');
            setError(null);
            setReport(null);
            setProductResult(null);
          }}
        >
          🔍 Product Search
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

      {mode === 'product' && (
        <div className="analysis-controls">
          <div className="control-group">
            <p>
              Tra cứu thông tin sản phẩm bằng tên, link Google Play hoặc link quảng cáo. Ví dụ:{' '}
              <em>"Liên Quân Mobile"</em>,{' '}
              <em>https://play.google.com/store/apps/details?id=com.example</em> hoặc{' '}
              <em>https://some.promo.link/game</em>.
            </p>
            <div className="link-search-zone">
              <input
                type="text"
                className="url-input"
                placeholder="Nhập tên sản phẩm, link Google Play hoặc link quảng cáo..."
                value={productQuery}
                onChange={(e) => setProductQuery(e.target.value)}
                disabled={loading}
              />
              <button
                className={`analyze-button ${loading ? 'loading' : ''}`}
                onClick={handleProductSearch}
                disabled={loading || !productQuery.trim()}
              >
                {loading ? 'Đang tra cứu...' : 'Tra cứu sản phẩm'}
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
            <div className="empty-icon">{mode === 'apk' ? '🛡️' : '🔍'}</div>
            <h3>{mode === 'apk' ? 'Sẵn sàng phân tích' : 'Tra cứu sản phẩm'}</h3>
            <p>
              {mode === 'apk'
                ? 'Chọn file APK và nhấn "Phân tích APK (Local)" để bắt đầu.'
                : 'Nhập tên sản phẩm, link Google Play hoặc link quảng cáo, nhấn "Tra cứu sản phẩm" để xem thông tin.'}
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
                    {mode === 'apk' ? 'Browser Analyzed' : 'Product Info'}
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
