import React from 'react';
import { Menu, X, Sun, Moon, Settings, Download } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useScrapingStore } from '../../store/scrapingStore';
import { Button } from '../common/Button';

export const Header: React.FC = () => {
  const { sidebarOpen, toggleSidebar, theme, toggleTheme } = useUIStore();
  const { currentSession } = useScrapingStore();

  // Debug: Log the currentSession to see its structure
  console.log('Header currentSession:', currentSession);

  const handleExportSession = () => {
    if (currentSession) {
      const dataStr = JSON.stringify(currentSession, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `session-${currentSession.id}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Logo and menu */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">WS</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Web Scraper
            </h1>
          </div>
        </div>

        {/* Center - Session status */}
        {currentSession && (
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Session: Active</span>
          </div>
        )}

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          {currentSession && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportSession}
              className="hidden sm:flex"
            >
              <Download size={16} className="mr-2" />
              Export
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
          >
            <Settings size={16} />
          </Button>
        </div>
      </div>
    </header>
  );
};
