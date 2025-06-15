// UI state management with Zustand

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Theme, ModalState, LoadingState, SidebarState } from '../types';
import { storageService } from '../services';

interface UIState {
  // Theme
  theme: Theme;
  isDarkMode: boolean;
  
  // Layout
  sidebar: SidebarState;
  
  // Modal
  modal: ModalState;
  
  // Loading states
  loading: LoadingState;
  
  // Notifications (handled by separate store)
  
  // Search and filters
  globalSearch: string;
  
  // Keyboard shortcuts
  shortcutsEnabled: boolean;
  
  // Performance
  reducedMotion: boolean;
  
  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  
  // Sidebar actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  
  // Modal actions
  openModal: (modal: Partial<ModalState>) => void;
  closeModal: () => void;
  
  // Loading actions
  setLoading: (loading: Partial<LoadingState>) => void;
  clearLoading: () => void;
  
  // Search actions
  setGlobalSearch: (search: string) => void;
  
  // Settings actions
  setShortcutsEnabled: (enabled: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  
  // Utility actions
  resetUI: () => void;
  loadSettings: () => void;
  saveSettings: () => void;
}

// Detect system theme preference
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

// Detect reduced motion preference
const getReducedMotionPreference = (): boolean => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};

export const useUIStore = create<UIState>()(
  immer((set, get) => ({
    // Initial state
    theme: 'system',
    isDarkMode: getSystemTheme() === 'dark',
    
    sidebar: {
      isOpen: true,
      activeSection: 'scraping',
      width: 320,
    },
    
    modal: {
      isOpen: false,
      size: 'md',
      closable: true,
    },
    
    loading: {
      isLoading: false,
    },
    
    globalSearch: '',
    shortcutsEnabled: true,
    reducedMotion: getReducedMotionPreference(),
    
    // Theme management
    setTheme: (theme) => set((state) => {
      state.theme = theme;
      
      // Update dark mode based on theme
      if (theme === 'system') {
        state.isDarkMode = getSystemTheme() === 'dark';
      } else {
        state.isDarkMode = theme === 'dark';
      }
      
      // Apply theme to document
      const root = document.documentElement;
      if (state.isDarkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      
      // Save to storage
      storageService.saveTheme(theme);
    }),
    
    toggleTheme: () => {
      const currentTheme = get().theme;
      let newTheme: Theme;
      
      if (currentTheme === 'system') {
        newTheme = get().isDarkMode ? 'light' : 'dark';
      } else if (currentTheme === 'light') {
        newTheme = 'dark';
      } else {
        newTheme = 'light';
      }
      
      get().setTheme(newTheme);
    },
    
    // Sidebar management
    setSidebarOpen: (open) => set((state) => {
      state.sidebar.isOpen = open;
      storageService.saveSidebarState(open);
    }),
    
    toggleSidebar: () => {
      const isOpen = get().sidebar.isOpen;
      get().setSidebarOpen(!isOpen);
    },
    
    setSidebarWidth: (width) => set((state) => {
      state.sidebar.width = Math.max(280, Math.min(600, width));
    }),
    
    // Modal management
    openModal: (modal) => set((state) => {
      state.modal = {
        isOpen: true,
        size: 'md',
        closable: true,
        ...modal,
      };
    }),
    
    closeModal: () => set((state) => {
      state.modal.isOpen = false;
      state.modal.content = undefined;
      state.modal.title = undefined;
    }),
    
    // Loading management
    setLoading: (loading) => set((state) => {
      state.loading = { ...state.loading, ...loading };
    }),
    
    clearLoading: () => set((state) => {
      state.loading = { isLoading: false };
    }),
    
    // Search management
    setGlobalSearch: (search) => set((state) => {
      state.globalSearch = search;
    }),
    
    // Settings management
    setShortcutsEnabled: (enabled) => set((state) => {
      state.shortcutsEnabled = enabled;
      storageService.updateSetting('shortcutsEnabled', enabled);
    }),
    
    setReducedMotion: (reduced) => set((state) => {
      state.reducedMotion = reduced;
      storageService.updateSetting('reducedMotion', reduced);
      
      // Apply to document
      const root = document.documentElement;
      if (reduced) {
        root.style.setProperty('--animation-duration', '0s');
      } else {
        root.style.removeProperty('--animation-duration');
      }
    }),
    
    // Utility actions
    resetUI: () => set((state) => {
      state.theme = 'system';
      state.isDarkMode = getSystemTheme() === 'dark';
      state.sidebar = {
        isOpen: true,
        activeSection: 'scraping',
        width: 320,
      };
      state.modal = {
        isOpen: false,
        size: 'md',
        closable: true,
      };
      state.loading = { isLoading: false };
      state.globalSearch = '';
      state.shortcutsEnabled = true;
      state.reducedMotion = getReducedMotionPreference();
      
      // Clear storage
      storageService.clearAllData();
    }),
    
    loadSettings: () => set((state) => {
      // Load theme
      const savedTheme = storageService.getTheme();
      if (savedTheme) {
        state.theme = savedTheme;
        if (savedTheme === 'system') {
          state.isDarkMode = getSystemTheme() === 'dark';
        } else {
          state.isDarkMode = savedTheme === 'dark';
        }
      }
      
      // Load sidebar state
      const sidebarState = storageService.getSidebarState();
      if (sidebarState) {
        state.sidebar.isOpen = sidebarState.isOpen;
      }
      
      // Load other settings
      const settings = storageService.getSettings();
      if (settings.shortcutsEnabled !== undefined) {
        state.shortcutsEnabled = settings.shortcutsEnabled;
      }
      if (settings.reducedMotion !== undefined) {
        state.reducedMotion = settings.reducedMotion;
      }
      
      // Apply theme to document
      const root = document.documentElement;
      if (state.isDarkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      
      // Apply reduced motion
      if (state.reducedMotion) {
        root.style.setProperty('--animation-duration', '0s');
      }
    }),
    
    saveSettings: () => {
      const state = get();
      storageService.saveTheme(state.theme);
      storageService.saveSidebarState(state.sidebar.isOpen);
      storageService.updateSetting('shortcutsEnabled', state.shortcutsEnabled);
      storageService.updateSetting('reducedMotion', state.reducedMotion);
    },
  }))
);

// Listen for system theme changes
if (typeof window !== 'undefined' && window.matchMedia) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  mediaQuery.addEventListener('change', (e) => {
    const store = useUIStore.getState();
    if (store.theme === 'system') {
      store.setTheme('system'); // This will update isDarkMode
    }
  });
  
  // Listen for reduced motion changes
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  motionQuery.addEventListener('change', (e) => {
    const store = useUIStore.getState();
    store.setReducedMotion(e.matches);
  });
}

// Selectors for computed values
export const useUISelectors = () => {
  const store = useUIStore();
  
  return {
    // Get effective theme (resolves 'system' to actual theme)
    getEffectiveTheme: (): 'light' | 'dark' => {
      return store.isDarkMode ? 'dark' : 'light';
    },
    
    // Check if sidebar should be shown
    shouldShowSidebar: (): boolean => {
      return store.sidebar.isOpen;
    },
    
    // Get modal props for components
    getModalProps: () => ({
      isOpen: store.modal.isOpen,
      onClose: store.closeModal,
      size: store.modal.size,
      closable: store.modal.closable,
    }),
    
    // Check if loading
    isLoading: (): boolean => {
      return store.loading.isLoading;
    },
    
    // Get loading message
    getLoadingMessage: (): string => {
      return store.loading.message || 'Loading...';
    },
  };
};
