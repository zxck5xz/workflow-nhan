// TypeScript shapes matching the exact API contract consumed by the dashboard.

export type TaskStatus = 'backlog' | 'in-testing' | 'evaluating' | 'reporting' | 'done';
export type Priority = 'P0' | 'P1' | 'P2';

export interface Project {
  id: string;
  name: string;
  platform: string;
  genre: string;
  status: string;
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

// A Member row as read from DB (includes the password hash).
export interface MemberRow extends Member {
  password: string;
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
  deadline: string | null;
  createdAt: string;
  completedAt: string | null;
  eisenhower: { urgent: boolean; important: boolean; autoClassified: boolean };
  tags: unknown;
  result?: string | null;
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
  overallStatus: string;
  highlights: unknown;
  risks: unknown;
  actionItems: unknown;
  authorId: string;
  createdAt: string;
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

export interface ResearchReport {
  id: string;
  type: string;
  title: string;
  packageName: string | null;
  technicalData: unknown;
  interpretation: unknown;
  markdownReport: string | null;
  sentimentScore: number | null;
  sentimentSummary: string | null;
  redditMentions: unknown;
  twitterMentions: unknown;
  authorId: string | null;
  createdAt: string;
}

