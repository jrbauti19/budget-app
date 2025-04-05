import { create } from 'zustand';

export interface TempState {
  tempData: any;
  setTempData: (data: any) => void;
}

// Non-persisted store for temporary data
export const useTemporaryStore = create<TempState>((set) => ({
  tempData: null,
  setTempData: (data) => set({ tempData: data }),
}));
