// Storage service for data persistence

import type { ScrapeSession, ScrapeRequest } from '../types/api';
import type { Theme } from '../types/ui';
import { STORAGE_KEYS, LIMITS } from '../utils';

class StorageService {
  // Generic storage methods
  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('❌ Failed to save to localStorage:', error);
    }
  }

  private getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('❌ Failed to read from localStorage:', error);
      return defaultValue || null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('❌ Failed to remove from localStorage:', error);
    }
  }

  // Theme persistence
  saveTheme(theme: Theme): void {
    this.setItem(STORAGE_KEYS.THEME, theme);
  }

  getTheme(): Theme {
    return this.getItem<Theme>(STORAGE_KEYS.THEME, 'system') || 'system';
  }

  // Form data persistence
  saveFormData(formData: Partial<ScrapeRequest>): void {
    this.setItem(STORAGE_KEYS.FORM_DATA, formData);
  }

  getFormData(): Partial<ScrapeRequest> | null {
    return this.getItem<Partial<ScrapeRequest>>(STORAGE_KEYS.FORM_DATA);
  }

  clearFormData(): void {
    this.removeItem(STORAGE_KEYS.FORM_DATA);
  }

  // Session persistence
  saveSessions(sessions: ScrapeSession[]): void {
    // Limit the number of stored sessions
    const limitedSessions = sessions.slice(0, LIMITS.MAX_SESSIONS);
    this.setItem(STORAGE_KEYS.SESSIONS, limitedSessions);
  }

  getSessions(): ScrapeSession[] {
    return this.getItem<ScrapeSession[]>(STORAGE_KEYS.SESSIONS, []) || [];
  }

  addSession(session: ScrapeSession): void {
    const sessions = this.getSessions();
    const updatedSessions = [session, ...sessions.slice(0, LIMITS.MAX_SESSIONS - 1)];
    this.saveSessions(updatedSessions);
  }

  updateSession(sessionId: string, updates: Partial<ScrapeSession>): void {
    const sessions = this.getSessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex !== -1) {
      sessions[sessionIndex] = { ...sessions[sessionIndex], ...updates };
      this.saveSessions(sessions);
    }
  }

  removeSession(sessionId: string): void {
    const sessions = this.getSessions();
    const filteredSessions = sessions.filter(s => s.id !== sessionId);
    this.saveSessions(filteredSessions);
  }

  getSession(sessionId: string): ScrapeSession | null {
    const sessions = this.getSessions();
    return sessions.find(s => s.id === sessionId) || null;
  }

  // Last session tracking
  saveLastSession(sessionId: string): void {
    this.setItem(STORAGE_KEYS.LAST_SESSION, sessionId);
  }

  getLastSession(): string | null {
    return this.getItem<string>(STORAGE_KEYS.LAST_SESSION);
  }

  // Sidebar state persistence
  saveSidebarState(isOpen: boolean): void {
    this.setItem(STORAGE_KEYS.SIDEBAR_STATE, { isOpen });
  }

  getSidebarState(): { isOpen: boolean } {
    return this.getItem(STORAGE_KEYS.SIDEBAR_STATE, { isOpen: true }) || { isOpen: true };
  }

  // Settings persistence
  saveSettings(settings: Record<string, any>): void {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  getSettings(): Record<string, any> {
    return this.getItem(STORAGE_KEYS.SETTINGS, {}) || {};
  }

  updateSetting(key: string, value: any): void {
    const settings = this.getSettings();
    settings[key] = value;
    this.saveSettings(settings);
  }

  getSetting(key: string, defaultValue?: any): any {
    const settings = this.getSettings();
    return settings[key] !== undefined ? settings[key] : defaultValue;
  }

  // Export data
  exportData(): string {
    const data = {
      theme: this.getTheme(),
      formData: this.getFormData(),
      sessions: this.getSessions(),
      settings: this.getSettings(),
      sidebarState: this.getSidebarState(),
      exportedAt: new Date().toISOString(),
    };
    
    return JSON.stringify(data, null, 2);
  }

  // Import data
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.theme) this.saveTheme(data.theme);
      if (data.formData) this.saveFormData(data.formData);
      if (data.sessions) this.saveSessions(data.sessions);
      if (data.settings) this.saveSettings(data.settings);
      if (data.sidebarState) this.saveSidebarState(data.sidebarState.isOpen);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to import data:', error);
      return false;
    }
  }

  // Clear all data
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      this.removeItem(key);
    });
  }

  // Get storage usage info
  getStorageInfo(): { used: number; available: number; percentage: number } {
    try {
      let used = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }
      
      // Estimate available space (most browsers have ~5-10MB limit)
      const estimated = 5 * 1024 * 1024; // 5MB
      const available = estimated - used;
      const percentage = (used / estimated) * 100;
      
      return { used, available, percentage };
    } catch (error) {
      console.error('❌ Failed to get storage info:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  // Check if storage is available
  isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // Cleanup old sessions
  cleanupOldSessions(maxAge: number = 7 * 24 * 60 * 60 * 1000): void {
    const sessions = this.getSessions();
    const now = Date.now();
    
    const validSessions = sessions.filter(session => {
      const sessionAge = now - new Date(session.created_at).getTime();
      return sessionAge < maxAge;
    });
    
    if (validSessions.length !== sessions.length) {
      console.log(`🧹 Cleaned up ${sessions.length - validSessions.length} old sessions`);
      this.saveSessions(validSessions);
    }
  }

  // Backup data to file
  backupToFile(): void {
    const data = this.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `webscraper-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  // Restore data from file
  async restoreFromFile(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      return this.importData(text);
    } catch (error) {
      console.error('❌ Failed to restore from file:', error);
      return false;
    }
  }
}

// Create singleton instance
export const storageService = new StorageService();

// Export individual methods for convenience
export const {
  saveTheme,
  getTheme,
  saveFormData,
  getFormData,
  clearFormData,
  saveSessions,
  getSessions,
  addSession,
  updateSession,
  removeSession,
  getSession,
  saveLastSession,
  getLastSession,
  saveSidebarState,
  getSidebarState,
  saveSettings,
  getSettings,
  updateSetting,
  getSetting,
  exportData,
  importData,
  clearAllData,
  getStorageInfo,
  isStorageAvailable,
  cleanupOldSessions,
  backupToFile,
  restoreFromFile,
} = storageService;
