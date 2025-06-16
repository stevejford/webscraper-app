// Enhanced Session Manager Tests following realtime.md recommendations

import { sessionManager, type EnhancedSession } from '../services/sessionManager';
import type { ScrapeRequest } from '../types/api';

// Mock dependencies
jest.mock('../services/supabase', () => ({
  supabaseService: {
    upsertSession: jest.fn().mockResolvedValue(true),
    getSession: jest.fn(),
    updateSessionProgress: jest.fn().mockResolvedValue(true),
    transitionSessionState: jest.fn().mockResolvedValue(true),
    checkpointSessionProgress: jest.fn().mockResolvedValue(true),
    getInterruptedSessions: jest.fn().mockResolvedValue([])
  }
}));

jest.mock('../services/storage', () => ({
  storageService: {
    addSession: jest.fn(),
    updateSession: jest.fn(),
    getSession: jest.fn(),
    saveLastSession: jest.fn()
  }
}));

describe('Enhanced Session Manager', () => {
  const mockRequest: ScrapeRequest = {
    url: 'https://example.com',
    max_pages: 10,
    delay: 1000,
    include_external: false,
    content_types: ['images', 'documents'],
    user_agent: 'test-agent'
  };

  beforeEach(() => {
    // Clear any existing sessions
    sessionManager['activeSessions'].clear();
    jest.clearAllMocks();
  });

  describe('Session Creation', () => {
    test('should create a new session with proper structure', async () => {
      const session = await sessionManager.createSession(mockRequest);

      expect(session).toMatchObject({
        id: expect.any(String),
        user_id: 'anonymous',
        status: 'pending',
        target_url: 'https://example.com',
        config: expect.objectContaining({
          url: 'https://example.com',
          max_pages: 10,
          delay: 1000
        }),
        progress: expect.objectContaining({
          pages_scraped: 0,
          files_downloaded: 0,
          urls_found: 0,
          errors_count: 0
        })
      });

      expect(session.start_time).toBeDefined();
      expect(session.last_updated).toBeDefined();
    });

    test('should store session in active sessions map', async () => {
      const session = await sessionManager.createSession(mockRequest);
      const retrievedSession = sessionManager.getSession(session.id);

      expect(retrievedSession).toEqual(session);
    });
  });

  describe('State Transitions', () => {
    let session: EnhancedSession;

    beforeEach(async () => {
      session = await sessionManager.createSession(mockRequest);
    });

    test('should allow valid state transitions', async () => {
      // pending -> running
      const result1 = await sessionManager.transitionSessionState(session.id, 'running');
      expect(result1).toBe(true);

      // running -> completed
      const result2 = await sessionManager.transitionSessionState(session.id, 'completed');
      expect(result2).toBe(true);
    });

    test('should reject invalid state transitions', async () => {
      // pending -> completed (invalid)
      const result = await sessionManager.transitionSessionState(session.id, 'completed');
      expect(result).toBe(false);
    });

    test('should update session timestamps on state transition', async () => {
      const originalTimestamp = session.last_updated;
      
      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));
      
      await sessionManager.transitionSessionState(session.id, 'running');
      
      const updatedSession = sessionManager.getSession(session.id);
      expect(updatedSession?.last_updated).not.toBe(originalTimestamp);
    });

    test('should set end_time for terminal states', async () => {
      await sessionManager.transitionSessionState(session.id, 'running');
      await sessionManager.transitionSessionState(session.id, 'completed');
      
      const completedSession = sessionManager.getSession(session.id);
      expect(completedSession?.end_time).toBeDefined();
    });
  });

  describe('Progress Checkpointing', () => {
    let session: EnhancedSession;

    beforeEach(async () => {
      session = await sessionManager.createSession(mockRequest);
    });

    test('should update progress data', async () => {
      const progressUpdate = {
        pages_scraped: 5,
        files_downloaded: 3,
        current_url: 'https://example.com/page1'
      };

      await sessionManager.checkpointProgress(session.id, progressUpdate);
      
      const updatedSession = sessionManager.getSession(session.id);
      expect(updatedSession?.progress).toMatchObject(progressUpdate);
    });

    test('should update last_checkpoint timestamp', async () => {
      const originalCheckpoint = session.progress.last_checkpoint;
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      await sessionManager.checkpointProgress(session.id, { pages_scraped: 1 });
      
      const updatedSession = sessionManager.getSession(session.id);
      expect(updatedSession?.progress.last_checkpoint).not.toBe(originalCheckpoint);
    });
  });

  describe('Session Resumption', () => {
    test('should resume interrupted session', async () => {
      // Create and interrupt a session
      const session = await sessionManager.createSession(mockRequest);
      await sessionManager.transitionSessionState(session.id, 'running');
      await sessionManager.transitionSessionState(session.id, 'interrupted');

      // Resume the session
      const resumedSession = await sessionManager.resumeSession(session.id);
      
      expect(resumedSession).toBeDefined();
      expect(resumedSession?.status).toBe('running');
    });

    test('should not resume completed session', async () => {
      // Create and complete a session
      const session = await sessionManager.createSession(mockRequest);
      await sessionManager.transitionSessionState(session.id, 'running');
      await sessionManager.transitionSessionState(session.id, 'completed');

      // Try to resume
      const resumedSession = await sessionManager.resumeSession(session.id);
      
      expect(resumedSession).toBeNull();
    });

    test('should handle non-existent session gracefully', async () => {
      const resumedSession = await sessionManager.resumeSession('non-existent-id');
      expect(resumedSession).toBeNull();
    });
  });

  describe('Session Cleanup', () => {
    test('should clean up completed sessions', async () => {
      const session = await sessionManager.createSession(mockRequest);
      await sessionManager.transitionSessionState(session.id, 'running');
      await sessionManager.transitionSessionState(session.id, 'completed');

      await sessionManager.cleanupSession(session.id);
      
      const retrievedSession = sessionManager.getSession(session.id);
      expect(retrievedSession).toBeNull();
    });

    test('should not clean up active sessions', async () => {
      const session = await sessionManager.createSession(mockRequest);
      await sessionManager.transitionSessionState(session.id, 'running');

      await sessionManager.cleanupSession(session.id);
      
      const retrievedSession = sessionManager.getSession(session.id);
      expect(retrievedSession).toBeDefined();
    });
  });

  describe('Legacy Compatibility', () => {
    test('should convert to legacy format correctly', async () => {
      const session = await sessionManager.createSession(mockRequest);
      const legacySession = sessionManager['convertToLegacyFormat'](session);

      expect(legacySession).toMatchObject({
        id: session.id,
        config: session.config,
        status: expect.objectContaining({
          session_id: session.id,
          status: session.status,
          pages_scraped: session.progress.pages_scraped,
          urls_found: session.progress.urls_found
        }),
        domain: expect.any(String),
        created_at: session.created_at,
        updated_at: session.last_updated
      });
    });

    test('should convert from legacy format correctly', async () => {
      const session = await sessionManager.createSession(mockRequest);
      const legacySession = sessionManager['convertToLegacyFormat'](session);
      const convertedBack = sessionManager['convertFromLegacyFormat'](legacySession);

      expect(convertedBack.id).toBe(session.id);
      expect(convertedBack.target_url).toBe(session.target_url);
      expect(convertedBack.progress.pages_scraped).toBe(session.progress.pages_scraped);
    });
  });

  describe('Error Handling', () => {
    test('should handle database errors gracefully', async () => {
      // Mock database error
      const { supabaseService } = require('../services/supabase');
      supabaseService.upsertSession.mockRejectedValueOnce(new Error('Database error'));

      // Should still create session in memory even if database fails
      const session = await sessionManager.createSession(mockRequest);
      expect(session).toBeDefined();
      expect(sessionManager.getSession(session.id)).toBeDefined();
    });

    test('should handle invalid session IDs', async () => {
      const result = await sessionManager.transitionSessionState('invalid-id', 'running');
      expect(result).toBe(false);
    });
  });
});
