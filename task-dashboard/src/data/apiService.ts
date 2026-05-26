import type { AppData } from '../types';
import { authService } from '../../services/authService';

const API_BASE = import.meta.env.VITE_API_URL || '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  // Get token from auth service
  const token = authService.getToken();
  
  // Prepare headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Merge with user-provided options
  const mergedOptions: RequestInit = {
    headers,
    ...options,
  };

  const res = await fetch(`${API_BASE}${path}`, mergedOptions);
  if (!res.ok) {
    // Handle 401 Unauthorized by clearing session
    if (res.status === 401) {
      authService.clearSession();
      // Reload page to redirect to login
      window.location.href = '/';
    }
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
