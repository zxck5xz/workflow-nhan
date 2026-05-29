import type { AppData } from '../types';

// Bộ dữ liệu giả dùng để test local.
// File này đã được thêm vào .gitignore và sẽ không bị commit.
export const localTestData: AppData = {
  projects: [
    // { id: 'proj-test', name: 'Dự án Test', platform: 'PC', genre: 'Test', status: 'active', color: '#ff6b35', createdAt: '2026-05-28' },
  ],
  members: [
    // { id: 'mem-test', name: 'Tester', email: 'test@example.com', role: 'Tester', avatarColor: '#00c48c', initials: 'T', joinedAt: '2026-05-28' },
  ],
  tasks: [
    // { id: 'task-test', title: 'Task Test', description: 'Mô tả test', projectId: 'proj-test', assigneeId: 'mem-test', status: 'backlog', priority: 'P1', weight: 3, deadline: '2026-05-30', createdAt: '2026-05-28', eisenhower: { urgent: false, important: false, autoClassified: false }, tags: [] },
  ],
  statuses: [],
  priorities: [],
  scorecards: [],
  insights: [],
  lastUpdated: new Date().toISOString(),
};
