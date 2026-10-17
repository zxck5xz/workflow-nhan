import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button, Modal } from './index';
import { v4 as uuid } from 'uuid';
import { classifyEisenhower, getDaysUntilDeadline, getToday } from '../../utils';
import { findDepartment } from '../../utils/teamColor';
import type { Member, Task, TaskStatus, Priority } from '../../types';

interface TaskFormModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (t: Task) => void;
  onDelete?: () => void;
  defaultProjectId?: string;
  defaultDeadline?: string;
}

interface TaskFormFieldsHandle {
  submit: () => void;
}

interface TaskFormFieldsProps {
  task: Task | null;
  defaultProjectId?: string;
  defaultDeadline?: string;
  onSave: (t: Task) => void;
}

const TaskFormFields = forwardRef<TaskFormFieldsHandle, TaskFormFieldsProps>(
  ({ task, defaultProjectId, defaultDeadline, onSave }, ref) => {
    const { state } = useApp();
    const { projects, members, departments } = state.data;

    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [projectId, setProjectId] = useState(
      task?.projectId || defaultProjectId || projects[0]?.id || '',
    );
    const [assigneeId, setAssigneeId] = useState(task ? task.assigneeId : members[0]?.id || '');
    const [priority, setPriority] = useState<Priority>(task?.priority || 'P1');
    const [weight, setWeight] = useState(task?.weight || 3);
    const [deadline, setDeadline] = useState(task?.deadline || defaultDeadline || getToday());
    const [status, setStatus] = useState<TaskStatus>(task?.status || 'backlog');
    const [tags, setTags] = useState(task?.tags.join(', ') || '');
    const [result, setResult] = useState(task?.result || '');
    const [manualEisenhower, setManualEisenhower] = useState(!task?.eisenhower?.autoClassified);
    const [urgent, setUrgent] = useState(task?.eisenhower?.urgent || false);
    const [important, setImportant] = useState(task?.eisenhower?.important || false);
    // Timeline fields, only for tasks imported from a timeline file
    const timeline = task?.timeline;
    const [team, setTeam] = useState(timeline?.team || '');
    const [startDate, setStartDate] = useState(timeline?.startDate || '');
    const [completionDate, setCompletionDate] = useState(timeline?.completionDate || '');
    const [progress, setProgress] = useState(timeline?.progress ?? 0);

    const autoEisenhower = classifyEisenhower(priority, deadline);

    // Nhân sự of the task's bộ phận come first; everyone else stays selectable
    const department = timeline ? findDepartment(departments, team) : undefined;
    const deptMembers = department ? members.filter((m) => m.departmentId === department.id) : [];
    const otherMembers = members.filter((m) => !deptMembers.includes(m));
    const memberOption = (m: Member) => (
      <option key={m.id} value={m.id}>
        {m.name}
      </option>
    );

    const handleSubmit = () => {
      if (!title.trim()) return;
      const eisenhower = manualEisenhower
        ? { urgent, important, autoClassified: false }
        : autoEisenhower;

      // Keep progress and status consistent: 100% ⇔ done
      let finalStatus = status;
      let finalProgress = progress;
      if (timeline) {
        if (progress >= 100) finalStatus = 'done';
        else if (status === 'done' && task?.status !== 'done') finalProgress = 100;
        else if (status === 'done') finalStatus = progress > 0 ? 'in-testing' : 'backlog';
      }
      const start = startDate || timeline?.startDate || deadline;
      const completion = completionDate || deadline;

      onSave({
        ...task,
        id: task?.id || `task-${uuid().slice(0, 8)}`,
        title: title.trim(),
        description: description.trim(),
        projectId,
        assigneeId,
        status: finalStatus,
        priority,
        weight,
        deadline,
        createdAt: task?.createdAt || new Date().toISOString(),
        completedAt:
          finalStatus === 'done' ? task?.completedAt || new Date().toISOString() : undefined,
        timeline: timeline && {
          ...timeline,
          team: team.trim() || timeline.team,
          startDate: start,
          completionDate: completion,
          // Keep the duration from Excel unless the dates were edited
          duration:
            start === timeline.startDate && completion === timeline.completionDate
              ? timeline.duration
              : Math.round(
                  (new Date(completion).getTime() - new Date(start).getTime()) / 86_400_000,
                ) + 1,
          progress: finalProgress,
        },
        eisenhower,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        result: result.trim() || undefined,
      });
    };

    useImperativeHandle(ref, () => ({ submit: handleSubmit }));

    return (
      <>
        <div className="form-group">
          <label className="form-label">Tên công việc *</label>
          <input
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VD: Test Core Loop - Level 1-20"
            autoFocus
          />
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả</label>
          <textarea
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Chi tiết công việc..."
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Dự án</label>
            <select
              className="form-select"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{timeline ? 'Nhân sự' : 'Người phụ trách'}</label>
            <select
              className="form-select"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
            >
              {timeline && <option value="">— Chưa phân công —</option>}
              {deptMembers.length > 0 && (
                <optgroup label={`Nhân sự ${department?.name}`}>
                  {deptMembers.map(memberOption)}
                </optgroup>
              )}
              {deptMembers.length > 0 ? (
                <optgroup label="Bộ phận khác">{otherMembers.map(memberOption)}</optgroup>
              ) : (
                members.map(memberOption)
              )}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Mức ưu tiên</label>
            <select
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value="P0">P0 — Hot/Competitor</option>
              <option value="P1">P1 — Project Request</option>
              <option value="P2">P2 — Research</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Trọng số (1-5)</label>
            <select
              className="form-select"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((w) => (
                <option key={w} value={w}>
                  {w} {w === 1 ? '(Thấp)' : w === 5 ? '(Cao)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
        {timeline && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Team phụ trách</label>
                <input
                  className="form-input"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tiến độ: {progress}%</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Bắt đầu</label>
                <input
                  className="form-input"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hoàn thành dự kiến</label>
                <input
                  className="form-input"
                  type="date"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                />
              </div>
            </div>
          </>
        )}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{timeline ? 'Kết thúc / Deadline' : 'Deadline'}</label>
            <input
              className="form-input"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              {state.data.statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Tags (phân cách bằng dấu phẩy)</label>
          <input
            className="form-input"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="VD: gameplay, core, bug"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Kết quả công việc</label>
          <textarea
            className="form-textarea"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            placeholder="VD: https://drive.google.com/... hoặc mô tả kết quả"
            rows={3}
          />
        </div>

        {/* Eisenhower */}
        <div
          className="form-group"
          style={{
            background: 'var(--color-bg-primary)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <label className="form-label" style={{ margin: 0 }}>
              Eisenhower Matrix
            </label>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={manualEisenhower}
                onChange={(e) => setManualEisenhower(e.target.checked)}
              />
              Chỉnh sửa thủ công
            </label>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: 'var(--text-sm)' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: manualEisenhower ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              }}
            >
              <input
                type="checkbox"
                checked={manualEisenhower ? urgent : autoEisenhower.urgent}
                onChange={(e) => setUrgent(e.target.checked)}
                disabled={!manualEisenhower}
              />
              ⚡ Urgent
            </label>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: manualEisenhower ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              }}
            >
              <input
                type="checkbox"
                checked={manualEisenhower ? important : autoEisenhower.important}
                onChange={(e) => setImportant(e.target.checked)}
                disabled={!manualEisenhower}
              />
              ⭐ Important
            </label>
          </div>
          {!manualEisenhower && (
            <div
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-muted)',
                marginTop: '6px',
              }}
            >
              Tự động: {priority} +{' '}
              {getDaysUntilDeadline(deadline) < 0
                ? 'Quá hạn'
                : `còn ${getDaysUntilDeadline(deadline)} ngày`}
            </div>
          )}
        </div>
      </>
    );
  },
);

TaskFormFields.displayName = 'TaskFormFields';

export function TaskFormModal({
  isOpen,
  task,
  onClose,
  onSave,
  onDelete,
  defaultProjectId,
  defaultDeadline,
}: TaskFormModalProps) {
  const formRef = useRef<TaskFormFieldsHandle>(null);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Sửa công việc' : 'Thêm công việc mới'}
      footer={
        <>
          {onDelete && (
            <Button variant="danger" onClick={onDelete}>
              Xóa
            </Button>
          )}
          <div style={{ flex: 1 }} />
          <Button onClick={onClose}>Hủy</Button>
          <Button variant="primary" onClick={() => formRef.current?.submit()}>
            Lưu
          </Button>
        </>
      }
    >
      <TaskFormFields
        ref={formRef}
        key={isOpen ? task?.id || 'new' : 'closed'}
        task={task}
        defaultProjectId={defaultProjectId}
        defaultDeadline={defaultDeadline}
        onSave={onSave}
      />
    </Modal>
  );
}
