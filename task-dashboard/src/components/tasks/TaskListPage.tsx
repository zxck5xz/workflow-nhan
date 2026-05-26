import { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button, Badge, Avatar, WeightDots, EmptyState, TaskFormModal } from '../common';
import PageHelp from '../common/PageHelp';
import { isOverdue, formatRelativeDate, getDaysUntilDeadline } from '../../utils';
import type { Task, TaskStatus, Priority, TaskFilters } from '../../types';
import './TaskListPage.css';

type SortKey = 'title' | 'deadline' | 'priority' | 'weight' | 'status';
type SortDir = 'asc' | 'desc';

const PRIORITY_ORDER: Record<Priority, number> = { P0: 0, P1: 1, P2: 2 };
const STATUS_ORDER: Record<TaskStatus, number> = { backlog: 0, 'in-testing': 1, evaluating: 2, reporting: 3, done: 4 };

export function TaskListPage() {
  const { state, dispatch } = useApp();
  const { tasks, projects, members, statuses } = state.data;

  const [filters, setFilters] = useState<TaskFilters>({ projectId: null, assigneeId: null, status: null, priority: null, dateRange: null, search: '' });
  const [sortKey, setSortKey] = useState<SortKey>('deadline');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    if (filters.projectId) result = result.filter(t => t.projectId === filters.projectId);
    if (filters.assigneeId) result = result.filter(t => t.assigneeId === filters.assigneeId);
    if (filters.status) result = result.filter(t => t.status === filters.status);
    if (filters.priority) result = result.filter(t => t.priority === filters.priority);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q) || t.tags.some(tag => tag.includes(q)));
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'title': cmp = a.title.localeCompare(b.title); break;
        case 'deadline': cmp = new Date(a.deadline).getTime() - new Date(b.deadline).getTime(); break;
        case 'priority': cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]; break;
        case 'weight': cmp = a.weight - b.weight; break;
        case 'status': cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]; break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [tasks, filters, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => !['backlog', 'done'].includes(t.status)).length,
    overdue: tasks.filter(t => isOverdue(t)).length,
  }), [tasks]);

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    const updated: Task = {
      ...task,
      status: newStatus,
      completedAt: newStatus === 'done' ? new Date().toISOString() : undefined,
    };
    dispatch({ type: 'UPDATE_TASK', payload: updated });
  };

  const SortHeader = ({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) => (
    <th className="sortable" onClick={() => toggleSort(sortKeyName)}>
      {label}
      <span className={`sort-indicator ${sortKey === sortKeyName ? 'sort-indicator--active' : ''}`}>
        {sortKey === sortKeyName ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
      </span>
    </th>
  );

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1>📋 Công việc</h1>
        <div className="page-header__actions">
          <Button variant="primary" onClick={() => setShowAddModal(true)}>+ Thêm công việc</Button>
          <PageHelp title="Hướng dẫn sử dụng - Công việc">
            <h4>Tổng quan</h4>
            <p>Trang quản lý task cho phép tạo, lọc, sắp xếp và cập nhật trạng thái công việc.</p>
            <h5>Thêm / sửa / xóa</h5>
            <ul>
              <li>Nhấn <strong>+ Thêm công việc</strong> để tạo task mới.</li>
              <li>Nhấn tên công việc để mở form chỉnh sửa.</li>
              <li>Sử dụng nút xóa trong form để xóa task.</li>
            </ul>
            <h5>Bộ lọc & Sắp xếp</h5>
            <ul>
              <li>Sử dụng thanh tìm kiếm hoặc các bộ chọn để lọc theo dự án, người phụ trách, trạng thái, ưu tiên.</li>
              <li>Nhấn tiêu đề cột để sắp xếp (Tên, Deadline, Ưu tiên, Trọng số, Trạng thái).</li>
            </ul>
          </PageHelp>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="tasks-quick-stats stagger-children">
        <div className="stat-card" style={{ '--stat-accent': 'var(--color-accent)' } as React.CSSProperties}>
          <span className="stat-card__label">Tổng cộng</span>
          <span className="stat-card__value">{stats.total}</span>
        </div>
        <div className="stat-card" style={{ '--stat-accent': 'var(--color-success)' } as React.CSSProperties}>
          <span className="stat-card__label">Hoàn thành</span>
          <span className="stat-card__value">{stats.completed}</span>
        </div>
        <div className="stat-card" style={{ '--stat-accent': 'var(--color-info)' } as React.CSSProperties}>
          <span className="stat-card__label">Đang thực hiện</span>
          <span className="stat-card__value">{stats.inProgress}</span>
        </div>
        <div className="stat-card" style={{ '--stat-accent': 'var(--color-danger)' } as React.CSSProperties}>
          <span className="stat-card__label">Trễ hạn</span>
          <span className="stat-card__value">{stats.overdue}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          className="form-input"
          placeholder="🔍 Tìm kiếm task, tag..."
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
        />
        <select className="form-select" value={filters.projectId || ''} onChange={e => setFilters(f => ({ ...f, projectId: e.target.value || null }))}>
          <option value="">Tất cả dự án</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select className="form-select" value={filters.assigneeId || ''} onChange={e => setFilters(f => ({ ...f, assigneeId: e.target.value || null }))}>
          <option value="">Tất cả người</option>
          {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select className="form-select" value={filters.status || ''} onChange={e => setFilters(f => ({ ...f, status: (e.target.value || null) as TaskStatus | null }))}>
          <option value="">Tất cả trạng thái</option>
          {statuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <select className="form-select" value={filters.priority || ''} onChange={e => setFilters(f => ({ ...f, priority: (e.target.value || null) as Priority | null }))}>
          <option value="">Tất cả mức độ</option>
          <option value="P0">P0 — Hot</option>
          <option value="P1">P1 — Project</option>
          <option value="P2">P2 — Research</option>
        </select>
      </div>

      {/* Table */}
      <div className="tasks-table-wrapper">
        {filteredTasks.length === 0 ? (
          <EmptyState icon="📝" title="Không có công việc nào" description="Thêm công việc mới hoặc thay đổi bộ lọc" />
        ) : (
          <div className="tasks-table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <SortHeader label="Tên công việc" sortKeyName="title" />
                  <th>Dự án</th>
                  <th>Người phụ trách</th>
                  <SortHeader label="Ưu tiên" sortKeyName="priority" />
                  <SortHeader label="Trọng số" sortKeyName="weight" />
                  <SortHeader label="Deadline" sortKeyName="deadline" />
                  <SortHeader label="Trạng thái" sortKeyName="status" />
                  <th>Eisenhower</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => {
                  const project = projects.find(p => p.id === task.projectId);
                  const member = members.find(m => m.id === task.assigneeId);
                  const overdue = isOverdue(task);
                  const daysLeft = getDaysUntilDeadline(task.deadline);

                  return (
                    <tr key={task.id} className={overdue ? 'task-row--overdue' : ''}>
                      <td>
                        <div className="task-title-cell">
                          <span className="task-title-text" onClick={() => setEditTask(task)}>{task.title}</span>
                          {task.tags.length > 0 && (
                            <div className="task-tags">
                              {task.tags.slice(0, 3).map(tag => <span key={tag} className="task-tag">{tag}</span>)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        {project && (
                          <span style={{ display: 'flex', alignItems: 'center' }}>
                            <span className="project-dot" style={{ background: project.color }} />
                            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{project.name}</span>
                          </span>
                        )}
                      </td>
                      <td>
                        {member && (
                          <div className="assignee-cell">
                            <Avatar initials={member.initials} color={member.avatarColor} size="sm" />
                            <span className="assignee-name">{member.name}</span>
                          </div>
                        )}
                      </td>
                      <td><Badge variant={task.priority.toLowerCase()}>{task.priority}</Badge></td>
                      <td><WeightDots weight={task.weight} /></td>
                      <td>
                        <span className={`deadline-text ${overdue ? 'deadline-text--overdue' : daysLeft <= 3 ? 'deadline-text--soon' : 'deadline-text--ok'}`}>
                          {formatRelativeDate(task.deadline)}
                        </span>
                      </td>
                      <td>
                        <select
                          className="status-select"
                          value={task.status}
                          onChange={e => handleStatusChange(task, e.target.value as TaskStatus)}
                          style={{
                            background: `${statuses.find(s => s.id === task.status)?.color}20`,
                            color: statuses.find(s => s.id === task.status)?.color,
                          }}
                        >
                          {statuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                      </td>
                      <td>
                        <div className="eisenhower-indicator">
                          <span className={task.eisenhower.urgent ? 'active' : ''} title="Urgent">⚡</span>
                          <span className={task.eisenhower.important ? 'active' : ''} title="Important">⭐</span>
                        </div>
                      </td>
                      <td>
                        <Button variant="ghost" size="sm" onClick={() => setEditTask(task)}>✏️</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <TaskFormModal
        isOpen={showAddModal || !!editTask}
        task={editTask}
        onClose={() => { setShowAddModal(false); setEditTask(null); }}
        onSave={(t) => {
          if (editTask) dispatch({ type: 'UPDATE_TASK', payload: t });
          else dispatch({ type: 'ADD_TASK', payload: t });
          setShowAddModal(false); setEditTask(null);
        }}
        onDelete={editTask ? () => {
          if (confirm(`Xóa task "${editTask.title}"?`)) {
            dispatch({ type: 'DELETE_TASK', payload: editTask.id });
            setEditTask(null);
          }
        } : undefined}
      />
    </div>
  );
}


