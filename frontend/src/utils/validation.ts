// Validation utilities

import { ScrapeRequest, ValidationResult, FormErrors } from '../types';
import { LIMITS } from './constants';
import { isValidUrl } from './helpers';

// Validate URL
export const validateUrl = (url: string): string | null => {
  if (!url.trim()) {
    return 'URL is required';
  }

  if (url.length > LIMITS.MAX_URL_LENGTH) {
    return `URL must be less than ${LIMITS.MAX_URL_LENGTH} characters`;
  }

  if (!isValidUrl(url)) {
    return 'Please enter a valid URL (e.g., https://example.com)';
  }

  // Check for supported protocols
  const urlObj = new URL(url);
  if (!['http:', 'https:'].includes(urlObj.protocol)) {
    return 'Only HTTP and HTTPS URLs are supported';
  }

  return null;
};

// Validate max pages
export const validateMaxPages = (maxPages: number): string | null => {
  if (!Number.isInteger(maxPages)) {
    return 'Max pages must be a whole number';
  }

  if (maxPages < LIMITS.MIN_PAGES) {
    return `Max pages must be at least ${LIMITS.MIN_PAGES}`;
  }

  if (maxPages > LIMITS.MAX_PAGES) {
    return `Max pages cannot exceed ${LIMITS.MAX_PAGES}`;
  }

  return null;
};

// Validate delay
export const validateDelay = (delay: number): string | null => {
  if (delay < LIMITS.MIN_DELAY) {
    return `Delay must be at least ${LIMITS.MIN_DELAY} seconds`;
  }

  if (delay > LIMITS.MAX_DELAY) {
    return `Delay cannot exceed ${LIMITS.MAX_DELAY} seconds`;
  }

  return null;
};

// Validate user agent
export const validateUserAgent = (userAgent?: string): string | null => {
  if (!userAgent) return null;

  if (userAgent.length > 500) {
    return 'User agent must be less than 500 characters';
  }

  // Check for potentially malicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(userAgent)) {
      return 'User agent contains invalid characters';
    }
  }

  return null;
};

// Validate content types
export const validateContentTypes = (contentTypes: any[]): string | null => {
  if (!Array.isArray(contentTypes)) {
    return 'Content types must be an array';
  }

  if (contentTypes.length === 0) {
    return 'At least one content type must be selected';
  }

  const enabledTypes = contentTypes.filter(type => type.enabled);
  if (enabledTypes.length === 0) {
    return 'At least one content type must be enabled';
  }

  return null;
};

// Validate depth limit
export const validateDepthLimit = (depthLimit?: number): string | null => {
  if (depthLimit === undefined || depthLimit === null) return null;

  if (!Number.isInteger(depthLimit)) {
    return 'Depth limit must be a whole number';
  }

  if (depthLimit < 1) {
    return 'Depth limit must be at least 1';
  }

  if (depthLimit > 10) {
    return 'Depth limit cannot exceed 10 levels';
  }

  return null;
};

// Comprehensive scrape request validation
export const validateScrapeRequest = (request: ScrapeRequest): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate URL
  const urlError = validateUrl(request.url);
  if (urlError) errors.push(urlError);

  // Validate max pages
  const maxPagesError = validateMaxPages(request.max_pages);
  if (maxPagesError) errors.push(maxPagesError);

  // Validate delay
  const delayError = validateDelay(request.delay);
  if (delayError) errors.push(delayError);

  // Validate user agent
  const userAgentError = validateUserAgent(request.user_agent);
  if (userAgentError) errors.push(userAgentError);

  // Validate content types
  const contentTypesError = validateContentTypes(request.content_types);
  if (contentTypesError) errors.push(contentTypesError);

  // Validate depth limit
  const depthLimitError = validateDepthLimit(request.depth_limit);
  if (depthLimitError) errors.push(depthLimitError);

  // Add warnings for potentially problematic configurations
  if (request.max_pages > 1000) {
    warnings.push('Scraping more than 1000 pages may take a very long time');
  }

  if (request.delay < 1 && request.max_pages > 100) {
    warnings.push('Low delay with many pages may overwhelm the target server');
  }

  if (request.scrape_whole_site && request.max_pages < 100) {
    warnings.push('Whole site scraping with low page limit may not capture the entire site');
  }

  if (request.download_content && request.content_types.filter(t => t.enabled).length > 3) {
    warnings.push('Downloading many content types may consume significant storage space');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Validate form fields and return form errors
export const validateFormFields = (request: Partial<ScrapeRequest>): FormErrors => {
  const errors: FormErrors = {};

  if (request.url !== undefined) {
    const urlError = validateUrl(request.url);
    if (urlError) errors.url = urlError;
  }

  if (request.max_pages !== undefined) {
    const maxPagesError = validateMaxPages(request.max_pages);
    if (maxPagesError) errors.max_pages = maxPagesError;
  }

  if (request.delay !== undefined) {
    const delayError = validateDelay(request.delay);
    if (delayError) errors.delay = delayError;
  }

  if (request.content_types !== undefined) {
    const contentTypesError = validateContentTypes(request.content_types);
    if (contentTypesError) errors.content_types = contentTypesError;
  }

  return errors;
};

// Check if form has any errors
export const hasFormErrors = (errors: FormErrors): boolean => {
  return Object.values(errors).some(error => error !== undefined && error !== '');
};

// Sanitize input string
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, ''); // Remove vbscript: protocol
};

// Validate file name
export const validateFileName = (fileName: string): string | null => {
  if (!fileName.trim()) {
    return 'File name is required';
  }

  if (fileName.length > LIMITS.MAX_FILENAME_LENGTH) {
    return `File name must be less than ${LIMITS.MAX_FILENAME_LENGTH} characters`;
  }

  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(fileName)) {
    return 'File name contains invalid characters';
  }

  return null;
};

// Validate session ID
export const validateSessionId = (sessionId: string): boolean => {
  // Session ID should be a valid UUID or similar format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(sessionId) || /^[a-zA-Z0-9_-]+$/.test(sessionId);
};
