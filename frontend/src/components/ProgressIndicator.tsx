import React from 'react';
import { motion } from 'framer-motion';
import { useScrapeStore } from '../store/scrapeStore';

const ProgressIndicator: React.FC = () => {
  const { currentSession } = useScrapeStore();
  
  if (!currentSession || currentSession.status.status !== 'running') {
    return null;
  }

  const { status } = currentSession;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-lg border border-primary-200 dark:border-primary-700"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
            Scraping in progress...
          </span>
        </div>
        <span className="text-sm text-primary-600 dark:text-primary-400">
          {Math.round(status.progress)}%
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-2 bg-primary-100 dark:bg-primary-900/50 rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${status.progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
        <div className="text-center">
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {status.pages_scraped}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Pages</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {status.urls_found}
          </div>
          <div className="text-gray-600 dark:text-gray-400">URLs</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {status.external_urls_found}
          </div>
          <div className="text-gray-600 dark:text-gray-400">External</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {status.content_downloaded || 0}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Content</div>
        </div>
      </div>
      
      {/* Current URL */}
      {status.current_url && (
        <div className="mt-3 p-2 bg-white/50 dark:bg-gray-800/50 rounded text-xs">
          <span className="text-gray-600 dark:text-gray-400">Currently scraping: </span>
          <span className="font-mono text-gray-900 dark:text-gray-100 break-all">
            {status.current_url}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default ProgressIndicator;
