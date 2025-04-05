import { MMKV, Mode } from 'react-native-mmkv';
import { createJSONStorage } from 'zustand/middleware';
import { getOrCreateEncryptionKey } from './utils';

// Initialize MMKV storage instance
export const storage = new MMKV({
  id: 'app-storage',
  // TODO: figure out how to use encryptionKey here **
  encryptionKey: getOrCreateEncryptionKey(), // Consider using a secure key management approach
  mode: Mode.SINGLE_PROCESS,
});

// Create a storage interface for Zustand persist middleware
export const mmkvStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
};

// Export as JSON storage for Zustand
export const mmkvJSONStorage = createJSONStorage(() => mmkvStorage);

// Helper for clearing all storage
export const clearStorage = () => {
  storage.clearAll();
};
