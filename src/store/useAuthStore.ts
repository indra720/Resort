import { create } from 'zustand';
import { User, UserRole } from '@/types';
import { MOCK_USERS } from '@/data/mockData';

interface AuthState {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

/**
 * Zustand store managing authentication and user role state.
 * Defaults to Super Admin for smooth previewing and testing of all features.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: MOCK_USERS[0], // Vikram Malhotra (Super Admin) by default
  role: 'Super Admin',
  isAuthenticated: true,

  login: (email: string, selectedRole?: UserRole) => {
    // Find matching mock user or assign chosen role
    const matched = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || (selectedRole && u.role === selectedRole)
    );

    if (matched) {
      set({ user: matched, role: matched.role, isAuthenticated: true });
      return true;
    }

    // Fallback user if custom email entered
    const defaultRole = selectedRole || 'Guest';
    const fallbackUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      phone: '+91 98000 00000',
      role: defaultRole,
    };

    set({ user: fallbackUser, role: defaultRole, isAuthenticated: true });
    return true;
  },

  logout: () => {
    set({ user: null, role: 'Guest', isAuthenticated: false });
  },

  switchRole: (newRole: UserRole) => {
    const matched = MOCK_USERS.find((u) => u.role === newRole);
    if (matched) {
      set({ user: matched, role: newRole });
    } else {
      set((state) => ({
        role: newRole,
        user: state.user ? { ...state.user, role: newRole } : null,
      }));
    }
  },
}));
