import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ACTIVE_ALERTS,
  ALERT_META,
  countAlerts,
  getAlertLevel,
  getReminders,
  loadReadReminders,
  saveReadReminders,
  type AlertLevel,
} from '../../utils/deadline';
import { formatDate, getToday } from '../../utils';
import type { Project, Task } from '../../types';
import './DeadlineAlerts.css';

/** Badge cảnh báo deadline của một task (trống khi còn > 7 ngày). */
export function AlertBadge({ task }: { task: Task }) {
  const level = getAlertLevel(task);
  if (level === 'normal') return null;
  const meta = ALERT_META[level];
  return (
    <span className={`alert-badge alert-badge--${level}`} title={meta.rule}>
      {meta.icon} {meta.label}
    </span>
  );
}

interface AlertSummaryBarProps {
  tasks: Task[];
  active: AlertLevel | null;
  onSelect: (level: AlertLevel | null) => void;
}

/** Hàng chip đếm task theo mốc cảnh báo; bấm để lọc. */
export function AlertSummaryBar({ tasks, active, onSelect }: AlertSummaryBarProps) {
  const counts = useMemo(() => countAlerts(tasks), [tasks]);
  const total = ACTIVE_ALERTS.reduce((s, l) => s + counts[l], 0);

  return (
    <div className="alert-summary">
      <span className="alert-summary__label">
        ⏰ Cảnh báo deadline{total === 0 && ': không có task nào sắp tới hạn'}
      </span>
      {ACTIVE_ALERTS.map((level) => {
        const meta = ALERT_META[level];
        if (counts[level] === 0 && active !== level) return null;
        return (
          <button
            key={level}
            className={`alert-chip alert-chip--${level} ${active === level ? 'alert-chip--active' : ''}`}
            title={meta.rule}
            onClick={() => onSelect(active === level ? null : level)}
          >
            {meta.icon} {meta.label} <b>{counts[level]}</b>
          </button>
        );
      })}
      {active && (
        <button className="alert-chip alert-chip--clear" onClick={() => onSelect(null)}>
          ✕ Bỏ lọc
        </button>
      )}
    </div>
  );
}

interface ReminderBellProps {
  tasks: Task[];
  projects: Project[];
  onOpenTask: (task: Task) => void;
}

/**
 * Chuông nhắc nhở: mỗi task nhắc 1 lần ở mốc T-7, T-3, T-1, hôm nay;
 * quá hạn nhắc lại mỗi ngày. Trạng thái "đã đọc" lưu trên trình duyệt.
 */
export function ReminderBell({ tasks, projects, onOpenTask }: ReminderBellProps) {
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState(loadReadReminders);
  const ref = useRef<HTMLDivElement>(null);
  const today = getToday();

  const reminders = useMemo(() => getReminders(tasks, today), [tasks, today]);
  const unread = reminders.filter((r) => !read.has(r.key));

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const markRead = (keys: string[]) => {
    // Keep only keys still relevant so storage doesn't grow forever
    const current = new Set(reminders.map((r) => r.key));
    const next = new Set([...read, ...keys].filter((k) => current.has(k)));
    setRead(next);
    saveReadReminders(next);
  };

  const projectName = (id: string) => projects.find((p) => p.id === id)?.name ?? '';

  return (
    <div className="reminder-bell" ref={ref}>
      <button
        className={`reminder-bell__btn ${unread.length ? 'reminder-bell__btn--active' : ''}`}
        onClick={() => setOpen((o) => !o)}
        title="Nhắc nhở deadline (T-7, T-3, T-1)"
      >
        🔔
        {unread.length > 0 && <span className="reminder-bell__count">{unread.length}</span>}
      </button>

      {open && (
        <div className="reminder-panel">
          <div className="reminder-panel__header">
            <span>Nhắc nhở deadline</span>
            {unread.length > 0 && (
              <button onClick={() => markRead(unread.map((r) => r.key))}>
                Đánh dấu đã đọc tất cả
              </button>
            )}
          </div>
          <div className="reminder-panel__body">
            {reminders.length === 0 && (
              <div className="reminder-panel__empty">Không có task nào sắp tới hạn 🎉</div>
            )}
            {ACTIVE_ALERTS.map((level) => {
              const group = reminders.filter((r) => r.level === level);
              if (!group.length) return null;
              const meta = ALERT_META[level];
              return (
                <div key={level} className="reminder-group">
                  <div className="reminder-group__title" style={{ color: meta.color }}>
                    {meta.icon} {meta.label} · {group.length}
                  </div>
                  {group.map((r) => {
                    const isUnread = !read.has(r.key);
                    return (
                      <div
                        key={r.key}
                        className={`reminder-item ${isUnread ? 'reminder-item--unread' : ''}`}
                      >
                        <div
                          className="reminder-item__main"
                          onClick={() => {
                            markRead([r.key]);
                            setOpen(false);
                            onOpenTask(r.task);
                          }}
                        >
                          <div className="reminder-item__title">
                            {r.task.timeline?.code && (
                              <span className="reminder-item__code">{r.task.timeline.code}</span>
                            )}
                            {r.task.title}
                          </div>
                          <div className="reminder-item__meta">
                            {projectName(r.task.projectId)}
                            {r.task.timeline?.team && ` · ${r.task.timeline.team}`} · Deadline{' '}
                            {formatDate(r.task.deadline)}
                            {r.daysLeft < 0 && ` (trễ ${-r.daysLeft} ngày)`}
                          </div>
                        </div>
                        {isUnread && (
                          <button
                            className="reminder-item__read"
                            title="Đánh dấu đã đọc"
                            onClick={() => markRead([r.key])}
                          >
                            ✓
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
