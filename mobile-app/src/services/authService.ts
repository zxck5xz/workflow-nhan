import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Member } from '../types';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:4000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Member;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Login failed');
    }
    return res.json();
  },

  logout(): void {
    AsyncStorage.multiRemove(['token', 'user']);
  },

  async setSession(token: string, user: Member): Promise<void> {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
  },

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem('token');
  },

  async getUser(): Promise<Member | null> {
    const json = await AsyncStorage.getItem('user');
    return json ? JSON.parse(json) : null;
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  },

  async clearSession(): Promise<void> {
    await AsyncStorage.multiRemove(['token', 'user']);
  },
};
