import React from 'react';
import { Home, History, Settings, FileText, Image, Video, Download } from 'lucide-react';
import { useScrapingStore } from '../../store/scrapingStore';
import { useUIStore } from '../../store/uiStore';
import { Button } from '../common/Button';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useScrapingStore();
  const { toggleSidebar } = useUIStore();
  const { currentSession } = useScrapingStore();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'urls', label: 'Pages', icon: FileText },
    { id: 'images', label: 'Images', icon: Image },
    { id: 'pdfs', label: 'PDFs', icon: FileText },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
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
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const count = getContentCount(item.id);
          const isActive = activeTab === item.id;

          return (
            <Button
              key={item.id}
              variant={isActive ? 'primary' : 'ghost'}
              className={`w-full justify-start ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => {
                setActiveTab(item.id);
                // Close sidebar on mobile after selection
                if (window.innerWidth < 1024) {
                  toggleSidebar();
                }
              }}
            >
              <Icon size={18} className="mr-3" />
              <span className="flex-1 text-left">{item.label}</span>
              {count > 0 && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  isActive 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}>
                  {count}
                </span>
              )}
            </Button>
          );
        })}
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
