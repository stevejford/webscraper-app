/**
 * Validation utilities for form inputs and data validation
 */

import { ScrapeRequest } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * URL validation
 */
export const validateUrl = (url: string): FieldValidationResult => {
  if (!url || url.trim() === '') {
    return { isValid: false, error: 'URL is required' };
  }

  try {
    const urlObj = new URL(url);
    
    // Check if protocol is http or https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' };
    }

    // Check if hostname exists
    if (!urlObj.hostname) {
      return { isValid: false, error: 'URL must have a valid hostname' };
    }

    // Check for localhost in production (optional warning)
    if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
      // This could be a warning rather than an error
      console.warn('⚠️ Using localhost URL');
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' };
  }
};

/**
 * Validate max pages
 */
export const validateMaxPages = (maxPages: number): FieldValidationResult => {
  if (maxPages < 1) {
    return { isValid: false, error: 'Max pages must be at least 1' };
  }

  if (maxPages > 10000) {
    return { isValid: false, error: 'Max pages cannot exceed 10,000' };
  }

  return { isValid: true };
};

/**
 * Validate delay
 */
export const validateDelay = (delay: number): FieldValidationResult => {
  if (delay < 0) {
    return { isValid: false, error: 'Delay cannot be negative' };
  }

  if (delay > 60) {
    return { isValid: false, error: 'Delay cannot exceed 60 seconds' };
  }

  return { isValid: true };
};

/**
 * Validate user agent string
 */
export const validateUserAgent = (userAgent?: string): FieldValidationResult => {
  if (!userAgent) {
    return { isValid: true }; // Optional field
  }

  if (userAgent.length > 500) {
    return { isValid: false, error: 'User agent string is too long (max 500 characters)' };
  }

  // Check for potentially malicious content
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(userAgent)) {
      return { isValid: false, error: 'User agent contains invalid characters' };
    }
  }

  return { isValid: true };
};

/**
 * Validate content types selection
 */
export const validateContentTypes = (contentTypes: any[]): FieldValidationResult => {
  if (!Array.isArray(contentTypes)) {
    return { isValid: false, error: 'Content types must be an array' };
  }

  const enabledTypes = contentTypes.filter(type => type.enabled);
  
  if (enabledTypes.length === 0) {
    return { isValid: false, error: 'At least one content type must be selected' };
  }

  return { isValid: true };
};

/**
 * Validate complete scrape request
 */
export const validateScrapeRequest = (request: ScrapeRequest): ValidationResult => {
  const errors: string[] = [];

  // Validate URL
  const urlValidation = validateUrl(request.url);
  if (!urlValidation.isValid && urlValidation.error) {
    errors.push(urlValidation.error);
  }

  // Validate max pages
  const maxPagesValidation = validateMaxPages(request.max_pages);
  if (!maxPagesValidation.isValid && maxPagesValidation.error) {
    errors.push(maxPagesValidation.error);
  }

  // Validate delay
  const delayValidation = validateDelay(request.delay);
  if (!delayValidation.isValid && delayValidation.error) {
    errors.push(delayValidation.error);
  }

  // Validate user agent
  const userAgentValidation = validateUserAgent(request.user_agent);
  if (!userAgentValidation.isValid && userAgentValidation.error) {
    errors.push(userAgentValidation.error);
  }

  // Validate content types if download is enabled
  if (request.download_content) {
    const contentTypesValidation = validateContentTypes(request.content_types);
    if (!contentTypesValidation.isValid && contentTypesValidation.error) {
      errors.push(contentTypesValidation.error);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Email validation (for future features)
 */
export const validateEmail = (email: string): FieldValidationResult => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
};

/**
 * Password validation (for future features)
 */
export const validatePassword = (password: string): FieldValidationResult => {
  if (!password || password.length === 0) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }

  if (password.length > 128) {
    return { isValid: false, error: 'Password cannot exceed 128 characters' };
  }

  // Check for at least one uppercase, lowercase, number, and special character
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter, lowercase letter, number, and special character',
    };
  }

  return { isValid: true };
};

/**
 * File name validation
 */
export const validateFileName = (fileName: string): FieldValidationResult => {
  if (!fileName || fileName.trim() === '') {
    return { isValid: false, error: 'File name is required' };
  }

  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(fileName)) {
    return { isValid: false, error: 'File name contains invalid characters' };
  }

  // Check length
  if (fileName.length > 255) {
    return { isValid: false, error: 'File name is too long (max 255 characters)' };
  }

  // Check for reserved names (Windows)
  const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
  const nameWithoutExtension = fileName.split('.')[0]?.toUpperCase();
  if (nameWithoutExtension && reservedNames.includes(nameWithoutExtension)) {
    return { isValid: false, error: 'File name is reserved and cannot be used' };
  }

  return { isValid: true };
};

/**
 * Session ID validation
 */
export const validateSessionId = (sessionId: string): FieldValidationResult => {
  if (!sessionId || sessionId.trim() === '') {
    return { isValid: false, error: 'Session ID is required' };
  }

  // Check if it's a valid UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(sessionId)) {
    return { isValid: false, error: 'Invalid session ID format' };
  }

  return { isValid: true };
};

/**
 * Generic required field validation
 */
export const validateRequired = (value: any, fieldName: string): FieldValidationResult => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true };
};

/**
 * Numeric range validation
 */
export const validateRange = (
  value: number,
  min: number,
  max: number,
  fieldName: string
): FieldValidationResult => {
  if (value < min || value > max) {
    return {
      isValid: false,
      error: `${fieldName} must be between ${min} and ${max}`,
    };
  }

  return { isValid: true };
};
