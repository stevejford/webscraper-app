/**
 * Application constants and configuration values
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  WS_BASE_URL: import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// WebSocket Configuration
export const WEBSOCKET_CONFIG = {
  MAX_RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 1000,
  HEARTBEAT_INTERVAL: 30000,
  CONNECTION_TIMEOUT: 10000,
  MESSAGE_QUEUE_LIMIT: 100,
} as const;

// UI Configuration
export const UI_CONFIG = {
  NOTIFICATION_DURATION: 5000,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  VIRTUAL_LIST_ITEM_HEIGHT: 50,
  MAX_VISIBLE_NOTIFICATIONS: 5,
} as const;

// Storage Configuration
export const STORAGE_CONFIG = {
  MAX_SESSIONS: 50,
  MAX_RECENT_URLS: 20,
  SESSION_EXPIRY_DAYS: 30,
  AUTO_CLEANUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
} as const;

// Content Types
export const DEFAULT_CONTENT_TYPES = [
  {
    id: 'images',
    name: 'Images',
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'],
    mime_types: ['image/*'],
    enabled: true,
  },
  {
    id: 'pdfs',
    name: 'PDFs',
    extensions: ['.pdf'],
    mime_types: ['application/pdf'],
    enabled: true,
  },
  {
    id: 'documents',
    name: 'Documents',
    extensions: ['.doc', '.docx', '.txt', '.rtf', '.odt', '.pages'],
    mime_types: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/*'],
    enabled: false,
  },
  {
    id: 'videos',
    name: 'Videos',
    extensions: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'],
    mime_types: ['video/*'],
    enabled: false,
  },
  {
    id: 'audio',
    name: 'Audio',
    extensions: ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac'],
    mime_types: ['audio/*'],
    enabled: false,
  },
  {
    id: 'archives',
    name: 'Archives',
    extensions: ['.zip', '.rar', '.7z', '.tar', '.gz'],
    mime_types: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'],
    enabled: false,
  },
] as const;

// User Agent Strings
export const USER_AGENTS = [
  {
    name: 'Chrome (Windows)',
    value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
  {
    name: 'Chrome (macOS)',
    value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
  {
    name: 'Firefox (Windows)',
    value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
  },
  {
    name: 'Firefox (macOS)',
    value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0',
  },
  {
    name: 'Safari (macOS)',
    value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  },
  {
    name: 'Edge (Windows)',
    value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
  },
] as const;

// Validation Limits
export const VALIDATION_LIMITS = {
  URL_MAX_LENGTH: 2048,
  MAX_PAGES_MIN: 1,
  MAX_PAGES_MAX: 10000,
  DELAY_MIN: 0,
  DELAY_MAX: 60,
  USER_AGENT_MAX_LENGTH: 500,
  FILENAME_MAX_LENGTH: 255,
  SESSION_ID_LENGTH: 36,
} as const;

// Theme Colors
export const THEME_COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
} as const;

// Status Colors
export const STATUS_COLORS = {
  running: 'text-blue-500',
  completed: 'text-green-500',
  error: 'text-red-500',
  stopped: 'text-gray-500',
  connecting: 'text-yellow-500',
  connected: 'text-green-500',
  disconnected: 'text-gray-500',
  reconnecting: 'text-yellow-500',
} as const;

// File Size Limits
export const FILE_SIZE_LIMITS = {
  MAX_DOWNLOAD_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_PREVIEW_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_THUMBNAIL_SIZE: 1 * 1024 * 1024, // 1MB
} as const;

// Export Formats
export const EXPORT_FORMATS = [
  { value: 'json', label: 'JSON', extension: 'json', mimeType: 'application/json' },
  { value: 'csv', label: 'CSV', extension: 'csv', mimeType: 'text/csv' },
  { value: 'txt', label: 'Text', extension: 'txt', mimeType: 'text/plain' },
] as const;

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  START_SCRAPING: 'ctrl+enter',
  STOP_SCRAPING: 'escape',
  SAVE_SESSION: 'ctrl+s',
  EXPORT_DATA: 'ctrl+e',
  TOGGLE_THEME: 'ctrl+shift+t',
  FOCUS_URL_INPUT: 'ctrl+l',
  OPEN_SETTINGS: 'ctrl+comma',
  TOGGLE_SIDEBAR: 'ctrl+b',
} as const;

// Regular Expressions
export const REGEX_PATTERNS = {
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  FILENAME: /^[^<>:"/\\|?*]+$/,
  IPV4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  TIMEOUT_ERROR: 'The request took too long to complete. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  SESSION_NOT_FOUND: 'Session not found or has expired.',
  WEBSOCKET_CONNECTION_FAILED: 'Failed to establish WebSocket connection.',
  FILE_DOWNLOAD_FAILED: 'Failed to download file.',
  EXPORT_FAILED: 'Failed to export data.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SCRAPING_STARTED: 'Scraping started successfully!',
  SCRAPING_COMPLETED: 'Scraping completed successfully!',
  SESSION_SAVED: 'Session saved successfully!',
  DATA_EXPORTED: 'Data exported successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
  CONNECTION_ESTABLISHED: 'Connection established successfully!',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  SESSIONS: 'webscraper_sessions',
  FORM_DATA: 'webscraper_form_data',
  USER_PREFERENCES: 'webscraper_preferences',
  CONNECTION_STATS: 'webscraper_connection_stats',
  RECENT_URLS: 'webscraper_recent_urls',
  THEME: 'webscraper_theme',
  SIDEBAR_STATE: 'webscraper_sidebar_state',
} as const;

// Animation Variants for Framer Motion
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideIn: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
  },
  scaleIn: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },
} as const;
