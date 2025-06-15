/**
 * Formatting utilities for data display and user interface
 */

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format duration in human-readable format
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  
  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours < 24) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
};

/**
 * Format date in relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
};

/**
 * Format date in standard format
 */
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return targetDate.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Format number with thousands separators
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format URL for display (truncate if too long)
 */
export const formatUrl = (url: string, maxLength: number = 50): string => {
  if (url.length <= maxLength) {
    return url;
  }
  
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const path = urlObj.pathname + urlObj.search;
    
    if (domain.length + 3 >= maxLength) {
      return domain.substring(0, maxLength - 3) + '...';
    }
    
    const remainingLength = maxLength - domain.length - 3; // 3 for "..."
    const truncatedPath = path.length > remainingLength 
      ? '...' + path.substring(path.length - remainingLength + 3)
      : path;
    
    return domain + truncatedPath;
  } catch {
    // If URL parsing fails, just truncate the string
    return url.substring(0, maxLength - 3) + '...';
  }
};

/**
 * Format text for display (truncate with ellipsis)
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Format content type for display
 */
export const formatContentType = (contentType: string): string => {
  const typeMap: Record<string, string> = {
    'image': 'Image',
    'pdf': 'PDF',
    'document': 'Document',
    'video': 'Video',
    'audio': 'Audio',
    'text': 'Text',
    'other': 'Other',
  };
  
  return typeMap[contentType] || contentType;
};

/**
 * Format status for display
 */
export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'running': 'Running',
    'completed': 'Completed',
    'error': 'Error',
    'stopped': 'Stopped',
    'starting': 'Starting',
    'connecting': 'Connecting',
    'connected': 'Connected',
    'disconnected': 'Disconnected',
    'reconnecting': 'Reconnecting',
  };
  
  return statusMap[status] || status;
};

/**
 * Format speed (items per second)
 */
export const formatSpeed = (itemsPerSecond: number): string => {
  if (itemsPerSecond < 1) {
    return `${(itemsPerSecond * 60).toFixed(1)}/min`;
  }
  
  return `${itemsPerSecond.toFixed(1)}/s`;
};

/**
 * Format estimated time remaining
 */
export const formatETA = (seconds: number): string => {
  if (seconds <= 0) {
    return 'Calculating...';
  }
  
  if (seconds < 60) {
    return `${Math.round(seconds)}s remaining`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  
  if (minutes < 60) {
    return remainingSeconds > 0 
      ? `${minutes}m ${remainingSeconds}s remaining`
      : `${minutes}m remaining`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return remainingMinutes > 0 
    ? `${hours}h ${remainingMinutes}m remaining`
    : `${hours}h remaining`;
};

/**
 * Format domain from URL
 */
export const formatDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
};

/**
 * Format session ID for display (show first and last parts)
 */
export const formatSessionId = (sessionId: string): string => {
  if (sessionId.length <= 16) {
    return sessionId;
  }
  
  return `${sessionId.substring(0, 8)}...${sessionId.substring(sessionId.length - 8)}`;
};

/**
 * Format error message for user display
 */
export const formatErrorMessage = (error: string): string => {
  // Remove technical stack traces and make user-friendly
  const userFriendlyErrors: Record<string, string> = {
    'Network Error': 'Unable to connect to the server. Please check your internet connection.',
    'Timeout': 'The request took too long to complete. Please try again.',
    'Not Found': 'The requested resource was not found.',
    'Unauthorized': 'You are not authorized to perform this action.',
    'Forbidden': 'Access to this resource is forbidden.',
    'Internal Server Error': 'An internal server error occurred. Please try again later.',
  };
  
  // Check for known error patterns
  for (const [pattern, message] of Object.entries(userFriendlyErrors)) {
    if (error.includes(pattern)) {
      return message;
    }
  }
  
  // Clean up technical details
  const cleanError = error
    .replace(/Error: /g, '')
    .replace(/at .*/g, '')
    .trim();
  
  return cleanError || 'An unexpected error occurred.';
};

/**
 * Format bytes per second to human readable speed
 */
export const formatTransferSpeed = (bytesPerSecond: number): string => {
  const units = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
  let value = bytesPerSecond;
  let unitIndex = 0;
  
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  
  return `${value.toFixed(1)} ${units[unitIndex]}`;
};

/**
 * Format latency in milliseconds
 */
export const formatLatency = (ms: number): string => {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }
  
  return `${(ms / 1000).toFixed(1)}s`;
};
