// Main utilities export file

export * from './constants';
export * from './helpers';
export * from './validation';

// Additional utility functions that don't fit in other categories

// Local storage utilities
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },
};

// Session storage utilities
export const sessionStorage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to sessionStorage:', error);
    }
  },

  remove: (key: string): void => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from sessionStorage:', error);
    }
  },
};

// Error handling utilities
export const errorHandler = {
  log: (error: Error, context?: string): void => {
    console.error(`[${context || 'Unknown'}]`, error);
    
    // In production, you might want to send errors to a monitoring service
    if (!import.meta.env.DEV) {
      // Send to monitoring service
    }
  },

  getErrorMessage: (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unknown error occurred';
  },
};

// Performance utilities
export const performance = {
  measure: (name: string, fn: () => void): number => {
    const start = Date.now();
    fn();
    const end = Date.now();
    const duration = end - start;
    console.log(`Performance [${name}]: ${duration}ms`);
    return duration;
  },

  measureAsync: async (name: string, fn: () => Promise<void>): Promise<number> => {
    const start = Date.now();
    await fn();
    const end = Date.now();
    const duration = end - start;
    console.log(`Performance [${name}]: ${duration}ms`);
    return duration;
  },
};

// Browser utilities
export const browser = {
  isOnline: (): boolean => navigator.onLine,
  
  getLanguage: (): string => navigator.language || 'en-US',
  
  isMobile: (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },
  
  isTablet: (): boolean => {
    return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
  },
  
  isDesktop: (): boolean => {
    return !browser.isMobile() && !browser.isTablet();
  },
  
  supportsWebSockets: (): boolean => {
    return 'WebSocket' in window;
  },
  
  supportsLocalStorage: (): boolean => {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },
};

// Download utilities
export const download = {
  file: (data: Blob | string, filename: string, mimeType?: string): void => {
    const blob = typeof data === 'string' 
      ? new Blob([data], { type: mimeType || 'text/plain' })
      : data;
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  json: (data: any, filename: string): void => {
    const jsonString = JSON.stringify(data, null, 2);
    download.file(jsonString, filename, 'application/json');
  },

  csv: (data: any[], filename: string): void => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    download.file(csvContent, filename, 'text/csv');
  },
};
