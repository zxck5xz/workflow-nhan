import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button, Modal } from '../common';
import { getStartOfWeek } from '../../utils';

import type { GameScorecard, WeeklyInsight } from '../../types';

import { v4 as uuid } from 'uuid';
import './InsightsPage.css';

export function InsightsPage() {
  const { state, dispatch } = useApp();
  const { scorecards, insights, projects, members } = state.data;

  const [activeTab, setActiveTab] = useState<'scorecards' | 'summary' | 'ai-eval'>('scorecards');
  const [showScorecardModal, setShowScorecardModal] = useState(false);
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [editScorecard, setEditScorecard] = useState<GameScorecard | null>(null);
  const [editInsight, setEditInsight] = useState<WeeklyInsight | null>(null);



  return (
    <div className="insights-page animate-fade-in">
      <div className="page-header">
        <h1>💡 Đánh giá & Insights</h1>
        <div className="header-actions">
          <Button variant="ghost" onClick={() => setShowHelp(true)}>❓ Hướng dẫn</Button>
        </div>
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'scorecards' ? 'active' : ''}`}
            onClick={() => setActiveTab('scorecards')}
          >
            Game Scorecards
          </button>
          <button 
            className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Tổng kết tuần
          </button>
          <button 
            className={`tab-btn ${activeTab === 'ai-eval' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-eval')}
          >
            🤖 AI Đánh giá
          </button>
        </div>
      </div>

      <div className="insights-content">
        {activeTab === 'scorecards' ? (
          <ScorecardsSection 
            scorecards={scorecards} 
            projects={projects}
            onAdd={() => setShowScorecardModal(true)}
            onEdit={(sc: any) => { setEditScorecard(sc); setShowScorecardModal(true); }}
            onDelete={(id: string) => dispatch({ type: 'DELETE_SCORECARD', payload: id })}
          />
        ) : activeTab === 'summary' ? (
          <SummarySection 
            insights={insights}
            onAdd={() => setShowInsightModal(true)}
            onEdit={(ins: any) => { setEditInsight(ins); setShowInsightModal(true); }}
            onDelete={(id: string) => dispatch({ type: 'DELETE_INSIGHT', payload: id })}
          />
        ) : (
          <AIEvaluationSection />
        )}
      </div>

      {/* Modals */}
      <ScorecardModal 
        isOpen={showScorecardModal}
        scorecard={editScorecard}
        projects={projects}
        members={members}
        onClose={() => { setShowScorecardModal(false); setEditScorecard(null); }}
        onSave={(sc: GameScorecard) => {
          if (editScorecard) dispatch({ type: 'UPDATE_SCORECARD', payload: sc });
          else dispatch({ type: 'ADD_SCORECARD', payload: sc });
          setShowScorecardModal(false); setEditScorecard(null);
        }}

      />

      <InsightModal
        isOpen={showInsightModal}
        insight={editInsight}
        members={members}
        onClose={() => { setShowInsightModal(false); setEditInsight(null); }}
        onSave={(ins: WeeklyInsight) => {
          if (editInsight) dispatch({ type: 'UPDATE_INSIGHT', payload: ins });
          else dispatch({ type: 'ADD_INSIGHT', payload: ins });
          setShowInsightModal(false); setEditInsight(null);
        }}

      />

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}

// ── Scorecards Section ──
function ScorecardsSection({ scorecards, projects, onAdd, onEdit, onDelete }: any) {
  return (
    <div className="insights-section">
      <div className="section-actions">
        <h3>Bảng điểm chất lượng Game</h3>
        <Button variant="primary" onClick={onAdd}>+ Chấm điểm mới</Button>
      </div>

      <div className="scorecard-grid">
        {scorecards.length === 0 && <div className="empty-state">Chưa có bảng điểm nào. Hãy bắt đầu chấm điểm chất lượng game!</div>}
        {scorecards.map((sc: GameScorecard) => {
          const project = projects.find((p: any) => p.id === sc.projectId);
          return (
            <div key={sc.id} className="scorecard-card card">
              <div className="scorecard-card__header">
                <div className="project-info">
                  <div className="color-dot" style={{ background: project?.color }} />
                  <strong>{project?.name || 'Dự án đã xóa'}</strong>
                </div>
                <span className="week-label">Tuần {sc.week}</span>
              </div>
              
              <div className="rating-bars">
                <RatingRow label="Core Loop" value={sc.ratings.coreLoop} />
                <RatingRow label="Monetization" value={sc.ratings.monetization} />
                <RatingRow label="Visual/UX" value={sc.ratings.visualUx} />
                <RatingRow label="Retention" value={sc.ratings.retention} />
                <RatingRow label="USP" value={sc.ratings.usp} />
              </div>

              <div className="scorecard-summary">
                <p>{sc.summary}</p>
              </div>

              <div className="card-actions">
                <Button variant="ghost" size="sm" onClick={() => onEdit(sc)}>✏️</Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(sc.id)}>🗑️</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RatingRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="rating-row">
      <span className="rating-label">{label}</span>
      <div className="rating-bar-container">
        <div className="rating-bar-fill" style={{ width: `${(value / 5) * 100}%`, background: getRatingColor(value) }} />
      </div>
      <span className="rating-value">{value}/5</span>
    </div>
  );
}

function getRatingColor(value: number) {
  if (value >= 4.5) return '#00c48c';
  if (value >= 3.5) return '#3b82f6';
  if (value >= 2.5) return '#ffb830';
  return '#ff4757';
}

// ── Summary Section ──
function SummarySection({ insights, onAdd, onEdit, onDelete }: any) {
  return (
    <div className="insights-section">
      <div className="section-actions">
        <h3>Tổng hợp Insight hàng tuần</h3>
        <Button variant="primary" onClick={onAdd}>+ Tạo Insight mới</Button>
      </div>

      <div className="insight-list">
        {insights.length === 0 && <div className="empty-state">Chưa có bản tổng hợp nào. Hãy tạo insight để tracking sức khỏe dự án!</div>}
        {insights.map((ins: WeeklyInsight) => (
          <div key={ins.id} className="insight-card card">
            <div className="insight-card__header">
              <div className="insight-title-group">
                <h3>{ins.title}</h3>
                <span className="week-tag">Tuần {ins.week}</span>
              </div>
              <span className={`status-pill status--${ins.overallStatus}`}>
                {ins.overallStatus.toUpperCase()}
              </span>
            </div>

            <div className="insight-grid">
              <div className="insight-block">
                <h4>✨ Highlights</h4>
                <ul>{ins.highlights.map((h, i) => <li key={i}>{h}</li>)}</ul>
              </div>
              <div className="insight-block">
                <h4>⚠️ Risks</h4>
                <ul>{ins.risks.map((r, i) => <li key={i}>{r}</li>)}</ul>
              </div>
              <div className="insight-block">
                <h4>🚀 Action Items</h4>
                <ul>{ins.actionItems.map((a, i) => <li key={i}>{a}</li>)}</ul>
              </div>
            </div>

            <div className="card-actions">
              <Button variant="ghost" size="sm" onClick={() => onEdit(ins)}>✏️</Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(ins.id)}>🗑️</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Modal Components ──
function ScorecardModal({ isOpen, scorecard, projects, members, onClose, onSave }: any) {
  const [projectId, setProjectId] = useState(scorecard?.projectId || projects[0]?.id || '');
  const [ratings, setRatings] = useState(scorecard?.ratings || { coreLoop: 3, monetization: 3, visualUx: 3, retention: 3, usp: 3 });
  const [summary, setSummary] = useState(scorecard?.summary || '');
  const authorId = scorecard?.authorId || members[0]?.id || '';


  const handleSubmit = () => {
    onSave({
      id: scorecard?.id || `sc-${uuid().slice(0, 8)}`,
      projectId,
      week: scorecard?.week || getStartOfWeek(new Date()).toISOString().split('T')[0],
      ratings,
      summary,
      authorId,
      createdAt: scorecard?.createdAt || new Date().toISOString()
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={scorecard ? 'Sửa bảng điểm' : 'Chấm điểm Game'} footer={<><Button onClick={onClose}>Hủy</Button><Button variant="primary" onClick={handleSubmit}>Lưu</Button></>}>
      <div className="form-group">
        <label className="form-label">Dự án</label>
        <select className="form-select" value={projectId} onChange={e => setProjectId(e.target.value)}>
          {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div className="ratings-form">
        {Object.keys(ratings).map((key: string) => (
          <div key={key} className="rating-input-row">
            <label className="rating-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
            <input 
              type="range" min="1" max="5" step="0.5" 
              value={ratings[key as keyof typeof ratings]} 
              onChange={e => setRatings({ ...ratings, [key]: parseFloat(e.target.value) })}
            />
            <span className="rating-display">{ratings[key as keyof typeof ratings]}/5</span>
          </div>
        ))}
      </div>
      <div className="form-group">
        <label className="form-label">Nhận xét chi tiết</label>
        <textarea className="form-input" rows={3} value={summary} onChange={e => setSummary(e.target.value)} placeholder="Điểm mạnh, điểm yếu, cơ hội cải thiện..." />
      </div>
    </Modal>
  );
}

function InsightModal({ isOpen, insight, members, onClose, onSave }: any) {
  const [title, setTitle] = useState(insight?.title || '');
  const [overallStatus, setOverallStatus] = useState(insight?.overallStatus || 'stable');
  const [highlights, setHighlights] = useState(insight?.highlights.join('\n') || '');
  const [risks, setRisks] = useState(insight?.risks.join('\n') || '');
  const [actionItems, setActionItems] = useState(insight?.actionItems.join('\n') || '');
  const authorId = insight?.authorId || members[0]?.id || '';


  const handleSubmit = () => {
    onSave({
      id: insight?.id || `ins-${uuid().slice(0, 8)}`,
      week: insight?.week || getStartOfWeek(new Date()).toISOString().split('T')[0],
      title,
      overallStatus,
      highlights: highlights.split('\n').filter((s: string) => s.trim()),
      risks: risks.split('\n').filter((s: string) => s.trim()),
      actionItems: actionItems.split('\n').filter((s: string) => s.trim()),
      authorId,
      createdAt: insight?.createdAt || new Date().toISOString()
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={insight ? 'Sửa Insight' : 'Tạo Insight tuần'} footer={<><Button onClick={onClose}>Hủy</Button><Button variant="primary" onClick={handleSubmit}>Lưu</Button></>}>
      <div className="form-group">
        <label className="form-label">Tiêu đề</label>
        <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="VD: Tổng kết tuần 20 - Focus Battle Arena" />
      </div>
      <div className="form-group">
        <label className="form-label">Trạng thái chung</label>
        <select className="form-select" value={overallStatus} onChange={e => setOverallStatus(e.target.value as any)}>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="stable">Stable</option>
          <option value="at-risk">At Risk</option>
          <option value="critical">Critical</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">✨ Highlights (Mỗi dòng 1 ý)</label>
        <textarea className="form-input" rows={3} value={highlights} onChange={e => setHighlights(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">⚠️ Risks (Mỗi dòng 1 ý)</label>
        <textarea className="form-input" rows={3} value={risks} onChange={e => setRisks(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">🚀 Action Items (Mỗi dòng 1 ý)</label>
        <textarea className="form-input" rows={3} value={actionItems} onChange={e => setActionItems(e.target.value)} />
      </div>
    </Modal>
  );
}

// ── AI Evaluation Section ──
function AIEvaluationSection() {
  const [game, setGame] = useState('');
  const [genre, setGenre] = useState('Casual');
  const [info, setInfo] = useState('');
  const [competitors, setCompetitors] = useState('');
  
  // Evaluation criteria state
  const [criteria, setCriteria] = useState<string[]>([
    'Core Loop',
    'Monetization',
    'Visual/UX',
    'Retention',
    'USP'
  ]);
  const [newCriterion, setNewCriterion] = useState('');

  // Terminal & results states
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [reportMarkdown, setReportMarkdown] = useState('');
  const [reportFilePath, setReportFilePath] = useState('');
  const [pptxPath, setPptxPath] = useState('');
  const [isCompilingPptx, setIsCompilingPptx] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [showRawText, setShowRawText] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Helper to add criteria
  const handleAddCriterion = () => {
    const trimmed = newCriterion.trim();
    if (trimmed && !criteria.includes(trimmed)) {
      setCriteria([...criteria, trimmed]);
      setNewCriterion('');
    }
  };

  // Helper to remove criteria
  const handleRemoveCriterion = (item: string) => {
    setCriteria(criteria.filter(c => c !== item));
  };

  // Run evaluation
  const handleEvaluate = async () => {
    if (!game.trim()) {
      alert('Vui lòng nhập tên game cần đánh giá.');
      return;
    }

    setIsEvaluating(true);
    setTerminalLogs([`> Bắt đầu quy trình đánh giá AI cho game: ${game}`]);
    setReportMarkdown('');
    setReportFilePath('');
    setPptxPath('');
    setErrorText('');

    // Start logging interval to simulate live parsing steps
    let stepCount = 0;
    const logInterval = setInterval(() => {
      stepCount++;
      if (stepCount === 1) {
        setTerminalLogs(prev => [...prev, '> [INFO] Đang tìm kiếm gameplay review & phân tích đối thủ cạnh tranh...']);
      } else if (stepCount === 2) {
        setTerminalLogs(prev => [...prev, `> [INFO] Thể loại: ${genre} | Đối thủ: ${competitors || 'N/A'}`]);
      } else if (stepCount === 3) {
        setTerminalLogs(prev => [...prev, '> [INFO] Đang phân tích sắc thái nhận xét & tự động chấm điểm...']);
      } else if (stepCount === 4) {
        setTerminalLogs(prev => [...prev, `> [INFO] Tiêu chí đánh giá: ${criteria.join(', ')}`]);
      } else if (stepCount === 5) {
        setTerminalLogs(prev => [...prev, '> [INFO] Đang biên dịch báo cáo đánh giá dạng Markdown...']);
      }
    }, 1200);

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          game,
          genre,
          info,
          competitors,
          criteria: criteria.join(',')
        })
      });

      clearInterval(logInterval);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Lỗi không xác định từ server.');
      }

      const resData = await response.json();
      setTerminalLogs(prev => [
        ...prev,
        `> SUCCESS: Báo cáo đã được sinh tại: ${resData.filePath}`,
        '> [INFO] Đang tải slide preview...'
      ]);

      // Wait a moment for terminal log transition
      setTimeout(() => {
        setReportMarkdown(resData.markdown);
        setReportFilePath(resData.filePath);
        setIsEvaluating(false);
        setActiveSlideIndex(0);
      }, 800);

    } catch (err: any) {
      clearInterval(logInterval);
      setErrorText(err.message || 'Có lỗi xảy ra trong quá trình đánh giá.');
      setTerminalLogs(prev => [...prev, `> LỖI CỰC BỘ: ${err.message || 'Quá trình thực thi thất bại.'}`]);
      setIsEvaluating(false);
    }
  };

  // Compile PPTX
  const handleCompilePptx = async () => {
    if (!reportFilePath) return;

    setIsCompilingPptx(true);
    try {
      const response = await fetch('/api/generate-pptx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          markdownPath: reportFilePath
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Không thể compile PPTX.');
      }

      const resData = await response.json();
      setPptxPath(resData.pptxPath);
      alert('Đã tạo thành công slide PowerPoint (.pptx)!');
    } catch (err: any) {
      alert(`Lỗi xuất PPTX: ${err.message}`);
    } finally {
      setIsCompilingPptx(false);
    }
  };

  // Open PPTX
  const handleOpenPptx = async () => {
    if (!pptxPath) return;

    try {
      const response = await fetch('/api/open-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filePath: pptxPath
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error);
      }
    } catch (err: any) {
      alert(`Không thể mở file PPTX: ${err.message}`);
    }
  };

  // Split slide markdown content
  const slides = useMemo(() => {
    if (!reportMarkdown) return [];
    return reportMarkdown.split('---').map(s => s.trim()).filter(Boolean);
  }, [reportMarkdown]);

  return (
    <div className="ai-eval-section animate-fade-in">
      {/* Upper part: Grid for input and criteria selection */}
      {!isEvaluating && !reportMarkdown && (
        <div className="eval-setup-layout">
          <div className="eval-form card">
            <h3>📝 Nhập Thông Tin Game</h3>
            <div className="form-group">
              <label className="form-label">Tên Game <span className="required-star">*</span></label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="VD: Shadow Battle Arena, Flappy Bird Rework..."
                value={game}
                onChange={e => setGame(e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Thể loại</label>
                <select 
                  className="form-select"
                  value={genre}
                  onChange={e => setGenre(e.target.value)}
                >
                  <option value="Casual">Casual</option>
                  <option value="Puzzle">Puzzle</option>
                  <option value="RPG / Action">RPG / Action</option>
                  <option value="Simulation">Simulation</option>
                  <option value="Strategy">Strategy</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Đối thủ cạnh tranh (phân cách bằng dấu phẩy)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="VD: Shadow Fight 3, Arena of Valor"
                  value={competitors}
                  onChange={e => setCompetitors(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Ghi chú / Thông tin bổ sung của game</label>
              <textarea 
                className="form-input" 
                rows={4}
                placeholder="VD: Đồ họa pixel nghệ thuật, cơ chế thẻ bài chiến thuật kết hợp nhập vai. Nhịp game nhanh nhưng còn lỗi lag khi mở khóa skin..."
                value={info}
                onChange={e => setInfo(e.target.value)}
              />
            </div>
            <Button variant="primary" size="lg" className="btn-start-eval" onClick={handleEvaluate}>
              ⚡ Bắt đầu Đánh giá
            </Button>
          </div>

          <div className="criteria-manager card">
            <h3>⚙️ Tiêu Chí Đánh Giá</h3>
            <p className="description">Chọn các hạng mục cốt lõi và thêm bớt các tiêu chí tùy chỉnh để AI Agent thực hiện chấm điểm.</p>
            
            <div className="criteria-checklist">
              {criteria.map(item => (
                <div key={item} className="criteria-tag">
                  <span className="criteria-tag-text">{item}</span>
                  <button 
                    type="button" 
                    className="criteria-tag-remove"
                    onClick={() => handleRemoveCriterion(item)}
                    title="Xóa tiêu chí này"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="criteria-add-input">
              <input 
                type="text" 
                className="form-input inline-input" 
                placeholder="Thêm tiêu chí mới..."
                value={newCriterion}
                onChange={e => setNewCriterion(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddCriterion(); }}
              />
              <Button onClick={handleAddCriterion}>Thêm</Button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Terminal Console */}
      {isEvaluating && (
        <div className="terminal-console card animate-scale-in">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <span className="terminal-title">AI Game Eval Agent Console v1.0.0</span>
          </div>
          <div className="terminal-body">
            {terminalLogs.map((log, index) => (
              <div key={index} className="terminal-log-line">
                {log}
              </div>
            ))}
            <div className="terminal-cursor-line">
              <span className="terminal-prompt">$</span>
              <span className="terminal-cursor animate-pulse">_</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorText && (
        <div className="error-panel card animate-fade-in">
          <h4>❌ Quá Trình Đánh Giá Thất Bại</h4>
          <p>{errorText}</p>
          <Button onClick={() => setErrorText('')}>Quay lại thiết lập</Button>
        </div>
      )}

      {/* Slideshow Display / Results */}
      {!isEvaluating && reportMarkdown && (
        <div className="eval-results-container animate-scale-in">
          <div className="results-actions-bar">
            <Button variant="secondary" onClick={() => { setReportMarkdown(''); setPptxPath(''); }}>
              ← Đánh giá game khác
            </Button>
            
            <div className="right-actions">
              <Button 
                variant={showRawText ? "primary" : "secondary"}
                onClick={() => setShowRawText(!showRawText)}
              >
                {showRawText ? "Hiển thị Slide Preview" : "Xem Markdown gốc"}
              </Button>
              
              {!pptxPath ? (
                <Button 
                  variant="primary" 
                  onClick={handleCompilePptx}
                  disabled={isCompilingPptx}
                >
                  {isCompilingPptx ? "Đang xuất PPTX..." : "📥 Xuất PowerPoint (.pptx)"}
                </Button>
              ) : (
                <Button variant="primary" className="btn-open-pptx" onClick={handleOpenPptx}>
                  🖥️ Mở PPTX trên máy tính
                </Button>
              )}
            </div>
          </div>

          {showRawText ? (
            <div className="raw-markdown-view card">
              <div className="code-header">
                <span>Markdown Report</span>
              </div>
              <textarea 
                className="code-textarea"
                readOnly
                value={reportMarkdown}
              />
            </div>
          ) : (
            <div className="slideshow-theater">
              <div className="slide-card card">
                {slides[activeSlideIndex] && (
                  <SlideContentRenderer markdown={slides[activeSlideIndex]} />
                )}
              </div>
              
              <div className="slideshow-controls">
                <Button 
                  disabled={activeSlideIndex === 0} 
                  onClick={() => setActiveSlideIndex(activeSlideIndex - 1)}
                >
                  ◀ Trước
                </Button>
                
                <span className="slideshow-counter">
                  Slide {activeSlideIndex + 1} / {slides.length}
                </span>
                
                <Button 
                  disabled={activeSlideIndex === slides.length - 1} 
                  onClick={() => setActiveSlideIndex(activeSlideIndex + 1)}
                >
                  Sau ▶
                </Button>
              </div>
              
              <div className="slideshow-dots">
                {slides.map((_, index) => (
                  <span 
                    key={index} 
                    className={`slide-dot ${index === activeSlideIndex ? 'active' : ''}`}
                    onClick={() => setActiveSlideIndex(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Slide Content Renderer ──
interface SlideContentRendererProps {
  markdown: string;
}

function SlideContentRenderer({ markdown }: SlideContentRendererProps) {
  const lines = markdown.split('\n');
  let title = '';
  const bodyContent: React.ReactNode[] = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('## Slide')) {
      const titleMatch = trimmed.match(/Slide \d+:\s*(.+)/);
      title = titleMatch ? titleMatch[1] : trimmed.replace(/## Slide \d+:\s*/, '');
    } else if (trimmed.startsWith('# ')) {
      title = trimmed.replace('# ', '');
    } else if (trimmed.startsWith('### ')) {
      const text = trimmed.replace('### ', '');
      const ratingMatch = text.match(/\(([^)]+)\/5\.0\)/);
      if (ratingMatch) {
        const name = text.replace(/\([^)]+\)/, '').replace('📍', '').trim();
        const score = parseFloat(ratingMatch[1]);
        bodyContent.push(
          <div key={`sub-${idx}`} className="slide-section-rating">
            <span className="section-rating-name">📍 {name}</span>
            <div className="section-rating-score-pill" style={{ background: `${getRatingColor(score)}20`, color: getRatingColor(score) }}>
              {score} / 5.0
            </div>
          </div>
        );
      } else {
        bodyContent.push(<h3 key={`sub-${idx}`} className="slide-sub-title">{text}</h3>);
      }
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const text = trimmed.substring(2);
      
      if (text.includes('|') && text.includes('/5.0')) {
        const parts = text.split('|');
        const textPart = parts[0].trim().replace(/\*\*/g, '');
        const scoreMatch = textPart.match(/(\d+(?:\.\d+)?)/);
        const score = scoreMatch ? parseFloat(scoreMatch[1]) : 3.0;
        
        bodyContent.push(
          <div key={`rating-${idx}`} className="slide-rating-progress-row">
            <span className="rating-progress-label">{textPart}</span>
            <div className="rating-progress-bar-container">
              <div 
                className="rating-progress-bar-fill" 
                style={{ 
                  width: `${(score / 5) * 100}%`,
                  background: getRatingColor(score) 
                }} 
              />
            </div>
          </div>
        );
      } else {
        bodyContent.push(
          <div key={`list-${idx}`} className="slide-bullet-item">
            <span className="slide-bullet-symbol">•</span>
            <span className="slide-bullet-text">{parseBoldText(text)}</span>
          </div>
        );
      }
    } else if (/^\d+\.\s*/.test(trimmed)) {
      const numMatch = trimmed.match(/^(\d+)\.\s*(.*)/);
      if (numMatch) {
        bodyContent.push(
          <div key={`num-${idx}`} className="slide-number-item">
            <span className="slide-number-prefix">{numMatch[1]}.</span>
            <span className="slide-number-text">{parseBoldText(numMatch[2])}</span>
          </div>
        );
      }
    } else if (trimmed) {
      bodyContent.push(
        <p key={`p-${idx}`} className="slide-paragraph">
          {parseBoldText(trimmed)}
        </p>
      );
    }
  });

  return (
    <div className="slide-canvas">
      {title && <h2 className="slide-main-title">{title}</h2>}
      <div className="slide-divider" />
      <div className="slide-body">
        {bodyContent}
      </div>
    </div>
  );
}

// Simple bold parsing helper
function parseBoldText(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index}>{part}</strong>;
    }
    return part;
  });
}

function HelpModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hướng dẫn sử dụng tab Insights" footer={<Button onClick={onClose}>Đóng</Button>}>
      <div className="insights-help-content">
        <h4>Tổng quan</h4>
        <p>Tab Insights gồm 3 phần chính: <strong>Game Scorecards</strong>, <strong>Tổng kết tuần</strong> và <strong>AI Đánh giá</strong>. Dưới đây là cách sử dụng nhanh.</p>

        <h5>Game Scorecards</h5>
        <ul>
          <li>Nhấn <strong>+ Chấm điểm mới</strong> để tạo bảng điểm cho từng dự án/tuần.</li>
          <li>Sử dụng thanh kéo để chấm từng tiêu chí (1 - 5).</li>
          <li>Ghi nhận tóm tắt, lưu để theo dõi tiến triển chất lượng.</li>
        </ul>

        <h5>Tổng kết tuần</h5>
        <ul>
          <li>Nhấn <strong>+ Tạo Insight mới</strong> để thêm bản tổng hợp tuần.</li>
          <li>Chia thành <em>Highlights</em>, <em>Risks</em> và <em>Action Items</em> — mỗi dòng là một mục.</li>
          <li>Sửa / xóa insight bằng các nút ở góc thẻ.</li>
        </ul>

        <h5>AI Đánh giá</h5>
        <ul>
          <li>Nhập tên game, thể loại, đối thủ và thông tin bổ trợ rồi nhấn <strong>⚡ Bắt đầu Đánh giá</strong>.</li>
          <li>Thêm hoặc bớt tiêu chí đánh giá tại khung bên phải để tùy chỉnh kết quả.</li>
          <li>Sau khi sinh báo cáo, bạn có thể xem Markdown nguồn hoặc xuất thành PPTX.</li>
        </ul>

        <h5>Mẹo nhanh</h5>
        <ul>
          <li>Sử dụng tags dự án để lọc nhanh khi có nhiều scorecards.</li>
          <li>Lưu ý nhập rõ ràng hành động trong <em>Action Items</em> để dễ follow-up.</li>
        </ul>
      </div>
    </Modal>
  );
}
