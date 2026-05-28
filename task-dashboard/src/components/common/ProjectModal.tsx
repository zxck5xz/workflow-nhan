import { useState, useEffect } from 'react';
import { Button, Modal } from './index';
import { v4 as uuid } from 'uuid';
import type { Project, Platform } from '../../types';

const PLATFORMS: Platform[] = ['iOS', 'Android', 'PC', 'Console', 'Web', 'Cross-platform'];
const COLORS = ['#ff6b35', '#00c48c', '#3b82f6', '#ffb830', '#e74c8b', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16', '#f97316'];

interface ProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: (p: Project) => void;
}

export function ProjectModal({ isOpen, project, onClose, onSave }: ProjectModalProps) {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<Platform>('iOS');
  const [genre, setGenre] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    if (isOpen) {
      setName(project?.name || '');
      setPlatform(project?.platform || 'iOS');
      setGenre(project?.genre || '');
      setColor(project?.color || COLORS[0]);
    }
  }, [isOpen, project]);

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
