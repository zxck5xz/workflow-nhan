// ============================================================
// Utility Functions
// ============================================================

import type { Task, Priority, EisenhowerClassification } from '../types';

// ── Eisenhower Auto-Classification ──
export function classifyEisenhower(priority: Priority, deadline: string): EisenhowerClassification {
  const daysUntilDeadline = getDaysUntilDeadline(deadline);

  let urgent = false;
  let important = false;

  switch (priority) {
    case 'P0':
      important = true;
      urgent = daysUntilDeadline <= 3;
      break;
    case 'P1':
      urgent = daysUntilDeadline <= 3;
      important = daysUntilDeadline <= 7;
      break;
    case 'P2':
      urgent = daysUntilDeadline <= 1;
      important = false;
      break;
  }

  return { urgent, important, autoClassified: true };
}

// ── Date Helpers ──
export function getDaysUntilDeadline(deadline: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dl = new Date(deadline);
  dl.setHours(0, 0, 0, 0);
  return Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function isOverdue(task: Task): boolean {
  if (task.status === 'done') return false;
  return getDaysUntilDeadline(task.deadline) < 0;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

export function formatRelativeDate(dateStr: string): string {
  const days = getDaysUntilDeadline(dateStr);
  if (days < 0) return `Trễ ${Math.abs(days)} ngày`;
  if (days === 0) return 'Hôm nay';
  if (days === 1) return 'Ngày mai';
  if (days <= 7) return `Còn ${days} ngày`;
  return formatDate(dateStr);
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getEndOfWeek(date: Date): Date {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getMonthCalendarDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday-start
  const days: Date[] = [];

  // Previous month padding
  for (let i = startDay - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push(d);
  }

  // Current month
  const daysInMonth = getDaysInMonth(year, month);
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  // Next month padding (fill to 42 = 6 rows)
  while (days.length < 42) {
    const lastDay = days[days.length - 1];
    const next = new Date(lastDay);
    next.setDate(next.getDate() + 1);
    days.push(next);
  }

  return days;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

// ── String Helpers ──
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ── Statistics ──
export function calculateOnTimeRate(tasks: Task[]): number {
  const completed = tasks.filter(t => t.status === 'done' && t.completedAt);
  if (completed.length === 0) return 0;
  const onTime = completed.filter(t => {
    const deadline = new Date(t.deadline);
    const completedAt = new Date(t.completedAt!);
    return completedAt <= deadline;
  });
  return Math.round((onTime.length / completed.length) * 100);
}

export function calculateAvgCompletionDays(tasks: Task[]): number {
  const completed = tasks.filter(t => t.status === 'done' && t.completedAt);
  if (completed.length === 0) return 0;
  const totalDays = completed.reduce((sum, t) => {
    const created = new Date(t.createdAt);
    const done = new Date(t.completedAt!);
    return sum + Math.ceil((done.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  }, 0);
  return Math.round(totalDays / completed.length);
}
