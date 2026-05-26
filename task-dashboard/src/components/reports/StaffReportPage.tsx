import { useMemo } from 'react';

import { useApp } from '../../contexts/AppContext';
import { Avatar, Badge } from '../common';
import PageHelp from '../common/PageHelp';
import { isOverdue } from '../../utils';
import type { Task } from '../../types';
import './StaffReportPage.css';

export function StaffReportPage() {
  const { state } = useApp();
  const { members, tasks, projects } = state.data;

  // Aggregate metrics per member
  const memberMetrics = useMemo(() => {
    return members.map(member => {
      const userTasks = tasks.filter(t => t.assigneeId === member.id);
      
      let completed = 0;
      let inProgress = 0;
      let overdue = 0;
      const activeTasks: Task[] = [];

      userTasks.forEach(task => {
        if (task.status === 'done') {
          completed++;
        } else if (task.status !== 'backlog') {
          inProgress++;
          if (isOverdue(task)) {
            overdue++;
          }
          // Collect top active tasks (sort by priority roughly, or just first few)
          if (activeTasks.length < 3) {
            activeTasks.push(task);
          }
        }
      });

      const totalAssigned = completed + inProgress;
      const progressPercent = totalAssigned > 0 ? Math.round((completed / totalAssigned) * 100) : 0;

      return {
        member,
        totalAssigned,
        completed,
        inProgress,
        overdue,
        progressPercent,
        activeTasks
      };
    });
  }, [members, tasks]);

  return (
    <div className="staff-report-page animate-fade-in">
      <div className="page-header">
        <h1>👥 Báo cáo nhân sự (Manager View)</h1>
        <p className="page-subtitle">Tổng quan năng suất và khối lượng công việc của team.</p>
        <div className="header-actions">
          <PageHelp title="Hướng dẫn - Báo cáo nhân sự">
            <h4>Mục đích</h4>
            <p>Trang này tổng hợp số liệu theo từng thành viên để giúp manager nắm khối lượng và tiến độ.</p>
            <h5>Sử dụng</h5>
            <ul>
              <li>Xem tổng số task, số đã hoàn thành, đang làm và trễ hạn của từng người.</li>
              <li>Mở thẻ để xem task cụ thể đang thực hiện.</li>
            </ul>
          </PageHelp>
        </div>
      </div>

      <div className="staff-grid">
        {memberMetrics.map(metrics => {
          const { member, totalAssigned, completed, inProgress, overdue, progressPercent, activeTasks } = metrics;
          
          return (
            <div key={member.id} className="staff-card card">
              <div className="staff-card__header">
                <Avatar initials={member.initials} color={member.avatarColor} size="lg" />
                <div className="staff-info">
                  <h3 className="staff-name">{member.name}</h3>
                  <span className="staff-role">{member.role}</span>
                </div>
              </div>

              <div className="staff-metrics">
                <div className="metric">
                  <span className="metric-value">{totalAssigned}</span>
                  <span className="metric-label">Tổng Task</span>
                </div>
                <div className="metric">
                  <span className="metric-value" style={{ color: 'var(--color-success)' }}>{completed}</span>
                  <span className="metric-label">Hoàn thành</span>
                </div>
                <div className="metric">
                  <span className="metric-value" style={{ color: 'var(--color-info)' }}>{inProgress}</span>
                  <span className="metric-label">Đang làm</span>
                </div>
                <div className="metric">
                  <span className="metric-value" style={{ color: overdue > 0 ? 'var(--color-danger)' : 'var(--color-text-primary)' }}>{overdue}</span>
                  <span className="metric-label">Trễ hạn</span>
                </div>
              </div>

              <div className="staff-progress">
                <div className="progress-header">
                  <span className="progress-label">Tiến độ công việc</span>
                  <span className="progress-percent">{progressPercent}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${progressPercent}%`, background: progressPercent === 100 ? 'var(--color-success)' : 'var(--color-accent)' }} 
                  />
                </div>
              </div>

              <div className="staff-active-tasks">
                <h4 className="active-tasks-title">Đang thực hiện ({inProgress})</h4>
                {activeTasks.length > 0 ? (
                  <ul className="active-task-list">
                    {activeTasks.map(task => {
                      const proj = projects.find(p => p.id === task.projectId);
                      return (
                        <li key={task.id} className="active-task-item">
                          <span className="task-proj-dot" style={{ background: proj?.color || '#ccc' }} title={proj?.name} />
                          <span className="task-title-truncate">{task.title}</span>
                          <Badge variant={task.priority.toLowerCase()} className="xs-badge">{task.priority}</Badge>
                        </li>
                      );
                    })}
                    {inProgress > activeTasks.length && (
                      <li className="active-task-item more-tasks">
                        + {inProgress - activeTasks.length} task khác...
                      </li>
                    )}
                  </ul>
                ) : (
                  <div className="no-active-tasks">Không có công việc đang thực hiện.</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
