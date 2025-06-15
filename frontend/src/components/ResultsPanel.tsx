import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  ExternalLink, 
  Download, 
  Search,
  Copy,
  CheckCircle,
  Image,
  FileText,
  Play,
  Folder
} from 'lucide-react';
import { useScrapeStore } from '../store/scrapeStore';
import ProgressIndicator from './ProgressIndicator';
import StatisticsPanel from './StatisticsPanel';
import URLTable from './URLTable';
import ContentGallery from './ContentGallery';

type TabType = 'urls' | 'external' | 'images' | 'pdfs' | 'videos' | 'documents' | 'stats';

const ResultsPanel: React.FC = () => {
  const { currentSession } = useScrapeStore();
  const [activeTab, setActiveTab] = useState<TabType>('urls');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  // Get content by type
  const getContentByType = (type: string) => {
    if (!currentSession?.scraped_content) return [];
    return currentSession.scraped_content.filter(content => content.content_type === type);
  };

  const tabs = [
    { 
      id: 'urls' as TabType, 
      label: 'URLS', 
      icon: BarChart3, 
      count: currentSession?.urls.length || 0 
    },
    { 
      id: 'external' as TabType, 
      label: 'External Links', 
      icon: ExternalLink, 
      count: currentSession?.external_urls.length || 0 
    },
    { 
      id: 'images' as TabType, 
      label: 'Images', 
      icon: Image, 
      count: getContentByType('image').length 
    },
    { 
      id: 'pdfs' as TabType, 
      label: 'PDFs', 
      icon: FileText, 
      count: getContentByType('pdf').length 
    },
    { 
      id: 'videos' as TabType, 
      label: 'Videos', 
      icon: Play, 
      count: getContentByType('video').length 
    },
    { 
      id: 'documents' as TabType, 
      label: 'Documents', 
      icon: Folder, 
      count: getContentByType('document').length 
    },
    { 
      id: 'stats' as TabType, 
      label: 'Statistics', 
      icon: BarChart3, 
      count: null 
    },
  ];

  const handleExport = async (format: 'json' | 'csv') => {
    if (!currentSession) return;

    let data: any;
    let filename: string;

    switch (activeTab) {
      case 'urls':
        data = currentSession.urls;
        filename = `${currentSession.domain}_urls.${format}`;
        break;
      case 'external':
        data = currentSession.external_urls;
        filename = `${currentSession.domain}_external.${format}`;
        break;
      case 'images':
      case 'pdfs':
      case 'videos':
      case 'documents':
        data = getContentByType(activeTab === 'images' ? 'image' : 
                               activeTab === 'pdfs' ? 'pdf' : 
                               activeTab === 'videos' ? 'video' : 'document');
        filename = `${currentSession.domain}_${activeTab}.${format}`;
        break;
      default:
        return;
    }
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      let csv: string;
      if (activeTab === 'urls' || activeTab === 'external') {
        csv = (data as string[]).join('\n');
      } else {
        // For content data, create CSV with headers
        const headers = 'URL,Title,Type,Size,Downloaded';
        const rows = data.map((item: any) => 
          `"${item.url}","${item.title || ''}","${item.content_type}","${item.file_size || ''}","${item.downloaded_at}"`
        );
        csv = [headers, ...rows].join('\n');
      }
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const copyToClipboard = async () => {
    if (!currentSession) return;
    
    let data: string[];
    
    switch (activeTab) {
      case 'urls':
        data = currentSession.urls;
        break;
      case 'external':
        data = currentSession.external_urls;
        break;
      case 'images':
      case 'pdfs':
      case 'videos':
      case 'documents':
        data = getContentByType(activeTab === 'images' ? 'image' : 
                               activeTab === 'pdfs' ? 'pdf' : 
                               activeTab === 'videos' ? 'video' : 'document')
                               .map(item => item.url);
        break;
      default:
        return;
    }
    
    await navigator.clipboard.writeText(data.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderTabContent = () => {
    if (!currentSession) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Start scraping to see results</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'stats':
        return <StatisticsPanel session={currentSession} />;
      
      case 'urls':
      case 'external':
        return (
          <URLTable
            urls={activeTab === 'urls' ? currentSession.urls : currentSession.external_urls}
            searchTerm={searchTerm}
            isExternal={activeTab === 'external'}
          />
        );
      
      case 'images':
        return (
          <ContentGallery
            content={getContentByType('image')}
            contentType="image"
          />
        );
      
      case 'pdfs':
        return (
          <ContentGallery
            content={getContentByType('pdf')}
            contentType="pdf"
          />
        );
      
      case 'videos':
        return (
          <ContentGallery
            content={getContentByType('video')}
            contentType="video"
          />
        );
      
      case 'documents':
        return (
          <ContentGallery
            content={getContentByType('document')}
            contentType="document"
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Scraping Results
        </h2>
        
        {currentSession && (activeTab === 'urls' || activeTab === 'external' || 
                           activeTab === 'images' || activeTab === 'pdfs' || 
                           activeTab === 'videos' || activeTab === 'documents') && (
          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            
            <div className="relative group">
              <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[120px]">
                <button
                  onClick={() => handleExport('json')}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg"
                >
                  Export JSON
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 last:rounded-b-lg"
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      {currentSession?.status.status === 'running' && <ProgressIndicator />}

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      {currentSession && (activeTab === 'urls' || activeTab === 'external') && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search URLS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>
    </motion.div>
  );
};

export default ResultsPanel;
