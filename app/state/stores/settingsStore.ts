import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvJSONStorage } from '../storage';

export interface AppSettingsState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  setTheme: (theme: AppSettingsState['theme']) => void;
  setLanguage: (language: string) => void;
  toggleNotifications: () => void;
}

export const useAppSettingsStore = create<AppSettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'en',
      notifications: true,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleNotifications: () =>
        set((state) => ({ notifications: !state.notifications })),
    }),
    {
      name: 'app-settings-storage',
      storage: mmkvJSONStorage,
    },
  ),
);
