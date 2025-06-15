// API service for HTTP requests to the backend

import { 
  ApiResponse, 
  HealthCheckResponse, 
  SessionsResponse, 
  ScrapeStatus, 
  ScrapeResult 
} from '../types';
import { config, API_ENDPOINTS } from '../utils';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = config.API_BASE_URL;
  }

  // Generic request method with error handling
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
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
      
      return {
        success: true,
        data,
        message: 'Request successful',
      };
    } catch (error) {
      console.error('❌ API Request failed:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<HealthCheckResponse>> {
    return this.request<HealthCheckResponse>(API_ENDPOINTS.HEALTH);
  }

  // Get active and completed sessions
  async getSessions(): Promise<ApiResponse<SessionsResponse>> {
    return this.request<SessionsResponse>(API_ENDPOINTS.SESSIONS);
  }

  // Get session status
  async getSessionStatus(sessionId: string): Promise<ApiResponse<ScrapeStatus>> {
    return this.request<ScrapeStatus>(API_ENDPOINTS.STATUS(sessionId));
  }

  // Get session result
  async getSessionResult(sessionId: string): Promise<ApiResponse<ScrapeResult>> {
    return this.request<ScrapeResult>(API_ENDPOINTS.RESULT(sessionId));
  }

  // Stop scraping session
  async stopSession(sessionId: string): Promise<ApiResponse<{ message: string; session_id: string }>> {
    return this.request(API_ENDPOINTS.STOP(sessionId), {
      method: 'POST',
    });
  }

  // Download file
  async downloadFile(filePath: string): Promise<Blob | null> {
    try {
      const url = `${this.baseURL}/downloads/${filePath}`;
      console.log(`📥 Downloading file: ${url}`);

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('❌ File download failed:', error);
      return null;
    }
  }

  // Get file URL for direct access
  getFileUrl(filePath: string): string {
    return `${this.baseURL}/downloads/${filePath}`;
  }

  // Check if backend is available
  async isBackendAvailable(): Promise<boolean> {
    try {
      const response = await this.healthCheck();
      return response.success;
    } catch {
      return false;
    }
  }

  // Retry request with exponential backoff
  async retryRequest<T>(
    requestFn: () => Promise<ApiResponse<T>>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<ApiResponse<T>> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await requestFn();
        if (result.success) {
          return result;
        }
        lastError = new Error(result.error || 'Request failed');
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
      }

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`⏳ Retrying request in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Max retries exceeded',
    };
  }

  // Batch requests with concurrency control
  async batchRequests<T>(
    requests: (() => Promise<ApiResponse<T>>)[],
    concurrency: number = 3
  ): Promise<ApiResponse<T>[]> {
    const results: ApiResponse<T>[] = [];
    
    for (let i = 0; i < requests.length; i += concurrency) {
      const batch = requests.slice(i, i + concurrency);
      const batchResults = await Promise.all(batch.map(request => request()));
      results.push(...batchResults);
    }
    
    return results;
  }

  // Upload file (if needed for future features)
  async uploadFile(file: File, endpoint: string): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
        message: 'File uploaded successfully',
      };
    } catch (error) {
      console.error('❌ File upload failed:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  // Stream response for large data
  async streamResponse(
    endpoint: string,
    onChunk: (chunk: string) => void,
    options: RequestInit = {}
  ): Promise<void> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        onChunk(chunk);
      }
    } catch (error) {
      console.error('❌ Stream response failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Export individual methods for convenience
export const {
  healthCheck,
  getSessions,
  getSessionStatus,
  getSessionResult,
  stopSession,
  downloadFile,
  getFileUrl,
  isBackendAvailable,
} = apiService;
