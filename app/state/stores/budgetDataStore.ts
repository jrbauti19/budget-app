import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvJSONStorage } from '../storage';

export interface BudgetDataState {
  lastSyncTime: number | null;
  isLoading: boolean;
  setLastSyncTime: (time: number) => void;
  setIsLoading: (isLoading: boolean) => void;
}

/**
 * Budget data store for managing application state related to budget synchronization and loading status.
 *
 * This store persists data using MMKV storage to maintain state across app sessions.
 * It tracks the timestamp of the last successful data synchronization and maintains
 * the current loading state to coordinate UI feedback during data operations.
 *
 * @example
 * import { useAppDataStore } from './stores/budgetDataStore';
 *
 * // Access store state
 * const { isLoading, lastSyncTime } = useAppDataStore();
 *
 * // Update store state
 * useAppDataStore.getState().setIsLoading(true);
 * useAppDataStore.getState().setLastSyncTime(Date.now());
 */
export const useAppDataStore = create<BudgetDataState>()(
  persist(
    (set) => ({
      lastSyncTime: null,
      isLoading: false,
      setLastSyncTime: (time) => set({ lastSyncTime: time }),
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'app-data-storage',
      storage: mmkvJSONStorage,
    },
  ),
);
