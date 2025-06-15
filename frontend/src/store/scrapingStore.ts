// Scraping state management with Zustand

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type {
  ScrapeSession,
  ScrapeRequest,
  ScrapeStatus,
  ScrapeResult,
  ScrapedContent,
  ConnectionState,
  ContentType
} from '../types';
import { DEFAULT_CONTENT_TYPES } from '../utils';
import { storageService } from '../services';

interface ScrapingState {
  // Current session
  currentSession: ScrapeSession | null;
  isSubmitting: boolean;
  
  // Connection state
  connectionState: ConnectionState;
  
  // Form data
  formData: ScrapeRequest;
  formErrors: Record<string, string>;
  
  // Session history
  sessions: ScrapeSession[];
  
  // Content management
  selectedContent: ScrapedContent[];
  contentFilters: {
    search: string;
    type: string;
    status: 'all' | 'success' | 'error';
  };
  
  // UI state
  activeTab: string;
  viewMode: 'grid' | 'list';
  
  // Actions
  setCurrentSession: (session: ScrapeSession | null) => void;
  setIsSubmitting: (submitting: boolean) => void;
  setConnectionState: (state: ConnectionState) => void;
  
  // Form actions
  updateFormData: (data: Partial<ScrapeRequest>) => void;
  setFormErrors: (errors: Record<string, string>) => void;
  resetForm: () => void;
  
  // Session actions
  addSession: (session: ScrapeSession) => void;
  updateSession: (sessionId: string, updates: Partial<ScrapeSession>) => void;
  removeSession: (sessionId: string) => void;
  loadSessions: () => void;
  
  // Status and content actions
  updateSessionStatus: (status: ScrapeStatus) => void;
  addContentItem: (content: ScrapedContent) => void;
  completeSession: (result: ScrapeResult) => void;
  
  // Content management actions
  setSelectedContent: (content: ScrapedContent[]) => void;
  updateContentFilters: (filters: Partial<typeof contentFilters>) => void;
  
