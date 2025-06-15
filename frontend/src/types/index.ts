/**
 * Central export file for all TypeScript type definitions
 */

// API types
export type {
  ScrapeRequest,
  ContentType,
  ScrapedContent,
  ScrapeStatus,
  ScrapeResult,
  SessionsResponse,
  ApiResponse,
  HealthCheckResponse,
} from './api';

// WebSocket types
export type {
  WebSocketMessage,
  ConnectionEstablishedMessage,
  StatusUpdateMessage,
  ScrapeCompleteMessage,
  ContentDownloadedMessage,
  ErrorMessage,
  PingMessage,
  PongMessage,
  WebSocketMessageType,
  ConnectionState,
  WebSocketConfig,
  WebSocketCallbacks,
} from './websocket';

// UI types
export type {
  ContentViewerProps,
  ContentGalleryProps,
  TabType,
  ViewMode,
  ThemeMode,
  NotificationItem,
  ModalProps,
  ButtonProps,
  InputProps,
  SelectOption,
  SelectProps,
  ProgressBarProps,
  LoadingSpinnerProps,
  TooltipProps,
  BadgeProps,
  CardProps,
  TableColumn,
  TableProps,
  PaginationProps,
  SearchInputProps,
  FilterOption,
  FilterProps,
  StatsCardProps,
} from './ui';
