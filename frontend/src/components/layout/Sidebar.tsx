import React from 'react';
import { Home, History, Settings, FileText, Image, Video, Download, MessageSquare, Database, Search } from 'lucide-react';
import { useScrapingStore } from '../../store/scrapingStore';
import { useUIStore } from '../../store/uiStore';
import { Button } from '../common/Button';

type Page = 'dashboard' | 'search' | 'settings' | 'sessions' | 'files' | 'chat';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const { activeTab, setActiveTab } = useScrapingStore();
  const { toggleSidebar } = useUIStore();
  const { currentSession } = useScrapingStore();

  // Main navigation pages
  const mainPages = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'chat', label: 'Chat Assistant', icon: MessageSquare },
    { id: 'sessions', label: 'Sessions', icon: Database },
    { id: 'files', label: 'Files', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Content navigation (only shown when on dashboard)
  const contentTabs = [
    { id: 'urls', label: 'Pages', icon: FileText },
    { id: 'images', label: 'Images', icon: Image },
    { id: 'pdfs', label: 'PDFs', icon: FileText },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'history', label: 'History', icon: History },
  ];

  const getContentCount = (type: string) => {
    if (!currentSession?.result) return 0;

    switch (type) {
      case 'urls':
        return currentSession.result.page_contents?.length || currentSession.result.urls.length;
      case 'images':
        return currentSession.result.scraped_content?.filter(c => c.content_type === 'image').length || 0;
      case 'pdfs':
        return currentSession.result.scraped_content?.filter(c => c.content_type === 'pdf').length || 0;
      case 'videos':
        return currentSession.result.scraped_content?.filter(c => c.content_type === 'video').length || 0;
      case 'downloads':
        return currentSession.result.scraped_content?.filter(c => c.success).length || 0;
      default:
        return 0;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Sidebar header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Navigation
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-6">
        {/* Main Pages */}
        <div className="space-y-2">
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Main
          </h3>
          {mainPages.map((page) => {
            const Icon = page.icon;
            const isActive = currentPage === page.id;

            return (
              <Button
                key={page.id}
                variant={isActive ? 'primary' : 'ghost'}
                className={`w-full justify-start ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => {
                  onPageChange(page.id as Page);
                  // If navigating to dashboard, set the active tab to dashboard
                  if (page.id === 'dashboard') {
                    setActiveTab('dashboard');
                  }
                  // Close sidebar on mobile after selection
                  if (window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
              >
                <Icon size={18} className="mr-3" />
                <span className="flex-1 text-left">{page.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Content Tabs (show when there's a session) */}
        {currentSession && (
          <div className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Content
            </h3>
            {contentTabs.map((tab) => {
              const Icon = tab.icon;
              const count = getContentCount(tab.id);
              const isActive = activeTab === tab.id;

              return (
                <Button
                  key={tab.id}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${
                    isActive
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    // Navigate to dashboard page and set the active tab
                    onPageChange('dashboard');
                    setActiveTab(tab.id);
                    // Close sidebar on mobile after selection
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                >
                  <Icon size={16} className="mr-3" />
                  <span className="flex-1 text-left">{tab.label}</span>
                  {count > 0 && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      isActive
                        ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                    }`}>
                      {count}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        )}
      </nav>

      {/* Session info */}
      {currentSession && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <div className="font-medium mb-1">Current Session</div>
            <div className="truncate">{currentSession.id}</div>
            <div className="flex justify-between mt-2">
              <span>Status:</span>
              <span className={`capitalize ${
                currentSession.status?.status === 'running' ? 'text-green-600' :
                currentSession.status?.status === 'completed' ? 'text-blue-600' :
                currentSession.status?.status === 'error' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {currentSession.status?.status || 'unknown'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
