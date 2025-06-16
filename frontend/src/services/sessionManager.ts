// Enhanced Session Manager following realtime.md recommendations
// Implements robust session lifecycle management, state persistence, and resumption

import type { ScrapeSession, ScrapeRequest, ScrapeStatus } from '../types/api';
import { supabaseService } from './supabase';
import { storageService } from './storage';

export interface SessionProgress {
  pages_scraped: number;
  files_downloaded: number;
  urls_found: number;
  external_urls_found: number;
  current_url?: string;
  errors_count: number;
  last_checkpoint: string;
  discovered_urls?: string[];
  retry_counts?: Record<string, number>;
}

export interface SessionConfig {
  url: string;
  max_pages: number;
  delay: number;
  user_agent?: string;
  include_external: boolean;
  content_types: string[];
  depth?: number;
  concurrency?: number;
  selectors?: Record<string, string>;
}

export interface EnhancedSession {
  id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused' | 'interrupted';
  target_url: string;
  config: SessionConfig;
  progress: SessionProgress;
  summary_results?: Record<string, any>;
  last_updated: string;
  // Legacy compatibility
  domain?: string;
  statistics?: Record<string, any>;
  created_at?: string;
  completed_at?: string;
}

export class SessionManager {
  private static instance: SessionManager;
  private activeSessions = new Map<string, EnhancedSession>();
  private checkpointInterval = 5000; // 5 seconds

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Create a new session following realtime.md recommendations
   */
  async createSession(request: ScrapeRequest): Promise<EnhancedSession> {
    const sessionId = crypto.randomUUID();
    const now = new Date().toISOString();

    const session: EnhancedSession = {
      id: sessionId,
      user_id: 'anonymous', // TODO: Replace with actual user ID when auth is implemented
      start_time: now,
      status: 'pending',
      target_url: request.url,
      config: {
        url: request.url,
        max_pages: request.max_pages || 10,
        delay: request.delay || 1000,
        user_agent: request.user_agent,
        include_external: request.include_external || false,
        content_types: request.content_types || ['images', 'documents'],
        depth: request.depth || 3,
        concurrency: 1, // Start with single-threaded
        selectors: request.selectors || {}
      },
      progress: {
        pages_scraped: 0,
        files_downloaded: 0,
        urls_found: 0,
        external_urls_found: 0,
        errors_count: 0,
        last_checkpoint: now,
        discovered_urls: [],
        retry_counts: {}
      },
      last_updated: now,
      // Legacy compatibility
      domain: new URL(request.url).hostname,
      statistics: {
        pages_scraped: 0,
        urls_found: 0,
        content_downloaded: 0,
        total_file_size: 0
      },
      created_at: now
    };

    // Store in memory
    this.activeSessions.set(sessionId, session);

    // Persist to database
    await this.persistSession(session);

    // Save to local storage for recovery
    storageService.addSession(this.convertToLegacyFormat(session));

    console.log('✅ Session created:', sessionId);
    return session;
  }

