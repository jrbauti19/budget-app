import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvJSONStorage } from '../../storage';

export interface UserState {
  user: {
    id: string | null;
    name: string | null;
    email: string | null;
  } | null;
  isLoggedIn: boolean;
  setUser: (user: UserState['user']) => void;
  login: (userData: UserState['user']) => void;
  logout: () => void;
}

/**
 * User authentication store that manages user session state.
 *
 * This store persists authentication data using MMKV storage to maintain the user session
 * across app restarts. It tracks the current user object and authentication status,
 * and provides methods for login, logout, and user data updates.
 *
 * @example
 * import { useUserStore } from './stores/userStore';
 *
 * // Access user state
 * const { user, isLoggedIn } = useUserStore();
 *
 * // Login a user
 * useUserStore.getState().login({
 *   id: '123',
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * });
 *
 * // Logout
 * useUserStore.getState().logout();
 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      setUser: (user) => set({ user }),
      login: (userData) => set({ user: userData, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: 'user-storage',
      storage: mmkvJSONStorage,
    },
  ),
);
