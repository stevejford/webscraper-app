/**
 * API-related TypeScript type definitions
 */

export interface ScrapeRequest {
  url: string;
  max_pages: number;
  delay: number;
  user_agent?: string;
  include_external: boolean;
  scrape_whole_site: boolean;
  download_content: boolean;
  content_types: ContentType[];
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
  content_type: 'text' | 'image' | 'pdf' | 'document' | 'video' | 'other';
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
  status: 'running' | 'completed' | 'error' | 'stopped';
  current_url?: string;
  pages_scraped: number;
  urls_found: number;
  external_urls_found: number;
  content_downloaded: number;
  progress: number;
  started_at: string;
  ended_at?: string;
  estimated_total_pages?: number;
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
  };
  status: ScrapeStatus;
}

export interface SessionsResponse {
  active_sessions: string[];
  completed_sessions: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface HealthCheckResponse {
  status: string;
  crawl4ai_available: boolean;
  active_sessions: number;
  completed_sessions: number;
}
