import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Clock, Zap, Target, FileText, Image, Video, File } from 'lucide-react';
import { useScrapingStore, useScrapingSelectors } from '../store/scrapingStore';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ContentItem } from '../components/media/ContentItem';
import { ContentViewer } from '../components/media/ContentViewer';
import type { ScrapedContent } from '../types/api';

interface SearchResult extends ScrapedContent {
  relevanceScore?: number;
  vectorSimilarity?: number;
  ftsRank?: number;
  snippet?: string;
}

export const SearchPage: React.FC = () => {
  const { currentSession, contentFilters, updateContentFilters, viewMode, setViewMode } = useScrapingStore();
  const { getFilteredContent } = useScrapingSelectors();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'local' | 'vector' | 'hybrid'>('local');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedContent, setSelectedContent] = useState<ScrapedContent | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load recent searches:', error);
      }
    }
  }, []);

  // Save recent searches
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  };

  // Local search using existing filtering
  const performLocalSearch = (query: string) => {
    updateContentFilters({ search: query });
    const results = getFilteredContent();
    setSearchResults(results.map(item => ({ ...item, relevanceScore: 1.0 })));
  };

  // Vector/hybrid search (placeholder for backend integration)
  const performVectorSearch = async (query: string, type: 'vector' | 'hybrid') => {
    if (!currentSession) return;

    setIsSearching(true);
    try {
      // This would call the backend search API
      const response = await fetch('/api/content/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          sessionId: currentSession.id,
          searchType: type,
          matchThreshold: 0.7,
          matchCount: 20
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
      } else {
        // Fallback to local search
        performLocalSearch(query);
      }
    } catch (error) {
      console.error('Vector search failed:', error);
      // Fallback to local search
      performLocalSearch(query);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    saveRecentSearch(query);

    if (searchType === 'local') {
      performLocalSearch(query);
    } else {
      await performVectorSearch(query, searchType);
    }
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    updateContentFilters({ search: '' });
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'pdf': return <FileText className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const getSearchTypeDescription = (type: string) => {
    switch (type) {
      case 'local': return 'Search through downloaded content using keywords';
      case 'vector': return 'AI-powered semantic search for meaning and context';
      case 'hybrid': return 'Combined keyword and semantic search for best results';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Search className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Search</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Search through your scraped content using keywords or AI-powered semantic search
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search your content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                icon={<Search size={16} />}
                className="text-lg"
              />
            </div>
            <Button
              onClick={() => handleSearch()}
              disabled={isSearching || !searchQuery.trim()}
              className="px-8"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
            {searchQuery && (
              <Button variant="ghost" onClick={clearSearch}>
                Clear
              </Button>
            )}
          </div>

          {/* Search Type Selection */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Search Type:</span>
            {[
              { value: 'local', label: 'Local', icon: Clock },
              { value: 'vector', label: 'AI Semantic', icon: Zap },
              { value: 'hybrid', label: 'Hybrid', icon: Target }
            ].map(({ value, label, icon: Icon }) => (
              <label key={value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  value={value}
                  checked={searchType === value}
                  onChange={(e) => setSearchType(e.target.value as any)}
                  className="text-blue-600"
                />
                <Icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
              </label>
            ))}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            {getSearchTypeDescription(searchType)}
          </p>

          {/* Advanced Options */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Advanced Options
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && !searchQuery && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => handleQuickSearch(search)}
                className="text-blue-600 hover:bg-blue-50"
              >
                <Clock className="w-3 h-3 mr-1" />
                {search}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {/* Results Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Search Results ({searchResults.length})
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Found {searchResults.length} items matching "{searchQuery}"
                </p>
              </div>
              
              {/* Content Type Filter */}
              <div className="flex items-center space-x-2">
                {['all', 'image', 'pdf', 'video', 'document'].map((type) => (
                  <Button
                    key={type}
                    variant={contentFilters.type === type ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => updateContentFilters({ type })}
                    className="capitalize"
                  >
                    {getContentTypeIcon(type)}
                    <span className="ml-1">{type}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Grid/List */}
          <div className="p-6">
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                : 'space-y-2'
            }>
              {searchResults.map((item, index) => (
                <div key={item.id || `${item.url}-${index}`} className="relative">
                  <ContentItem
                    content={item}
                    viewMode={viewMode}
                    selected={false}
                    onSelect={() => {}}
                    onView={() => setSelectedContent(item)}
                  />
                  {item.relevanceScore && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      {Math.round(item.relevanceScore * 100)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {searchQuery && searchResults.length === 0 && !isSearching && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No results found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No content matches your search for "{searchQuery}"
          </p>
          <div className="space-x-2">
            <Button variant="ghost" onClick={() => setSearchType('hybrid')}>
              Try AI Search
            </Button>
            <Button variant="ghost" onClick={clearSearch}>
              Clear Search
            </Button>
          </div>
        </div>
      )}

      {/* Content Viewer Modal */}
      {selectedContent && (
        <ContentViewer
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
          onNext={() => {
            const currentIndex = searchResults.findIndex(item => item.url === selectedContent.url);
            const nextIndex = (currentIndex + 1) % searchResults.length;
            setSelectedContent(searchResults[nextIndex]);
          }}
          onPrevious={() => {
            const currentIndex = searchResults.findIndex(item => item.url === selectedContent.url);
            const prevIndex = currentIndex === 0 ? searchResults.length - 1 : currentIndex - 1;
            setSelectedContent(searchResults[prevIndex]);
          }}
          showNavigation={searchResults.length > 1}
        />
      )}
    </div>
  );
};
