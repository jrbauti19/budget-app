import NetInfo from '@react-native-community/netinfo';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { FirebaseError } from 'firebase/app';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

// Import types from the @types folder
import {
  ErrorData,
  ErrorSeverity,
  ErrorType,
  LoggedError,
} from './@types';

/**
 * ErrorService - Singleton class for handling errors across the application
 */
class ErrorService {
  private static instance: ErrorService;
  private firestore: any;
  private userId: string | null = null;
  private isInitialized = false;
  private errorListeners: Array<(error: LoggedError) => void> = [];

  // Private constructor for singleton pattern
  private constructor() {
    // Initialization will be done in the init method
  }

  /**
   * Get the singleton instance of ErrorService
   */
  public static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  /**
   * Initialize the ErrorService with Firebase
   * @param firestoreInstance The Firestore instance
   * @param userId Optional user ID for tracking errors
   */
  public init(firestoreInstance: any, userId?: string): void {
    if (this.isInitialized) {
      console.warn('ErrorService is already initialized');
      return;
    }

    this.firestore = firestoreInstance;
    if (userId) {
      this.setUserId(userId);
    }
    this.isInitialized = true;
  }

  /**
   * Set or update the user ID
   * @param userId The user ID to set
   */
  public setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Clear the user ID (e.g., on logout)
   */
  public clearUserId(): void {
    this.userId = null;
  }

  /**
   * Add a listener for errors
   * @param listener Function to call when an error is logged
   */
  public addErrorListener(listener: (error: LoggedError) => void): void {
    this.errorListeners.push(listener);
  }

  /**
   * Remove an error listener
   * @param listener The listener to remove
   */
  public removeErrorListener(listener: (error: LoggedError) => void): void {
    this.errorListeners = this.errorListeners.filter((l) => l !== listener);
  }

  /**
   * Get device information for error context
   */
  private async getDeviceInfo(): Promise<LoggedError['deviceInfo']> {
    const netInfo = await NetInfo.fetch();

    // TODO: fix types
    return {
      brand: Device.brand,
      modelName: Device.modelName,
      osName: Device.osName,
      osVersion: Device.osVersion,
      appVersion: Application.nativeApplicationVersion,
      isConnected: netInfo.isConnected,
      connectionType: netInfo.type,
    };
  }

  /**
   * Log an error to Firestore and notify listeners
   * @param severity Error severity level
   * @param type Error type
   * @param errorData Error data
   */
  public async logError(
    severity: ErrorSeverity,
    type: ErrorType,
    errorData: ErrorData,
  ): Promise<void> {
    try {
      if (!this.isInitialized) {
        console.warn('ErrorService is not initialized');
        console.error(errorData.message, errorData);
        return;
      }

      const deviceInfo = await this.getDeviceInfo();

      const loggedError: LoggedError = {
        timestamp: new Date(),
        severity,
        type,
        message: errorData.message,
        code: errorData.code,
        stack: errorData.stack,
        context: errorData.context,
        deviceInfo,
        userId: this.userId || undefined,
      };

      // Log to console during development
      if (__DEV__) {
        console.group(`[${severity.toUpperCase()}] ${type}`);
        console.error(loggedError.message);
        if (loggedError.stack) console.error(loggedError.stack);
        if (loggedError.context) console.error(loggedError.context);
        console.groupEnd();
      }

      // Log to Firestore
      try {
        const errorsCollection = collection(this.firestore, 'errorLogs');

        await addDoc(errorsCollection, {
          ...loggedError,
          timestamp: serverTimestamp(),
          deviceInfo: loggedError.deviceInfo,
        });
      } catch (firestoreError) {
        // If Firestore logging fails, at least log to console
        console.error('Failed to log error to Firestore:', firestoreError);
      }

      // Notify all listeners
      this.errorListeners.forEach((listener) => {
        try {
          listener(loggedError);
        } catch (listenerError) {
          console.error('Error in error listener:', listenerError);
        }
      });
    } catch (metaError) {
      // Last resort error handling
      console.error('Error in ErrorService.logError:', metaError);
    }
  }

  /**
   * Handle a Firebase error
   * @param error Firebase error
   * @param context Additional context
   */
  public handleFirebaseError(
    error: FirebaseError,
    context?: Record<string, any>,
  ): void {
    let type = ErrorType.UNKNOWN;
    let severity = ErrorSeverity.ERROR;

    // Categorize Firebase errors
    if (error.code?.startsWith('auth/')) {
      type = ErrorType.AUTH;
    } else if (
      error.code?.startsWith('firestore/') ||
      error.code?.startsWith('storage/')
    ) {
      type = ErrorType.DATABASE;
    } else if (
      error.code?.includes('network') ||
      error.code?.includes('unavailable')
    ) {
      type = ErrorType.NETWORK;
      // Network errors might be temporary, so mark as warning
      severity = ErrorSeverity.WARNING;
    }

    this.logError(severity, type, {
      message: error.message,
      code: error.code,
      stack: error.stack,
      context,
    });
  }

  /**
   * Handle a network error
   * @param error Network error
   * @param context Additional context
   */
  public handleNetworkError(error: Error, context?: Record<string, any>): void {
    this.logError(ErrorSeverity.WARNING, ErrorType.NETWORK, {
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  /**
   * Handle an API error
   * @param error API error
   * @param context Additional context
   */
  public handleApiError(error: any, context?: Record<string, any>): void {
    this.logError(ErrorSeverity.ERROR, ErrorType.API, {
      message: error.message || 'API Error',
      code: error.status || error.statusCode,
      stack: error.stack,
      context: {
        ...context,
        response: error.response?.data,
      },
    });
  }

  /**
   * Handle a validation error
   * @param message Validation error message
   * @param context Additional context
   */
  public handleValidationError(
    message: string,
    context?: Record<string, any>,
  ): void {
    this.logError(ErrorSeverity.WARNING, ErrorType.VALIDATION, {
      message,
      context,
    });
  }

  /**
   * Handle a generic error
   * @param error Generic error
   * @param context Additional context
   */
  public handleError(error: Error, context?: Record<string, any>): void {
    // Default to unknown error type
    let type = ErrorType.UNKNOWN;
    let severity = ErrorSeverity.ERROR;

    // Try to categorize the error based on the message
    const errorMsg = error.message.toLowerCase();
    if (
      errorMsg.includes('network') ||
      errorMsg.includes('connection') ||
      errorMsg.includes('offline')
    ) {
      type = ErrorType.NETWORK;
      severity = ErrorSeverity.WARNING;
    } else if (
      errorMsg.includes('auth') ||
      errorMsg.includes('login') ||
      errorMsg.includes('permission')
    ) {
      type = ErrorType.AUTH;
    } else if (
      errorMsg.includes('database') ||
      errorMsg.includes('storage') ||
      errorMsg.includes('data')
    ) {
      type = ErrorType.DATABASE;
    } else if (errorMsg.includes('api') || errorMsg.includes('server')) {
      type = ErrorType.API;
    } else if (
      errorMsg.includes('validation') ||
      errorMsg.includes('invalid')
    ) {
      type = ErrorType.VALIDATION;
      severity = ErrorSeverity.WARNING;
    }

    this.logError(severity, type, {
      message: error.message,
      stack: error.stack,
      context,
    });
  }
}

// Export the singleton instance
export default ErrorService.getInstance();
