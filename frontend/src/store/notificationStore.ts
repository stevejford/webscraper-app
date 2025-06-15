// Notification state management with Zustand

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Notification, NotificationType } from '../types';
import { generateId } from '../utils';

interface NotificationState {
  notifications: Notification[];
  maxNotifications: number;
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  clearNotificationsByType: (type: NotificationType) => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  
  // Convenience methods
  showSuccess: (title: string, message: string, options?: Partial<Notification>) => string;
  showError: (title: string, message: string, options?: Partial<Notification>) => string;
  showWarning: (title: string, message: string, options?: Partial<Notification>) => string;
  showInfo: (title: string, message: string, options?: Partial<Notification>) => string;
}

export const useNotificationStore = create<NotificationState>()(
  immer((set, get) => ({
    notifications: [],
    maxNotifications: 5,
    
    addNotification: (notification) => {
      const id = generateId();
      const newNotification: Notification = {
        id,
        timestamp: new Date(),
        duration: 5000, // Default 5 seconds
        persistent: false,
        ...notification,
      };
      
      set((state) => {
        // Add new notification
        state.notifications.unshift(newNotification);
        
        // Remove excess notifications
        if (state.notifications.length > state.maxNotifications) {
          state.notifications = state.notifications.slice(0, state.maxNotifications);
        }
      });
      
      // Auto-remove non-persistent notifications
      if (!newNotification.persistent && newNotification.duration && newNotification.duration > 0) {
        setTimeout(() => {
          get().removeNotification(id);
        }, newNotification.duration);
      }
      
      return id;
    },
    
    removeNotification: (id) => set((state) => {
      state.notifications = state.notifications.filter(n => n.id !== id);
    }),
    
    clearNotifications: () => set((state) => {
      state.notifications = [];
    }),
    
    clearNotificationsByType: (type) => set((state) => {
      state.notifications = state.notifications.filter(n => n.type !== type);
    }),
    
    updateNotification: (id, updates) => set((state) => {
      const index = state.notifications.findIndex(n => n.id === id);
      if (index !== -1) {
        state.notifications[index] = { ...state.notifications[index], ...updates };
      }
    }),
    
    // Convenience methods
    showSuccess: (title, message, options = {}) => {
      return get().addNotification({
        type: 'success',
        title,
        message,
        duration: 4000,
        ...options,
      });
    },
    
    showError: (title, message, options = {}) => {
      return get().addNotification({
        type: 'error',
        title,
        message,
        duration: 8000,
        persistent: false,
        ...options,
      });
    },
    
    showWarning: (title, message, options = {}) => {
      return get().addNotification({
        type: 'warning',
        title,
        message,
        duration: 6000,
        ...options,
      });
    },
    
    showInfo: (title, message, options = {}) => {
      return get().addNotification({
        type: 'info',
        title,
        message,
        duration: 5000,
        ...options,
      });
    },
  }))
);

// Hook for notification actions
export const useNotifications = () => {
  const {
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  } = useNotificationStore();
  
  return {
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    
    // Additional convenience methods
    showConnectionError: () => showError(
      'Connection Error',
      'Unable to connect to the server. Please check your connection and try again.',
      { persistent: true }
    ),
    
    showScrapingStarted: (url: string) => showInfo(
      'Scraping Started',
      `Started scraping ${url}`,
      { duration: 3000 }
    ),
    
    showScrapingComplete: (itemCount: number) => showSuccess(
      'Scraping Complete',
      `Successfully scraped ${itemCount} items`,
      { duration: 6000 }
    ),
    
    showDownloadComplete: (filename: string) => showSuccess(
      'Download Complete',
      `Downloaded ${filename}`,
      { duration: 3000 }
    ),
    
    showExportComplete: (format: string) => showSuccess(
      'Export Complete',
      `Data exported as ${format.toUpperCase()}`,
      { duration: 3000 }
    ),
    
    showValidationError: (field: string, error: string) => showError(
      'Validation Error',
      `${field}: ${error}`,
      { duration: 5000 }
    ),
    
    showNetworkError: () => showError(
      'Network Error',
      'A network error occurred. Please check your connection.',
      { duration: 8000 }
    ),
    
    showSessionExpired: () => showWarning(
      'Session Expired',
      'Your session has expired. Please refresh the page.',
      { persistent: true }
    ),
    
    showMaintenanceMode: () => showWarning(
      'Maintenance Mode',
      'The service is currently under maintenance. Please try again later.',
      { persistent: true }
    ),
    
    showQuotaExceeded: () => showWarning(
      'Quota Exceeded',
      'You have reached your usage limit. Please try again later.',
      { duration: 10000 }
    ),
    
    showFeatureUnavailable: (feature: string) => showInfo(
      'Feature Unavailable',
      `${feature} is not available in this version.`,
      { duration: 5000 }
    ),
  };
};
