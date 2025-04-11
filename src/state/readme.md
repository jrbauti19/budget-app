`Zustand State Management` with `MMKV Persistence`
This directory contains a modular approach to state management using Zustand with selective MMKV persistence for React Native.

Overview:
The state management system follows a modular multi-store approach, allowing you to:

Selectively persist only the stores that need persistence
Organize related state into separate stores
Maintain a clean, scalable state architecture

`Directory Structure`

```
Copystate/
├── stores/ # Individual store implementations
│ ├── persist/ # Stores with persistence
│ └── non-persist/ # Stores without persistence
├── index.ts # Main export file
├── storage.ts # MMKV storage configuration
├── utils.ts # Utility functions
└── README.md # This documentation
```

`Key Components`

Storage Configuration (storage.ts)
Handles the MMKV storage setup with encryption for secure persistent storage:

```
typescriptCopyimport { MMKV, Mode } from 'react-native-mmkv';
import { createJSONStorage } from 'zustand/middleware';

// Initialize MMKV storage instance
export const storage = new MMKV({
id: 'app-storage',
encryptionKey: '...', // Securely generated encryption key
mode: Mode.SINGLE_PROCESS,
});

export const mmkvJSONStorage = createJSONStorage(() => mmkvStorage);
```

`Persistent Stores`
Located in stores/persist/, these stores maintain their state across app restarts:

Best Practices

`Store Organization`:

Group related state in the same store
Split large stores into smaller ones when they grow too complex

`Persistence`:

Only persist data that needs to survive app restarts
Consider performance implications of large persisted stores

`Sensitive Data`:

Use the encrypted MMKV storage for any sensitive user data
Clear sensitive data with clearAllStores() during logout

`Testing`:

Stores can be tested independently using Jest
Mock the storage for testing persistence logic

`Adding New Stores`

Create a new file in the appropriate directory:

stores/persist/ for persisted stores
stores/non-persist/ for non-persisted stores

Define your store following the established patterns
Export it from the index.ts file
