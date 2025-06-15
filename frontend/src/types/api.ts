// Core API types for the web scraper application

export interface ScrapeRequest {
  url: string;
  max_pages: number;
  delay: number;
  user_agent?: string;
  include_external: boolean;
  scrape_whole_site: boolean;
  download_content: boolean;
  content_types: ContentType[];
  depth_limit?: number;
  respect_robots?: boolean;
}

export interface ContentType {
  id: string;
  name: string;
  extensions: string[];
  mime_types: string[];
  enabled: boolean;
}

export interface ScrapedContent {
  url: string;
  content_type: 'text' | 'image' | 'pdf' | 'document' | 'video' | 'audio' | 'other';
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  title?: string;
  description?: string;
  text_content?: string;
  thumbnail?: string;
  downloaded_at: string;
  success: boolean;
  error?: string;
}

export interface ScrapeStatus {
  session_id: string;
  status: 'running' | 'completed' | 'error' | 'stopped' | 'paused';
  current_url?: string;
  pages_scraped: number;
  urls_found: number;
  external_urls_found: number;
  content_downloaded: number;
  progress: number;
  started_at: string;
  ended_at?: string;
  estimated_total_pages?: number;
  estimated_completion_time?: string;
}

export interface ScrapeResult {
  session_id: string;
  domain: string;
  urls: string[];
  external_urls: string[];
  scraped_content: ScrapedContent[];
  statistics: {
    total_pages_scraped: number;
    total_urls_found: number;
    external_urls_found: number;
    content_downloaded: number;
    total_file_size: number;
    duration_seconds: number;
    content_by_type: Record<string, number>;
    success_rate: number;
    average_page_size: number;
  };
  status: ScrapeStatus;
  created_at: string;
  updated_at: string;
}

export interface ScrapeSession {
  id: string;
  config: ScrapeRequest;
  status: ScrapeStatus;
  result?: ScrapeResult;
  created_at: string;
  updated_at: string;
}

export interface SessionsResponse {
  active_sessions: string[];
  completed_sessions: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthCheckResponse {
  status: string;
  crawl4ai_available: boolean;
  active_sessions: number;
  version: string;
  uptime: number;
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface FormErrors {
  url?: string;
  max_pages?: string;
  delay?: string;
  content_types?: string;
  general?: string;
}

// Export types
export type ExportFormat = 'json' | 'csv' | 'zip';

export interface ExportOptions {
  format: ExportFormat;
  include_content: boolean;
  include_metadata: boolean;
  include_statistics: boolean;
}
