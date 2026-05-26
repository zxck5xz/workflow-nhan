import type { AppData } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export const apiService = {
  async loadData(): Promise<AppData> {
    const res = await request<AppData>('/api/app-data');
    return res;
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
};
