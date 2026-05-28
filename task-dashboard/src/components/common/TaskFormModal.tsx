import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button, Modal } from './index';
import { v4 as uuid } from 'uuid';
import { classifyEisenhower, getDaysUntilDeadline, getToday } from '../../utils';
import type { Task, TaskStatus, Priority } from '../../types';

interface TaskFormModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (t: Task) => void;
  onDelete?: () => void;
  defaultProjectId?: string;
  defaultDeadline?: string;
}

export function TaskFormModal({ isOpen, task, onClose, onSave, onDelete, defaultProjectId, defaultDeadline }: TaskFormModalProps) {
  const { state } = useApp();
  const { projects, members } = state.data;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<Priority>('P1');
  const [weight, setWeight] = useState(3);
  const [deadline, setDeadline] = useState(getToday());
  const [status, setStatus] = useState<TaskStatus>('backlog');
  const [tags, setTags] = useState('');
  const [manualEisenhower, setManualEisenhower] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [important, setImportant] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(task?.title || '');
      setDescription(task?.description || '');
      setProjectId(task?.projectId || defaultProjectId || projects[0]?.id || '');
      setAssigneeId(task?.assigneeId || members[0]?.id || '');
      setPriority(task?.priority || 'P1');
      setWeight(task?.weight || 3);
      setDeadline(task?.deadline || defaultDeadline || getToday());
      setStatus(task?.status || 'backlog');
      setTags(task?.tags.join(', ') || '');
      setManualEisenhower(!task?.eisenhower?.autoClassified);
      setUrgent(task?.eisenhower?.urgent || false);
      setImportant(task?.eisenhower?.important || false);
    }
  }, [isOpen, task, defaultProjectId, defaultDeadline, projects, members]);

  // Auto-classify when priority or deadline changes
  const autoEisenhower = classifyEisenhower(priority, deadline);

  const handleSubmit = () => {
    if (!title.trim()) return;
    const eisenhower = manualEisenhower
      ? { urgent, important, autoClassified: false }
      : autoEisenhower;

    onSave({
      id: task?.id || `task-${uuid().slice(0, 8)}`,
      title: title.trim(),
      description: description.trim(),
      projectId,
      assigneeId,
      status,
      priority,
      weight,
      deadline,
      createdAt: task?.createdAt || new Date().toISOString(),
      completedAt: status === 'done' ? (task?.completedAt || new Date().toISOString()) : undefined,
      eisenhower,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Sửa công việc' : 'Thêm công việc mới'}
      footer={
        <>
          {onDelete && <Button variant="danger" onClick={onDelete}>Xóa</Button>}
          <div style={{ flex: 1 }} />
          <Button onClick={onClose}>Hủy</Button>
          <Button variant="primary" onClick={handleSubmit}>Lưu</Button>
        </>
      }
    >
      <div className="form-group">
        <label className="form-label">Tên công việc *</label>
        <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="VD: Test Core Loop - Level 1-20" autoFocus />
      </div>
      <div className="form-group">
        <label className="form-label">Mô tả</label>
        <textarea className="form-textarea" value={description} onChange={e => setDescription(e.target.value)} placeholder="Chi tiết công việc..." />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Dự án</label>
          <select className="form-select" value={projectId} onChange={e => setProjectId(e.target.value)}>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Người phụ trách</label>
          <select className="form-select" value={assigneeId} onChange={e => setAssigneeId(e.target.value)}>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Mức ưu tiên</label>
          <select className="form-select" value={priority} onChange={e => setPriority(e.target.value as Priority)}>
            <option value="P0">P0 — Hot/Competitor</option>
            <option value="P1">P1 — Project Request</option>
            <option value="P2">P2 — Research</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Trọng số (1-5)</label>
          <select className="form-select" value={weight} onChange={e => setWeight(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map(w => <option key={w} value={w}>{w} {w === 1 ? '(Thấp)' : w === 5 ? '(Cao)' : ''}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Deadline</label>
          <input className="form-input" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Trạng thái</label>
          <select className="form-select" value={status} onChange={e => setStatus(e.target.value as TaskStatus)}>
            {state.data.statuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Tags (phân cách bằng dấu phẩy)</label>
        <input className="form-input" value={tags} onChange={e => setTags(e.target.value)} placeholder="VD: gameplay, core, bug" />
      </div>

      {/* Eisenhower */}
      <div className="form-group" style={{ background: 'var(--color-bg-primary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label className="form-label" style={{ margin: 0 }}>Eisenhower Matrix</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <input type="checkbox" checked={manualEisenhower} onChange={e => setManualEisenhower(e.target.checked)} />
            Chỉnh sửa thủ công
          </label>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: 'var(--text-sm)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: manualEisenhower ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
            <input
              type="checkbox"
              checked={manualEisenhower ? urgent : autoEisenhower.urgent}
              onChange={e => setUrgent(e.target.checked)}
              disabled={!manualEisenhower}
            />
            ⚡ Urgent
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: manualEisenhower ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
            <input
              type="checkbox"
              checked={manualEisenhower ? important : autoEisenhower.important}
              onChange={e => setImportant(e.target.checked)}
              disabled={!manualEisenhower}
            />
            ⭐ Important
          </label>
        </div>
        {!manualEisenhower && (
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '6px' }}>
            Tự động: {priority} + {getDaysUntilDeadline(deadline) < 0 ? 'Quá hạn' : `còn ${getDaysUntilDeadline(deadline)} ngày`}
          </div>
        )}
      </div>
    </Modal>
  );
}
