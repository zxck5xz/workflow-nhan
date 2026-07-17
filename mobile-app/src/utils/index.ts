import type { Task, Priority } from '../types';

export function isOverdue(task: Task): boolean {
  if (task.status === 'done') return false;
  return new Date(task.deadline) < new Date();
}

export function formatRelativeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 7) return `${diffDays}d left`;
  return `${Math.floor(diffDays / 7)}w ${diffDays % 7}d left`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

export function getPriorityColor(p: Priority): string {
  switch (p) {
    case 'P0':
      return '#ff4757';
    case 'P1':
      return '#ff6b35';
    case 'P2':
      return '#5c6280';
  }
}

export function getPriorityBg(p: Priority): string {
  switch (p) {
    case 'P0':
      return 'rgba(255,71,87,0.12)';
    case 'P1':
      return 'rgba(255,107,53,0.12)';
    case 'P2':
      return 'rgba(92,98,128,0.12)';
  }
}

export function getStatusColor(statusId: string): string {
  const map: Record<string, string> = {
    backlog: '#5c6280',
    'in-testing': '#3b82f6',
    evaluating: '#ffb830',
    reporting: '#a855f7',
    done: '#00c48c',
  };
  return map[statusId] || '#5c6280';
}

export function getStatusLabel(statusId: string): string {
  const map: Record<string, string> = {
    backlog: 'Backlog',
    'in-testing': 'In Testing',
    evaluating: 'Evaluating',
    reporting: 'Reporting',
    done: 'Done',
  };
  return map[statusId] || statusId;
}
