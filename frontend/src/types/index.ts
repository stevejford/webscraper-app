// Main types export file

// Re-export all types from individual modules
export * from './api';
export * from './websocket';
export * from './ui';

// Additional utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Generic response wrapper
export interface Response<T = any> {
  data?: T;
  error?: string;
  success: boolean;
  timestamp: string;
}

// Environment configuration
export interface Config {
  API_BASE_URL: string;
  WS_BASE_URL: string;
  MAX_FILE_SIZE: number;
  RECONNECT_ATTEMPTS: number;
  HEARTBEAT_INTERVAL: number;
  DEVELOPMENT: boolean;
}
