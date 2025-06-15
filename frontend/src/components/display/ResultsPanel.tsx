import React, { useState, useMemo } from 'react';
import { Search, Download, ExternalLink, Copy, Filter, SortAsc, SortDesc } from 'lucide-react';
import { useScrapingStore } from '../../store/scrapingStore';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { download } from '../../utils';

interface ResultsPanelProps {
  contentType: 'urls' | 'external_urls';
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ contentType }) => {
  const { currentSession } = useScrapingStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'url' | 'domain'>('url');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());

  const urls = useMemo(() => {
    if (!currentSession?.result) return [];
    
    const urlList = contentType === 'urls' 
      ? currentSession.result.urls 
      : currentSession.result.external_urls || [];
    
    // Filter by search term
    let filtered = urlList.filter(url => 
      url.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Sort URLs
    filtered.sort((a, b) => {
      let aValue: string, bValue: string;
      
      if (sortBy === 'domain') {
        try {
          aValue = new URL(a).hostname;
          bValue = new URL(b).hostname;
        } catch {
          aValue = a;
          bValue = b;
        }
      } else {
        aValue = a;
        bValue = b;
      }
      
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [currentSession, contentType, searchTerm, sortBy, sortOrder]);

  const handleSelectUrl = (url: string, selected: boolean) => {
    const newSelected = new Set(selectedUrls);
    if (selected) {
      newSelected.add(url);
    } else {
      newSelected.delete(url);
    }
    setSelectedUrls(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedUrls.size === urls.length) {
      setSelectedUrls(new Set());
    } else {
      setSelectedUrls(new Set(urls));
    }
  };

  const handleCopySelected = () => {
    const selectedUrlList = Array.from(selectedUrls);
    navigator.clipboard.writeText(selectedUrlList.join('\n'));
  };

  const handleExportSelected = () => {
    const selectedUrlList = Array.from(selectedUrls);
    const data = selectedUrlList.map(url => ({ url }));
    download.csv(data, `${contentType}-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportAll = () => {
    const data = urls.map(url => ({ url }));
    download.csv(data, `${contentType}-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const toggleSort = (field: 'url' | 'domain') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getDomain = (url: string): string => {
    try {
      return new URL(url).hostname;
    } catch {
      return 'Invalid URL';
    }
  };

  const getTitle = () => {
    return contentType === 'urls' ? 'Discovered URLs' : 'External URLs';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {getTitle()} ({urls.length})
          </h2>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportAll}
              disabled={urls.length === 0}
            >
              <Download size={16} className="mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Search and controls */}
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search URLs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={16} />}
            />
          </div>
          
          {selectedUrls.size > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedUrls.size} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopySelected}
              >
                <Copy size={16} className="mr-2" />
                Copy
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportSelected}
              >
                <Download size={16} className="mr-2" />
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedUrls(new Set())}
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {urls.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ExternalLink size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No URLs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm 
                ? 'Try adjusting your search term'
                : 'Start a scraping session to discover URLs'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedUrls.size === urls.length && urls.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Select all
                  </span>
                </label>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort('url')}
                    className="text-xs"
                  >
                    URL
                    {sortBy === 'url' && (
                      sortOrder === 'asc' ? <SortAsc size={12} className="ml-1" /> : <SortDesc size={12} className="ml-1" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort('domain')}
                    className="text-xs"
                  >
                    Domain
                    {sortBy === 'domain' && (
                      sortOrder === 'asc' ? <SortAsc size={12} className="ml-1" /> : <SortDesc size={12} className="ml-1" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* URL list */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {urls.map((url, index) => (
                <div
                  key={index}
                  className={`flex items-center p-3 rounded-lg border transition-colors ${
                    selectedUrls.has(url)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedUrls.has(url)}
                    onChange={(e) => handleSelectUrl(url, e.target.checked)}
                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline truncate flex-1 mr-4"
                      >
                        {url}
                      </a>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="hidden sm:inline">{getDomain(url)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(url, '_blank')}
                          className="text-xs"
                        >
                          <ExternalLink size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
