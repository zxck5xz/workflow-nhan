import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Member } from '../types';
import { authService } from '../services/authService';

interface AuthContextValue {
  user: Member | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Restore the session from localStorage synchronously on first render.
  const [user, setUser] = useState<Member | null>(() =>
    authService.getToken() ? authService.getUser() : null,
  );
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      authService.setSession(response.token, response.user);
      setUser(response.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role?: string) => {
    setLoading(true);
    try {
      const response = await authService.register({ name, email, password, role });
      authService.setSession(response.token, response.user);
      setUser(response.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.clearSession();
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook paired with its provider
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
