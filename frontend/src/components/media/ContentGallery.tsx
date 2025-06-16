import React, { useState, useMemo } from 'react';
import { Search, Grid, List, Download, Filter, Eye, X } from 'lucide-react';
import { useScrapingStore, useScrapingSelectors } from '../../store/scrapingStore';
import type { ScrapedContent } from '../../types/api';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { ContentViewer } from './ContentViewer';
import { ContentItem } from './ContentItem';
import { ContentFilters } from './ContentFilters';

interface ContentGalleryProps {
  contentType: string;
  showOnlySuccessful?: boolean;
}

export const ContentGallery: React.FC<ContentGalleryProps> = ({
  contentType,
  showOnlySuccessful = false,
}) => {
  const { viewMode, setViewMode, contentFilters, updateContentFilters } = useScrapingStore();
  const { getFilteredContent } = useScrapingSelectors();
  const [selectedContent, setSelectedContent] = useState<ScrapedContent | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Get filtered content
  const content = useMemo(() => {
    let filtered = getFilteredContent(contentType === 'all' ? undefined : contentType);
    
    if (showOnlySuccessful) {
      filtered = filtered.filter(item => item.success);
    }
    
    return filtered;
  }, [getFilteredContent, contentType, showOnlySuccessful]);

  const handleSearch = (value: string) => {
    updateContentFilters({ search: value });
  };

  const handleSelectItem = (url: string, selected: boolean) => {
    const newSelected = new Set(selectedItems);
    if (selected) {
      newSelected.add(url);
    } else {
      newSelected.delete(url);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === content.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(content.map(item => item.url)));
    }
  };

  const handleBulkDownload = async () => {
    const selectedContent = content.filter(item => selectedItems.has(item.url));
    const { currentSession } = useScrapingStore.getState();

    if (!currentSession || selectedContent.length === 0) return;

    try {
      // Create a zip file with all selected content
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      let downloadCount = 0;

      for (const item of selectedContent) {
        if (item.success) {
          try {
            // Get download URL - prefer public_url, fall back to API endpoint
            let downloadUrl = '';
            if (item.public_url) {
              downloadUrl = item.public_url;
            } else if (item.file_path) {
              downloadUrl = `/api/content/${currentSession.id}/${item.file_path}`;
            }

            if (downloadUrl) {
              const response = await fetch(downloadUrl);
              if (response.ok) {
                const blob = await response.blob();
                const filename = item.title || item.filename || item.file_path?.split('/').pop() || `file_${downloadCount}`;
                zip.file(filename, blob);
                downloadCount++;
              }
            }
          } catch (error) {
            console.error(`Failed to download ${item.url}:`, error);
          }
        }
      }

      if (downloadCount > 0) {
        // Generate and download the zip file
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `scraped-content-${currentSession.domain}-${Date.now()}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Clear selection
        setSelectedItems(new Set());
      }
    } catch (error) {
      console.error('Bulk download failed:', error);
    }
  };

  const getContentTypeLabel = () => {
    switch (contentType) {
      case 'image': return 'Images';
      case 'pdf': return 'PDFs';
      case 'video': return 'Videos';
      case 'document': return 'Documents';
      case 'all': return showOnlySuccessful ? 'Downloaded Content' : 'All Content';
      default: return 'Content';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {getContentTypeLabel()} ({content.length})
          </h2>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} className="mr-2" />
              Filters
            </Button>
            
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none border-r border-gray-300 dark:border-gray-600"
              >
                <Grid size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Search and bulk actions */}
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search content..."
              value={contentFilters.search}
              onChange={(e) => handleSearch(e.target.value)}
              icon={<Search size={16} />}
            />
          </div>
          
          {selectedItems.size > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedItems.size} selected
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleBulkDownload}
              >
                <Download size={16} className="mr-2" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedItems(new Set())}
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <ContentFilters />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {content.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Eye size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No content found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {contentFilters.search 
                ? 'Try adjusting your search or filters'
                : 'Start a scraping session to see content here'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Select all checkbox */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItems.size === content.length && content.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Select all
                </span>
              </label>
            </div>

            {/* Content grid/list */}
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                : 'space-y-2'
            }>
              {content.map((item, index) => (
                <ContentItem
                  key={item.id || `${item.url}-${index}`}
                  content={item}
                  viewMode={viewMode}
                  selected={selectedItems.has(item.url)}
                  onSelect={(selected) => handleSelectItem(item.url, selected)}
                  onView={() => setSelectedContent(item)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content viewer modal */}
      {selectedContent && (
        <ContentViewer
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
          onNext={() => {
            const currentIndex = content.findIndex(item => item.url === selectedContent.url);
            const nextIndex = (currentIndex + 1) % content.length;
            setSelectedContent(content[nextIndex]);
          }}
          onPrevious={() => {
            const currentIndex = content.findIndex(item => item.url === selectedContent.url);
            const prevIndex = currentIndex === 0 ? content.length - 1 : currentIndex - 1;
            setSelectedContent(content[prevIndex]);
          }}
          showNavigation={content.length > 1}
        />
      )}
    </div>
  );
};
