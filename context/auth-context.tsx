'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/api-client';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'tutor' | 'admin';
  plan: 'free' | 'premium' | 'enterprise';
  plan_expires_at?: string | null;
  avatar_url?: string;
  locale?: string;
  timezone?: string;
  xp?: number;
  level?: number;
  streak?: number;
  ranking?: number;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const token = Cookies.get('access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      const { data } = await apiClient.get('/auth/me');
      const userData = data.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err: any) {
      console.error('Failed to fetch user:', err);
      // Only clear if server explicitly says unauthorized (401)
      if (err.response?.status === 401) {
        localStorage.removeItem('user');
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load user on mount and sync with server
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setIsHydrated(true);
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(async (credentials: any) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    const { user, access_token, refresh_token } = data.data;
    
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    Cookies.set('access_token', access_token, { expires: 1/96 });
    Cookies.set('refresh_token', refresh_token, { expires: 7 });
  }, []);

  const register = useCallback(async (registrationData: any) => {
    await apiClient.post('/auth/register', registrationData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    }
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoading: !isHydrated || isLoading, isAuthenticated, login, register, logout, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
