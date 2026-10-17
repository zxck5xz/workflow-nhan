import { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button, Badge, Avatar, TaskFormModal, ProjectModal } from '../common';
import PageHelp from '../common/PageHelp';
import { isOverdue, formatDate } from '../../utils';
import {
  ACTIVE_ALERTS,
  ALERT_META,
  countAlerts,
  getAlertLevel,
  type AlertLevel,
  isTaskCompleted,
} from '../../utils/deadline';
import { AlertSummaryBar, ReminderBell } from './DeadlineAlerts';
import { TimelineImportModal } from './TimelineImportModal';
import { TimelineListView } from './TimelineListView';
import type { Task, Project } from '../../types';
import './ProjectControlPage.css';

type ViewMode = 'list' | 'board' | 'overview';

export function ProjectControlPage() {
  const { state, dispatch } = useApp();
  const { tasks, projects } = state.data;

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState<string | null>(null);
  const [alertFilter, setAlertFilter] = useState<AlertLevel | null>(null);
  const [showImport, setShowImport] = useState(false);

  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Filter tasks based on selected project, team and search; the alert filter
  // applies on top so the summary bar keeps showing every level's count
  const scopedTasks = useMemo(() => {
    let result = [...tasks];
    if (selectedProjectId) {
      result = result.filter((t) => t.projectId === selectedProjectId);
    }
    if (teamFilter) {
      result = result.filter((t) => t.timeline?.team === teamFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          t.timeline?.code.toLowerCase() === q,
      );
    }
    return result;
  }, [tasks, selectedProjectId, teamFilter, search]);

  const filteredTasks = useMemo(
    () => (alertFilter ? scopedTasks.filter((t) => getAlertLevel(t) === alertFilter) : scopedTasks),
    [scopedTasks, alertFilter],
  );

  const teams = useMemo(() => {
    const set = new Set<string>();
    for (const t of tasks) {
      if (t.timeline && (!selectedProjectId || t.projectId === selectedProjectId)) {
        set.add(t.timeline.team);
      }
    }
    return [...set].sort((a, b) => a.localeCompare(b, 'vi'));
  }, [tasks, selectedProjectId]);

  // Pending alert count + most severe level per project, for the sidebar badge
  const projectAlerts = useMemo(() => {
    const map = new Map<string, { count: number; level: AlertLevel }>();
    for (const t of tasks) {
      const level = getAlertLevel(t);
      if (!ACTIVE_ALERTS.includes(level)) continue;
      const cur = map.get(t.projectId);
      if (!cur) map.set(t.projectId, { count: 1, level });
      else {
        cur.count++;
        if (ALERT_META[level].rank > ALERT_META[cur.level].rank) cur.level = level;
      }
    }
    return map;
  }, [tasks]);

  const selectProject = (id: string | null) => {
    setSelectedProjectId(id);
    setTeamFilter(null);
    setAlertFilter(null);
  };

  const openTask = (task: Task) => {
    if (selectedProjectId && task.projectId !== selectedProjectId) selectProject(task.projectId);
    setEditTask(task);
  };

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId),
    [projects, selectedProjectId],
  );

  return (
    <div className="project-control">
      {/* 1. Internal Sidebar (Jira-style) */}
      <aside className="pc-sidebar">
        <div className="pc-sidebar__header">
          <h3>Dự án</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddProject(true)}
            title="Thêm dự án"
          >
            +
          </Button>
        </div>
        <div className="pc-sidebar__list">
          <div
            className={`pc-sidebar__item ${!selectedProjectId ? 'active' : ''}`}
            onClick={() => selectProject(null)}
          >
            <span className="pc-sidebar__icon">🌐</span>
            <span className="pc-sidebar__label">Tất cả công việc</span>
          </div>
          <div className="pc-sidebar__divider">Dự án của bạn</div>
          {projects.map((p) => {
            const alert = projectAlerts.get(p.id);
            return (
              <div
                key={p.id}
                className={`pc-sidebar__item ${selectedProjectId === p.id ? 'active' : ''}`}
                onClick={() => selectProject(p.id)}
              >
                <span className="pc-sidebar__dot" style={{ background: p.color }} />
                <span className="pc-sidebar__label">{p.name}</span>
                {alert && (
                  <span
                    className={`pc-sidebar__alert pc-sidebar__alert--${alert.level}`}
                    title={`${alert.count} task cần chú ý deadline (gấp nhất: ${ALERT_META[alert.level].label})`}
                  >
                    {alert.count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="pc-main">
        <header className="pc-header">
          <div className="pc-header__top">
            <div className="pc-header__title">
              {selectedProject ? (
                <>
                  <Badge
                    variant="ghost"
                    style={{
                      background: `${selectedProject.color}20`,
                      color: selectedProject.color,
                    }}
                  >
                    {selectedProject.timeline ? '📅 Timeline' : selectedProject.platform}
                  </Badge>
                  <h1>{selectedProject.name}</h1>
                  {selectedProject.timeline && (
                    <span className="pc-header__range">
                      {formatDate(selectedProject.timeline.startDate)} →{' '}
                      {formatDate(selectedProject.timeline.endDate)}
                    </span>
                  )}
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
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {teams.length > 0 && (
                <select
                  className="form-select pc-team-filter"
                  value={teamFilter ?? ''}
                  onChange={(e) => setTeamFilter(e.target.value || null)}
                >
                  <option value="">Tất cả team</option>
                  {teams.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              )}
              <ReminderBell tasks={tasks} projects={projects} onOpenTask={openTask} />
              <Button variant="secondary" onClick={() => setShowImport(true)}>
                📥 Import timeline
              </Button>
              {selectedProject && (
                <Button
                  variant="ghost"
                  title="Xóa dự án và toàn bộ task"
                  onClick={() => {
                    const n = tasks.filter((t) => t.projectId === selectedProject.id).length;
                    if (confirm(`Xóa dự án "${selectedProject.name}" và ${n} task?`)) {
                      dispatch({ type: 'DELETE_PROJECT', payload: selectedProject.id });
                      selectProject(null);
                    }
                  }}
                >
                  🗑
                </Button>
              )}
              <Button variant="primary" onClick={() => setShowAddTask(true)}>
                + Tạo mới
              </Button>
              <PageHelp title="Jira-style Dashboard">
                <h4>Quản lý dự án tập trung</h4>
                <p>
                  Hệ thống kết hợp danh sách, bảng Kanban và báo cáo trong một màn hình duy nhất.
                </p>
                <ul>
                  <li>
                    <strong>Sidebar:</strong> Chuyển đổi nhanh giữa các dự án.
                  </li>
                  <li>
                    <strong>List View:</strong> Quản lý chi tiết công việc dạng bảng.
                  </li>
                  <li>
                    <strong>Board View:</strong> Kéo thả (sắp tới) và theo dõi luồng công việc.
                  </li>
                  <li>
                    <strong>Overview:</strong> Thống kê nhanh hiệu suất dự án.
                  </li>
                  <li>
                    <strong>Import timeline:</strong> tạo dự án mới từ file Excel (TT, Nội dung công
                    việc, Đảm nhiệm, Bắt đầu, Hoàn thành, Kết thúc, Tiến độ).
                  </li>
                  <li>
                    <strong>Cảnh báo deadline:</strong> 🟡 còn ≤ 7 ngày, 🟠 còn ≤ 3 ngày / ngày mai,
                    🔴 hôm nay / quá hạn. Chuông 🔔 nhắc mỗi task một lần ở mốc T-7, T-3, T-1; task
                    quá hạn được nhắc lại mỗi ngày.
                  </li>
                </ul>
              </PageHelp>
            </div>
          </div>

          <nav className="pc-tabs">
            <button
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
            >
              📋 Danh sách
            </button>
            <button
              className={viewMode === 'board' ? 'active' : ''}
              onClick={() => setViewMode('board')}
            >
              🍱 Bảng (Kanban)
            </button>
            <button
              className={viewMode === 'overview' ? 'active' : ''}
              onClick={() => setViewMode('overview')}
            >
              📊 Tổng quan
            </button>
          </nav>
        </header>

        <section className="pc-content">
          <AlertSummaryBar tasks={scopedTasks} active={alertFilter} onSelect={setAlertFilter} />
          {viewMode === 'list' && (
            <TimelineListView
              tasks={filteredTasks}
              showProject={!selectedProject}
              onEditTask={setEditTask}
            />
          )}
          {viewMode === 'board' && <BoardView tasks={filteredTasks} onEditTask={setEditTask} />}
          {viewMode === 'overview' && (
            <OverviewView tasks={filteredTasks} project={selectedProject || null} />
          )}
        </section>
      </main>

      {/* Modals */}
      <TimelineImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onImport={(payload) => {
          dispatch({ type: 'IMPORT_PROJECT', payload });
          setShowImport(false);
          selectProject(payload.project.id);
          setViewMode('list');
        }}
      />
      <ProjectModal
        isOpen={showAddProject}
        project={null}
        onClose={() => setShowAddProject(false)}
        onSave={(p) => {
          dispatch({ type: 'ADD_PROJECT', payload: p });
          setShowAddProject(false);
        }}
      />
      <TaskFormModal
        isOpen={showAddTask || !!editTask}
        task={editTask}
        defaultProjectId={selectedProjectId || undefined}
        onClose={() => {
          setShowAddTask(false);
          setEditTask(null);
        }}
        onSave={(t) => {
          if (editTask) dispatch({ type: 'UPDATE_TASK', payload: t });
          else dispatch({ type: 'ADD_TASK', payload: t });
          setShowAddTask(false);
          setEditTask(null);
        }}
        onDelete={
          editTask
            ? () => {
                if (confirm(`Xóa task "${editTask.title}"?`)) {
                  dispatch({ type: 'DELETE_TASK', payload: editTask.id });
                  setEditTask(null);
                }
              }
            : undefined
        }
      />
    </div>
  );
}

// ── View Components ──

function BoardView({ tasks, onEditTask }: { tasks: Task[]; onEditTask: (t: Task) => void }) {
  const { state } = useApp();
  const { statuses, members } = state.data;

  return (
    <div className="pc-view-board">
      {statuses.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status.id);
        return (
          <div key={status.id} className="board-column">
            <div className="board-column__header">
              <span className="status-label">{status.label}</span>
              <span className="count-badge">{columnTasks.length}</span>
            </div>
            <div className="board-column__body">
              {columnTasks.map((task) => {
                const member = members.find((m) => m.id === task.assigneeId);
                return (
                  <div
                    key={task.id}
                    className={`board-card ${isTaskCompleted(task) ? 'board-card--done' : ''}`}
                    onClick={() => onEditTask(task)}
                  >
                    <div className="board-card__title">{task.title}</div>
                    <div className="board-card__footer">
                      <Badge variant={task.priority.toLowerCase()}>{task.priority}</Badge>
                      <div style={{ flex: 1 }} />
                      {member && (
                        <Avatar initials={member.initials} color={member.avatarColor} size="xs" />
                      )}
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
  const completed = tasks.filter((t) => t.status === 'done').length;
  const overdue = tasks.filter((t) => isOverdue(t)).length;
  const progress = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
  const alerts = countAlerts(tasks);

  const timelineTasks = tasks.filter((t) => t.timeline);
  const avgProgress = timelineTasks.length
    ? Math.round(timelineTasks.reduce((s, t) => s + t.timeline!.progress, 0) / timelineTasks.length)
    : null;
  const byTeam = new Map<string, Task[]>();
  for (const t of timelineTasks) {
    const list = byTeam.get(t.timeline!.team) ?? [];
    list.push(t);
    byTeam.set(t.timeline!.team, list);
  }
  const teamRows = [...byTeam.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="pc-view-overview">
      <div className="overview-stats">
        <div className="stat-box">
          <label>Hoàn thành</label>
          <div className="value">
            {completed}/{tasks.length}
          </div>
          <div className="progress-small">
            <div className="fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        {avgProgress !== null && (
          <div className="stat-box">
            <label>Tiến độ trung bình</label>
            <div className="value">{avgProgress}%</div>
            <div className="progress-small">
              <div className="fill" style={{ width: `${avgProgress}%` }} />
            </div>
          </div>
        )}
        <div className="stat-box danger">
          <label>Trễ hạn</label>
          <div className="value">{overdue}</div>
        </div>
        <div className="stat-box danger">
          <label>Hạn hôm nay / ngày mai</label>
          <div className="value">{alerts.today + alerts.t1}</div>
        </div>
        <div className="stat-box accent">
          <label>Gấp (≤ 3 ngày)</label>
          <div className="value">{alerts.t3}</div>
        </div>
        <div className="stat-box warning">
          <label>Sắp hạn (≤ 7 ngày)</label>
          <div className="value">{alerts.t7}</div>
        </div>
      </div>

      {teamRows.length > 0 && (
        <div className="project-details-card">
          <h3>Phân bổ theo team</h3>
          <table className="data-table" style={{ marginTop: 'var(--space-3)' }}>
            <thead>
              <tr>
                <th>Team</th>
                <th>Số task</th>
                <th>Hoàn thành</th>
                <th>Tiến độ TB</th>
                <th>Cần chú ý</th>
              </tr>
            </thead>
            <tbody>
              {teamRows.map(([team, list]) => {
                const counts = countAlerts(list);
                const avg = Math.round(
                  list.reduce((s, t) => s + t.timeline!.progress, 0) / list.length,
                );
                return (
                  <tr key={team}>
                    <td>{team}</td>
                    <td>{list.length}</td>
                    <td>{counts.completed}</td>
                    <td>{avg}%</td>
                    <td>
                      {ACTIVE_ALERTS.filter((l) => counts[l] > 0).map((l) => (
                        <span
                          key={l}
                          className={`alert-badge alert-badge--${l}`}
                          title={ALERT_META[l].rule}
                        >
                          {ALERT_META[l].icon} {counts[l]}
                        </span>
                      ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {project && (
        <div className="project-details-card">
          <h3>Thông tin dự án</h3>
          <div className="details-grid">
            <div className="detail-item">
              <label>Nền tảng:</label> <span>{project.platform}</span>
            </div>
            <div className="detail-item">
              <label>Thể loại:</label> <span>{project.genre}</span>
            </div>
            <div className="detail-item">
              <label>Ngày tạo:</label> <span>{project.createdAt}</span>
            </div>
            {project.timeline && (
              <>
                <div className="detail-item">
                  <label>Thời gian:</label>{' '}
                  <span>
                    {formatDate(project.timeline.startDate)} →{' '}
                    {formatDate(project.timeline.endDate)}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Nguồn:</label>{' '}
                  <span>
                    {project.timeline.sourceFile} · sheet “{project.timeline.sheetName}”
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
