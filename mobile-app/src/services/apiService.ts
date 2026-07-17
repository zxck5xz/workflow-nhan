import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppData, ResearchReport } from '../types';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:4000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await AsyncStorage.getItem('token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { headers, ...options });
  if (!res.ok) {
    if (res.status === 401) await AsyncStorage.multiRemove(['token', 'user']);
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export const apiService = {
  async loadData(): Promise<AppData> {
    return request<AppData>('/api/app-data');
  },

  async saveData(data: AppData): Promise<void> {
    await request('/api/app-data', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async saveSnapshot(data: AppData): Promise<void> {
    await request('/api/snapshot', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async listSnapshots(): Promise<string[]> {
    const res = await request<{ snapshots: string[] }>('/api/snapshots');
    return res.snapshots;
  },

  async loadSnapshot(date: string): Promise<AppData> {
    return request<AppData>(`/api/snapshots/${date}`);
  },

  async searchProduct(query: string): Promise<{
    found: boolean;
    info: Record<string, unknown> | null;
    packageName?: string;
    error?: string;
  }> {
    return request('/api/search-product', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  },

  async analyzeSentiment(
    query: string,
    reportId?: string,
  ): Promise<{
    sentimentScore: number;
    sentimentSummary: string;
    overallLabel: string;
    positiveCount: number;
    negativeCount: number;
    neutralCount: number;
    totalMentions: number;
    redditMentions: Array<Record<string, unknown>>;
    twitterMentions: Array<Record<string, unknown>>;
  }> {
    return request('/api/research/sentiment', {
      method: 'POST',
      body: JSON.stringify({ query, reportId }),
    });
  },

  async listResearchReports(): Promise<ResearchReport[]> {
    const res = await request<{ reports: ResearchReport[] }>('/api/research-reports');
    return res.reports;
  },

  async saveResearchReport(
    report: Partial<ResearchReport>,
  ): Promise<{ success: boolean; report: ResearchReport }> {
    return request('/api/research-reports', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  },
};
