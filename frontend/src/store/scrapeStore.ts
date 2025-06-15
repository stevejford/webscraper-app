import { create } from 'zustand';
import { ScrapeRequest, ScrapeResult, ScrapeStatus } from '../types';

interface ScrapeState {
  // Current scraping session
  currentSession: ScrapeResult | null;
  isConnected: boolean;
  websocket: WebSocket | null;
  
  // Form state
  formData: ScrapeRequest;
  isSubmitting: boolean;
  
  // Session history
  sessions: ScrapeResult[];
  
  // Actions
  setCurrentSession: (session: ScrapeResult | null) => void;
  updateFormData: (data: Partial<ScrapeRequest>) => void;
  setIsSubmitting: (value: boolean) => void;
  addSession: (session: ScrapeResult) => void;
  setWebSocket: (ws: WebSocket | null) => void;
  setIsConnected: (connected: boolean) => void;
  updateSessionStatus: (status: ScrapeStatus) => void;
}

export const useScrapeStore = create<ScrapeState>((set, get) => ({
  // Initial state
  currentSession: null,
  isConnected: false,
  websocket: null,
  
  formData: {
    url: '',
    max_pages: 10,
    delay: 1.0,
    include_external: false,
    scrape_whole_site: false,
    download_content: true,
    content_types: [
      { id: 'images', name: 'Images', extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'], mime_types: ['image/*'], enabled: true },
      { id: 'pdfs', name: 'PDFs', extensions: ['.pdf'], mime_types: ['application/pdf'], enabled: true },
      { id: 'documents', name: 'Documents', extensions: ['.doc', '.docx', '.txt', '.rtf'], mime_types: ['application/msword', 'text/*'], enabled: false },
      { id: 'videos', name: 'Videos', extensions: ['.mp4', '.avi', '.mov', '.wmv'], mime_types: ['video/*'], enabled: false },
      { id: 'audio', name: 'Audio', extensions: ['.mp3', '.wav', '.m4a'], mime_types: ['audio/*'], enabled: false }
    ]
  },
  isSubmitting: false,
  
  sessions: [],
  
  // Actions
  setCurrentSession: (session) => set({ currentSession: session }),
  
  updateFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),
  
  setIsSubmitting: (value) => set({ isSubmitting: value }),
  
  addSession: (session) => set((state) => ({
    sessions: [session, ...state.sessions.slice(0, 9)] // Keep last 10 sessions
  })),
  
  setWebSocket: (ws) => set({ websocket: ws }),
  
  setIsConnected: (connected) => set({ isConnected: connected }),
  
  updateSessionStatus: (status) => set((state) => {
    if (state.currentSession) {
      return {
        currentSession: {
          ...state.currentSession,
          status
        }
      };
    }
    return state;
  }),
}));
