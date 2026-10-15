// ============================================================
// Deadline alerts — mức cảnh báo + nhắc nhở theo mốc T-7 / T-3 / T-1
// ============================================================

import type { Task } from '../types';
import { getDaysUntilDeadline } from './index';

export type AlertLevel = 'completed' | 'normal' | 't7' | 't3' | 't1' | 'today' | 'overdue';

export interface AlertMeta {
  label: string;
  icon: string;
  color: string;
  rule: string;
  /** Thứ tự nghiêm trọng, cao hơn = gấp hơn. */
  rank: number;
}

export const ALERT_META: Record<AlertLevel, AlertMeta> = {
  completed: {
    label: 'Hoàn thành',
    icon: '✅',
    color: 'var(--color-success)',
    rule: 'Task đã xong (Done hoặc tiến độ 100%) — không cảnh báo.',
    rank: 0,
  },
  normal: {
    label: 'Bình thường',
    icon: '',
    color: 'var(--color-text-muted)',
    rule: 'Còn hơn 7 ngày tới deadline.',
    rank: 1,
  },
  t7: {
    label: 'Còn ≤ 7 ngày',
    icon: '🟡',
    color: 'var(--color-warning)',
    rule: 'Mốc T-7: còn 4–7 ngày tới deadline, cần theo dõi.',
    rank: 2,
  },
  t3: {
    label: 'Còn ≤ 3 ngày',
    icon: '🟠',
    color: 'var(--color-accent)',
    rule: 'Mốc T-3: còn 2–3 ngày tới deadline, cần ưu tiên xử lý.',
    rank: 3,
  },
  t1: {
    label: 'Ngày mai',
    icon: '🟠',
    color: 'var(--color-accent)',
    rule: 'Mốc T-1: deadline là ngày mai.',
    rank: 4,
  },
  today: {
    label: 'Hôm nay',
    icon: '🔴',
    color: 'var(--color-danger)',
    rule: 'Deadline trong hôm nay.',
    rank: 5,
  },
  overdue: {
    label: 'Quá hạn',
    icon: '🔴',
    color: 'var(--color-danger)',
    rule: 'Đã qua deadline mà chưa hoàn thành.',
    rank: 6,
  },
};

/** Các mức cần hành động, xếp từ gấp nhất. */
export const ACTIVE_ALERTS: AlertLevel[] = ['overdue', 'today', 't1', 't3', 't7'];

export function isTaskCompleted(task: Task): boolean {
  return task.status === 'done' || (task.timeline?.progress ?? 0) >= 100;
}

export function alertLevelForDays(daysLeft: number): AlertLevel {
  if (daysLeft < 0) return 'overdue';
  if (daysLeft === 0) return 'today';
  if (daysLeft === 1) return 't1';
  if (daysLeft <= 3) return 't3';
  if (daysLeft <= 7) return 't7';
  return 'normal';
}

export function getAlertLevel(task: Task): AlertLevel {
  if (isTaskCompleted(task)) return 'completed';
  if (!task.deadline) return 'normal';
  return alertLevelForDays(getDaysUntilDeadline(task.deadline));
}

export function countAlerts(tasks: Task[]): Record<AlertLevel, number> {
  const counts: Record<AlertLevel, number> = {
    completed: 0,
    normal: 0,
    t7: 0,
    t3: 0,
    t1: 0,
    today: 0,
    overdue: 0,
  };
  for (const t of tasks) counts[getAlertLevel(t)]++;
  return counts;
}

// ── Reminders ──
// Mỗi mốc T-7 / T-3 / T-1 / hôm nay nhắc đúng một lần cho mỗi task; quá hạn
// nhắc lại mỗi ngày tới khi task xong. Task import khi đã qua mốc T-7 chỉ nhận
// lời nhắc của mốc hiện tại, không bắn dồn các mốc cũ.

export interface Reminder {
  key: string;
  task: Task;
  level: AlertLevel;
  daysLeft: number;
}

export function reminderKey(task: Task, level: AlertLevel, today: string): string {
  return level === 'overdue' ? `${task.id}:overdue:${today}` : `${task.id}:${level}`;
}

export function getReminders(tasks: Task[], today: string): Reminder[] {
  const out: Reminder[] = [];
  for (const task of tasks) {
    const level = getAlertLevel(task);
    if (!ACTIVE_ALERTS.includes(level)) continue;
    out.push({
      key: reminderKey(task, level, today),
      task,
      level,
      daysLeft: getDaysUntilDeadline(task.deadline),
    });
  }
  return out.sort(
    (a, b) => ALERT_META[b.level].rank - ALERT_META[a.level].rank || a.daysLeft - b.daysLeft,
  );
}

const READ_KEY = 'task-dashboard-read-reminders';

export function loadReadReminders(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function saveReadReminders(keys: Set<string>): void {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify([...keys]));
  } catch {
    // storage unavailable — reminders just show again next visit
  }
}
