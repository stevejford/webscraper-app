import React, { useState } from 'react';
import { Play, Square, Settings, Globe, Download, FileText } from 'lucide-react';
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Web Scraper Configuration
        </h2>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isConnected() ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isConnected() ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Input */}
        <div>
          <Input
            label="Target URL"
            type="url"
            value={formData.url}
            onChange={(e) => updateFormData({ url: e.target.value })}
            error={formErrors.url}
            placeholder="https://example.com"
            icon={<Globe size={16} />}
            disabled={isRunning}
          />
        </div>

        {/* Basic Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Content Download Options */}
        <div>
          <div className="flex items-center justify-between mb-3">
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
                Download Content
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

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <Button
              type="submit"
              variant="primary"
              disabled={!canStart}
              loading={isSubmitting}
            >
              <Play size={16} className="mr-2" />
              Start Scraping
            </Button>
            
            {canStop && (
              <Button
                type="button"
                variant="danger"
                onClick={handleStop}
              >
                <Square size={16} className="mr-2" />
                Stop
              </Button>
            )}
          </div>

          {currentSession && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Session: {currentSession.id.slice(0, 8)}...
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
