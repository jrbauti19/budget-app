import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvJSONStorage } from './storage';
import { useAppDataStore } from './stores/budgetDataStore';
import { useAppSettingsStore } from './stores/settingsStore';
import { useTemporaryStore } from './stores/tempStore';
import { useUserStore } from './stores/userStore';

import * as SecureStore from 'expo-secure-store'; // If using Expo
import DeviceInfo from 'react-native-device-info';
import EncryptedStorage from 'react-native-encrypted-storage'; // Alternative

// Helper for selective persistence
export const createPersistedStore = <T extends object>(
  initialState: T,
  name: string,
) => {
  return create<T>()(
    persist(() => initialState, {
      name,
      storage: mmkvJSONStorage,
    }),
  );
};

// Reset all stores to initial state
export const clearAllStores = () => {
  // Reset in-memory state for each store
  useUserStore.setState({ user: null, isLoggedIn: false });
  useAppSettingsStore.setState({
    theme: 'system',
    language: 'en',
    notifications: true,
  });
  useAppDataStore.setState({ lastSyncTime: null, isLoading: false });
  useTemporaryStore.setState({ tempData: null });
};

export const getOrCreateEncryptionKey = async () => {
  const KEY_STORAGE_NAME = 'MMKV_ENCRYPTION_KEY';

  try {
    // Try to retrieve existing key
    let key;
    if (typeof SecureStore !== 'undefined') {
      key = await SecureStore.getItemAsync(KEY_STORAGE_NAME);
    } else {
      key = await EncryptedStorage.getItem(KEY_STORAGE_NAME);
    }

    if (key) return key;

    // Generate a new key if none exists
    const deviceId = DeviceInfo.getUniqueId();
    const timestamp = Date.now().toString();
    const randomPart = Math.random().toString(36).substring(2);

    // Combine elements for entropy
    key = `${deviceId}_${timestamp}_${randomPart}`;

    // Store the key securely
    if (typeof SecureStore !== 'undefined') {
      await SecureStore.setItemAsync(KEY_STORAGE_NAME, key);
    } else {
      await EncryptedStorage.setItem(KEY_STORAGE_NAME, key);
    }

    return key;
  } catch (error) {
    console.error('Failed to handle encryption key:', error);
    // Fallback to a less secure but functional approach
    return 'fallback_encryption_key_' + DeviceInfo.getUniqueId();
  }
};
