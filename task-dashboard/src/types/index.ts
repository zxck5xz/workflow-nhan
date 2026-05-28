// ============================================================
// Task Management Dashboard — Core Type Definitions
// ============================================================

export type Platform = 'iOS' | 'Android' | 'PC' | 'Console' | 'Web' | 'Cross-platform';

export type TaskStatus = 'backlog' | 'in-testing' | 'evaluating' | 'reporting' | 'done';

export type Priority = 'P0' | 'P1' | 'P2';

export interface Project {
  id: string;
  name: string;
  platform: Platform;
  genre: string;
  status: 'active' | 'archived';
  color: string;
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarColor: string;
  initials: string;
  joinedAt: string;
}

export interface EisenhowerClassification {
  urgent: boolean;
  important: boolean;
  autoClassified: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assigneeId: string;
  status: TaskStatus;
  priority: Priority;
  weight: number; // 1-5
  deadline: string; // ISO date
  createdAt: string;
  completedAt?: string;
  eisenhower: EisenhowerClassification;
  tags: string[];
}

export interface GameScorecard {
  id: string;
  projectId: string;
  week: string; // ISO date of the Monday of the week
  ratings: {
    coreLoop: number;      // 1-5
    monetization: number;  // 1-5
    visualUx: number;      // 1-5
    retention: number;     // 1-5
    usp: number;           // 1-5
  };
  summary: string;
  authorId: string;
  createdAt: string;
}

export interface WeeklyInsight {
  id: string;
  week: string; // ISO date of the Monday
  title: string;
  overallStatus: 'excellent' | 'good' | 'stable' | 'at-risk' | 'critical';
  highlights: string[];
  risks: string[];
  actionItems: string[];
  authorId: string;
  createdAt: string;
}

export interface StatusConfig {
  id: TaskStatus;
  label: string;
  color: string;
  order: number;
}

export interface PriorityConfig {
  id: Priority;
  label: string;
  color: string;
  defaultWeight: number;
}

export interface AppData {
  projects: Project[];
  members: Member[];
  tasks: Task[];
  statuses: StatusConfig[];
  priorities: PriorityConfig[];
  scorecards: GameScorecard[];
  insights: WeeklyInsight[];
  lastUpdated: string;
}

// Filter types
export interface TaskFilters {
  projectId: string | null;
  assigneeId: string | null;
  status: TaskStatus | null;
  priority: Priority | null;
  dateRange: { start: string; end: string } | null;
  search: string;
}

// Report types
export interface MemberPerformance {
  memberId: string;
  totalTasks: number;
  completedTasks: number;
  onTimeRate: number;
  avgWeight: number;
  avgCompletionDays: number;
  tasksByPriority: Record<Priority, number>;
  tasksByStatus: Record<TaskStatus, number>;
}

// Calendar event type
export interface CalendarEvent {
  task: Task;
  date: string;
  isOverdue: boolean;
}

// Navigation
export type PageId = 'setup' | 'project-control' | 'calendar' | 'reports' | 'staff-reports' | 'insights' | 'user-management';

export interface NavItem {
  id: PageId;
  label: string;
  icon: string;
}
