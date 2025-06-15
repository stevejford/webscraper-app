import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Square, 
  ChevronDown, 
  ChevronUp, 
  Link as LinkIcon, 
  Settings as SettingsIcon,
  AlertCircle,
  Download,
  Image,
  FileText,
  Globe
} from 'lucide-react';
import { useScrapeStore } from '../store/scrapeStore';
import { useWebSocket } from '../hooks/useWebSocket';
import { ContentType } from '../types';

const ScrapeForm: React.FC = () => {
  const { 
    formData, 
    updateFormData, 
    isSubmitting, 
    setIsSubmitting,
    currentSession 
  } = useScrapeStore();
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showContentOptions, setShowContentOptions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { startScraping, stopScraping } = useWebSocket();
  
  // Default content types
  const [contentTypes, setContentTypes] = useState<ContentType[]>([
    { id: 'images', name: 'Images', extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'], mime_types: ['image/*'], enabled: true },
    { id: 'pdfs', name: 'PDFs', extensions: ['.pdf'], mime_types: ['application/pdf'], enabled: true },
    { id: 'documents', name: 'Documents', extensions: ['.doc', '.docx', '.txt', '.rtf'], mime_types: ['application/msword', 'text/*'], enabled: false },
    { id: 'videos', name: 'Videos', extensions: ['.mp4', '.avi', '.mov', '.wmv'], mime_types: ['video/*'], enabled: false },
    { id: 'audio', name: 'Audio', extensions: ['.mp3', '.wav', '.m4a'], mime_types: ['audio/*'], enabled: false }
  ]);

  // User Agent options - Best for Shopify first
  const userAgents = [
    { 
      name: 'Shopify Bot (Recommended)', 
      value: 'Mozilla/5.0 (compatible; Shopify-Scraper/1.0; +https://shopify.com/robots)' 
    },
    { 
      name: 'Chrome 120 (Windows)', 
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
    },
    { 
      name: 'Chrome 120 (macOS)', 
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
    },
    { 
      name: 'Firefox 121 (Windows)', 
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0' 
    },
    { 
      name: 'Firefox 121 (macOS)', 
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0' 
    },
    { 
      name: 'Safari 17 (macOS)', 
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15' 
    },
    { 
      name: 'Safari 17 (iOS)', 
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' 
    },
    { 
      name: 'Edge 120 (Windows)', 
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0' 
    },
    { 
      name: 'Chrome Mobile (Android)', 
      value: 'Mozilla/5.0 (Linux; Android 14; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36' 
    },
    { 
      name: 'Samsung Internet (Android)', 
      value: 'Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36' 
    },
    { 
      name: 'Bot - Googlebot', 
      value: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' 
    },
    { 
      name: 'Bot - Bingbot', 
      value: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)' 
    },
    { 
      name: 'E-commerce - Amazon Bot', 
      value: 'Mozilla/5.0 (compatible; Amazon-Route53-Health-Check-Service; +https://docs.aws.amazon.com/Route53/)' 
    },
    { 
      name: 'E-commerce - WooCommerce', 
      value: 'Mozilla/5.0 (compatible; WooCommerce/8.0; +https://woocommerce.com)' 
    },
    { 
      name: 'E-commerce - Magento', 
      value: 'Mozilla/5.0 (compatible; Magento/2.4; +https://magento.com)' 
    },
    { 
      name: 'Custom (Enter manually)', 
      value: 'custom' 
    }
  ];

  const [customUserAgent, setCustomUserAgent] = useState('');
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.url) {
      newErrors.url = 'URL is required';
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = 'Please enter a valid URL';
      }
    }
    
    if (formData.max_pages < 1 || formData.max_pages > 1000) {
      newErrors.max_pages = 'Max pages must be between 1 and 1000';
    }
    
    if (formData.delay < 0 || formData.delay > 10) {
      newErrors.delay = 'Delay must be between 0 and 10 seconds';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (currentSession?.status.status === 'running') {
      stopScraping();
    } else {
      const requestData = {
        ...formData,
        content_types: contentTypes.filter(ct => ct.enabled)
      };
      startScraping(requestData);
    }
  };
  
  const toggleContentType = (id: string) => {
    const updatedContentTypes = contentTypes.map(ct =>
      ct.id === id ? { ...ct, enabled: !ct.enabled } : ct
    );
    setContentTypes(updatedContentTypes);

    // Sync with form data
    updateFormData({ content_types: updatedContentTypes });
  };
  
  const isRunning = currentSession?.status.status === 'running';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
          <LinkIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Scrape Configuration
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Website URL
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => updateFormData({ url: e.target.value })}
            className={`input-field ${errors.url ? 'border-red-500 ring-red-500' : ''}`}
            placeholder="https://example.com"
            disabled={isRunning}
          />
          {errors.url && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center space-x-2 mt-2 text-red-600 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{errors.url}</span>
            </motion.div>
          )}
        </div>
        
        {/* Scrape Whole Site Option */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <label className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Scrape Entire Website
                </label>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Automatically discover and scrape all pages on the domain
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const newValue = !formData.scrape_whole_site;
                updateFormData({ 
                  scrape_whole_site: newValue,
                  // When enabling whole site, set to unlimited (0), when disabling, set to reasonable default (10)
                  max_pages: newValue ? 0 : 10
                });
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                formData.scrape_whole_site ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
              disabled={isRunning}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.scrape_whole_site ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        
        {/* Max Pages - Conditional based on whole site option */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {formData.scrape_whole_site ? 'Max Pages (0 = unlimited)' : 'Max Pages'}: {formData.max_pages || 'unlimited'}
          </label>
          <input
            type="range"
            min={formData.scrape_whole_site ? "0" : "1"}
            max={formData.scrape_whole_site ? "1000" : "100"}
            value={formData.scrape_whole_site ? (formData.max_pages === 0 ? 1000 : formData.max_pages) : formData.max_pages}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (formData.scrape_whole_site) {
                // For whole site: if at max (1000), set to 0 (unlimited), otherwise use the value
                updateFormData({ max_pages: value === 1000 ? 0 : value });
              } else {
                updateFormData({ max_pages: value });
              }
            }}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            disabled={isRunning}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formData.scrape_whole_site ? 'Limited' : '1'}</span>
            <span>{formData.scrape_whole_site ? 'Unlimited' : '100'}</span>
          </div>
        </div>
        
        {/* Download Content Option */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <label className="text-sm font-medium text-green-900 dark:text-green-100">
                  Download Content
                </label>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Save images, PDFs, and other files locally
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateFormData({ download_content: !formData.download_content })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                formData.download_content ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
              disabled={isRunning}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.download_content ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        
        {/* Content Types Selection */}
        {formData.download_content && (
          <div>
            <button
              type="button"
              onClick={() => setShowContentOptions(!showContentOptions)}
              className="flex items-center space-x-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Content Types to Download</span>
              {showContentOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            <AnimatePresence>
              {showContentOptions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3"
                >
                  {contentTypes.map((contentType) => (
                    <div key={contentType.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {contentType.id === 'images' && <Image className="w-4 h-4 text-blue-500" />}
                        {contentType.id === 'pdfs' && <FileText className="w-4 h-4 text-red-500" />}
                        {contentType.id === 'documents' && <FileText className="w-4 h-4 text-green-500" />}
                        {contentType.id === 'videos' && <FileText className="w-4 h-4 text-purple-500" />}
                        {contentType.id === 'audio' && <FileText className="w-4 h-4 text-orange-500" />}
                        <div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {contentType.name}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {contentType.extensions.join(', ')}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleContentType(contentType.id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                          contentType.enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        disabled={isRunning}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            contentType.enabled ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        
        {/* Rate Limiting */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Delay Between Requests: {formData.delay}s
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={formData.delay}
            onChange={(e) => updateFormData({ delay: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            disabled={isRunning}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0s</span>
            <span>5s</span>
          </div>
        </div>
        
        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Advanced Options</span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {/* Advanced Options */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              {/* Include External Links */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Include External Links
                </label>
                <button
                  type="button"
                  onClick={() => updateFormData({ include_external: !formData.include_external })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    formData.include_external ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  disabled={isRunning}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.include_external ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {/* Custom User Agent */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  User Agent
                </label>
                <select
                  value={formData.user_agent || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'custom') {
                      updateFormData({ user_agent: customUserAgent });
                    } else {
                      updateFormData({ user_agent: value });
                      if (value !== customUserAgent) {
                        setCustomUserAgent('');
                      }
                    }
                  }}
                  className="input-field mb-3"
                  disabled={isRunning}
                >
                  <option value="">Default (Auto-detect)</option>
                  {userAgents.map((ua, index) => (
                    <option key={index} value={ua.value}>
                      {ua.name}
                    </option>
                  ))}
                </select>
                
                {/* Custom User Agent Input */}
                {(formData.user_agent === 'custom' || 
                  (formData.user_agent && !userAgents.find(ua => ua.value === formData.user_agent))) && (
                  <div className="mt-2">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Custom User Agent String
                    </label>
                    <input
                      type="text"
                      value={formData.user_agent === 'custom' ? customUserAgent : formData.user_agent}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCustomUserAgent(value);
                        updateFormData({ user_agent: value });
                      }}
                      className="input-field text-xs font-mono"
                      placeholder="Enter custom user agent..."
                      disabled={isRunning}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      💡 Tip: Use a browser-like user agent for better compatibility
                    </p>
                  </div>
                )}
                
                {/* User Agent Preview */}
                {formData.user_agent && formData.user_agent !== 'custom' && (
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded border">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Selected User Agent:</p>
                    <p className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all">
                      {formData.user_agent}
                    </p>
                  </div>
                )}
                
                {/* Shopify Tip */}
                {formData.user_agent?.includes('Shopify') && (
                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      🛍️ <strong>Shopify Tip:</strong> This user agent is optimized for Shopify stores and may have better access to product data.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting && !isRunning}
          className={`w-full flex items-center justify-center space-x-3 py-4 rounded-xl font-medium transition-all duration-200 ${
            isRunning
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'btn-primary'
          }`}
          whileTap={{ scale: 0.98 }}
        >
          {isRunning ? (
            <>
              <Square className="w-5 h-5" />
              <span>Stop Scraping</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Start Scraping</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ScrapeForm;
