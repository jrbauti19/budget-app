import { create } from 'zustand';

export interface TempState {
  tempData: any;
  setTempData: (data: any) => void;
}

/**
 * Temporary data store for managing ephemeral application state.
 *
 * This store maintains temporary data that does not need to persist across app sessions.
 * Unlike other stores, it does not use persistence middleware, making it suitable for
 * transient state like form data, UI state, or intermediate processing results.
 *
 * @example
 * import { useTemporaryStore } from './stores/tempStore';
 *
 * // Access temporary data
 * const { tempData } = useTemporaryStore();
 *
 * // Store temporary data
 * useTemporaryStore.getState().setTempData({
 *   formValues: { name: 'John', age: 30 },
 *   lastStep: 2
 * });
 *
 * // Clear temporary data
 * useTemporaryStore.getState().setTempData(null);
 */
export const useTemporaryStore = create<TempState>((set) => ({
  tempData: null,
  setTempData: (data) => set({ tempData: data }),
}));
