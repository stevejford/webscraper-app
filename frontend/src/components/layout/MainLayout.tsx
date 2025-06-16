import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Dashboard } from '../../pages/Dashboard';
import { SearchPage } from '../../pages/SearchPage';
import { SessionsPage } from '../../pages/SessionsPage';
import { FilesPage } from '../../pages/FilesPage';
import { SettingsPage } from '../settings/SettingsPage';
import { useUIStore } from '../../store/uiStore';
import { useScrapingStore } from '../../store/scrapingStore';

type Page = 'dashboard' | 'search' | 'settings' | 'sessions' | 'files' | 'chat';

export const MainLayout: React.FC = () => {
  const { sidebarOpen } = useUIStore();
  const { loadSessions } = useScrapingStore();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  // Load sessions and settings on app startup
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadSessions();
        console.log('✅ App initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, [loadSessions]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigateToSettings={() => setCurrentPage('settings')} />;
      case 'search':
        return <SearchPage />;
      case 'settings':
        return <SettingsPage />;
      case 'sessions':
        return <SessionsPage onNavigateToSettings={() => setCurrentPage('settings')} />;
      case 'files':
        return <FilesPage />;
      case 'chat':
        return <div className="p-8 text-center text-gray-500">Chat page coming soon...</div>;
      default:
        return <Dashboard onNavigateToSettings={() => setCurrentPage('settings')} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header
          onNavigateToSettings={() => setCurrentPage('settings')}
          onNavigateToSearch={() => setCurrentPage('search')}
        />
        
        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {currentPage === 'settings' ? (
            renderCurrentPage()
          ) : (
            <div className="container mx-auto px-6 py-8">
              {renderCurrentPage()}
            </div>
          )}
        </main>
        
        <Footer />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => useUIStore.getState().toggleSidebar()}
        />
      )}
    </div>
  );
};