  // UI actions
  setActiveTab: (tab: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
}

const defaultFormData: ScrapeRequest = {
  url: '',
  max_pages: 10,
  delay: 1.0,
  user_agent: '',
  include_external: false,
  scrape_whole_site: false,
  download_content: true,
  content_types: DEFAULT_CONTENT_TYPES,
  depth_limit: 3,
  respect_robots: true,
};

export const useScrapingStore = create<ScrapingState>()(
  immer((set, get) => ({
    // Initial state
    currentSession: null,
    isSubmitting: false,
    
    connectionState: {
      status: 'disconnected',
      reconnectAttempts: 0,
    },
    
    formData: { ...defaultFormData },
    formErrors: {},
    
    sessions: [],
    
    selectedContent: [],
    contentFilters: {
      search: '',
      type: 'all',
      status: 'all',
    },
    
    activeTab: 'stats',
    viewMode: 'grid',
    
    // Session management
    setCurrentSession: (session) => set((state) => {
      state.currentSession = session;
      if (session) {
        storageService.saveLastSession(session.id);
      }
    }),
    
    setIsSubmitting: (submitting) => set((state) => {
      state.isSubmitting = submitting;
    }),
    
    setConnectionState: (connectionState) => set((state) => {
      state.connectionState = connectionState;
    }),
    
    // Form management
    updateFormData: (data) => set((state) => {
      state.formData = { ...state.formData, ...data };
      // Save to localStorage
      storageService.saveFormData(state.formData);
    }),
    
    setFormErrors: (errors) => set((state) => {
      state.formErrors = errors;
    }),
    
    resetForm: () => set((state) => {
      state.formData = { ...defaultFormData };
      state.formErrors = {};
      storageService.clearFormData();
    }),
    
    // Session history management
    addSession: (session) => set((state) => {
      state.sessions = [session, ...state.sessions.slice(0, 9)]; // Keep last 10
      storageService.addSession(session);
    }),
    
    updateSession: (sessionId, updates) => set((state) => {
      const sessionIndex = state.sessions.findIndex(s => s.id === sessionId);
      if (sessionIndex !== -1) {
        state.sessions[sessionIndex] = { ...state.sessions[sessionIndex], ...updates };
        storageService.updateSession(sessionId, updates);
      }
      
      // Update current session if it matches
      if (state.currentSession?.id === sessionId) {
        state.currentSession = { ...state.currentSession, ...updates };
      }
    }),
    
    removeSession: (sessionId) => set((state) => {
      state.sessions = state.sessions.filter(s => s.id !== sessionId);
      storageService.removeSession(sessionId);
      
      // Clear current session if it matches
      if (state.currentSession?.id === sessionId) {
        state.currentSession = null;
      }
    }),
    
    loadSessions: () => set((state) => {
      const savedSessions = storageService.getSessions();
      state.sessions = savedSessions;
      
      // Load last session if available
      const lastSessionId = storageService.getLastSession();
      if (lastSessionId) {
        const lastSession = savedSessions.find(s => s.id === lastSessionId);
        if (lastSession) {
          state.currentSession = lastSession;
        }
      }
      
      // Load saved form data
      const savedFormData = storageService.getFormData();
      if (savedFormData) {
        state.formData = { ...defaultFormData, ...savedFormData };
      }
    }),
    
    // Real-time updates
    updateSessionStatus: (status) => set((state) => {
      if (state.currentSession) {
        state.currentSession.status = status;
        state.currentSession.updated_at = new Date().toISOString();

        // CRITICAL FIX: Also update the result.status if result exists
        if (state.currentSession.result) {
          state.currentSession.result.status = status;
        } else {
          // Create a minimal result object if it doesn't exist yet
          state.currentSession.result = {
            session_id: status.session_id,
            domain: '',
            urls: [],
            external_urls: [],
            scraped_content: [],
            page_contents: [],
            statistics: {
              total_pages_scraped: status.pages_scraped,
              total_urls_found: status.urls_found,
              external_urls_found: status.external_urls_found,
              content_downloaded: status.content_downloaded,
              total_file_size: 0,
              duration_seconds: 0,
              content_by_type: {},
              success_rate: 0,
              average_page_size: 0,
            },
            status: status,
            created_at: state.currentSession.created_at,
            updated_at: new Date().toISOString(),
          };
        }

        // Update in sessions list
        const sessionIndex = state.sessions.findIndex(s => s.id === status.session_id);
        if (sessionIndex !== -1) {
          state.sessions[sessionIndex].status = status;
          state.sessions[sessionIndex].updated_at = new Date().toISOString();
          if (state.sessions[sessionIndex].result) {
            state.sessions[sessionIndex].result!.status = status;
          }
        }

        // Save to storage
        storageService.updateSession(status.session_id, {
          status,
          result: state.currentSession.result,
          updated_at: new Date().toISOString(),
        });
      }
    }),
    
    addContentItem: (content) => set((state) => {
      if (state.currentSession?.result) {
        state.currentSession.result.scraped_content.push(content);
        state.currentSession.updated_at = new Date().toISOString();
        
        // Update statistics
        if (content.success) {
          state.currentSession.result.statistics.content_downloaded++;
          if (content.file_size) {
            state.currentSession.result.statistics.total_file_size += content.file_size;
          }
          
          // Update content by type
          const contentType = content.content_type;
          if (!state.currentSession.result.statistics.content_by_type[contentType]) {
            state.currentSession.result.statistics.content_by_type[contentType] = 0;
          }
          state.currentSession.result.statistics.content_by_type[contentType]++;
        }
        
        // Save to storage
        storageService.updateSession(state.currentSession.id, {
          result: state.currentSession.result,
          updated_at: new Date().toISOString(),
        });
      }
    }),
    
    completeSession: (result) => set((state) => {
      if (state.currentSession) {
        state.currentSession.result = result;
        state.currentSession.status = result.status;
        state.currentSession.updated_at = new Date().toISOString();
        
        // Update in sessions list
        const sessionIndex = state.sessions.findIndex(s => s.id === result.session_id);
        if (sessionIndex !== -1) {
          state.sessions[sessionIndex] = { ...state.currentSession };
        } else {
          // Add to sessions if not found
          state.sessions.unshift(state.currentSession);
        }
        
        // Save to storage
        storageService.updateSession(result.session_id, {
          result,
          status: result.status,
          updated_at: new Date().toISOString(),
        });
      }
      
      state.isSubmitting = false;
    }),
    
    // Content management
    setSelectedContent: (content) => set((state) => {
      state.selectedContent = content;
    }),
    
    updateContentFilters: (filters) => set((state) => {
      state.contentFilters = { ...state.contentFilters, ...filters };
    }),
    
    // UI actions
    setActiveTab: (tab) => set((state) => {
      state.activeTab = tab;
    }),
    
    setViewMode: (mode) => set((state) => {
      state.viewMode = mode;
    }),
  }))
);

// Selectors for computed values
export const useScrapingSelectors = () => {
  const store = useScrapingStore();
  
  return {
    // Get filtered content based on current filters
    getFilteredContent: (contentType?: string) => {
      if (!store.currentSession?.result?.scraped_content) return [];
      
      let content = store.currentSession.result.scraped_content;
      
      // Filter by type
      if (contentType && contentType !== 'all') {
        content = content.filter(item => item.content_type === contentType);
      }
      
      // Filter by search
      if (store.contentFilters.search) {
        const search = store.contentFilters.search.toLowerCase();
        content = content.filter(item => 
          item.url.toLowerCase().includes(search) ||
          item.title?.toLowerCase().includes(search) ||
          item.description?.toLowerCase().includes(search)
        );
      }
      
      // Filter by status
      if (store.contentFilters.status !== 'all') {
        const success = store.contentFilters.status === 'success';
        content = content.filter(item => item.success === success);
      }
      
      return content;
    },
    
    // Get content statistics
    getContentStats: () => {
      if (!store.currentSession?.result?.scraped_content) {
        return { total: 0, success: 0, failed: 0, byType: {} };
      }
      
      const content = store.currentSession.result.scraped_content;
      const stats = {
        total: content.length,
        success: content.filter(item => item.success).length,
        failed: content.filter(item => !item.success).length,
        byType: {} as Record<string, number>,
      };
      
      content.forEach(item => {
        const type = item.content_type;
        stats.byType[type] = (stats.byType[type] || 0) + 1;
      });
      
      return stats;
    },
    
    // Check if form is valid
    isFormValid: () => {
      return Object.keys(store.formErrors).length === 0 && 
             store.formData.url.trim() !== '';
    },
    
    // Get progress percentage
    getProgress: () => {
      if (!store.currentSession?.status) return 0;
      return store.currentSession.status.progress || 0;
    },
  };
};
