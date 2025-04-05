import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvJSONStorage } from '../storage';

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
