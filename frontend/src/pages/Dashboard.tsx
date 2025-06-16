import React from 'react';
import { useScrapingStore } from '../store/scrapingStore';
import { ScrapeForm } from '../components/forms/ScrapeForm';
import { ProgressDashboard } from '../components/display/ProgressDashboard';
import { ResultsPanel } from '../components/display/ResultsPanel';
import { ContentGallery } from '../components/media/ContentGallery';
import { SessionHistory } from '../components/display/SessionHistory';
import { StatisticsPanel } from '../components/display/StatisticsPanel';
import { PageContentViewer } from '../components/display/PageContentViewer';
import { APIKeyStatus } from '../components/common/APIKeyStatus';


interface DashboardProps {
  onNavigateToSettings?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateToSettings }) => {
  const { activeTab, currentSession, clearCurrentSession, resetAllSessions } = useScrapingStore();

  // Debug: Log current session state
  console.log('🏠 Dashboard - Current session:', currentSession?.id);
  const sessionStatus = typeof currentSession?.status === 'string' ? currentSession.status : currentSession?.status?.status || 'unknown';
  console.log('🏠 Dashboard - Session status:', sessionStatus);
  console.log('🏠 Dashboard - Session result:', !!currentSession?.result);
  console.log('🏠 Dashboard - Content count:', currentSession?.result?.scraped_content?.length || 0);
  console.log('🏠 Dashboard - Pages count:', currentSession?.result?.page_contents?.length || 0);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Emergency Session Controls - Show if stuck */}
            {currentSession && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Active Session: {currentSession.id.slice(0, 8)}...
                    </h4>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                      Status: {typeof currentSession.status === 'string' ? currentSession.status : currentSession.status?.status || 'unknown'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={clearCurrentSession}
                      className="px-3 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 hover:bg-yellow-200 rounded transition-colors"
                    >
                      Clear Session
                    </button>
                    <button
                      onClick={resetAllSessions}
                      className="px-3 py-1 text-xs font-medium text-red-800 bg-red-100 hover:bg-red-200 rounded transition-colors"
                    >
                      Reset All
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Scraping Interface - Primary Focus */}
            <div className="relative">
              <ScrapeForm />
            </div>

            {/* Session Progress - Only show when active */}
            {currentSession && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProgressDashboard />
                <StatisticsPanel />
              </div>
            )}

            {/* Secondary Features - Compact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* API Key Status - Smaller, less prominent */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-2 border-blue-400">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Chat Assistant
                    </h4>
                    <div className="mt-1">
                      <APIKeyStatus onConfigureClick={onNavigateToSettings} />
                    </div>
                  </div>
                  <button
                    onClick={onNavigateToSettings}
                    className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                  >
                    Setup
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-2 border-green-400">
                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                  Quick Stats
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Sessions:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">
                      {currentSession ? '1 Active' : '0 Active'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Files:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">
                      {currentSession?.result?.scraped_content?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'urls':
        return currentSession ? <PageContentViewer sessionId={currentSession.id} /> : <ResultsPanel contentType="urls" />;
      
      case 'images':
        return <ContentGallery contentType="image" />;
      
      case 'pdfs':
        return <ContentGallery contentType="pdf" />;
      
      case 'videos':
        return <ContentGallery contentType="video" />;
      
      case 'downloads':
        return <ContentGallery contentType="all" showOnlySuccessful />;
      
      case 'history':
        return <SessionHistory />;
      
      case 'settings':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Settings
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Settings panel coming soon...
            </p>
          </div>
        );
      
      default:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Welcome to Web Scraper
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Select a tab from the sidebar to get started.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
};
