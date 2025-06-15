// UI-specific types and interfaces

import type { ScrapedContent } from './api';

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// View modes
export type ViewMode = 'grid' | 'list';

// Tab types
export type TabType = 'stats' | 'urls' | 'external' | 'images' | 'pdfs' | 'videos' | 'documents' | 'audio' | 'other';

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
  timestamp: Date;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

// Modal types
export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
}

// Content viewer types
export interface ContentViewerProps {
  content: ScrapedContent;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
}

export interface ContentGalleryProps {
  content: ScrapedContent[];
  contentType: string;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  onContentSelect?: (content: ScrapedContent) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

// Form types
export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  help?: string;
  value?: any;
  onChange?: (value: any) => void;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

// Sidebar state
export interface SidebarState {
  isOpen: boolean;
  activeSection?: string;
  width?: number;
}

// Search and filter types
export interface SearchFilters {
  query: string;
  contentType?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sizeRange?: {
    min: number;
    max: number;
  };
  status?: 'success' | 'error' | 'all';
}

// Pagination types
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Sort types
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: string;
  direction: SortDirection;
}

// Table types
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

// Progress types
export interface ProgressInfo {
  current: number;
  total: number;
  percentage: number;
  estimatedTimeRemaining?: number;
  speed?: number;
}

// Keyboard shortcut types
export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

// Export types for UI
export interface ExportUIOptions {
  format: 'json' | 'csv' | 'zip';
  filename?: string;
  includeMetadata: boolean;
  includeContent: boolean;
  selectedItems?: string[];
}
