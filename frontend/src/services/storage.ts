/**
 * Storage Service for Local Data Persistence
 * 
 * This service handles local storage operations including:
 * - Session data persistence
 * - User preferences
 * - Form data caching
 * - Application settings
 */

import { ScrapeRequest, ScrapeResult } from '../types';

export interface StorageKeys {
  SESSIONS: 'webscraper_sessions';
  FORM_DATA: 'webscraper_form_data';
  USER_PREFERENCES: 'webscraper_preferences';
  CONNECTION_STATS: 'webscraper_connection_stats';
  RECENT_URLS: 'webscraper_recent_urls';
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultMaxPages: number;
  defaultDelay: number;
  autoSaveFormData: boolean;
  showConnectionDetails: boolean;
  notificationsEnabled: boolean;
  defaultContentTypes: string[];
}

export interface ConnectionStats {
  totalConnections: number;
  totalReconnections: number;
  totalErrors: number;
  averageLatency: number;
  lastConnectedAt: string | null;
}

class StorageService {
  private readonly keys: StorageKeys = {
    SESSIONS: 'webscraper_sessions',
    FORM_DATA: 'webscraper_form_data',
    USER_PREFERENCES: 'webscraper_preferences',
    CONNECTION_STATS: 'webscraper_connection_stats',
    RECENT_URLS: 'webscraper_recent_urls',
  };

  /**
   * Generic storage operations
   */
  private setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      console.log(`💾 Stored data for key: ${key}`);
    } catch (error) {
      console.error(`❌ Failed to store data for key: ${key}`, error);
    }
  }

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`❌ Failed to retrieve data for key: ${key}`, error);
      return defaultValue;
    }
  }

  private removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
      console.log(`🗑️ Removed data for key: ${key}`);
    } catch (error) {
      console.error(`❌ Failed to remove data for key: ${key}`, error);
    }
  }

  /**
   * Session management
   */
  saveSessions(sessions: ScrapeResult[]): void {
    this.setItem(this.keys.SESSIONS, sessions);
  }

  getSessions(): ScrapeResult[] {
    return this.getItem<ScrapeResult[]>(this.keys.SESSIONS, []);
  }

  addSession(session: ScrapeResult): void {
    const sessions = this.getSessions();
    const updatedSessions = [session, ...sessions.slice(0, 49)]; // Keep last 50 sessions
    this.saveSessions(updatedSessions);
  }

  removeSession(sessionId: string): void {
    const sessions = this.getSessions();
    const filteredSessions = sessions.filter(s => s.session_id !== sessionId);
    this.saveSessions(filteredSessions);
  }

  clearSessions(): void {
    this.removeItem(this.keys.SESSIONS);
  }

  /**
   * Form data persistence
   */
  saveFormData(formData: ScrapeRequest): void {
    this.setItem(this.keys.FORM_DATA, formData);
  }

  getFormData(): ScrapeRequest | null {
    const defaultFormData: ScrapeRequest = {
      url: '',
      max_pages: 10,
      delay: 1.0,
      include_external: false,
      scrape_whole_site: false,
      download_content: true,
      content_types: [],
    };
    
    const stored = this.getItem<ScrapeRequest | null>(this.keys.FORM_DATA, null);
    return stored || defaultFormData;
  }

  clearFormData(): void {
    this.removeItem(this.keys.FORM_DATA);
  }

  /**
   * User preferences
   */
  savePreferences(preferences: Partial<UserPreferences>): void {
    const current = this.getPreferences();
    const updated = { ...current, ...preferences };
    this.setItem(this.keys.USER_PREFERENCES, updated);
  }

  getPreferences(): UserPreferences {
    const defaultPreferences: UserPreferences = {
      theme: 'system',
      defaultMaxPages: 10,
      defaultDelay: 1.0,
      autoSaveFormData: true,
      showConnectionDetails: false,
      notificationsEnabled: true,
      defaultContentTypes: ['images', 'pdfs'],
    };

    return this.getItem<UserPreferences>(this.keys.USER_PREFERENCES, defaultPreferences);
  }

  /**
   * Connection statistics
   */
  saveConnectionStats(stats: ConnectionStats): void {
    this.setItem(this.keys.CONNECTION_STATS, stats);
  }

  getConnectionStats(): ConnectionStats {
    const defaultStats: ConnectionStats = {
      totalConnections: 0,
      totalReconnections: 0,
      totalErrors: 0,
      averageLatency: 0,
      lastConnectedAt: null,
    };

    return this.getItem<ConnectionStats>(this.keys.CONNECTION_STATS, defaultStats);
  }

  /**
   * Recent URLs
   */
  addRecentUrl(url: string): void {
    const recentUrls = this.getRecentUrls();
    const updatedUrls = [url, ...recentUrls.filter(u => u !== url)].slice(0, 20); // Keep last 20 URLs
    this.setItem(this.keys.RECENT_URLS, updatedUrls);
  }

  getRecentUrls(): string[] {
    return this.getItem<string[]>(this.keys.RECENT_URLS, []);
  }

  clearRecentUrls(): void {
    this.removeItem(this.keys.RECENT_URLS);
  }

  /**
   * Utility methods
   */
  getStorageSize(): number {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  clearAllData(): void {
    Object.values(this.keys).forEach(key => {
      this.removeItem(key);
    });
  }

  exportData(): string {
    const data = {
      sessions: this.getSessions(),
      formData: this.getFormData(),
      preferences: this.getPreferences(),
      connectionStats: this.getConnectionStats(),
      recentUrls: this.getRecentUrls(),
      exportedAt: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.sessions) this.saveSessions(data.sessions);
      if (data.formData) this.saveFormData(data.formData);
      if (data.preferences) this.savePreferences(data.preferences);
      if (data.connectionStats) this.saveConnectionStats(data.connectionStats);
      if (data.recentUrls) this.setItem(this.keys.RECENT_URLS, data.recentUrls);
      
      console.log('✅ Data imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to import data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();

// Export class for testing
export { StorageService };
