import { useState, useRef, useEffect } from 'react';
import { ClientSideApkParser } from '../../utils/apkParser';
import { apiService } from '../../data/apiService';
import { buildStandardReportMarkdown, buildVietnameseHtml } from '../../data/reportTemplate';
import './CodeAnalysisPage.css';

export function CodeAnalysisPage() {
  const [mode, setMode] = useState<'apk' | 'product'>('apk');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [apkTechnicalData, setApkTechnicalData] = useState<any>(null);
  const [apkInterpretation, setApkInterpretation] = useState<any>(null);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const logsRef = useRef<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [productQuery, setProductQuery] = useState('');
  const [productResult, setProductResult] = useState<{
    found: boolean;
    info: any;
    packageName?: string;
  } | null>(null);

  const [analyzingSentiment, setAnalyzingSentiment] = useState(false);
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);

  const addLog = (msg: string) => {
    logsRef.current = [...logsRef.current, msg];
    setLogs([...logsRef.current]);
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const reports = await apiService.listResearchReports();
      setHistory(reports);
    } catch (err) {
      console.error('Failed to fetch research history', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleInterpretApk = async () => {
    if (!apkTechnicalData) return;

    setIsInterpreting(true);
    addLog(`[AI] Đang yêu cầu AI giải mã ý nghĩa kỹ thuật...`);

    try {
      const data = await apiService.interpretApk(apkTechnicalData);
      setApkInterpretation(data);
      addLog(`[AI] Đã có kết quả phân tích AI.`);

      // Save APK report with interpretation
      await apiService.saveResearchReport({
        type: 'apk',
        title: `APK Analysis: ${apkTechnicalData.packageName}`,
        packageName: apkTechnicalData.packageName,
        technicalData: apkTechnicalData,
        interpretation: data,
        markdownReport: report,
      });
      fetchHistory();
    } catch (err: any) {
      addLog(`[Lỗi AI] ${err.message}`);
    } finally {
      setIsInterpreting(false);
    }
  };

  const loadReportFromHistory = (item: any) => {
    setMode(item.type);
    setReport(item.markdownReport || null);
    setCurrentReportId(item.id || null);
    if (item.type === 'apk') {
      setApkTechnicalData(item.technicalData);
      setApkInterpretation(item.interpretation);
    } else if (item.type === 'product') {
      setProductResult({ found: true, info: item.technicalData });
      const hasSentiment = item.sentimentScore !== null && item.sentimentScore !== undefined;
      if (hasSentiment) {
        const reddits = Array.isArray(item.redditMentions) ? item.redditMentions : [];
        const tweets = Array.isArray(item.twitterMentions) ? item.twitterMentions : [];
        const posCount = reddits.filter((m: any) => (m.sentiment ?? 0) > 0.15).length + tweets.filter((t: any) => (t.sentiment ?? 0) > 0.15).length;
        const negCount = reddits.filter((m: any) => (m.sentiment ?? 0) < -0.15).length + tweets.filter((t: any) => (t.sentiment ?? 0) < -0.15).length;
        const neuCount = reddits.length + tweets.length - posCount - negCount;
        setSentimentData({
          sentimentScore: item.sentimentScore,
          sentimentSummary: item.sentimentSummary || '',
          positiveCount: posCount,
          negativeCount: negCount,
          neutralCount: neuCount,
          totalMentions: reddits.length + tweets.length,
          redditMentions: reddits,
          twitterMentions: tweets,
        });
      } else {
        setSentimentData(null);
      }
    }
    setError(null);
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
      const result = await ClientSideApkParser.parse(selectedFile, (step) => {
        setProgress(step);
        addLog(step);
      });

      setApkTechnicalData(result);
      addLog(`[Báo cáo] Đang tạo báo cáo chuẩn hóa...`);

      let appInfo: Record<string, unknown> | null = null;
      try {
        const searchRes = await apiService.searchAppInfo(result.packageName);
        if (searchRes.found && searchRes.info) {
          appInfo = searchRes.info;
        }
      } catch { /* ignore */ }

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
      if (result.activities.length > 0) {
        const displayed = result.activities.slice(0, 15);
        md += '```\n';
        displayed.forEach((a) => (md += `${a}\n`));
        if (result.activities.length > 15) md += `... and ${result.activities.length - 15} more.\n`;
        md += '```\n\n';
      }

      md += `### Permission Model\n\n`;
      if (result.permissions.length > 0) {
        md += '```\n';
        result.permissions.forEach((p) => (md += `${p}\n`));
        md += '```\n\n';
      }

      md += `### Network & API Surface\n\n`;
      if (result.apiEndpoints.length > 0) {
        md += '```\n';
        result.apiEndpoints.slice(0, 20).forEach((ep) => (md += `${ep}\n`));
        md += '```\n\n';
      }

      setReport(md);
    } catch (err: any) {
      setError(`Analysis error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSearch = async () => {
    if (!productQuery.trim()) return;
    setLoading(true);
    setError(null);
    setReport(null);
    setProductResult(null);
    setSentimentData(null);
    setCurrentReportId(null);
    try {
      const res = await apiService.searchProduct(productQuery);
      if (res.found && res.info) {
        setProductResult({ found: true, info: res.info, packageName: res.packageName });
        let md = buildStandardReportMarkdown(res.info, 'product');
        setReport(md);

        const saved = await apiService.saveResearchReport({
          type: 'product',
          title: `Product: ${String(res.info.name || productQuery)}`,
          packageName: res.packageName,
          technicalData: res.info,
          markdownReport: md,
        });
        if (saved?.report?.id) {
          setCurrentReportId(saved.report.id);
        }
        fetchHistory();
      } else {
        setError('Product not found.');
      }
    } catch (err: any) {
      setError(`Search error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSentimentAnalysis = async () => {
    const info = productResult?.info;
    const pkgName = productResult?.packageName;
    if (!info && !pkgName) return;
    setAnalyzingSentiment(true);
    setError(null);
    try {
      const query = String(info?.name || pkgName || '');
      const result = await apiService.analyzeSentiment(query, currentReportId || undefined);
      setSentimentData(result);

      const safeInfo = info || {};
      const md = buildStandardReportMarkdown(safeInfo, 'product', result);
      setReport(md);

      await apiService.saveResearchReport({
        id: currentReportId,
        type: 'product',
        title: `Product: ${String(safeInfo.name || query)}`,
        packageName: pkgName,
        technicalData: safeInfo,
        markdownReport: md,
        sentimentScore: result.sentimentScore,
        sentimentSummary: result.sentimentSummary,
        redditMentions: result.redditMentions,
        twitterMentions: result.twitterMentions,
      });
      fetchHistory();
    } catch (err: any) {
      setError(`Sentiment analysis error: ${err.message}`);
    } finally {
      setAnalyzingSentiment(false);
    }
  };

  const downloadReport = async () => {
    if (!report) return;
    const html = buildVietnameseHtml(report);
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.width = '800px';
    container.style.padding = '20px';
    container.style.background = '#fff';
    document.body.appendChild(container);
    try {
      const html2canvasMod = await import('html2canvas');
      const canvas = await html2canvasMod.default(container);
      const imgData = canvas.toDataURL('image/jpeg');
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      doc.addImage(imgData, 'JPEG', 10, 10, 190, 0);
      doc.save('report.pdf');
    } finally {
      document.body.removeChild(container);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="code-analysis-page">
      <aside className="analysis-sidebar">
        <h3>🕒 Research History</h3>
        {loadingHistory ? (
          <div className="sidebar-loading">Loading...</div>
        ) : (
          <div className="history-list">
            {history.length === 0 && <p className="empty-history">No past reports.</p>}
            {history.map((item) => (
              <div key={item.id} className="history-item" onClick={() => loadReportFromHistory(item)}>
                <div className="history-icon">
                  {item.type === 'apk' ? '📱' : item.type === 'product' ? '🔍' : '⚡'}
                </div>
                <div className="history-info">
                  <span className="history-title">{item.title}</span>
                  <span className="history-date">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>

      <div className="analysis-main-content">
        <header className="page-header">
          <div className="header-content">
            <h1>Code & APK Analysis</h1>
            <p>Phân tích kỹ thuật và quy trình vận hành của sản phẩm (Web & Mobile).</p>
          </div>
        </header>

        <div className="mode-selector">
          <button className={`mode-tab ${mode === 'apk' ? 'active' : ''}`} onClick={() => {
            setMode('apk');
            setError(null);
            setReport(null);
            setProductResult(null);
            setApkInterpretation(null);
            setApkTechnicalData(null);
          }}>📱 APK Analysis</button>
          <button className={`mode-tab ${mode === 'product' ? 'active' : ''}`} onClick={() => {
            setMode('product');
            setError(null);
            setReport(null);
            setProductResult(null);
            setApkInterpretation(null);
            setApkTechnicalData(null);
          }}>🔍 Product Search</button>
        </div>

        {mode === 'apk' && (
          <div className="analysis-controls">
            <div className="control-group">
              <div className="upload-zone">
                <input type="file" accept=".apk" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
                <button className="select-file-btn" onClick={() => fileInputRef.current?.click()}>
                  {selectedFile ? `📁 ${selectedFile.name}` : 'Chọn file APK...'}
                </button>
                <button className={`analyze-button ${loading ? 'loading' : ''}`} onClick={runApkAnalysis} disabled={loading || !selectedFile}>
                  {loading ? 'Đang xử lý...' : 'Phân tích APK (Local)'}
                </button>
              </div>
            </div>
          </div>
        )}

        {mode === 'product' && (
          <div className="analysis-controls">
            <div className="control-group">
              <div className="link-search-zone">
                <input type="text" className="url-input" placeholder="Tên sản phẩm hoặc link Google Play..." value={productQuery} onChange={(e) => setProductQuery(e.target.value)} />
                <button className={`analyze-button ${loading ? 'loading' : ''}`} onClick={handleProductSearch} disabled={loading || !productQuery.trim()}>
                  {loading ? 'Đang tra cứu...' : 'Tra cứu'}
                </button>
              </div>
            </div>
          </div>
        )}

        {error && <div className="error-banner"><strong>Lỗi:</strong> {error}</div>}

        {loading && progress && (
          <div className="progress-bar-container" style={{ margin: '1rem 0' }}>
            <div className="progress-bar" style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
              <div className="progress-bar-fill" style={{ height: '100%', background: '#4f46e5', width: '60%' }}></div>
            </div>
            <p className="progress-text" style={{ fontSize: '0.85rem', color: '#4f46e5', marginTop: '0.5rem' }}>{progress}</p>
          </div>
        )}

        {loading && logs.length > 0 && (
          <div className="live-log" style={{ background: '#1e293b', color: '#a5f3fc', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', maxHeight: '120px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.8rem' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{logs.join('\n')}</pre>
          </div>
        )}

        <div className="analysis-content">
          {report && (
            <div className="report-container">
              <div className="report-card">
                <div className="report-header">
                  <h2>{mode === 'apk' ? 'Báo cáo APK Mobile' : 'Thông tin sản phẩm'}</h2>
                  <div className="report-actions">
                    <span className="badge">
                      {mode === 'apk' ? 'APK Analyzed' : productResult?.info?.name || 'Product Info'}
                    </span>
                    {mode === 'apk' && !apkInterpretation && (
                      <button className={`ai-interpret-btn ${isInterpreting ? 'loading' : ''}`} onClick={handleInterpretApk} disabled={isInterpreting}>
                        🤖 {isInterpreting ? 'AI is Thinking...' : 'Ask AI to Interpret'}
                      </button>
                    )}
                    {mode === 'product' && (
                      <button className={`sentiment-btn ${analyzingSentiment ? 'loading' : ''}`} onClick={handleSentimentAnalysis} disabled={analyzingSentiment || !productResult}>
                        🌐 {analyzingSentiment ? 'Analyzing...' : 'Sentiment (Reddit/Twitter)'}
                      </button>
                    )}
                    <button className="download-btn" onClick={downloadReport}>📥 Download Report</button>
                  </div>
                </div>
                {apkInterpretation && (
                  <div className="ai-narrative-box">
                    <p><strong>AI Tóm lược:</strong> {apkInterpretation.summary}</p>
                    <div className="ai-blocks">
                      <div className="ai-block">
                        <h4>🛡️ Security Audit</h4>
                        <ul>{apkInterpretation.security_audit.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul>
                      </div>
                      <div className="ai-block">
                        <h4>🎯 Product Logic</h4>
                        <ul>{apkInterpretation.product_logic.map((l: string, i: number) => <li key={i}>{l}</li>)}</ul>
                      </div>
                    </div>
                  </div>
                )}

                {sentimentData && (
                  <div className="sentiment-box">
                    <h4>🌐 Social Sentiment Analysis</h4>
                    <div className="sentiment-overall">
                      <span className={`sentiment-badge ${(sentimentData.sentimentScore ?? 0) > 0.15 ? 'positive' : (sentimentData.sentimentScore ?? 0) < -0.15 ? 'negative' : 'neutral'}`}>
                        {(sentimentData.sentimentScore ?? 0) > 0.15 ? '🟢 Positive' : (sentimentData.sentimentScore ?? 0) < -0.15 ? '🔴 Negative' : '🟡 Neutral'}
                      </span>
                      <span className="sentiment-score">Score: {(sentimentData.sentimentScore ?? 0).toFixed(3)}</span>
                      <span className="sentiment-counts">
                        {sentimentData.positiveCount ?? 0} positive / {sentimentData.negativeCount ?? 0} negative / {sentimentData.neutralCount ?? 0} neutral
                      </span>
                    </div>
                    <p className="sentiment-summary">{sentimentData.sentimentSummary || ''}</p>

                    {sentimentData.redditMentions && sentimentData.redditMentions.length > 0 && (
                      <div className="sentiment-platform">
                        <h5>🔴 Reddit Mentions ({sentimentData.redditMentions.length})</h5>
                        <div className="sentiment-mentions">
                          {sentimentData.redditMentions.slice(0, 8).map((m: any, i: number) => (
                            <div key={i} className="mention-item">
                              <span className="mention-sub">r/{m.subreddit}</span>
                              <span className={`mention-sent ${(m.sentiment ?? 0) > 0.15 ? 'pos' : (m.sentiment ?? 0) < -0.15 ? 'neg' : 'neu'}`}>
                                {(m.sentiment ?? 0) > 0.15 ? '✅' : (m.sentiment ?? 0) < -0.15 ? '❌' : '➖'}
                              </span>
                              <span className="mention-title">{(m.title || '').slice(0, 100)}</span>
                              <span className="mention-score">⬆ {m.score ?? 0}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sentimentData.twitterMentions && sentimentData.twitterMentions.length > 0 && (
                      <div className="sentiment-platform">
                        <h5>🐦 Twitter Mentions ({sentimentData.twitterMentions.length})</h5>
                        <div className="sentiment-mentions">
                          {sentimentData.twitterMentions.slice(0, 5).map((t: any, i: number) => (
                            <div key={i} className="mention-item">
                              <span className={`mention-sent ${(t.sentiment ?? 0) > 0.15 ? 'pos' : (t.sentiment ?? 0) < -0.15 ? 'neg' : 'neu'}`}>
                                {(t.sentiment ?? 0) > 0.15 ? '✅' : (t.sentiment ?? 0) < -0.15 ? '❌' : '➖'}
                              </span>
                              <span className="mention-title">{(t.tweet || '').slice(0, 120)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <pre className="report-body">{report}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
