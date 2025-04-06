// Define error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// Define error types
export enum ErrorType {
  NETWORK = 'network',
  AUTH = 'authentication',
  DATABASE = 'database',
  API = 'api',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown',
}

// Interface for error data
export interface ErrorData {
  message: string;
  code?: string | number;
  stack?: string;
  context?: Record<string, any>;
}

// Interface for device information
export interface DeviceInfo {
  brand?: string;
  modelName?: string;
  osName?: string;
  osVersion?: string;
  appVersion?: string;
  isConnected?: boolean;
  connectionType?: string;
}

// Interface for logged error
export interface LoggedError {
  timestamp: Date;
  severity: ErrorSeverity;
  type: ErrorType;
  message: string;
  code?: string | number;
  stack?: string;
  context?: Record<string, any>;
  deviceInfo: DeviceInfo;
  userId?: string;
}

// Error listener function type
export type ErrorListener = (error: LoggedError) => void;
