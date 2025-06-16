// Enhanced Supabase service with Realtime support for scraped data

import { createClient } from '@supabase/supabase-js';
import type { ScrapeSession } from '../types/api';

// Supabase configuration
const SUPABASE_URL = "https://jeymatvbyfaxhxztbjsw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpleW1hdHZieWZheGh4enRianN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMDI1MjksImV4cCI6MjA2NTU3ODUyOX0.F6vOOWnYxYTHUx1AsEvKZ3T58xh7QfJoRBz37qk9XTk";

// Create Supabase client for Realtime
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface SupabaseSession {
  id: string;
  user_id: string | null;
  start_time: string;
  end_time?: string | null;
  status: string;
  target_url: string;
  config: any;
  progress: any;
  summary_results: any;
  last_updated: string;
  // Legacy compatibility fields
  domain?: string | null;
  statistics?: any;
  created_at?: string | null;
  completed_at?: string | null;
  updated_at?: string | null;
}

interface SupabasePage {
  id: string;
  session_id: string;
  url: string;
  title?: string | null;
  content?: string | null;
  text_content?: string | null;
  html_content?: string | null;
  scraped_at?: string | null;
  metadata?: any;
}

interface SupabaseFile {
  id: string;
  session_id: string;
  original_url: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  content_hash?: string;
  public_url?: string;
  is_deduped: boolean;
  text_content?: string;
  metadata: any;
  uploaded_at: string;
}

class SupabaseService {
  private baseUrl: string;
  private headers: Record<string, string>;
  private realtimeSubscriptions: Map<string, any> = new Map();

  constructor() {
    this.baseUrl = `${SUPABASE_URL}/rest/v1`;
    this.headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  // Realtime subscription methods
  subscribeToSessionUpdates(sessionId: string, callback: (payload: any) => void) {
    const channel = supabaseClient
      .channel(`session-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scraping_sessions',
          filter: `id=eq.${sessionId}`
        },
        callback
      )
      .subscribe();

    this.realtimeSubscriptions.set(`session-${sessionId}`, channel);
    return channel;
  }

  subscribeToPageUpdates(sessionId: string, callback: (payload: any) => void) {
    const channel = supabaseClient
      .channel(`pages-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scraped_pages',
          filter: `session_id=eq.${sessionId}`
        },
        callback
      )
      .subscribe();

    this.realtimeSubscriptions.set(`pages-${sessionId}`, channel);
    return channel;
  }