  /**
   * Transition session state with validation
   */
  async transitionSessionState(
    sessionId: string, 
    newStatus: EnhancedSession['status'],
    progressUpdate?: Partial<SessionProgress>
  ): Promise<boolean> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      console.error('Session not found:', sessionId);
      return false;
    }

    // Validate state transition
    if (!this.isValidTransition(session.status, newStatus)) {
      console.error(`Invalid state transition from ${session.status} to ${newStatus}`);
      return false;
    }

    // Update session
    session.status = newStatus;
    session.last_updated = new Date().toISOString();
    
    if (progressUpdate) {
      session.progress = { ...session.progress, ...progressUpdate };
    }

    if (newStatus === 'completed' || newStatus === 'failed') {
      session.end_time = new Date().toISOString();
      session.completed_at = session.end_time;
    }

    // Persist changes
    await this.persistSession(session);
    
    console.log(`✅ Session ${sessionId} transitioned to ${newStatus}`);
    return true;
  }

  /**
   * Checkpoint session progress for resumption
   */
  async checkpointProgress(sessionId: string, progress: Partial<SessionProgress>): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    // Update progress with checkpoint timestamp
    session.progress = {
      ...session.progress,
      ...progress,
      last_checkpoint: new Date().toISOString()
    };
    session.last_updated = new Date().toISOString();

    // Persist to database
    await this.persistSession(session);

    // Update local storage
    storageService.updateSession(sessionId, this.convertToLegacyFormat(session));
  }

  /**
   * Resume interrupted session
   */
  async resumeSession(sessionId: string): Promise<EnhancedSession | null> {
    try {
      // Try to load from database first
      let session = await this.loadSessionFromDatabase(sessionId);
      
      if (!session) {
        // Fallback to local storage
        const legacySession = storageService.getSession(sessionId);
        if (legacySession) {
          session = this.convertFromLegacyFormat(legacySession);
        }
      }

      if (!session) {
        console.error('Session not found for resumption:', sessionId);
        return null;
      }

      // Only resume if session was interrupted or paused
      if (session.status !== 'interrupted' && session.status !== 'paused') {
        console.error('Session cannot be resumed from status:', session.status);
        return null;
      }

      // Transition to running state
      await this.transitionSessionState(sessionId, 'running');
      
      // Add to active sessions
      this.activeSessions.set(sessionId, session);

      console.log('✅ Session resumed:', sessionId);
      return session;
    } catch (error) {
      console.error('Failed to resume session:', error);
      return null;
    }
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): EnhancedSession | null {
    return this.activeSessions.get(sessionId) || null;
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): EnhancedSession[] {
    return Array.from(this.activeSessions.values());
  }

  /**
   * Clean up completed or failed sessions
   */
  async cleanupSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (session && (session.status === 'completed' || session.status === 'failed')) {
      this.activeSessions.delete(sessionId);
      console.log('✅ Session cleaned up:', sessionId);
    }
  }

  /**
   * Validate state transitions
   */
  private isValidTransition(currentStatus: string, newStatus: string): boolean {
    const validTransitions: Record<string, string[]> = {
      'pending': ['running', 'failed'],
      'running': ['completed', 'failed', 'paused', 'interrupted'],
      'paused': ['running', 'failed', 'completed'],
      'interrupted': ['running', 'failed'],
      'completed': [], // No transitions from completed
      'failed': ['running'] // Allow retry
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  /**
   * Persist session to database
   */
  private async persistSession(session: EnhancedSession): Promise<void> {
    try {
      // Use the enhanced schema structure
      const sessionData = {
        id: session.id,
        user_id: session.user_id,
        start_time: session.start_time,
        end_time: session.end_time,
        status: session.status,
        target_url: session.target_url,
        config: session.config,
        progress: session.progress,
        summary_results: session.summary_results,
        last_updated: session.last_updated,
        // Legacy compatibility
        domain: session.domain,
        statistics: session.statistics,
        created_at: session.created_at,
        completed_at: session.completed_at
      };

      await supabaseService.upsertSession(sessionData);
    } catch (error) {
      console.error('Failed to persist session:', error);
    }
  }

  /**
   * Load session from database
   */
  private async loadSessionFromDatabase(sessionId: string): Promise<EnhancedSession | null> {
    try {
      const sessionData = await supabaseService.getSession(sessionId);
      return sessionData ? this.convertFromDatabaseFormat(sessionData) : null;
    } catch (error) {
      console.error('Failed to load session from database:', error);
      return null;
    }
  }

  /**
   * Convert to legacy format for backward compatibility
   */
  private convertToLegacyFormat(session: EnhancedSession): ScrapeSession {
    return {
      id: session.id,
      config: session.config as any,
      status: {
        session_id: session.id,
        status: session.status as any,
        pages_scraped: session.progress.pages_scraped,
        urls_found: session.progress.urls_found,
        external_urls_found: session.progress.external_urls_found,
        content_downloaded: session.progress.files_downloaded,
        progress: Math.min(100, (session.progress.pages_scraped / (session.config.max_pages || 10)) * 100),
        started_at: session.start_time,
        completed_at: session.end_time
      },
      domain: session.domain || new URL(session.target_url).hostname,
      created_at: session.created_at || session.start_time,
      updated_at: session.last_updated
    };
  }

  /**
   * Convert from legacy format
   */
  private convertFromLegacyFormat(legacySession: ScrapeSession): EnhancedSession {
    return {
      id: legacySession.id,
      user_id: 'anonymous',
      start_time: legacySession.status.started_at || legacySession.created_at,
      end_time: legacySession.status.completed_at,
      status: this.mapLegacyStatus(legacySession.status.status),
      target_url: legacySession.config.url,
      config: legacySession.config as SessionConfig,
      progress: {
        pages_scraped: legacySession.status.pages_scraped,
        files_downloaded: legacySession.status.content_downloaded,
        urls_found: legacySession.status.urls_found,
        external_urls_found: legacySession.status.external_urls_found || 0,
        errors_count: 0,
        last_checkpoint: legacySession.updated_at
      },
      last_updated: legacySession.updated_at,
      domain: legacySession.domain,
      statistics: {
        pages_scraped: legacySession.status.pages_scraped,
        urls_found: legacySession.status.urls_found,
        content_downloaded: legacySession.status.content_downloaded,
        total_file_size: 0
      },
      created_at: legacySession.created_at,
      completed_at: legacySession.status.completed_at
    };
  }

  /**
   * Convert from database format
   */
  private convertFromDatabaseFormat(dbSession: any): EnhancedSession {
    return {
      id: dbSession.id,
      user_id: dbSession.user_id,
      start_time: dbSession.start_time || dbSession.created_at,
      end_time: dbSession.end_time || dbSession.completed_at,
      status: dbSession.status,
      target_url: dbSession.target_url || dbSession.config?.url,
      config: dbSession.config,
      progress: dbSession.progress || {},
      summary_results: dbSession.summary_results,
      last_updated: dbSession.last_updated || dbSession.updated_at,
      domain: dbSession.domain,
      statistics: dbSession.statistics,
      created_at: dbSession.created_at,
      completed_at: dbSession.completed_at
    };
  }

  /**
   * Map legacy status to enhanced status
   */
  private mapLegacyStatus(legacyStatus: string): EnhancedSession['status'] {
    const statusMap: Record<string, EnhancedSession['status']> = {
      'starting': 'pending',
      'running': 'running',
      'completed': 'completed',
      'error': 'failed',
      'stopped': 'failed'
    };
    return statusMap[legacyStatus] || 'failed';
  }
}

// Export singleton instance
export const sessionManager = SessionManager.getInstance();
