import { useMemo } from 'react';
import { Button, Badge, Avatar, Modal } from './index';
import type { Task } from '../../types';

interface TaskDetailsModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  members: Array<{ id: string; initials: string; avatarColor: string; name: string }>;
  projects: Array<{ id: string; name: string; color: string; platform: string; genre: string }>;
  statuses: Array<{ id: string; label: string; color: string }>;
}

export function TaskDetailsModal({
  isOpen,
  task,
  onClose,
  members,
  projects,
  statuses,
}: TaskDetailsModalProps) {
  const member = useMemo(
    () => (task ? members.find(m => m.id === task.assigneeId) : undefined),
    [task, members]
  );

  const project = useMemo(
    () => (task ? projects.find(p => p.id === task.projectId) : undefined),
    [task, projects]
  );

  const status = useMemo(
    () => (task ? statuses.find(s => s.id === task.status) : undefined),
    [task, statuses]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Chi tiết công việc' : 'Chi tiết công việc'}
      footer={
        <>
          <div style={{ flex: 1 }} />
          <Button onClick={onClose}>Đóng</Button>
        </>
      }
    >
      {!task ? null : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>{task.title}</div>
                {task.tags?.length ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                    {task.tags.map(tag => (
                      <span key={tag} style={{ fontSize: 'var(--text-xs)', padding: '2px var(--space-2)', borderRadius: 'var(--radius-xs)', background: 'var(--color-bg-hover)', color: 'var(--color-text-muted)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', alignItems: 'flex-end' }}>
                <Badge variant={task.priority.toLowerCase()}>{task.priority}</Badge>
                {project ? (
                  <Badge style={{ background: `${project.color}20`, color: project.color }}>{project.platform}</Badge>
                ) : null}
              </div>
            </div>

            {task.description ? (
              <p style={{ marginTop: 'var(--space-3)' }}>{task.description}</p>
            ) : null}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <div className="detail-item-label">Người phụ trách</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                {member ? <Avatar initials={member.initials} color={member.avatarColor} size="sm" title={member.name} /> : null}
                <div style={{ color: 'var(--color-text-secondary)' }}>{member?.name || '—'}</div>
              </div>
            </div>

            <div>
              <div className="detail-item-label">Trạng thái</div>
              <div style={{ marginTop: 'var(--space-2)' }}>
                {status ? <Badge style={{ background: `${status.color}20`, color: status.color }}>{status.label}</Badge> : <Badge>—</Badge>}
              </div>
            </div>

            <div>
              <div className="detail-item-label">Dự án</div>
              <div style={{ marginTop: 'var(--space-2)', color: 'var(--color-text-secondary)' }}>{project?.name || '—'}</div>
            </div>

            <div>
              <div className="detail-item-label">Trọng số</div>
              <div style={{ marginTop: 'var(--space-2)', color: 'var(--color-text-secondary)' }}>{task.weight ?? '—'}</div>
            </div>

            <div>
              <div className="detail-item-label">Deadline</div>
              <div style={{ marginTop: 'var(--space-2)', color: 'var(--color-text-secondary)' }}>{task.deadline || '—'}</div>
            </div>

            <div>
              <div className="detail-item-label">Eisenhower</div>
              <div style={{ marginTop: 'var(--space-2)', display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <Badge variant="" style={{ background: task.eisenhower?.urgent ? 'var(--color-danger-muted)' : 'var(--color-bg-hover)', color: task.eisenhower?.urgent ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
                  ⚡ Urgent
                </Badge>
                <Badge variant="" style={{ background: task.eisenhower?.important ? 'var(--color-info-muted)' : 'var(--color-bg-hover)', color: task.eisenhower?.important ? 'var(--color-info)' : 'var(--color-text-muted)' }}>
                  ⭐ Important
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <div className="detail-item-label">Thông tin</div>
            <div style={{ marginTop: 'var(--space-2)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              <div><strong>Created:</strong> {task.createdAt || '—'}</div>
              <div><strong>Completed:</strong> {task.completedAt || '—'}</div>
              <div><strong>Auto classified:</strong> {task.eisenhower?.autoClassified ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>
      )}

      {/* local styles for labels (keeps modal look consistent without editing global CSS) */}
      <style>{`
        .detail-item-label { font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-muted); margin-bottom: var(--space-2); }
      `}</style>
    </Modal>
  );
}

