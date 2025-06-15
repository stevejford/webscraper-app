// Utility helper functions

import { FILE_SIZES } from './constants';
import { ScrapedContent } from '../types';

// Format file size in human readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  
  return `${size.toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
};

// Format duration in human readable format
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
};

// Format date in relative time
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// Deep clone object
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

// Check if URL is valid
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Extract domain from URL
export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
};

// Get file extension from URL or filename
export const getFileExtension = (url: string): string => {
  const pathname = new URL(url).pathname;
  const extension = pathname.split('.').pop()?.toLowerCase();
  return extension ? `.${extension}` : '';
};

// Get content type from file extension
export const getContentTypeFromExtension = (extension: string): string => {
  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
  const videoExts = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'];
  const audioExts = ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac'];
  const docExts = ['.doc', '.docx', '.txt', '.rtf', '.odt', '.pages'];

  if (extension === '.pdf') return 'pdf';
  if (imageExts.includes(extension)) return 'image';
  if (videoExts.includes(extension)) return 'video';
  if (audioExts.includes(extension)) return 'audio';
  if (docExts.includes(extension)) return 'document';
  
  return 'other';
};

// Filter content by type
export const filterContentByType = (content: ScrapedContent[], type: string): ScrapedContent[] => {
  if (type === 'all') return content;
  return content.filter(item => item.content_type === type);
};

// Calculate progress percentage
export const calculateProgress = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.min(Math.round((current / total) * 100), 100);
};

// Estimate time remaining
export const estimateTimeRemaining = (
  startTime: Date,
  current: number,
  total: number
): number => {
  if (current === 0 || total === 0) return 0;
  
  const elapsed = Date.now() - startTime.getTime();
  const rate = current / elapsed;
  const remaining = total - current;
  
  return remaining / rate;
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// Convert bytes to appropriate unit
export const bytesToUnit = (bytes: number, unit: 'KB' | 'MB' | 'GB'): number => {
  switch (unit) {
    case 'KB':
      return bytes / FILE_SIZES.KB;
    case 'MB':
      return bytes / FILE_SIZES.MB;
    case 'GB':
      return bytes / FILE_SIZES.GB;
    default:
      return bytes;
  }
};

// Check if content is downloadable
export const isDownloadableContent = (content: ScrapedContent): boolean => {
  return content.success && !!content.file_path;
};

// Get content icon based on type
export const getContentIcon = (contentType: string): string => {
  switch (contentType) {
    case 'image':
      return '🖼️';
    case 'pdf':
      return '📄';
    case 'video':
      return '🎥';
    case 'audio':
      return '🎵';
    case 'document':
      return '📝';
    default:
      return '📎';
  }
};

// Sort array by multiple criteria
export const multiSort = <T>(
  array: T[],
  sortBy: Array<{ key: keyof T; direction: 'asc' | 'desc' }>
): T[] => {
  return [...array].sort((a, b) => {
    for (const { key, direction } of sortBy) {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};
