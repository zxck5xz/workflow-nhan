import { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button, Badge, Avatar, WeightDots, EmptyState, TaskFormModal, ProjectModal } from '../common';
import PageHelp from '../common/PageHelp';
import { isOverdue, formatRelativeDate, getDaysUntilDeadline } from '../../utils';
import type { Task, Project, TaskStatus, Priority } from '../../types';
import './ProjectControlPage.css';

type ViewMode = 'list' | 'board' | 'overview';

export function ProjectControlPage() {
  const { state, dispatch } = useApp();
  const { tasks, projects, members, statuses } = state.data;

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [search, setSearch] = useState('');
  
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Filter tasks based on selected project and search
  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    if (selectedProjectId) {
      result = result.filter(t => t.projectId === selectedProjectId);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q) || t.tags.some(tag => tag.includes(q)));
    }
    return result;
  }, [tasks, selectedProjectId, search]);

  const selectedProject = useMemo(() => 
    projects.find(p => p.id === selectedProjectId), 
    [projects, selectedProjectId]
  );

  return (
    <div className="project-control">
      {/* 1. Internal Sidebar (Jira-style) */}
      <aside className="pc-sidebar">
        <div className="pc-sidebar__header">
          <h3>Dự án</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowAddProject(true)} title="Thêm dự án">+</Button>
        </div>
        <div className="pc-sidebar__list">
          <div 
            className={`pc-sidebar__item ${!selectedProjectId ? 'active' : ''}`}
            onClick={() => setSelectedProjectId(null)}
          >
            <span className="pc-sidebar__icon">🌐</span>
            <span className="pc-sidebar__label">Tất cả công việc</span>
          </div>
          <div className="pc-sidebar__divider">Dự án của bạn</div>
          {projects.map(p => (
            <div 
              key={p.id} 
              className={`pc-sidebar__item ${selectedProjectId === p.id ? 'active' : ''}`}
              onClick={() => setSelectedProjectId(p.id)}
            >
              <span className="pc-sidebar__dot" style={{ background: p.color }} />
              <span className="pc-sidebar__label">{p.name}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="pc-main">
        <header className="pc-header">
          <div className="pc-header__top">
            <div className="pc-header__title">
              {selectedProject ? (
                <>
                  <Badge variant="ghost" style={{ background: `${selectedProject.color}20`, color: selectedProject.color }}>{selectedProject.platform}</Badge>
                  <h1>{selectedProject.name}</h1>
                </>
              ) : (
                <h1>🌐 Tất cả công việc</h1>
              )}
            </div>
            <div className="pc-header__actions">
              <div className="pc-search">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm nhanh..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Button variant="primary" onClick={() => setShowAddTask(true)}>+ Tạo mới</Button>
              <PageHelp title="Jira-style Dashboard">
                <h4>Quản lý dự án tập trung</h4>
                <p>Hệ thống kết hợp danh sách, bảng Kanban và báo cáo trong một màn hình duy nhất.</p>
                <ul>
                  <li><strong>Sidebar:</strong> Chuyển đổi nhanh giữa các dự án.</li>
                  <li><strong>List View:</strong> Quản lý chi tiết công việc dạng bảng.</li>
                  <li><strong>Board View:</strong> Kéo thả (sắp tới) và theo dõi luồng công việc.</li>
                  <li><strong>Overview:</strong> Thống kê nhanh hiệu suất dự án.</li>
                </ul>
              </PageHelp>
            </div>
          </div>

          <nav className="pc-tabs">
            <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>📋 Danh sách</button>
            <button className={viewMode === 'board' ? 'active' : ''} onClick={() => setViewMode('board')}>🍱 Bảng (Kanban)</button>
            <button className={viewMode === 'overview' ? 'active' : ''} onClick={() => setViewMode('overview')}>📊 Tổng quan</button>
          </nav>
        </header>

        <section className="pc-content">
          {viewMode === 'list' && (
            <ListView tasks={filteredTasks} onEditTask={setEditTask} />
          )}
          {viewMode === 'board' && (
            <BoardView tasks={filteredTasks} onEditTask={setEditTask} />
          )}
          {viewMode === 'overview' && (
            <OverviewView tasks={filteredTasks} project={selectedProject || null} />
          )}
        </section>
      </main>

      {/* Modals */}
      <ProjectModal 
        isOpen={showAddProject} 
        project={null} 
        onClose={() => setShowAddProject(false)}
        onSave={(p) => { dispatch({ type: 'ADD_PROJECT', payload: p }); setShowAddProject(false); }}
      />
      <TaskFormModal
        isOpen={showAddTask || !!editTask}
        task={editTask}
        defaultProjectId={selectedProjectId || undefined}
        onClose={() => { setShowAddTask(false); setEditTask(null); }}
        onSave={(t) => {
          if (editTask) dispatch({ type: 'UPDATE_TASK', payload: t });
          else dispatch({ type: 'ADD_TASK', payload: t });
          setShowAddTask(false); setEditTask(null);
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

// ── View Components ──

function ListView({ tasks, onEditTask }: { tasks: Task[]; onEditTask: (t: Task) => void }) {
  const { state } = useApp();
  const { projects, members, statuses } = state.data;

  if (tasks.length === 0) return <EmptyState icon="📝" title="Chưa có công việc" description="Bắt đầu bằng cách tạo một công việc mới." />;

  return (
    <div className="pc-view-list">
      <table className="data-table">
        <thead>
          <tr>
            <th>Tên công việc</th>
            <th>Người phụ trách</th>
            <th>Mức độ</th>
            <th>Hạn chót</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => {
            const member = members.find(m => m.id === task.assigneeId);
            const status = statuses.find(s => s.id === task.status);
            return (
              <tr key={task.id} className={isOverdue(task) ? 'task-row--overdue' : ''}>
                <td>
                  <span className="pc-task-title" onClick={() => onEditTask(task)}>{task.title}</span>
                </td>
                <td>
                  {member && <div className="assignee-cell"><Avatar initials={member.initials} color={member.avatarColor} size="sm" /> <span>{member.name}</span></div>}
                </td>
                <td><Badge variant={task.priority.toLowerCase()}>{task.priority}</Badge></td>
                <td><span className={isOverdue(task) ? 'text-danger' : ''}>{formatRelativeDate(task.deadline)}</span></td>
                <td><Badge style={{ background: `${status?.color}20`, color: status?.color }}>{status?.label}</Badge></td>
                <td><Button variant="ghost" size="sm" onClick={() => onEditTask(task)}>✏️</Button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function BoardView({ tasks, onEditTask }: { tasks: Task[]; onEditTask: (t: Task) => void }) {
  const { state } = useApp();
  const { statuses, members } = state.data;

  return (
    <div className="pc-view-board">
      {statuses.map(status => {
        const columnTasks = tasks.filter(t => t.status === status.id);
        return (
          <div key={status.id} className="board-column">
            <div className="board-column__header">
              <span className="status-label">{status.label}</span>
              <span className="count-badge">{columnTasks.length}</span>
            </div>
            <div className="board-column__body">
              {columnTasks.map(task => {
                const member = members.find(m => m.id === task.assigneeId);
                return (
                  <div key={task.id} className="board-card" onClick={() => onEditTask(task)}>
                    <div className="board-card__title">{task.title}</div>
                    <div className="board-card__footer">
                      <Badge variant={task.priority.toLowerCase()}>{task.priority}</Badge>
                      <div style={{ flex: 1 }} />
                      {member && <Avatar initials={member.initials} color={member.avatarColor} size="xs" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OverviewView({ tasks, project }: { tasks: Task[]; project: Project | null }) {
  const completed = tasks.filter(t => t.status === 'done').length;
  const overdue = tasks.filter(t => isOverdue(t)).length;
  const progress = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;

  return (
    <div className="pc-view-overview">
      <div className="overview-stats">
        <div className="stat-box">
          <label>Hoàn thành</label>
          <div className="value">{completed}/{tasks.length}</div>
          <div className="progress-small"><div className="fill" style={{ width: `${progress}%` }} /></div>
        </div>
        <div className="stat-box danger">
          <label>Trễ hạn</label>
          <div className="value">{overdue}</div>
        </div>
      </div>
      
      {project && (
        <div className="project-details-card">
          <h3>Thông tin dự án</h3>
          <div className="details-grid">
            <div className="detail-item"><label>Nền tảng:</label> <span>{project.platform}</span></div>
            <div className="detail-item"><label>Thể loại:</label> <span>{project.genre}</span></div>
            <div className="detail-item"><label>Ngày tạo:</label> <span>{project.createdAt}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
