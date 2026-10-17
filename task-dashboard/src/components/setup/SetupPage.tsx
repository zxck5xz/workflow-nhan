import { useMemo, useState, type CSSProperties } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationSection } from './NotificationSection';
import { Button, Avatar, Modal, ProjectModal } from '../common';
import PageHelp from '../common/PageHelp';
import { v4 as uuid } from 'uuid';
import { getInitials } from '../../utils';
import { buildTeamColors, findDepartment, teamKey } from '../../utils/teamColor';
import { UNASSIGNED_TEAM } from '../../utils/timelineImport';
import type { Department, Project, Member } from '../../types';
import './SetupPage.css';

// Members without a department keep their color; new ones start neutral
const NO_DEPARTMENT_COLOR = '#5c6280';

const COLORS = [
  '#ff6b35',
  '#00c48c',
  '#3b82f6',
  '#ffb830',
  '#e74c8b',
  '#8b5cf6',
  '#ef4444',
  '#06b6d4',
  '#84cc16',
  '#f97316',
];

export function SetupPage() {
  const { user } = useAuth();
  return (
    <div className="setup-page">
      <div className="page-header">
        <h1>⚙️ Cấu hình</h1>
        <div className="header-actions">
          <PageHelp title="Hướng dẫn - Cấu hình">
            <h4>Tổng quan</h4>
            <p>Trang cấu hình dùng để quản lý dự án và nhân sự (Projects & Members).</p>
            <h5>Dự án</h5>
            <ul>
              <li>Thêm / sửa / xóa dự án, chọn platform, genre và màu đại diện.</li>
            </ul>
            <h5>Bộ phận</h5>
            <ul>
              <li>Đặt tên và màu cho từng bộ phận (team).</li>
              <li>
                Cột Team của task import từ timeline lấy màu theo bộ phận cùng tên (không phân biệt
                hoa thường).
              </li>
              <li>Nút &quot;Lấy từ timeline&quot; tạo nhanh bộ phận từ các team đã import.</li>
            </ul>
            <h5>Nhân sự</h5>
            <ul>
              <li>Quản lý thành viên, vai trò và bộ phận. Màu avatar đi theo màu bộ phận.</li>
            </ul>
          </PageHelp>
        </div>
      </div>
      <div className="setup-grid stagger-children">
        <ProjectsSection />
        <DepartmentsSection />
        <MembersSection />
      </div>
      {user?.role === 'ADMIN' && (
        <div style={{ marginTop: 'var(--space-4)', maxWidth: 480 }}>
          <NotificationSection />
        </div>
      )}
    </div>
  );
}

// ── Projects Section ──
function ProjectsSection() {
  const { state, dispatch } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);

  return (
    <div className="setup-section">
      <div className="setup-section__header">
        <h3>📁 Dự án ({state.data.projects.length})</h3>
        <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>
          + Thêm
        </Button>
      </div>
      <div className="setup-section__body">
        <div className="editable-list">
          {state.data.projects.map((proj) => (
            <div key={proj.id} className="editable-list__item">
              <div className="editable-list__color-dot" style={{ background: proj.color }} />
              <div className="editable-list__item-info">
                <div className="editable-list__item-name">{proj.name}</div>
                <div className="editable-list__item-meta">
                  {proj.platform} · {proj.genre} · {proj.status}
                </div>
              </div>
              <div className="editable-list__item-actions">
                <Button variant="ghost" size="sm" onClick={() => setEditProject(proj)}>
                  ✏️
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm(`Xóa dự án "${proj.name}"?`))
                      dispatch({ type: 'DELETE_PROJECT', payload: proj.id });
                  }}
                >
                  🗑️
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProjectModal
        isOpen={showAdd || !!editProject}
        project={editProject}
        onClose={() => {
          setShowAdd(false);
          setEditProject(null);
        }}
        onSave={(p) => {
          if (editProject) dispatch({ type: 'UPDATE_PROJECT', payload: p });
          else dispatch({ type: 'ADD_PROJECT', payload: p });
          setShowAdd(false);
          setEditProject(null);
        }}
      />
    </div>
  );
}

