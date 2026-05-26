import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button, Avatar } from '../common';
import PageHelp from '../common/PageHelp';
import { getToday, getStartOfWeek, getEndOfWeek, isOverdue } from '../../utils';
import type { Task } from '../../types';
import './WorkReportPage.css';

type TimeRange = 'today' | 'this_week' | 'custom';

export function WorkReportPage() {
  const { state } = useApp();
  const { tasks, projects, members } = state.data;

  const [timeRange, setTimeRange] = useState<TimeRange>('today');
  const [assigneeId, setAssigneeId] = useState<string>(members[0]?.id || '');
  const [copySuccess, setCopySuccess] = useState(false);

  const reportData = useMemo(() => {
    // 1. Determine Date Range
    let startDate = new Date();
    let endDate = new Date();
    
    if (timeRange === 'today') {
      const today = new Date(getToday());
      startDate = today;
      endDate = today;
    } else if (timeRange === 'this_week') {
      startDate = getStartOfWeek(new Date());
      endDate = getEndOfWeek(new Date());
    }

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    // 2. Filter Tasks for the selected Assignee
    const userTasks = tasks.filter(t => t.assigneeId === assigneeId);

    // 3. Categorize Tasks
    const completedTasks: Task[] = [];
    const inProgressTasks: Task[] = [];
    const overdueTasks: Task[] = [];

    userTasks.forEach(task => {
      const isCompleted = task.status === 'done';
      const isOverdueTask = isOverdue(task);

      // check if completed in range
      if (isCompleted && task.completedAt) {
        const completedDate = task.completedAt.split('T')[0];
        if (completedDate >= startStr && completedDate <= endStr) {
          completedTasks.push(task);
        }
      } else if (!isCompleted && task.status !== 'backlog') {
        // currently in progress
        inProgressTasks.push(task);
        if (isOverdueTask) {
          overdueTasks.push(task);
        }
      }
    });

    return {
      completedTasks,
      inProgressTasks,
      overdueTasks,
      startStr,
      endStr
    };
  }, [tasks, timeRange, assigneeId]);

  const generateSlackText = () => {
    const { completedTasks, inProgressTasks, overdueTasks, startStr, endStr } = reportData;
    const assignee = members.find(m => m.id === assigneeId);
    
    let text = `🚀 *BÁO CÁO CÔNG VIỆC ${timeRange === 'today' ? startStr : `Tuần ${startStr} - ${endStr}`}*\n`;
    text += `👤 Người báo cáo: ${assignee?.name || 'Unknown'}\n\n`;

    // Group completed by project
    const completedByProject = new Map<string, Task[]>();
    completedTasks.forEach(t => {
      if (!completedByProject.has(t.projectId)) completedByProject.set(t.projectId, []);
      completedByProject.get(t.projectId)!.push(t);
    });

    text += `✅ *ĐÃ HOÀN THÀNH (${completedTasks.length} task):*\n`;
    if (completedTasks.length === 0) text += `- (Không có)\n`;
    completedByProject.forEach((tasks, pId) => {
      const pName = projects.find(p => p.id === pId)?.name || 'Khác';
      tasks.forEach(t => {
        text += `- [${pName}] ${t.title}\n`;
      });
    });
    text += '\n';

    text += `⏳ *ĐANG THỰC HIỆN (${inProgressTasks.length} task):*\n`;
    if (inProgressTasks.length === 0) text += `- (Không có)\n`;
    inProgressTasks.forEach(t => {
      const pName = projects.find(p => p.id === t.projectId)?.name || 'Khác';
      text += `- [${pName}] ${t.title}\n`;
    });
    text += '\n';

    if (overdueTasks.length > 0) {
      text += `⚠️ *TRỄ HẠN (${overdueTasks.length} task):*\n`;
      overdueTasks.forEach(t => {
        const pName = projects.find(p => p.id === t.projectId)?.name || 'Khác';
        text += `- [${pName}] ${t.title} (Hạn: ${t.deadline})\n`;
      });
      text += '\n';
    }

    return text;
  };

  const handleCopy = () => {
    const text = generateSlackText();
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const slackText = generateSlackText();
  const selectedMember = members.find(m => m.id === assigneeId);

  return (
    <div className="report-page animate-fade-in">
      <div className="page-header">
        <h1>📊 Báo cáo công việc</h1>
        <div className="header-actions">
          <PageHelp title="Hướng dẫn - Báo cáo công việc">
            <h4>Tổng quan</h4>
            <p>Chuẩn bị bản báo cáo nhanh (Slack-ready) cho cá nhân hoặc tuần.</p>
            <h5>Bước thực hiện</h5>
            <ul>
              <li>Chọn khoảng thời gian (Hôm nay / Tuần này) và thành viên.</li>
              <li>Kiểm tra số liệu ở thống kê và preview Slack, nhấn <strong>Copy to Clipboard</strong> để gửi.</li>
            </ul>
          </PageHelp>
        </div>
      </div>

      <div className="report-layout">
        {/* Controls */}
        <div className="report-controls card">
          <div className="form-group">
            <label className="form-label">Khoảng thời gian</label>
            <div className="time-range-toggles">
              <button 
                className={`toggle-btn ${timeRange === 'today' ? 'active' : ''}`}
                onClick={() => setTimeRange('today')}
              >
                Hôm nay
              </button>
              <button 
                className={`toggle-btn ${timeRange === 'this_week' ? 'active' : ''}`}
                onClick={() => setTimeRange('this_week')}
              >
                Tuần này
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Thành viên</label>
            <select 
              className="form-select" 
              value={assigneeId} 
              onChange={e => setAssigneeId(e.target.value)}
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {selectedMember && (
            <div className="selected-member-profile">
              <Avatar initials={selectedMember.initials} color={selectedMember.avatarColor} size="lg" />
              <div className="profile-details">
                <strong>{selectedMember.name}</strong>
                <span className="profile-role">{selectedMember.role}</span>
              </div>
            </div>
          )}
        </div>

        {/* Preview & Output */}
        <div className="report-content">
          <div className="report-stats">
            <div className="stat-card" style={{ '--stat-accent': 'var(--color-success)' } as React.CSSProperties}>
              <span className="stat-card__label">Hoàn thành</span>
              <span className="stat-card__value">{reportData.completedTasks.length}</span>
            </div>
            <div className="stat-card" style={{ '--stat-accent': 'var(--color-info)' } as React.CSSProperties}>
              <span className="stat-card__label">Đang thực hiện</span>
              <span className="stat-card__value">{reportData.inProgressTasks.length}</span>
            </div>
            <div className="stat-card" style={{ '--stat-accent': 'var(--color-danger)' } as React.CSSProperties}>
              <span className="stat-card__label">Trễ hạn</span>
              <span className="stat-card__value">{reportData.overdueTasks.length}</span>
            </div>
          </div>

          <div className="slack-preview card">
            <div className="slack-preview__header">
              <h3 className="card-title" style={{ margin: 0 }}>Slack Markdown Preview</h3>
              <Button variant="primary" onClick={handleCopy}>
                {copySuccess ? '✅ Đã Copy' : '📋 Copy to Clipboard'}
              </Button>
            </div>
            <textarea 
              className="slack-preview__textarea"
              readOnly
              value={slackText}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
