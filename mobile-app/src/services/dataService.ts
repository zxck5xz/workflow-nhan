import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppData, Task, Project, Member, GameScorecard, WeeklyInsight } from '../types';
import { seedData } from './seedData';
import { apiService } from './apiService';

const STORAGE_KEY = 'app_data';

let cachedData: AppData | null = null;

export const dataService = {
  async load(): Promise<AppData> {
    if (cachedData) return cachedData;
    try {
      const data = await apiService.loadData();
      cachedData = data;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    } catch {
      try {
        const cached = await AsyncStorage.getItem(STORAGE_KEY);
        if (cached) {
          const data: AppData = JSON.parse(cached);
          cachedData = data;
          return data;
        }
      } catch {}
      return seedData;
    }
  },

  async save(data: AppData): Promise<void> {
    cachedData = data;
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      await apiService.saveData(data);
    } catch {}
  },

  addTask(data: AppData, task: Task): AppData {
    return { ...data, tasks: [...data.tasks, task], lastUpdated: new Date().toISOString() };
  },

  updateTask(data: AppData, task: Task): AppData {
    return {
      ...data,
      tasks: data.tasks.map((t) => (t.id === task.id ? task : t)),
      lastUpdated: new Date().toISOString(),
    };
  },

  deleteTask(data: AppData, taskId: string): AppData {
    return {
      ...data,
      tasks: data.tasks.filter((t) => t.id !== taskId),
      lastUpdated: new Date().toISOString(),
    };
  },

  addProject(data: AppData, project: Project): AppData {
    return {
      ...data,
      projects: [...data.projects, project],
      lastUpdated: new Date().toISOString(),
    };
  },

  updateProject(data: AppData, project: Project): AppData {
    return {
      ...data,
      projects: data.projects.map((p) => (p.id === project.id ? project : p)),
      lastUpdated: new Date().toISOString(),
    };
  },

  deleteProject(data: AppData, projectId: string): AppData {
    return {
      ...data,
      projects: data.projects.filter((p) => p.id !== projectId),
      tasks: data.tasks.filter((t) => t.projectId !== projectId),
      lastUpdated: new Date().toISOString(),
    };
  },

  addMember(data: AppData, member: Member): AppData {
    return { ...data, members: [...data.members, member], lastUpdated: new Date().toISOString() };
  },

  updateMember(data: AppData, member: Member): AppData {
    return {
      ...data,
      members: data.members.map((m) => (m.id === member.id ? member : m)),
      lastUpdated: new Date().toISOString(),
    };
  },

  deleteMember(data: AppData, memberId: string): AppData {
    return {
      ...data,
      members: data.members.filter((m) => m.id !== memberId),
      lastUpdated: new Date().toISOString(),
    };
  },

  addScorecard(data: AppData, scorecard: GameScorecard): AppData {
    return {
      ...data,
      scorecards: [...data.scorecards, scorecard],
      lastUpdated: new Date().toISOString(),
    };
  },

  addInsight(data: AppData, insight: WeeklyInsight): AppData {
    return {
      ...data,
      insights: [...data.insights, insight],
      lastUpdated: new Date().toISOString(),
    };
  },
};
