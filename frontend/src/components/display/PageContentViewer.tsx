import React, { useState } from 'react';
import { FileText, ExternalLink, Eye, Download, Search, Filter } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useScrapingStore } from '../../store/scrapingStore';
import { apiService } from '../../services/api';
import type { PageContent, ScrapedContent } from '../../types/api';

interface PageContentViewerProps {
  sessionId: string;
}

export const PageContentViewer: React.FC<PageContentViewerProps> = ({ sessionId }) => {
  const { currentSession } = useScrapingStore();
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'images' | 'links' | 'media'>('all');
  const [showHtml, setShowHtml] = useState(false);

  const pageContents = currentSession?.result?.page_contents || [];
  const scrapedContent = currentSession?.result?.scraped_content || [];

  // Filter pages based on search term
  const filteredPages = pageContents.filter(page =>
    page.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.text_content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get related content for a page
  const getRelatedContent = (pageUrl: string): ScrapedContent[] => {
    return scrapedContent.filter(content => content.source_page_url === pageUrl);
  };

  // Get content by type for a page
  const getContentByType = (pageUrl: string, type: string): string[] => {
    const page = pageContents.find(p => p.url === pageUrl);
    if (!page) return [];

    switch (type) {
      case 'images':
        return page.images;
      case 'links':
        return page.links;
      case 'media':
        return page.media_files;
      default:
        return [];
    }
  };

  const handleDownloadHtml = async (page: PageContent) => {
    if (!page.file_path) return;

    try {
      const blob = await apiService.downloadFile(page.file_path);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${page.title || 'page'}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to download HTML:', error);
    }
  };

  const handleViewContent = (content: ScrapedContent) => {
    if (content.file_path) {
      const url = apiService.getContentFileUrl(sessionId, content.file_path);
      window.open(url, '_blank');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Page Content & Context
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {pageContents.length} pages scraped
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search pages by title, URL, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Content</option>
            <option value="images">With Images</option>
            <option value="links">With Links</option>
            <option value="media">With Media</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Scraped Pages
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredPages.map((page, index) => {
              const relatedContent = getRelatedContent(page.url);
              const hasImages = page.images.length > 0;
              const hasLinks = page.links.length > 0;
              const hasMedia = page.media_files.length > 0;

              // Apply filter
              if (filterType === 'images' && !hasImages) return null;
              if (filterType === 'links' && !hasLinks) return null;
              if (filterType === 'media' && !hasMedia) return null;

              return (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPage?.url === page.url
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedPage(page)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {page.title || 'Untitled Page'}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {page.url}
                      </p>
                      
                      {/* Content indicators */}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        {hasImages && (
                          <span className="flex items-center">
                            <Eye size={12} className="mr-1" />
                            {page.images.length} images
                          </span>
                        )}
                        {hasLinks && (
                          <span className="flex items-center">
                            <ExternalLink size={12} className="mr-1" />
                            {page.links.length} links
                          </span>
                        )}
                        {relatedContent.length > 0 && (
                          <span className="flex items-center">
                            <Download size={12} className="mr-1" />
                            {relatedContent.length} downloaded
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <FileText size={16} className="text-gray-400 ml-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Page Details */}
        <div className="space-y-4">
          {selectedPage ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Page Details
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHtml(!showHtml)}
                  >
                    {showHtml ? 'Show Text' : 'Show HTML'}
                  </Button>
                  {selectedPage.file_path && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadHtml(selectedPage)}
                    >
                      <Download size={16} className="mr-1" />
                      Download
                    </Button>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {selectedPage.title || 'Untitled Page'}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {selectedPage.url}
                </p>

                {selectedPage.meta_description && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedPage.meta_description}
                    </p>
                  </div>
                )}

                {selectedPage.headings.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Headings ({selectedPage.headings.length})
                    </h5>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {selectedPage.headings.slice(0, 10).map((heading, index) => (
                        <p key={index} className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {heading}
                        </p>
                      ))}
                      {selectedPage.headings.length > 10 && (
                        <p className="text-xs text-gray-500">
                          +{selectedPage.headings.length - 10} more...
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Content Preview */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content Preview
                  </h5>
                  <div className="bg-white dark:bg-gray-800 rounded border p-3 max-h-64 overflow-y-auto">
                    <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {showHtml 
                        ? selectedPage.html_content.slice(0, 2000) + (selectedPage.html_content.length > 2000 ? '...' : '')
                        : selectedPage.text_content.slice(0, 1000) + (selectedPage.text_content.length > 1000 ? '...' : '')
                      }
                    </pre>
                  </div>
                </div>

                {/* Related Downloaded Content */}
                {(() => {
                  const relatedContent = getRelatedContent(selectedPage.url);
                  return relatedContent.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Downloaded Content ({relatedContent.length})
                      </h5>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {relatedContent.map((content, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {content.alt_text || content.link_text || content.url.split('/').pop()}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {content.content_type} • {content.file_size ? `${(content.file_size / 1024).toFixed(1)}KB` : 'Unknown size'}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewContent(content)}
                            >
                              <Eye size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a page to view its content and context</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
