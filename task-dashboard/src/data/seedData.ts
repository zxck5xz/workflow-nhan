// ============================================================
// Seed Data — Demo data for 5 team members, 3 projects, 25 tasks
// ============================================================

import type { AppData } from '../types';

const today = new Date();
const d = (daysOffset: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

const past = (daysAgo: number) => d(-daysAgo);

export const seedData: AppData = {
  projects: [
    { id: 'proj-1', name: 'Puzzle Quest Mobile', platform: 'iOS', genre: 'Puzzle', status: 'active', color: '#ff6b35', createdAt: past(60) },
    { id: 'proj-2', name: 'Battle Arena PC', platform: 'PC', genre: 'MOBA', status: 'active', color: '#00c48c', createdAt: past(45) },
    { id: 'proj-3', name: 'Idle Farm Android', platform: 'Android', genre: 'Idle/Casual', status: 'active', color: '#3b82f6', createdAt: past(30) },
  ],
  members: [
    { id: 'mem-1', name: 'Nhân Nguyễn', role: 'Lead Tester', avatarColor: '#ff6b35', initials: 'NN', joinedAt: past(120) },
    { id: 'mem-2', name: 'Minh Trần', role: 'Game Analyst', avatarColor: '#00c48c', initials: 'MT', joinedAt: past(100) },
    { id: 'mem-3', name: 'Linh Phạm', role: 'QA Tester', avatarColor: '#3b82f6', initials: 'LP', joinedAt: past(90) },
    { id: 'mem-4', name: 'Hùng Lê', role: 'QA Tester', avatarColor: '#ffb830', initials: 'HL', joinedAt: past(80) },
    { id: 'mem-5', name: 'Thảo Đỗ', role: 'Report Writer', avatarColor: '#e74c8b', initials: 'TĐ', joinedAt: past(70) },
  ],
  tasks: [
    // ── Active tasks ──
    { id: 'task-1', title: 'Test Core Loop - Level 1-20', description: 'Kiểm tra gameplay loop từ level 1 đến 20', projectId: 'proj-1', assigneeId: 'mem-1', status: 'in-testing', priority: 'P0', weight: 5, deadline: d(2), createdAt: past(5), eisenhower: { urgent: true, important: true, autoClassified: true }, tags: ['gameplay', 'core'] },
    { id: 'task-2', title: 'Phân tích Monetization Model', description: 'Đánh giá mô hình kiếm tiền: IAP, Ads, Battle Pass', projectId: 'proj-1', assigneeId: 'mem-2', status: 'evaluating', priority: 'P0', weight: 4, deadline: d(3), createdAt: past(4), eisenhower: { urgent: true, important: true, autoClassified: true }, tags: ['monetization'] },
    { id: 'task-3', title: 'UI/UX Flow Recording', description: 'Ghi lại toàn bộ flow UI/UX của game', projectId: 'proj-1', assigneeId: 'mem-3', status: 'in-testing', priority: 'P1', weight: 3, deadline: d(5), createdAt: past(3), eisenhower: { urgent: false, important: true, autoClassified: true }, tags: ['ux', 'recording'] },
    { id: 'task-4', title: 'Test Performance Android', description: 'Benchmark FPS, loading time, memory trên các thiết bị Android', projectId: 'proj-3', assigneeId: 'mem-4', status: 'backlog', priority: 'P1', weight: 4, deadline: d(7), createdAt: past(2), eisenhower: { urgent: false, important: true, autoClassified: true }, tags: ['performance', 'android'] },
    { id: 'task-5', title: 'Viết báo cáo tuần 19', description: 'Tổng hợp kết quả testing tuần 19', projectId: 'proj-1', assigneeId: 'mem-5', status: 'reporting', priority: 'P1', weight: 3, deadline: d(1), createdAt: past(2), eisenhower: { urgent: true, important: false, autoClassified: true }, tags: ['report'] },
    { id: 'task-6', title: 'So sánh đối thủ: Candy Crush', description: 'Phân tích điểm mạnh/yếu so với Candy Crush Saga', projectId: 'proj-1', assigneeId: 'mem-2', status: 'backlog', priority: 'P0', weight: 5, deadline: d(4), createdAt: past(1), eisenhower: { urgent: false, important: true, autoClassified: true }, tags: ['competitor', 'analysis'] },
    { id: 'task-7', title: 'Test Matchmaking System', description: 'Kiểm tra hệ thống ghép trận', projectId: 'proj-2', assigneeId: 'mem-1', status: 'in-testing', priority: 'P0', weight: 5, deadline: d(3), createdAt: past(4), eisenhower: { urgent: true, important: true, autoClassified: true }, tags: ['multiplayer', 'core'] },
    { id: 'task-8', title: 'Balance Check - Heroes', description: 'Kiểm tra cân bằng sức mạnh các hero', projectId: 'proj-2', assigneeId: 'mem-3', status: 'evaluating', priority: 'P1', weight: 4, deadline: d(6), createdAt: past(5), eisenhower: { urgent: false, important: true, autoClassified: true }, tags: ['balance', 'gameplay'] },
    { id: 'task-9', title: 'Idle Mechanic Verification', description: 'Xác minh cơ chế idle earning đúng công thức', projectId: 'proj-3', assigneeId: 'mem-4', status: 'in-testing', priority: 'P1', weight: 3, deadline: d(4), createdAt: past(3), eisenhower: { urgent: false, important: true, autoClassified: true }, tags: ['idle', 'mechanic'] },
    { id: 'task-10', title: 'Research: Top Idle Games 2026', description: 'Nghiên cứu top 10 idle game trending', projectId: 'proj-3', assigneeId: 'mem-5', status: 'backlog', priority: 'P2', weight: 2, deadline: d(14), createdAt: past(1), eisenhower: { urgent: false, important: false, autoClassified: true }, tags: ['research'] },

    // ── More tasks for report data ──
    { id: 'task-11', title: 'Test Tutorial Flow', description: 'Kiểm tra tutorial onboarding', projectId: 'proj-1', assigneeId: 'mem-3', status: 'done', priority: 'P0', weight: 4, deadline: past(2), createdAt: past(10), completedAt: past(3), eisenhower: { urgent: false, important: true, autoClassified: true }, tags: ['tutorial', 'ux'] },
    { id: 'task-12', title: 'Crash Log Analysis', description: 'Phân tích crash logs từ beta test', projectId: 'proj-2', assigneeId: 'mem-1', status: 'done', priority: 'P0', weight: 5, deadline: past(1), createdAt: past(8), completedAt: past(2), eisenhower: { urgent: true, important: true, autoClassified: true }, tags: ['crash', 'bug'] },
    { id: 'task-13', title: 'Store Listing Review', description: 'Review mô tả App Store/Google Play', projectId: 'proj-3', assigneeId: 'mem-5', status: 'done', priority: 'P2', weight: 2, deadline: past(3), createdAt: past(12), completedAt: past(4), eisenhower: { urgent: false, important: false, autoClassified: true }, tags: ['store', 'review'] },
    { id: 'task-14', title: 'Retention D1/D7 Estimation', description: 'Ước lượng retention dựa trên game design', projectId: 'proj-1', assigneeId: 'mem-2', status: 'done', priority: 'P1', weight: 4, deadline: past(5), createdAt: past(15), completedAt: past(6), eisenhower: { urgent: false, important: true, autoClassified: true }, tags: ['retention', 'analysis'] },
    { id: 'task-15', title: 'Test Ad Integration', description: 'Kiểm tra rewarded ads, interstitial ads', projectId: 'proj-3', assigneeId: 'mem-4', status: 'done', priority: 'P1', weight: 3, deadline: past(4), createdAt: past(11), completedAt: past(3), eisenhower: { urgent: false, important: true, autoClassified: true }, tags: ['ads', 'monetization'] },

    // ── Overdue tasks ──
    { id: 'task-16', title: 'Viết báo cáo tháng 4', description: 'Tổng hợp report tháng 4', projectId: 'proj-2', assigneeId: 'mem-5', status: 'reporting', priority: 'P1', weight: 3, deadline: past(2), createdAt: past(10), eisenhower: { urgent: true, important: false, autoClassified: true }, tags: ['report', 'monthly'] },

    // ── Additional for workload balance ──
    { id: 'task-17', title: 'Test Social Features', description: 'Kiểm tra friend list, chat, guild', projectId: 'proj-2', assigneeId: 'mem-3', status: 'backlog', priority: 'P1', weight: 3, deadline: d(8), createdAt: past(1), eisenhower: { urgent: false, important: false, autoClassified: true }, tags: ['social'] },
    { id: 'task-18', title: 'Leaderboard Integrity Check', description: 'Kiểm tra tính toàn vẹn bảng xếp hạng', projectId: 'proj-2', assigneeId: 'mem-1', status: 'backlog', priority: 'P2', weight: 2, deadline: d(10), createdAt: past(1), eisenhower: { urgent: false, important: false, autoClassified: true }, tags: ['leaderboard'] },
    { id: 'task-19', title: 'Localization QA - Vietnamese', description: 'Kiểm tra bản dịch tiếng Việt', projectId: 'proj-1', assigneeId: 'mem-4', status: 'backlog', priority: 'P2', weight: 2, deadline: d(12), createdAt: past(1), eisenhower: { urgent: false, important: false, autoClassified: true }, tags: ['localization', 'qa'] },
    { id: 'task-20', title: 'Weekly Scorecard Update', description: 'Cập nhật Game Scorecard hàng tuần', projectId: 'proj-1', assigneeId: 'mem-2', status: 'backlog', priority: 'P1', weight: 3, deadline: d(2), createdAt: past(1), eisenhower: { urgent: true, important: true, autoClassified: true }, tags: ['scorecard'] },
  ],
  statuses: [
    { id: 'backlog', label: 'Backlog', color: '#5c6280', order: 0 },
    { id: 'in-testing', label: 'In Testing', color: '#3b82f6', order: 1 },
    { id: 'evaluating', label: 'Evaluating', color: '#ffb830', order: 2 },
    { id: 'reporting', label: 'Reporting', color: '#a855f7', order: 3 },
    { id: 'done', label: 'Done', color: '#00c48c', order: 4 },
  ],
  priorities: [
    { id: 'P0', label: 'P0 — Hot/Competitor', color: '#ff4757', defaultWeight: 5 },
    { id: 'P1', label: 'P1 — Project Request', color: '#ff6b35', defaultWeight: 3 },
    { id: 'P2', label: 'P2 — Research', color: '#5c6280', defaultWeight: 2 },
  ],
  scorecards: [
    {
      id: 'sc-1',
      projectId: 'proj-1',
      week: past(7),
      ratings: { coreLoop: 4, monetization: 3, visualUx: 5, retention: 4, usp: 4 },
      summary: 'Game có visual cực tốt, core loop gây nghiện nhưng monetization còn hơi nhẹ đô.',
      authorId: 'mem-2',
      createdAt: past(7)
    }
  ],
  insights: [
    {
      id: 'ins-1',
      week: past(7),
      title: 'Tổng kết tuần 19 - Thị trường Casual Puzzle',
      overallStatus: 'good',
      highlights: ['Visual UX của dự án Puzzle Quest được đánh giá rất cao', 'Tốc độ test của team tăng 15%'],
      risks: ['Cạnh tranh từ các game idle mới nổi', 'Deadline dự án Battle Arena đang đến gần'],
      actionItems: ['Tăng cường test monetization cho Puzzle Quest', 'Review lại cân bằng Hero trong Battle Arena'],
      authorId: 'mem-1',
      createdAt: past(7)
    }
  ],
  lastUpdated: new Date().toISOString(),
};
