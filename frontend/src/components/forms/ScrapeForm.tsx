import React, { useState } from 'react';
import { Play, Square, Settings, Globe, Download, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useScrapingStore } from '../../store/scrapingStore';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { validateUrl } from '../../utils/validation';
import { DEFAULT_CONTENT_TYPES } from '../../utils/constants';

export const ScrapeForm: React.FC = () => {
  const {
    formData,
    formErrors,
    isSubmitting,
    currentSession,
    updateFormData,
    setFormErrors,
  } = useScrapingStore();

  const { isConnected, startScraping, stopScraping } = useWebSocket();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors: Record<string, string> = {};
    
    const urlError = validateUrl(formData.url);
    if (urlError) {
      errors.url = urlError;
    }
    
    if (formData.max_pages < 1 || formData.max_pages > 1000) {
      errors.max_pages = 'Max pages must be between 1 and 1000';
    }
    
    if (formData.delay < 0 || formData.delay > 60) {
      errors.delay = 'Delay must be between 0 and 60 seconds';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    await startScraping(formData);
  };

  const handleStop = async () => {
    await stopScraping();
  };

  const handleContentTypeToggle = (typeId: string) => {
    const updatedTypes = formData.content_types.map(type =>
      type.id === typeId ? { ...type, enabled: !type.enabled } : type
    );
    updateFormData({ content_types: updatedTypes });
  };

  const isRunning = (typeof currentSession?.status === 'string' ? currentSession.status : currentSession?.status?.status) === 'running';
  const canStart = !isSubmitting && !isRunning && formData.url;
  const canStop = isRunning;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-blue-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-600 rounded-lg">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Start Web Scraping
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Configure and launch your web scraping session
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
            isConnected() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected() ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-xs font-medium">
              {isConnected() ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Welcome Message for New Users */}
        {!formData.url && (
          <div className="text-center py-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to Web Scraper! 🚀
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Extract content, images, PDFs, and files from any website with our intelligent scraping engine.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Globe className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 dark:text-white">Smart Crawling</h4>
                  <p className="text-gray-600 dark:text-gray-400">Intelligently discovers and extracts content</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Download className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 dark:text-white">Media Download</h4>
                  <p className="text-gray-600 dark:text-gray-400">Downloads images, PDFs, videos, and documents</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 dark:text-white">Content Analysis</h4>
                  <p className="text-gray-600 dark:text-gray-400">AI-powered content processing and search</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* URL Input - Hero Style */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {formData.url ? 'Target Website' : 'Enter Website URL'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formData.url ? 'Ready to scrape this website' : 'Start by entering the website you want to scrape'}
            </p>
          </div>

          <div className="relative">
            <Input
              label=""
              type="url"
              value={formData.url}
              onChange={(e) => updateFormData({ url: e.target.value })}
              error={formErrors.url}
              placeholder="https://example.com"
              icon={<Globe size={20} />}
              disabled={isRunning}
              className="text-lg py-4 pl-12 text-center"
            />

            {/* Quick Examples */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">Examples:</span>
              {['https://news.ycombinator.com', 'https://reddit.com/r/programming', 'https://github.com/trending'].map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => updateFormData({ url: example })}
                  disabled={isRunning}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {example.replace('https://', '')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Basic Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Scraping Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Max Pages"
                type="number"
                min="1"
                max="1000"
                value={formData.max_pages}
                onChange={(e) => updateFormData({ max_pages: parseInt(e.target.value) || 1 })}
                error={formErrors.max_pages}
                disabled={isRunning}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Maximum number of pages to scrape
              </p>
            </div>

            <div>
              <Input
                label="Delay (seconds)"
                type="number"
                min="0"
                max="60"
                step="0.1"
                value={formData.delay}
                onChange={(e) => updateFormData({ delay: parseFloat(e.target.value) || 0 })}
                error={formErrors.delay}
                disabled={isRunning}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Delay between requests (be respectful)
              </p>
            </div>
          </div>
        </div>

        {/* Content Download Options */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Content Options
            </h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.download_content}
                onChange={(e) => updateFormData({ download_content: e.target.checked })}
                disabled={isRunning}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Download size={16} className="inline mr-1" />
                Download Files & Media
              </span>
            </label>
          </div>

          {formData.download_content && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {formData.content_types.map((type) => (
                <label key={type.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={type.enabled}
                    onChange={() => handleContentTypeToggle(type.id)}
                    disabled={isRunning}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {type.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Advanced Settings Toggle */}
        <div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            disabled={isRunning}
          >
            <Settings size={16} className="mr-2" />
            Advanced Settings
          </Button>
        </div>

        {/* Advanced Settings Panel */}
        {showAdvanced && (
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="User Agent"
                type="text"
                value={formData.user_agent || ''}
                onChange={(e) => updateFormData({ user_agent: e.target.value })}
                placeholder="Custom user agent (optional)"
                disabled={isRunning}
              />
              
              <Input
                label="Depth Limit"
                type="number"
                min="1"
                max="10"
                value={formData.depth_limit || 3}
                onChange={(e) => updateFormData({ depth_limit: parseInt(e.target.value) || 3 })}
                disabled={isRunning}
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.include_external}
                  onChange={(e) => updateFormData({ include_external: e.target.checked })}
                  disabled={isRunning}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Include External Links
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.scrape_whole_site}
                  onChange={(e) => updateFormData({ scrape_whole_site: e.target.checked })}
                  disabled={isRunning}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Scrape Whole Site
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.respect_robots || false}
                  onChange={(e) => updateFormData({ respect_robots: e.target.checked })}
                  disabled={isRunning}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Respect robots.txt
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Scraping Summary */}
        {formData.url && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-blue-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Scraping Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600 dark:text-gray-400">Target:</span>
                <span className="font-medium text-gray-900 dark:text-white truncate">
                  {new URL(formData.url).hostname}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-green-600" />
                <span className="text-gray-600 dark:text-gray-400">Max Pages:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formData.max_pages}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-purple-600" />
                <span className="text-gray-600 dark:text-gray-400">Content:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formData.download_content ? 'Yes' : 'Text Only'}
                </span>
              </div>
            </div>

            {formData.download_content && (
              <div className="mt-3 pt-3 border-t border-blue-200 dark:border-gray-600">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Will download: {Object.entries(formData.content_types).filter(([_, enabled]) => enabled).map(([type, _]) => type).join(', ')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons - Hero Style */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button
              type="submit"
              variant="primary"
              disabled={!canStart}
              loading={isSubmitting}
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
            >
              <Play size={20} className="mr-3" />
              {isSubmitting ? 'Starting Scraper...' : 'Start Scraping'}
            </Button>

            {canStop && (
              <Button
                type="button"
                variant="danger"
                onClick={handleStop}
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg"
              >
                <Square size={20} className="mr-3" />
                Stop Scraping
              </Button>
            )}
          </div>

          {currentSession && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Active Session: {currentSession.id.slice(0, 8)}...
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
