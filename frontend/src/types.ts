// Enhanced TypeScript interfaces for content viewing and full site scraping

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

export interface WebSocketMessage {
  type: 'connection_established' | 'status_update' | 'scrape_complete' | 'error' | 'content_downloaded';
  data?: any;
  message?: string;
  session_id?: string;
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

// Content viewer types
export interface ContentViewerProps {
  content: ScrapedContent;
  onClose: () => void;
}

export interface ContentGalleryProps {
  content: ScrapedContent[];
  contentType: string;
}
