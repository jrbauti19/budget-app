import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvJSONStorage } from '../../storage';

export interface AppSettingsState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  setTheme: (theme: AppSettingsState['theme']) => void;
  setLanguage: (language: string) => void;
  toggleNotifications: () => void;
}

/**
 * Application settings store that manages user preferences.
 *
 * This store persists user preferences using MMKV storage to maintain consistent settings
 * across app sessions. It manages theme selection, language preference, and notification
 * settings, providing methods to update each setting individually.
 *
 * @example
 * import { useAppSettingsStore } from './stores/settingsStore';
 *
 * // Access settings
 * const { theme, language, notifications } = useAppSettingsStore();
 *
 * // Update theme
 * useAppSettingsStore.getState().setTheme('dark');
 *
 * // Change language
 * useAppSettingsStore.getState().setLanguage('fr');
 *
 * // Toggle notifications
 * useAppSettingsStore.getState().toggleNotifications();
 */
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
