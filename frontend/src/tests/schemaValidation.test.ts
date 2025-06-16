// Schema Validation Tests - Check if data structures match Supabase schema

import { sessionManager } from '../services/sessionManager';
import type { ScrapeRequest } from '../types/api';

describe('Schema Validation Tests', () => {
  const mockRequest: ScrapeRequest = {
    url: 'https://example.com',
    max_pages: 10,
    delay: 1000,
    include_external: false,
    content_types: ['images', 'documents'],
    user_agent: 'test-agent'
  };

  describe('Enhanced Session Schema Validation', () => {
    test('should create session with correct schema structure', async () => {
      const session = await sessionManager.createSession(mockRequest);
      
      console.log('🔍 Created session structure:');
      console.log(JSON.stringify(session, null, 2));
      
      // Check required fields exist
      expect(session.id).toBeDefined();
      expect(session.user_id).toBeDefined();
      expect(session.start_time).toBeDefined();
      expect(session.status).toBeDefined();
      expect(session.target_url).toBeDefined();
      expect(session.config).toBeDefined();
      expect(session.progress).toBeDefined();
      expect(session.last_updated).toBeDefined();
      
      // Check field types
      expect(typeof session.id).toBe('string');
      expect(typeof session.user_id).toBe('string');
      expect(typeof session.start_time).toBe('string');
      expect(typeof session.status).toBe('string');
      expect(typeof session.target_url).toBe('string');
      expect(typeof session.config).toBe('object');
      expect(typeof session.progress).toBe('object');
      expect(typeof session.last_updated).toBe('string');
      
      // Check status enum values
      expect(['pending', 'running', 'completed', 'failed', 'paused', 'interrupted']).toContain(session.status);
    });

    test('should validate session data for Supabase insertion', async () => {
      const session = await sessionManager.createSession(mockRequest);
      
      // Get the data that would be sent to Supabase
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

      console.log('🔍 Session data for Supabase:');
      console.log(JSON.stringify(sessionData, null, 2));

      // Validate against expected Supabase schema
      expect(sessionData.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      expect(sessionData.user_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      expect(sessionData.start_time).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(sessionData.target_url).toMatch(/^https?:\/\//);
      expect(sessionData.last_updated).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      
      // Check JSONB fields are objects
      expect(typeof sessionData.config).toBe('object');
      expect(typeof sessionData.progress).toBe('object');
      expect(sessionData.summary_results === null || typeof sessionData.summary_results === 'object').toBe(true);
      expect(sessionData.statistics === null || typeof sessionData.statistics === 'object').toBe(true);
    });

    test('should identify schema mismatches', async () => {
      const session = await sessionManager.createSession(mockRequest);
      
      // Check for potential schema issues
      const issues: string[] = [];
      
      // Check for undefined values that might cause issues
      Object.entries(session).forEach(([key, value]) => {
        if (value === undefined) {
          issues.push(`Field '${key}' is undefined`);
        }
      });
      
      // Check for invalid date formats
      if (session.start_time && !session.start_time.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
        issues.push(`Invalid start_time format: ${session.start_time}`);
      }
      
      if (session.last_updated && !session.last_updated.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
        issues.push(`Invalid last_updated format: ${session.last_updated}`);
      }
      
      // Check for invalid UUID formats
      if (session.id && !session.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        issues.push(`Invalid UUID format for id: ${session.id}`);
      }
      
      if (session.user_id && !session.user_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        issues.push(`Invalid UUID format for user_id: ${session.user_id}`);
      }
      
      // Check for invalid status values
      const validStatuses = ['pending', 'running', 'completed', 'failed', 'paused', 'interrupted'];
      if (!validStatuses.includes(session.status)) {
        issues.push(`Invalid status value: ${session.status}`);
      }
      
      console.log('🔍 Schema validation issues found:');
      issues.forEach(issue => console.log(`❌ ${issue}`));
      
      // Log the issues but don't fail the test - we want to see what's wrong
      if (issues.length > 0) {
        console.warn(`Found ${issues.length} potential schema issues`);
      }
    });
  });

  describe('Progress Data Schema Validation', () => {
    test('should validate progress data structure', async () => {
      const session = await sessionManager.createSession(mockRequest);
      
      const progressData = {
        pages_scraped: 5,
        files_downloaded: 3,
        urls_found: 10,
        external_urls_found: 2,
        current_url: 'https://example.com/page1',
        errors_count: 0,
        last_checkpoint: new Date().toISOString()
      };
      
      await sessionManager.checkpointProgress(session.id, progressData);
      
      const updatedSession = sessionManager.getSession(session.id);
      
      console.log('🔍 Progress data structure:');
      console.log(JSON.stringify(updatedSession?.progress, null, 2));
      
      // Validate progress structure
      expect(updatedSession?.progress).toBeDefined();
      expect(typeof updatedSession?.progress.pages_scraped).toBe('number');
      expect(typeof updatedSession?.progress.files_downloaded).toBe('number');
      expect(typeof updatedSession?.progress.urls_found).toBe('number');
      expect(typeof updatedSession?.progress.errors_count).toBe('number');
      expect(typeof updatedSession?.progress.last_checkpoint).toBe('string');
    });
  });

  describe('Legacy Compatibility Validation', () => {
    test('should maintain backward compatibility with legacy session format', async () => {
      const session = await sessionManager.createSession(mockRequest);
      const legacySession = sessionManager['convertToLegacyFormat'](session);
      
      console.log('🔍 Legacy session structure:');
      console.log(JSON.stringify(legacySession, null, 2));
      
      // Check legacy format structure
      expect(legacySession.id).toBeDefined();
      expect(legacySession.config).toBeDefined();
      expect(legacySession.status).toBeDefined();
      expect(legacySession.domain).toBeDefined();
      expect(legacySession.created_at).toBeDefined();
      expect(legacySession.updated_at).toBeDefined();
      
      // Check status structure
      expect(legacySession.status.session_id).toBeDefined();
      expect(legacySession.status.status).toBeDefined();
      expect(legacySession.status.pages_scraped).toBeDefined();
      expect(legacySession.status.urls_found).toBeDefined();
    });
  });

  describe('Database Field Mapping Validation', () => {
    test('should check if all required database fields are present', async () => {
      const session = await sessionManager.createSession(mockRequest);
      
      // Expected database schema fields based on supabase-reset-and-setup.sql
      const requiredFields = [
        'id',
        'user_id', 
        'start_time',
        'status',
        'target_url',
        'config',
        'progress',
        'last_updated'
      ];
      
      const optionalFields = [
        'end_time',
        'summary_results',
        'domain',
        'statistics', 
        'created_at',
        'completed_at',
        'updated_at'
      ];
      
      console.log('🔍 Checking required fields:');
      requiredFields.forEach(field => {
        const hasField = session.hasOwnProperty(field) && session[field as keyof typeof session] !== undefined;
        console.log(`${hasField ? '✅' : '❌'} ${field}: ${hasField ? 'present' : 'missing'}`);
        expect(hasField).toBe(true);
      });
      
      console.log('🔍 Checking optional fields:');
      optionalFields.forEach(field => {
        const hasField = session.hasOwnProperty(field);
        console.log(`${hasField ? '✅' : '⚠️'} ${field}: ${hasField ? 'present' : 'not set'}`);
      });
    });
  });
});
