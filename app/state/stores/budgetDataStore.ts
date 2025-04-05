import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvJSONStorage } from '../storage';

export interface BudgetDataState {
  lastSyncTime: number | null;
  isLoading: boolean;
  setLastSyncTime: (time: number) => void;
  setIsLoading: (isLoading: boolean) => void;
}

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
