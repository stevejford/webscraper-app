import React from 'react';
import { Activity, Globe, Download, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { useScrapingStore } from '../../store/scrapingStore';
import { formatDuration, formatNumber } from '../../utils/helpers';

export const ProgressDashboard: React.FC = () => {
  const { currentSession } = useScrapingStore();

  if (!currentSession) {
    return null;
  }

  const { status, result } = currentSession;
  const sessionStatus = typeof status === 'string' ? status : status?.status;
  const isRunning = sessionStatus === 'running';
  const isCompleted = sessionStatus === 'completed';
  const hasError = sessionStatus === 'error';
  const estimatedTotal = result?.status?.estimated_total_pages || result?.status?.pages_scraped || 1;
  const actualProgress = Math.min(100, (result?.status?.pages_scraped || 0) / estimatedTotal * 100);

  // Calculate duration
  const startTime = new Date(currentSession.created_at);
  const endTime = isCompleted ? new Date(currentSession.updated_at) : new Date();
  const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

  // Calculate rates
  const pagesPerSecond = duration > 0 ? (result?.status?.pages_scraped || 0) / duration : 0;
  const contentPerSecond = duration > 0 ? (result?.status?.content_downloaded || 0) / duration : 0;

  // Estimate time remaining
  const remainingPages = Math.max(0, estimatedTotal - (result?.status?.pages_scraped || 0));
  const estimatedTimeRemaining = pagesPerSecond > 0 ? remainingPages / pagesPerSecond : 0;

  const stats = [
    {
      label: 'Pages Scraped',
      value: formatNumber(result?.status?.pages_scraped || 0),
      icon: Globe,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      label: 'URLs Found',
      value: formatNumber(result?.status?.urls_found || 0),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      label: 'Content Downloaded',
      value: formatNumber(result?.status?.content_downloaded || 0),
      icon: Download,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      label: 'Duration',
      value: formatDuration(duration),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Scraping Progress
        </h2>
        
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isRunning ? 'bg-green-500 animate-pulse' :
            isCompleted ? 'bg-blue-500' :
            hasError ? 'bg-red-500' :
            'bg-gray-400'
          }`} />
          <span className={`text-sm font-medium capitalize ${
            isRunning ? 'text-green-600' :
            isCompleted ? 'text-blue-600' :
            hasError ? 'text-red-600' :
            'text-gray-600'
          }`}>
            {sessionStatus}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Overall Progress
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round(actualProgress)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ease-out ${
              hasError ? 'bg-red-500' : 'bg-blue-600'
            }`}
            style={{ width: `${Math.min(100, actualProgress)}%` }}
          />
        </div>
        
        {isRunning && estimatedTimeRemaining > 0 && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Estimated time remaining: {formatDuration(estimatedTimeRemaining)}
          </div>
        )}
      </div>

      {/* Current Activity */}
      {isRunning && (
        <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Activity size={16} className="text-blue-600 animate-pulse" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Activity
            </span>
          </div>

          {/* Show additional info if available */}
          {result?.status?.additional_info && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-2 font-medium">
              {result.status.additional_info}
            </p>
          )}

          {/* Show current URL */}
          {result?.status?.current_url && (
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              URL: {result.status.current_url}
            </p>
          )}
        </div>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${stat.bgColor} mb-2`}>
                <Icon size={24} className={stat.color} />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Metrics */}
      {isRunning && duration > 10 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {pagesPerSecond.toFixed(2)} pages/sec
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Scraping Rate
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {contentPerSecond.toFixed(2)} files/sec
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Download Rate
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {hasError && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle size={16} className="text-red-600" />
            <span className="text-sm font-medium text-red-800 dark:text-red-200">
              Scraping Error
            </span>
          </div>
          {result?.status && 'error' in result.status && (
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {(result.status as any).error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
