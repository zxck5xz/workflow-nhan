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
  weight: number;
  deadline: string;
  createdAt: string;
  completedAt?: string;
  eisenhower: EisenhowerClassification;
  tags: string[];
  result?: string;
}

export interface GameScorecard {
  id: string;
  projectId: string;
  week: string;
  ratings: {
    coreLoop: number;
    monetization: number;
    visualUx: number;
    retention: number;
    usp: number;
  };
  summary: string;
  authorId: string;
  createdAt: string;
}

export interface WeeklyInsight {
  id: string;
  week: string;
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

export interface TaskFilters {
  projectId: string | null;
  assigneeId: string | null;
  status: TaskStatus | null;
  priority: Priority | null;
  dateRange: { start: string; end: string } | null;
  search: string;
}

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

export interface CalendarEvent {
  task: Task;
  date: string;
  isOverdue: boolean;
}

export interface ResearchReport {
  id: string;
  type: 'apk' | 'product' | 'codebase';
  title: string;
  packageName?: string;
  technicalData?: Record<string, unknown>;
  interpretation?: {
    summary: string;
    security_audit: string[];
    product_logic: string[];
  };
  markdownReport?: string;
  sentimentScore?: number;
  sentimentSummary?: string;
  redditMentions?: Array<Record<string, unknown>>;
  twitterMentions?: Array<Record<string, unknown>>;
  authorId?: string;
  createdAt: string;
}
