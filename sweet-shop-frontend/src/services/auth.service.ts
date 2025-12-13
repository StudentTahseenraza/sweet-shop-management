import api from './api';
import { IUser } from '../types';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: IUser;
  token: string;
}

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data.data;
  },

  getProfile: async (): Promise<IUser> => {
    const response = await api.get('/auth/profile');
    return response.data.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  isAdmin: (): boolean => {
    const user = localStorage.getItem('user');
    if (!user) return false;
    return JSON.parse(user).role === 'ADMIN';
  },

  getCurrentUser: (): IUser | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};