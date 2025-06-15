// Application constants and configuration

import { Config, ContentType } from '../types';

// Environment configuration
export const config: Config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  WS_BASE_URL: import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000',
  MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '50000000'), // 50MB
  RECONNECT_ATTEMPTS: parseInt(import.meta.env.VITE_RECONNECT_ATTEMPTS || '5'),
  HEARTBEAT_INTERVAL: parseInt(import.meta.env.VITE_HEARTBEAT_INTERVAL || '30000'), // 30 seconds
  DEVELOPMENT: import.meta.env.DEV,
};

// Default content types
export const DEFAULT_CONTENT_TYPES: ContentType[] = [
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
    mime_types: ['application/zip', 'application/x-rar-compressed'],
    enabled: false,
  },
];

// User agent options
export const USER_AGENTS = [
  {
    name: 'Default Browser',
    value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  },
  {
    name: 'Mobile Chrome',
    value: 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
  },
  {
    name: 'iPhone Safari',
    value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
  },
  {
    name: 'Shopify Bot',
    value: 'Mozilla/5.0 (compatible; ShopifyBot/1.0; +https://help.shopify.com/en/partners/dashboard/managing-stores/shopify-bot)',
  },
  {
    name: 'Googlebot',
    value: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  },
];

// Application limits
export const LIMITS = {
  MAX_PAGES: 10000,
  MIN_PAGES: 1,
  MAX_DELAY: 60,
  MIN_DELAY: 0,
  MAX_SESSIONS: 10,
  MAX_CONTENT_ITEMS: 1000,
  MAX_URL_LENGTH: 2048,
  MAX_FILENAME_LENGTH: 255,
};

// UI constants
export const UI_CONSTANTS = {
  SIDEBAR_WIDTH: 320,
  HEADER_HEIGHT: 64,
  FOOTER_HEIGHT: 48,
  CARD_BORDER_RADIUS: 8,
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  PROGRESS_UPDATE_INTERVAL: 1000,
};

// WebSocket constants
export const WS_CONSTANTS = {
  RECONNECT_DELAY: 1000,
  MAX_RECONNECT_ATTEMPTS: 5,
  CONNECTION_TIMEOUT: 10000,
  HEARTBEAT_INTERVAL: 30000,
  MESSAGE_QUEUE_SIZE: 100,
};

// File size constants
export const FILE_SIZES = {
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
};

// Color constants for charts and UI
export const COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#06b6d4',
  GRAY: '#6b7280',
};

// Chart colors
export const CHART_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#14b8a6',
];

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  START_SCRAPING: 'Enter',
  STOP_SCRAPING: 'Escape',
  TOGGLE_THEME: 'Ctrl+Shift+T',
  TOGGLE_SIDEBAR: 'Ctrl+B',
  SAVE_SESSION: 'Ctrl+S',
  EXPORT_DATA: 'Ctrl+E',
  SEARCH: 'Ctrl+F',
  REFRESH: 'F5',
};

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'webscraper_theme',
  SIDEBAR_STATE: 'webscraper_sidebar',
  FORM_DATA: 'webscraper_form',
  SESSIONS: 'webscraper_sessions',
  SETTINGS: 'webscraper_settings',
  LAST_SESSION: 'webscraper_last_session',
};

// API endpoints
export const API_ENDPOINTS = {
  HEALTH: '/health',
  SESSIONS: '/api/scrape/sessions',
  STATUS: (sessionId: string) => `/api/scrape/status/${sessionId}`,
  RESULT: (sessionId: string) => `/api/scrape/result/${sessionId}`,
  STOP: (sessionId: string) => `/api/scrape/stop/${sessionId}`,
  WEBSOCKET: (sessionId: string) => `/ws/scrape/${sessionId}`,
};
