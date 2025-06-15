/**
 * API Service for HTTP requests to the backend
 * 
 * This service handles all HTTP API calls to the backend server,
 * including session management, health checks, and data retrieval.
 */

import { ScrapeRequest, ScrapeResult, ScrapeStatus, SessionsResponse, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  private async fetchWithErrorHandling<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ API Response: ${endpoint}`, data);

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`❌ API Error: ${endpoint}`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<ApiResponse<{
    status: string;
    crawl4ai_available: boolean;
    active_sessions: number;
    completed_sessions: number;
  }>> {
    return this.fetchWithErrorHandling('/health');
  }

  /**
   * Get all sessions (active and completed)
   */
  async getSessions(): Promise<ApiResponse<SessionsResponse>> {
    return this.fetchWithErrorHandling('/api/scrape/sessions');
  }

  /**
   * Get session status by ID
   */
  async getSessionStatus(sessionId: string): Promise<ApiResponse<ScrapeStatus>> {
    return this.fetchWithErrorHandling(`/api/scrape/status/${sessionId}`);
  }

  /**
   * Get session result by ID
   */
  async getSessionResult(sessionId: string): Promise<ApiResponse<ScrapeResult>> {
    return this.fetchWithErrorHandling(`/api/scrape/result/${sessionId}`);
  }

  /**
   * Stop a running scraping session
   */
  async stopSession(sessionId: string): Promise<ApiResponse<{ message: string; session_id: string }>> {
    return this.fetchWithErrorHandling(`/api/scrape/stop/${sessionId}`, {
      method: 'POST',
    });
  }

  /**
   * Start a new scraping session (HTTP endpoint, not WebSocket)
   */
  async startSession(request: ScrapeRequest): Promise<ApiResponse<{ session_id: string; status: string }>> {
    return this.fetchWithErrorHandling('/api/scrape/start', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Download content file
   */
  async downloadFile(filePath: string): Promise<Blob | null> {
    try {
      const url = `${this.baseUrl}/downloads/${filePath}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error('❌ File download error:', error);
      return null;
    }
  }

  /**
   * Get file URL for direct access
   */
  getFileUrl(filePath: string): string {
    return `${this.baseUrl}/downloads/${filePath}`;
  }

  /**
   * Test API connectivity
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.healthCheck();
      return response.success;
    } catch {
      return false;
    }
  }

  /**
   * Get API base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Update API base URL
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export class for testing or multiple instances
export { ApiService };
