import { create } from 'zustand';
import { getAdminMe, adminLogout, adminLogin } from '../api';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
  avatar?: string;
  permissions?: string[];
}

interface AuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  admin: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email: string, pass: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await adminLogin({ email, password: pass });
      if (res && res.admin) {
        if (typeof window !== 'undefined' && res.token) {
          localStorage.setItem('admin_token', res.token);
        }
        set({
          admin: res.admin,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      }
      throw new Error('Invalid login response');
    } catch (err: any) {
      set({
        admin: null,
        isAuthenticated: false,
        isLoading: false,
        error: err.message || 'Authentication failed',
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await adminLogout();
    } catch {
      // Ignore network errors during logout
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
      }
      set({
        admin: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  checkSession: async () => {
    set({ isLoading: true });
    try {
      const admin = await getAdminMe();
      if (admin && admin.id) {
        set({ admin, isAuthenticated: true, isLoading: false, error: null });
        return true;
      }
      set({ admin: null, isAuthenticated: false, isLoading: false, error: null });
      return false;
    } catch {
      set({ admin: null, isAuthenticated: false, isLoading: false, error: null });
      return false;
    }
  },
}));
