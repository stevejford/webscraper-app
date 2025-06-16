import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Settings, Download, Search } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useScrapingStore } from '../../store/scrapingStore';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { SessionSwitcher } from '../session/SessionSwitcher';

interface HeaderProps {
  onNavigateToSettings?: () => void;
  onNavigateToSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateToSettings, onNavigateToSearch }) => {
  const { sidebarOpen, toggleSidebar, theme, toggleTheme } = useUIStore();
  const { currentSession, updateContentFilters } = useScrapingStore();
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');



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

  const handleGlobalSearch = (query: string) => {
    if (query.trim()) {
      updateContentFilters({ search: query });
      onNavigateToSearch?.();
      setShowGlobalSearch(false);
      setGlobalSearchQuery('');
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

        {/* Center - Session Switcher and Global Search */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8 items-center space-x-4">
          {/* Session Switcher */}
          <SessionSwitcher maxRecentSessions={5} />

          {/* Global Search */}
          <div className="flex-1 max-w-md">
            {showGlobalSearch ? (
              <div className="flex w-full space-x-2">
                <Input
                  type="text"
                  placeholder="Search all content..."
                  value={globalSearchQuery}
                  onChange={(e) => setGlobalSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGlobalSearch(globalSearchQuery)}
                  className="flex-1"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleGlobalSearch(globalSearchQuery)}
                  disabled={!globalSearchQuery.trim()}
                >
                  <Search size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowGlobalSearch(false);
                    setGlobalSearchQuery('');
                  }}
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                {currentSession && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Session: Active</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Mobile search button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGlobalSearch(!showGlobalSearch)}
            className="md:hidden"
            title="Search"
          >
            <Search size={16} />
          </Button>

          {/* Desktop search button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGlobalSearch(!showGlobalSearch)}
            className="hidden md:flex"
            title="Search"
          >
            <Search size={16} />
          </Button>

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
            onClick={onNavigateToSettings}
            title="Settings"
          >
            <Settings size={16} />
          </Button>
        </div>
      </div>
    </header>
  );
};
