// ============================================================
// Data Service — localStorage CRUD + JSON export/import + API sync
// ============================================================

import type { AppData, Project, Member, Task, GameScorecard, WeeklyInsight } from '../types';
import { seedData } from './seedData';
import { apiService } from './apiService';

const STORAGE_KEY = 'task-dashboard-data';
const API_BASE = import.meta.env.VITE_API_URL;

export const dataService = {
  async load(): Promise<AppData> {
    // Try backend first if configured
    if (API_BASE) {
      try {
        const data = await apiService.loadData();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      } catch {
        console.warn('API unavailable, falling back to localStorage');
      }
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as AppData;
    } catch {
      console.warn('Failed to parse stored data, using seed data');
    }
    const data = { ...seedData, lastUpdated: new Date().toISOString() };
    await this.save(data);
    return data;
  },

  async save(data: AppData): Promise<void> {
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (API_BASE) {
      try {
        await apiService.saveData(data);
      } catch {
        console.warn('Failed to sync data to backend');
      }
    }
  },

  // ── Export/Import ──
  exportJSON(data: AppData): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  async importJSON(file: File): Promise<AppData> {
    const text = await file.text();
    const data = JSON.parse(text) as AppData;
    // Validate basic structure
    if (!data.projects || !data.members || !data.tasks) {
      throw new Error('Invalid data format');
    }
    this.save(data);
    return data;
  },

  // ── Reset ──
  resetToSeed(): AppData {
    const data = { ...seedData, lastUpdated: new Date().toISOString() };
    this.save(data);
    return data;
  },

  // ── History Snapshots ──
  async saveSnapshot(data: AppData): Promise<void> {
    const date = new Date().toISOString().split('T')[0];
    const key = `task-dashboard-snapshot-${date}`;
    localStorage.setItem(key, JSON.stringify(data));
    if (API_BASE) {
      try {
        await apiService.saveSnapshot(data);
      } catch {
        console.warn('Failed to sync snapshot to backend');
      }
    }
  },

  async getSnapshots(): Promise<string[]> {
    if (API_BASE) {
      try {
        return await apiService.listSnapshots();
      } catch {
        console.warn('API unavailable, falling back to local snapshots');
      }
    }
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('task-dashboard-snapshot-')) {
        keys.push(key.replace('task-dashboard-snapshot-', ''));
      }
    }
    return keys.sort().reverse();
  },

  async loadSnapshot(date: string): Promise<AppData | null> {
    if (API_BASE) {
      try {
        return await apiService.loadSnapshot(date);
      } catch {
        console.warn('API unavailable, falling back to local snapshots');
      }
    }
    const raw = localStorage.getItem(`task-dashboard-snapshot-${date}`);
    return raw ? JSON.parse(raw) as AppData : null;
  },

  // ── CRUD helpers ──
  addProject(data: AppData, project: Project): AppData {
    return { ...data, projects: [...data.projects, project] };
  },

  updateProject(data: AppData, project: Project): AppData {
    return { ...data, projects: data.projects.map(p => p.id === project.id ? project : p) };
  },

  deleteProject(data: AppData, projectId: string): AppData {
    return {
      ...data,
      projects: data.projects.filter(p => p.id !== projectId),
      tasks: data.tasks.filter(t => t.projectId !== projectId),
    };
  },

  addMember(data: AppData, member: Member): AppData {
    return { ...data, members: [...data.members, member] };
  },

  updateMember(data: AppData, member: Member): AppData {
    return { ...data, members: data.members.map(m => m.id === member.id ? member : m) };
  },

  deleteMember(data: AppData, memberId: string): AppData {
    return { ...data, members: data.members.filter(m => m.id !== memberId) };
  },

  addTask(data: AppData, task: Task): AppData {
    return { ...data, tasks: [...data.tasks, task] };
  },

  updateTask(data: AppData, task: Task): AppData {
    return { ...data, tasks: data.tasks.map(t => t.id === task.id ? task : t) };
  },

  deleteTask(data: AppData, taskId: string): AppData {
    return { ...data, tasks: data.tasks.filter(t => t.id !== taskId) };
  },

  // ── Scorecard CRUD ──
  addScorecard(data: AppData, sc: GameScorecard): AppData {
    return { ...data, scorecards: [...data.scorecards, sc] };
  },
  updateScorecard(data: AppData, sc: GameScorecard): AppData {
    return { ...data, scorecards: data.scorecards.map(s => s.id === sc.id ? sc : s) };
  },
  deleteScorecard(data: AppData, id: string): AppData {
    return { ...data, scorecards: data.scorecards.filter(s => s.id !== id) };
  },

  // ── Insight CRUD ──
  addInsight(data: AppData, insight: WeeklyInsight): AppData {
    return { ...data, insights: [...data.insights, insight] };
  },
  updateInsight(data: AppData, insight: WeeklyInsight): AppData {
    return { ...data, insights: data.insights.map(i => i.id === insight.id ? insight : i) };
  },
  deleteInsight(data: AppData, id: string): AppData {
    return { ...data, insights: data.insights.filter(i => i.id !== id) };
  },
};
