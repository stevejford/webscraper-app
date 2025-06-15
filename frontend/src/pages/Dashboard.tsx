import React from 'react';
import { useScrapingStore } from '../store/scrapingStore';
import { ScrapeForm } from '../components/forms/ScrapeForm';
import { ProgressDashboard } from '../components/display/ProgressDashboard';
import { ResultsPanel } from '../components/display/ResultsPanel';
import { ContentGallery } from '../components/media/ContentGallery';
import { SessionHistory } from '../components/display/SessionHistory';
import { StatisticsPanel } from '../components/display/StatisticsPanel';
import { PageContentViewer } from '../components/display/PageContentViewer';

export const Dashboard: React.FC = () => {
  const { activeTab, currentSession } = useScrapingStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <ScrapeForm />
            {currentSession && (
              <>
                <ProgressDashboard />
                <StatisticsPanel />
              </>
            )}
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