// ── Departments Section ──
function DepartmentsSection() {
  const { state, dispatch } = useApp();
  const departments = useMemo(
    () => [...(state.data.departments ?? [])].sort((a, b) => a.order - b.order),
    [state.data.departments],
  );
  const [editing, setEditing] = useState<Department | 'new' | null>(null);

  // Team names from imported timelines, one per spelling-insensitive key
  const timelineTeams = useMemo(() => {
    const seen = new Map<string, string>();
    for (const t of state.data.tasks) {
      const team = t.timeline?.team;
      if (team && team !== UNASSIGNED_TEAM && !seen.has(teamKey(team)))
        seen.set(teamKey(team), team);
    }
    return [...seen.values()];
  }, [state.data.tasks]);
  const missingTeams = timelineTeams.filter((t) => !findDepartment(departments, t));

  const setDepartments = (list: Department[]) =>
    dispatch({ type: 'SET_DEPARTMENTS', payload: list.map((d, i) => ({ ...d, order: i })) });

  const importTeams = () => {
    // Keep the colors the teams already show in the task list
    const colors = buildTeamColors(timelineTeams, departments);
    setDepartments([
      ...departments,
      ...[...missingTeams]
        .sort((a, b) => a.localeCompare(b, 'vi'))
        .map((name) => ({
          id: `dept-${uuid().slice(0, 8)}`,
          name,
          color: colors.get(name) ?? COLORS[0],
          order: 0,
        })),
    ]);
  };

  const move = (index: number, delta: number) => {
    const list = [...departments];
    const [item] = list.splice(index, 1);
    list.splice(index + delta, 0, item);
    setDepartments(list);
  };

  const countMembers = (id: string) =>
    state.data.members.filter((m) => m.departmentId === id).length;
  const countTasks = (d: Department) =>
    state.data.tasks.filter((t) => t.timeline && teamKey(t.timeline.team) === teamKey(d.name))
      .length;

  return (
    <div className="setup-section">
      <div className="setup-section__header">
        <h3>🏷️ Bộ phận ({departments.length})</h3>
        <div className="setup-section__actions">
          {missingTeams.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              title={missingTeams.join(', ')}
              onClick={importTeams}
            >
              Lấy từ timeline ({missingTeams.length})
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={() => setEditing('new')}>
            + Thêm
          </Button>
        </div>
      </div>
      <div className="setup-section__body">
        {departments.length === 0 && (
          <p className="setup-section__empty">
            Chưa có bộ phận nào. Thêm mới hoặc lấy từ các team trong timeline đã import.
          </p>
        )}
        <div className="editable-list">
          {departments.map((dept, i) => (
            <div key={dept.id} className="editable-list__item">
              <div className="editable-list__item-info editable-list__item-info--inline">
                <span className="dept-chip" style={{ '--dept-color': dept.color } as CSSProperties}>
                  {dept.name}
                </span>
                <div className="editable-list__item-meta">
                  {countMembers(dept.id)} nhân sự · {countTasks(dept)} task
                </div>
              </div>
              <div className="editable-list__item-actions">
                <Button
                  variant="ghost"
                  size="sm"
                  title="Lên"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  title="Xuống"
                  disabled={i === departments.length - 1}
                  onClick={() => move(i, 1)}
                >
                  ↓
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditing(dept)}>
                  ✏️
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const n = countMembers(dept.id);
                    const note = n ? ` ${n} nhân sự sẽ không còn thuộc bộ phận nào.` : '';
                    if (confirm(`Xóa bộ phận "${dept.name}"?${note}`))
                      setDepartments(departments.filter((d) => d.id !== dept.id));
                  }}
                >
                  🗑️
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <DepartmentModal
          department={editing === 'new' ? null : editing}
          existing={departments}
          onClose={() => setEditing(null)}
          onSave={(d) => {
            setDepartments(
              editing === 'new'
                ? [...departments, d]
                : departments.map((x) => (x.id === d.id ? d : x)),
            );
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function DepartmentModal({
  department,
  existing,
  onClose,
  onSave,
}: {
  department: Department | null;
  existing: Department[];
  onClose: () => void;
  onSave: (d: Department) => void;
}) {
  const [name, setName] = useState(department?.name ?? '');
  const [color, setColor] = useState(department?.color ?? COLORS[existing.length % COLORS.length]);

  const duplicate = existing.some(
    (d) => d.id !== department?.id && teamKey(d.name) === teamKey(name),
  );
  const canSave = name.trim() !== '' && !duplicate;

  const handleSubmit = () => {
    if (!canSave) return;
    onSave({
      id: department?.id ?? `dept-${uuid().slice(0, 8)}`,
      name: name.trim().replace(/\s+/g, ' '),
      color,
      order: department?.order ?? existing.length,
    });
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={department ? 'Sửa bộ phận' : 'Thêm bộ phận'}
      footer={
        <>
          <Button onClick={onClose}>Hủy</Button>
          <div style={{ flex: 1 }} />
          <Button variant="primary" onClick={handleSubmit} disabled={!canSave}>
            Lưu
          </Button>
        </>
      }
    >
      <div className="form-group">
        <label className="form-label">Tên bộ phận</label>
        <input
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="VD: VLive Product, Dev, VLive MKT"
          autoFocus
        />
        {duplicate && <p className="setup-form-error">Đã có bộ phận tên này.</p>}
        <p className="setup-form-hint">
          Đặt đúng tên team trong file timeline để cột Team tự lấy màu.
        </p>
      </div>
      <div className="form-group">
        <label className="form-label">Màu</label>
        <div className="color-swatches">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`color-swatch ${color === c ? 'color-swatch--active' : ''}`}
              style={{ background: c }}
              aria-label={c}
              onClick={() => setColor(c)}
            />
          ))}
          <label
            className={`color-swatch color-swatch--custom ${COLORS.includes(color) ? '' : 'color-swatch--active'}`}
            title="Màu khác"
            style={COLORS.includes(color) ? undefined : { background: color }}
          >
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
        </div>
        <p className="setup-form-hint">
          Xem trước:{' '}
          <span className="dept-chip" style={{ '--dept-color': color } as CSSProperties}>
            {name.trim() || 'Tên bộ phận'}
          </span>
        </p>
      </div>
    </Modal>
  );
}

// ── Members Section ──
function MembersSection() {
  const { state, dispatch } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const departmentById = useMemo(
    () => new Map((state.data.departments ?? []).map((d) => [d.id, d])),
    [state.data.departments],
  );

  return (
    <div className="setup-section">
      <div className="setup-section__header">
        <h3>👥 Nhân sự ({state.data.members.length})</h3>
        <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>
          + Thêm
        </Button>
      </div>
      <div className="setup-section__body">
        <div className="editable-list">
          {state.data.members.map((mem) => (
            <div key={mem.id} className="editable-list__item">
              <Avatar initials={mem.initials} color={mem.avatarColor} />
              <div className="editable-list__item-info">
                <div className="editable-list__item-name">{mem.name}</div>
                <div className="editable-list__item-meta">
                  {mem.role}
                  {departmentById.get(mem.departmentId ?? '') && (
                    <span
                      className="dept-chip dept-chip--sm"
                      style={
                        {
                          '--dept-color': departmentById.get(mem.departmentId!)!.color,
                        } as CSSProperties
                      }
                    >
                      {departmentById.get(mem.departmentId!)!.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="editable-list__item-actions">
                <Button variant="ghost" size="sm" onClick={() => setEditMember(mem)}>
                  ✏️
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm(`Xóa nhân sự "${mem.name}"?`))
                      dispatch({ type: 'DELETE_MEMBER', payload: mem.id });
                  }}
                >
                  🗑️
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MemberModal
        // remount per member so the form starts from that member's values
        key={editMember?.id ?? (showAdd ? 'new' : 'closed')}
        isOpen={showAdd || !!editMember}
        member={editMember}
        departments={state.data.departments ?? []}
        onClose={() => {
          setShowAdd(false);
          setEditMember(null);
        }}
        onSave={(m) => {
          if (editMember) dispatch({ type: 'UPDATE_MEMBER', payload: m });
          else dispatch({ type: 'ADD_MEMBER', payload: m });
          setShowAdd(false);
          setEditMember(null);
        }}
      />
    </div>
  );
}

function MemberModal({
  isOpen,
  member,
  onClose,
  onSave,
  departments,
}: {
  isOpen: boolean;
  member: Member | null;
  onClose: () => void;
  onSave: (m: Member) => void;
  departments: Department[];
}) {
  const [name, setName] = useState(member?.name || '');
  const [role, setRole] = useState(member?.role || '');
  const [departmentId, setDepartmentId] = useState(member?.departmentId ?? '');
  const sortedDepartments = [...departments].sort((a, b) => a.order - b.order);
  const department = departments.find((d) => d.id === departmentId);
  // Color follows the department
  const color = department?.color ?? member?.avatarColor ?? NO_DEPARTMENT_COLOR;

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({
      id: member?.id || `mem-${uuid().slice(0, 8)}`,
      name: name.trim(),
      email: member?.email || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@example.com`,
      role: role.trim() || 'Tester',
      avatarColor: color,
      initials: getInitials(name.trim()),
      joinedAt: member?.joinedAt || new Date().toISOString().split('T')[0],
      departmentId: department?.id,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={member ? 'Sửa nhân sự' : 'Thêm nhân sự'}
      footer={
        <>
          <Button onClick={onClose}>Hủy</Button>
          <div style={{ flex: 1 }} />
          <Button variant="primary" onClick={handleSubmit}>
            Lưu
          </Button>
        </>
      }
    >
      <div className="form-group">
        <label className="form-label">Họ tên</label>
        <input
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="VD: Nhân Nguyễn"
          autoFocus
        />
      </div>
      <div className="form-group">
        <label className="form-label">Vai trò</label>
        <input
          className="form-input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="VD: Lead Tester, QA, Analyst"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Bộ phận</label>
        <div className="member-dept-field">
          <Avatar initials={name ? getInitials(name) : '?'} color={color} />
          <select
            className="form-select"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
          >
            <option value="">— Chưa có bộ phận —</option>
            {sortedDepartments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <p className="setup-form-hint">
          {departments.length === 0
            ? 'Chưa có bộ phận nào — thêm ở mục Bộ phận phía trên.'
            : 'Màu avatar lấy theo màu của bộ phận.'}
        </p>
      </div>
    </Modal>
  );
}
