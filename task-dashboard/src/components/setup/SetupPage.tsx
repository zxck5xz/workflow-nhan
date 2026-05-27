import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button, Avatar, Modal } from '../common';
import PageHelp from '../common/PageHelp';
import { v4 as uuid } from 'uuid';
import { getInitials } from '../../utils';
import type { Project, Member, Platform } from '../../types';
import './SetupPage.css';

const PLATFORMS: Platform[] = ['iOS', 'Android', 'PC', 'Console', 'Web', 'Cross-platform'];
const COLORS = ['#ff6b35', '#00c48c', '#3b82f6', '#ffb830', '#e74c8b', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16', '#f97316'];

export function SetupPage() {
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
            <h5>Nhân sự</h5>
            <ul>
              <li>Quản lý thành viên, vai trò và màu avatar để hiển thị trong app.</li>
            </ul>
          </PageHelp>
        </div>
      </div>
      <div className="setup-grid stagger-children">
        <ProjectsSection />
        <MembersSection />
      </div>
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
        <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>+ Thêm</Button>
      </div>
      <div className="setup-section__body">
        <div className="editable-list">
          {state.data.projects.map(proj => (
            <div key={proj.id} className="editable-list__item">
              <div className="editable-list__color-dot" style={{ background: proj.color }} />
              <div className="editable-list__item-info">
                <div className="editable-list__item-name">{proj.name}</div>
                <div className="editable-list__item-meta">{proj.platform} · {proj.genre} · {proj.status}</div>
              </div>
              <div className="editable-list__item-actions">
                <Button variant="ghost" size="sm" onClick={() => setEditProject(proj)}>✏️</Button>
                <Button variant="ghost" size="sm" onClick={() => {
                  if (confirm(`Xóa dự án "${proj.name}"?`)) dispatch({ type: 'DELETE_PROJECT', payload: proj.id });
                }}>🗑️</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProjectModal
        isOpen={showAdd || !!editProject}
        project={editProject}
        onClose={() => { setShowAdd(false); setEditProject(null); }}
        onSave={(p) => {
          if (editProject) dispatch({ type: 'UPDATE_PROJECT', payload: p });
          else dispatch({ type: 'ADD_PROJECT', payload: p });
          setShowAdd(false); setEditProject(null);
        }}
      />
    </div>
  );
}

function ProjectModal({ isOpen, project, onClose, onSave }: { isOpen: boolean; project: Project | null; onClose: () => void; onSave: (p: Project) => void }) {
  const [name, setName] = useState(project?.name || '');
  const [platform, setPlatform] = useState<Platform>(project?.platform || 'iOS');
  const [genre, setGenre] = useState(project?.genre || '');
  const [color, setColor] = useState(project?.color || COLORS[0]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({
      id: project?.id || `proj-${uuid().slice(0, 8)}`,
      name: name.trim(),
      platform,
      genre: genre.trim() || 'Uncategorized',
      status: project?.status || 'active',
      color,
      createdAt: project?.createdAt || new Date().toISOString().split('T')[0],
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Sửa dự án' : 'Thêm dự án mới'}
      footer={<><Button onClick={onClose}>Hủy</Button><div style={{ flex: 1 }} /><Button variant="primary" onClick={handleSubmit}>Lưu</Button></>}
    >
      <div className="form-group">
        <label className="form-label">Tên dự án</label>
        <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="VD: Puzzle Quest Mobile" autoFocus />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Platform</label>
          <select className="form-select" value={platform} onChange={e => setPlatform(e.target.value as Platform)}>
            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Genre</label>
          <input className="form-input" value={genre} onChange={e => setGenre(e.target.value)} placeholder="VD: Puzzle, MOBA" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Màu sắc</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {COLORS.map(c => (
            <div
              key={c}
              onClick={() => setColor(c)}
              style={{
                width: 28, height: 28, borderRadius: 4, background: c, cursor: 'pointer',
                border: color === c ? '2px solid white' : '2px solid transparent',
                transition: 'border-color 0.15s',
              }}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
}

// ── Members Section ──
function MembersSection() {
  const { state, dispatch } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);

  return (
    <div className="setup-section">
      <div className="setup-section__header">
        <h3>👥 Nhân sự ({state.data.members.length})</h3>
        <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>+ Thêm</Button>
      </div>
      <div className="setup-section__body">
        <div className="editable-list">
          {state.data.members.map(mem => (
            <div key={mem.id} className="editable-list__item">
              <Avatar initials={mem.initials} color={mem.avatarColor} />
              <div className="editable-list__item-info">
                <div className="editable-list__item-name">{mem.name}</div>
                <div className="editable-list__item-meta">{mem.role}</div>
              </div>
              <div className="editable-list__item-actions">
                <Button variant="ghost" size="sm" onClick={() => setEditMember(mem)}>✏️</Button>
                <Button variant="ghost" size="sm" onClick={() => {
                  if (confirm(`Xóa nhân sự "${mem.name}"?`)) dispatch({ type: 'DELETE_MEMBER', payload: mem.id });
                }}>🗑️</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MemberModal
        isOpen={showAdd || !!editMember}
        member={editMember}
        onClose={() => { setShowAdd(false); setEditMember(null); }}
        onSave={(m) => {
          if (editMember) dispatch({ type: 'UPDATE_MEMBER', payload: m });
          else dispatch({ type: 'ADD_MEMBER', payload: m });
          setShowAdd(false); setEditMember(null);
        }}
      />
    </div>
  );
}

function MemberModal({ isOpen, member, onClose, onSave }: { isOpen: boolean; member: Member | null; onClose: () => void; onSave: (m: Member) => void }) {
  const [name, setName] = useState(member?.name || '');
  const [role, setRole] = useState(member?.role || '');
  const [color, setColor] = useState(member?.avatarColor || COLORS[0]);

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
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={member ? 'Sửa nhân sự' : 'Thêm nhân sự'}
      footer={<><Button onClick={onClose}>Hủy</Button><div style={{ flex: 1 }} /><Button variant="primary" onClick={handleSubmit}>Lưu</Button></>}
    >
      <div className="form-group">
        <label className="form-label">Họ tên</label>
        <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="VD: Nhân Nguyễn" autoFocus />
      </div>
      <div className="form-group">
        <label className="form-label">Vai trò</label>
        <input className="form-input" value={role} onChange={e => setRole(e.target.value)} placeholder="VD: Lead Tester, QA, Analyst" />
      </div>
      <div className="form-group" style={{ marginTop: 'var(--space-2)' }}>
        <label className="form-label">Màu avatar</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {COLORS.map(c => (
            <div
              key={c}
              onClick={() => setColor(c)}
              style={{
                width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer',
                border: color === c ? '2px solid white' : '2px solid transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: 700, color: 'white',
              }}
            >
              {name ? getInitials(name) : '?'}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