  subscribeToFileUpdates(sessionId: string, callback: (payload: any) => void) {
    const channel = supabaseClient
      .channel(`files-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stored_files',
          filter: `session_id=eq.${sessionId}`
        },
        callback
      )
      .subscribe();

    this.realtimeSubscriptions.set(`files-${sessionId}`, channel);
    return channel;
  }

  unsubscribeFromSession(sessionId: string) {
    const sessionChannel = this.realtimeSubscriptions.get(`session-${sessionId}`);
    const pagesChannel = this.realtimeSubscriptions.get(`pages-${sessionId}`);
    const filesChannel = this.realtimeSubscriptions.get(`files-${sessionId}`);

    if (sessionChannel) {
      supabaseClient.removeChannel(sessionChannel);
      this.realtimeSubscriptions.delete(`session-${sessionId}`);
    }
    if (pagesChannel) {
      supabaseClient.removeChannel(pagesChannel);
      this.realtimeSubscriptions.delete(`pages-${sessionId}`);
    }
    if (filesChannel) {
      supabaseClient.removeChannel(filesChannel);
      this.realtimeSubscriptions.delete(`files-${sessionId}`);
    }
  }

  unsubscribeAll() {
    this.realtimeSubscriptions.forEach((channel) => {
      supabaseClient.removeChannel(channel);
    });
    this.realtimeSubscriptions.clear();
  }

  // Helper method to map MIME types to content types
  private mapMimeTypeToContentType(mimeType: string): 'text' | 'image' | 'pdf' | 'document' | 'video' | 'audio' | 'other' {
    if (!mimeType) return 'other';

    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.startsWith('text/') || mimeType === 'text/html') return 'text';
    if (mimeType.includes('document') || mimeType.includes('word') || mimeType.includes('excel') || mimeType.includes('powerpoint')) return 'document';

    return 'other';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase request failed:', response.status, response.statusText);
      console.error('Error response:', errorText);
      console.error('Request URL:', url);
      console.error('Request method:', options?.method || 'GET');
      console.error('Request body:', options?.body);
      throw new Error(`Supabase request failed: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  // Fetch all sessions
  async getSessions(): Promise<ScrapeSession[]> {
    console.log('🔍 Fetching sessions from Supabase...');
    
    try {
      const sessions = await this.request<SupabaseSession[]>(
        '/scraping_sessions?order=created_at.desc'
      );

      console.log(`📊 Found ${sessions.length} sessions in Supabase`);

      // Load content for each session
      const convertedSessions: ScrapeSession[] = await Promise.all(
        sessions.map(async (session) => {
          try {
            // Fetch files for this session
            const files = await this.request<SupabaseFile[]>(
              `/stored_files?session_id=eq.${session.id}&order=uploaded_at.desc`
            );

            // Fetch pages for this session
            const pages = await this.request<SupabasePage[]>(
              `/scraped_pages?session_id=eq.${session.id}&order=scraped_at.desc`
            );

            const scrapedContent = files.map(file => ({
              id: file.id,
              url: file.original_url,
              filename: file.file_name,
              file_size: file.file_size,
              size: file.file_size,
              type: file.mime_type,
              mime_type: file.mime_type,
              content_type: file.mime_type.split('/')[0] as any,
              success: true,
              downloaded_at: file.uploaded_at,
              public_url: file.public_url,
              metadata: file.metadata || {}
            }));

            const pageContents = pages.map(page => ({
              url: page.url,
              title: page.title || '',
              html_content: page.html_content || '',
              text_content: page.text_content || page.content || '',
              meta_description: page.metadata?.meta_description || '',
              meta_keywords: page.metadata?.meta_keywords || '',
              headings: page.metadata?.headings || [],
              links: page.metadata?.links || [],
              images: page.metadata?.images || [],
              media_files: page.metadata?.media_files || [],
              scraped_at: page.scraped_at || new Date().toISOString(),
              file_path: page.metadata?.file_path || ''
            }));

            return {
              id: session.id,
              config: {
                url: session.target_url || session.config?.url || `https://${session.domain || 'unknown.com'}`,
                max_pages: session.config?.max_pages || 10,
                delay: session.config?.delay || 1,
                content_types: session.config?.content_types || [],
                include_external: session.config?.include_external || false,
                scrape_whole_site: session.config?.scrape_whole_site || true,
                download_content: session.config?.download_content || true,
                user_agent: session.config?.user_agent || 'WebScraper/1.0'
              },
              status: {
                session_id: session.id,
                status: session.status as 'running' | 'completed' | 'error' | 'stopped' | 'paused',
                current_url: '',
                pages_scraped: pages.length,
                urls_found: 0,
                external_urls_found: 0,
                content_downloaded: files.length,
                progress: session.status === 'completed' ? 100 : 0,
                started_at: session.created_at || session.start_time || new Date().toISOString(),
                ended_at: session.completed_at || session.end_time || undefined
              },
              created_at: session.created_at || session.start_time || new Date().toISOString(),
              updated_at: session.updated_at || session.last_updated || session.created_at || new Date().toISOString(),
              result: {
                session_id: session.id,
                domain: session.domain || new URL(session.target_url || session.config?.url || 'https://unknown.com').hostname,
                urls: [],
                external_urls: [],
                scraped_content: scrapedContent,
                page_contents: pageContents,
                statistics: {
                  total_pages_scraped: pages.length,
                  total_urls_found: 0,
                  external_urls_found: 0,
                  content_downloaded: files.length,
                  total_file_size: files.reduce((sum, f) => sum + f.file_size, 0),
                  duration_seconds: 0,
                  content_by_type: {},
                  success_rate: 100,
                  average_page_size: 0
                },
                status: {
                  session_id: session.id,
                  status: session.status as 'running' | 'completed' | 'error' | 'stopped' | 'paused',
                  current_url: '',
                  pages_scraped: pages.length,
                  urls_found: 0,
                  external_urls_found: 0,
                  content_downloaded: files.length,
                  progress: session.status === 'completed' ? 100 : 0,
                  started_at: session.created_at || session.start_time || new Date().toISOString(),
                  ended_at: session.completed_at || session.end_time || undefined
                },
                created_at: session.created_at || session.start_time || new Date().toISOString(),
                updated_at: session.updated_at || session.last_updated || session.created_at || new Date().toISOString()
              }
            };
          } catch (error) {
            console.error(`❌ Failed to load content for session ${session.id}:`, error);
            return {
              id: session.id,
              config: {
                url: session.target_url || session.config?.url || `https://${session.domain || 'unknown.com'}`,
                max_pages: session.config?.max_pages || 10,
                delay: session.config?.delay || 1,
                content_types: session.config?.content_types || [],
                include_external: session.config?.include_external || false,
                scrape_whole_site: session.config?.scrape_whole_site || true,
                download_content: session.config?.download_content || true,
                user_agent: session.config?.user_agent || 'WebScraper/1.0'
              },
              status: {
                session_id: session.id,
                status: session.status as 'running' | 'completed' | 'error' | 'stopped' | 'paused',
                current_url: '',
                pages_scraped: 0,
                urls_found: 0,
                external_urls_found: 0,
                content_downloaded: 0,
                progress: 0,
                started_at: session.created_at || session.start_time || new Date().toISOString(),
                ended_at: session.completed_at || session.end_time || undefined
              },
              created_at: session.created_at || session.start_time || new Date().toISOString(),
              updated_at: session.updated_at || session.last_updated || session.created_at || new Date().toISOString(),
              result: {
                session_id: session.id,
                domain: session.domain || new URL(session.target_url || session.config?.url || 'https://unknown.com').hostname,
                urls: [],
                external_urls: [],
                scraped_content: [],
                page_contents: [],
                statistics: {
                  total_pages_scraped: 0,
                  total_urls_found: 0,
                  external_urls_found: 0,
                  content_downloaded: 0,
                  total_file_size: 0,
                  duration_seconds: 0,
                  content_by_type: {},
                  success_rate: 0,
                  average_page_size: 0
                },
                status: {
                  session_id: session.id,
                  status: session.status as 'running' | 'completed' | 'error' | 'stopped' | 'paused',
                  current_url: '',
                  pages_scraped: 0,
                  urls_found: 0,
                  external_urls_found: 0,
                  content_downloaded: 0,
                  progress: 0,
                  started_at: session.created_at || session.start_time || new Date().toISOString(),
                  ended_at: session.completed_at || session.end_time || undefined
                },
                created_at: session.created_at || session.start_time || new Date().toISOString(),
                updated_at: session.updated_at || session.last_updated || session.created_at || new Date().toISOString()
              }
            };
          }
        })
      );

      console.log(`✅ Loaded ${convertedSessions.length} sessions with content`);
      return convertedSessions;
    } catch (error) {
      console.error('❌ Failed to fetch sessions from Supabase:', error);
      return [];
    }
  }

  // Fetch session details with pages and files
  async getSessionDetails(sessionId: string): Promise<{
    session: ScrapeSession | null;
    pages: SupabasePage[];
    files: SupabaseFile[];
  }> {
    console.log(`🔍 Fetching details for session ${sessionId}...`);

    try {
      // Fetch session
      const sessions = await this.request<SupabaseSession[]>(
        `/scraping_sessions?id=eq.${sessionId}`
      );

      if (sessions.length === 0) {
        return { session: null, pages: [], files: [] };
      }

      const supabaseSession = sessions[0];

      // Fetch pages
      const pages = await this.request<SupabasePage[]>(
        `/scraped_pages?session_id=eq.${sessionId}&order=scraped_at.desc`
      );

      // Fetch files
      const files = await this.request<SupabaseFile[]>(
        `/stored_files?session_id=eq.${sessionId}&order=uploaded_at.desc`
      );

      // Convert session to frontend format with proper null handling
      const targetUrl = supabaseSession.target_url || supabaseSession.config?.url || `https://${supabaseSession.domain || 'unknown.com'}`;
      const createdAt = supabaseSession.created_at || supabaseSession.start_time || new Date().toISOString();
      const updatedAt = supabaseSession.updated_at || supabaseSession.last_updated || createdAt;
      const endedAt = supabaseSession.completed_at || supabaseSession.end_time || undefined;

      const session: ScrapeSession = {
        id: supabaseSession.id,
        config: {
          url: targetUrl,
          max_pages: supabaseSession.config?.max_pages || 10,
          delay: supabaseSession.config?.delay || 1,
          content_types: supabaseSession.config?.content_types || [],
          include_external: supabaseSession.config?.include_external || false,
          scrape_whole_site: supabaseSession.config?.scrape_whole_site || true,
          download_content: supabaseSession.config?.download_content || true,
          user_agent: supabaseSession.config?.user_agent || 'WebScraper/1.0'
        },
        status: {
          session_id: supabaseSession.id,
          status: supabaseSession.status as 'running' | 'completed' | 'error' | 'stopped' | 'paused',
          started_at: createdAt,
          ended_at: endedAt,
          pages_scraped: supabaseSession.progress?.pages_scraped || 0,
          urls_found: supabaseSession.progress?.urls_found || 0,
          external_urls_found: supabaseSession.progress?.external_urls_found || 0,
          content_downloaded: supabaseSession.progress?.content_downloaded || 0,
          progress: supabaseSession.status === 'completed' ? 100 : (supabaseSession.progress?.progress || 0),
          current_url: '',
          estimated_total_pages: supabaseSession.config?.max_pages || 0
        },
        created_at: createdAt,
        updated_at: updatedAt,
        result: {
          session_id: supabaseSession.id,
          domain: supabaseSession.domain || new URL(targetUrl).hostname,
          urls: [],
          external_urls: [],
          scraped_content: files.map(file => ({
            url: file.original_url || '',
            content_type: this.mapMimeTypeToContentType(file.mime_type),
            file_path: file.file_path,
            file_size: file.file_size,
            mime_type: file.mime_type,
            downloaded_at: file.uploaded_at || new Date().toISOString(),
            success: true
          })),
          page_contents: pages.map(page => ({
            url: page.url,
            title: page.title || '',
            html_content: page.html_content || '',
            text_content: page.text_content || page.content || '',
            headings: [],
            links: [],
            images: [],
            media_files: [],
            scraped_at: page.scraped_at || new Date().toISOString()
          })),
          statistics: {
            total_pages_scraped: supabaseSession.progress?.pages_scraped || 0,
            total_urls_found: supabaseSession.progress?.urls_found || 0,
            external_urls_found: supabaseSession.progress?.external_urls_found || 0,
            content_downloaded: supabaseSession.progress?.content_downloaded || 0,
            total_file_size: supabaseSession.progress?.total_file_size || 0,
            duration_seconds: 0,
            content_by_type: {},
            success_rate: 100,
            average_page_size: 0
          },
          status: {
            session_id: supabaseSession.id,
            status: supabaseSession.status as 'running' | 'completed' | 'error' | 'stopped' | 'paused',
            started_at: createdAt,
            ended_at: endedAt,
            pages_scraped: supabaseSession.progress?.pages_scraped || 0,
            urls_found: supabaseSession.progress?.urls_found || 0,
            external_urls_found: supabaseSession.progress?.external_urls_found || 0,
            content_downloaded: supabaseSession.progress?.content_downloaded || 0,
            progress: supabaseSession.status === 'completed' ? 100 : (supabaseSession.progress?.progress || 0),
            current_url: '',
            estimated_total_pages: supabaseSession.config?.max_pages || 0
          },
          created_at: createdAt,
          updated_at: updatedAt
        }
      };

      console.log(`✅ Loaded session with ${pages.length} pages and ${files.length} files`);

      return { session, pages, files };
    } catch (error) {
      console.error(`❌ Failed to fetch session details:`, error);
      return { session: null, pages: [], files: [] };
    }
  }

  // Fetch recent activity
  async getRecentActivity(limit: number = 10): Promise<{
    sessions: ScrapeSession[];
    totalPages: number;
    totalFiles: number;
  }> {
    console.log('🔍 Fetching recent activity...');

    try {
      // Get recent sessions
      const sessions = await this.getSessions();
      const recentSessions = sessions.slice(0, limit);

      // Count total pages and files
      const [pagesResult, filesResult] = await Promise.all([
        this.request<{ count: number }[]>('/scraped_pages?select=count'),
        this.request<{ count: number }[]>('/stored_files?select=count')
      ]);

      const totalPages = pagesResult[0]?.count || 0;
      const totalFiles = filesResult[0]?.count || 0;

      console.log(`✅ Recent activity: ${recentSessions.length} sessions, ${totalPages} pages, ${totalFiles} files`);

      return {
        sessions: recentSessions,
        totalPages,
        totalFiles
      };
    } catch (error) {
      console.error('❌ Failed to fetch recent activity:', error);
      return {
        sessions: [],
        totalPages: 0,
        totalFiles: 0
      };
    }
  }

  // Search sessions
  async searchSessions(query: string): Promise<ScrapeSession[]> {
    console.log(`🔍 Searching sessions for: ${query}`);

    try {
      const sessions = await this.request<SupabaseSession[]>(
        `/scraping_sessions?or=(domain.ilike.%${query}%,config->>url.ilike.%${query}%)&order=created_at.desc`
      );

      const convertedSessions: ScrapeSession[] = sessions.map(session => ({
        id: session.id,
        config: {
          url: session.target_url || session.config?.url || `https://${session.domain || 'unknown.com'}`,
          max_pages: session.config?.max_pages || 10,
          delay: session.config?.delay || 1,
          content_types: session.config?.content_types || [],
          include_external: session.config?.include_external || false,
          scrape_whole_site: session.config?.scrape_whole_site || true,
          download_content: session.config?.download_content || true,
          user_agent: session.config?.user_agent || 'WebScraper/1.0'
        },
        status: {
          session_id: session.id,
          status: session.status as 'running' | 'completed' | 'error' | 'stopped' | 'paused',
          current_url: '',
          pages_scraped: 0,
          urls_found: 0,
          external_urls_found: 0,
          content_downloaded: 0,
          progress: session.status === 'completed' ? 100 : 0,
          started_at: session.created_at || session.start_time || new Date().toISOString(),
          ended_at: session.completed_at || session.end_time || undefined
        },
        created_at: session.created_at || session.start_time || new Date().toISOString(),
        updated_at: session.updated_at || session.last_updated || session.created_at || new Date().toISOString()
      }));

      console.log(`✅ Found ${convertedSessions.length} matching sessions`);
      return convertedSessions;
    } catch (error) {
      console.error('❌ Failed to search sessions:', error);
      return [];
    }
  }

  // Get statistics
  async getStatistics(): Promise<{
    totalSessions: number;
    totalPages: number;
    totalFiles: number;
    totalFileSize: number;
    activeSessions: number;
  }> {
    console.log('📊 Fetching statistics...');

    try {
      const [sessionsResult, pagesResult, filesResult] = await Promise.all([
        this.request<SupabaseSession[]>('/scraping_sessions?select=id,status'),
        this.request<{ count: number }[]>('/scraped_pages?select=count'),
        this.request<SupabaseFile[]>('/stored_files?select=file_size')
      ]);

      const totalSessions = sessionsResult.length;
      const activeSessions = sessionsResult.filter(s => s.status === 'running').length;
      const totalPages = pagesResult[0]?.count || 0;
      const totalFiles = filesResult.length;
      const totalFileSize = filesResult.reduce((sum, file) => sum + file.file_size, 0);

      const stats = {
        totalSessions,
        totalPages,
        totalFiles,
        totalFileSize,
        activeSessions
      };

      console.log('✅ Statistics loaded:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Failed to fetch statistics:', error);
      return {
        totalSessions: 0,
        totalPages: 0,
        totalFiles: 0,
        totalFileSize: 0,
        activeSessions: 0
      };
    }
  }

  // Enhanced session management methods following realtime.md recommendations

  async getSession(sessionId: string): Promise<SupabaseSession | null> {
    try {
      console.log('📡 Fetching session from Supabase:', sessionId);

      const sessions = await this.request<SupabaseSession[]>(`/scraping_sessions?id=eq.${sessionId}`);

      if (sessions.length === 0) {
        console.log('ℹ️ Session not found in Supabase:', sessionId);
        return null;
      }

      console.log('✅ Fetched session from Supabase:', sessionId);
      return sessions[0];
    } catch (error) {
      console.error('❌ Failed to fetch session from Supabase:', error);
      return null;
    }
  }

  async upsertSession(sessionData: any): Promise<boolean> {
    try {
      console.log('📡 Upserting session to Supabase:', sessionData.id);
      console.log('📊 Session data being sent:', JSON.stringify(sessionData, null, 2));

      await this.request('/scraping_sessions', {
        method: 'POST',
        body: JSON.stringify(sessionData),
        headers: {
          'Prefer': 'resolution=merge-duplicates'
        }
      });

      console.log('✅ Session upserted to Supabase:', sessionData.id);
      return true;
    } catch (error) {
      console.error('❌ Failed to upsert session to Supabase:', error);
      console.error('❌ Session data that failed:', JSON.stringify(sessionData, null, 2));
      return false;
    }
  }

  async updateSessionProgress(sessionId: string, progress: any): Promise<boolean> {
    try {
      console.log('📡 Updating session progress in Supabase:', sessionId);

      await this.request(`/scraping_sessions?id=eq.${sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          progress: progress,
          last_updated: new Date().toISOString()
        })
      });

      console.log('✅ Session progress updated in Supabase:', sessionId);
      return true;
    } catch (error) {
      console.error('❌ Failed to update session progress in Supabase:', error);
      return false;
    }
  }

  async transitionSessionState(sessionId: string, newStatus: string, progressUpdate?: any): Promise<boolean> {
    try {
      console.log('📡 Transitioning session state in Supabase:', sessionId, newStatus);

      // Use the database function for state validation
      await this.request('/rpc/transition_session_state', {
        method: 'POST',
        body: JSON.stringify({
          session_id: sessionId,
          new_status: newStatus,
          progress_update: progressUpdate
        })
      });

      console.log('✅ Session state transitioned in Supabase:', sessionId, newStatus);
      return true;
    } catch (error) {
      console.error('❌ Failed to transition session state in Supabase:', error);
      return false;
    }
  }

  async checkpointSessionProgress(sessionId: string, progressData: any): Promise<boolean> {
    try {
      console.log('📡 Checkpointing session progress in Supabase:', sessionId);

      // Use the database function for progress checkpointing
      await this.request('/rpc/checkpoint_session_progress', {
        method: 'POST',
        body: JSON.stringify({
          session_id: sessionId,
          progress_data: progressData
        })
      });

      console.log('✅ Session progress checkpointed in Supabase:', sessionId);
      return true;
    } catch (error) {
      console.error('❌ Failed to checkpoint session progress in Supabase:', error);
      return false;
    }
  }

  async getInterruptedSessions(): Promise<SupabaseSession[]> {
    try {
      console.log('📡 Fetching interrupted sessions from Supabase...');

      const sessions = await this.request<SupabaseSession[]>(
        '/scraping_sessions?status=in.(interrupted,paused)&order=last_updated.desc'
      );

      console.log(`✅ Found ${sessions.length} interrupted sessions`);
      return sessions;
    } catch (error) {
      console.error('❌ Failed to fetch interrupted sessions:', error);
      return [];
    }
  }
}

// Create singleton instance
export const supabaseService = new SupabaseService();

// Export individual methods for convenience
export const {
  getSessions,
  getSessionDetails,
  getRecentActivity,
  searchSessions,
  getStatistics
} = supabaseService;
