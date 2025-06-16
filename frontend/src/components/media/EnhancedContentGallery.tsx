import React, { useState, useMemo } from 'react';
import { ScrapedContent } from '../../types/api';
import { ContentItem } from './ContentItem';
import { ContentViewer } from './ContentViewer';
import { EnhancedImageViewer } from './EnhancedImageViewer';
import { EnhancedPDFViewer } from './EnhancedPDFViewer';
import { EnhancedAudioPlayer } from './EnhancedAudioPlayer';

interface EnhancedContentGalleryProps {
  contents: ScrapedContent[];
  title?: string;
  useEnhancedViewers?: boolean;
}

export const EnhancedContentGallery: React.FC<EnhancedContentGalleryProps> = ({ 
  contents, 
  title = "Downloaded Content",
  useEnhancedViewers = true 
}) => {
  const [selectedContent, setSelectedContent] = useState<ScrapedContent | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort contents
  const filteredAndSortedContents = useMemo(() => {
    let filtered = contents;

    // Filter by type
    if (filterType !== 'all') {
      filtered = contents.filter(content => content.content_type === filterType);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          const nameA = a.title || a.filename || a.url;
          const nameB = b.title || b.filename || b.url;
          comparison = nameA.localeCompare(nameB);
          break;
        case 'size':
          comparison = (a.file_size || 0) - (b.file_size || 0);
          break;
        case 'date':
          const dateA = new Date(a.downloaded_at || 0).getTime();
          const dateB = new Date(b.downloaded_at || 0).getTime();
          comparison = dateA - dateB;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [contents, filterType, sortBy, sortOrder]);

  // Get content type counts
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: contents.length };
    contents.forEach(content => {
      const type = content.content_type || 'other';
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [contents]);

  // Enhanced viewer selection
  const renderEnhancedViewer = () => {
    if (!selectedContent || !useEnhancedViewers) {
      return selectedContent ? (
        <ContentViewer
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
        />
      ) : null;
    }

    const contentType = selectedContent.content_type;
    const mimeType = selectedContent.mime_type || '';

    // Image viewer for images
    if (contentType === 'image' || mimeType.startsWith('image/')) {
      return (
        <EnhancedImageViewer
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
        />
      );
    }

    // PDF viewer for PDFs
    if (contentType === 'pdf' || mimeType === 'application/pdf') {
      return (
        <EnhancedPDFViewer
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
        />
      );
    }

    // Audio player for audio files
    if (contentType === 'audio' || mimeType.startsWith('audio/')) {
      return (
        <EnhancedAudioPlayer
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
        />
      );
    }

    // Fallback to standard viewer
    return (
      <ContentViewer
        content={selectedContent}
        onClose={() => setSelectedContent(null)}
      />
    );
  };

  // Bulk download functionality
  const downloadAll = async () => {
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      let downloadCount = 0;

      for (const content of filteredAndSortedContents) {
        if (content.success && content.public_url) {
          try {
            const response = await fetch(content.public_url);
            if (response.ok) {
              const blob = await response.blob();
              const filename = content.title || content.filename || `file_${downloadCount}`;
              zip.file(filename, blob);
              downloadCount++;
            }
          } catch (error) {
            console.error(`Failed to download ${content.url}:`, error);
          }
        }
      }

      if (downloadCount > 0) {
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `scraped-content-${Date.now()}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Bulk download failed:', error);
    }
  };

  if (contents.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-gray-600">No content downloaded yet</p>
        <p className="text-sm text-gray-500 mt-2">Start a scraping session to see downloaded media files here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {filteredAndSortedContents.length} of {contents.length} items
          </div>
          {/* View Mode Toggle */}
          <div className="flex border rounded">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-lg">
        {/* Type Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Filter:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="all">All ({typeCounts.all})</option>
            {Object.entries(typeCounts)
              .filter(([type]) => type !== 'all')
              .map(([type, count]) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)} ({count})
                </option>
              ))}
          </select>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'size' | 'date')}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={downloadAll}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
          >
            📥 Download All
          </button>
        </div>

        {/* Enhanced Viewers Toggle */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">
            <input
              type="checkbox"
              checked={useEnhancedViewers}
              onChange={(e) => {
                // This would need to be passed as a prop or managed by parent
                console.log('Enhanced viewers:', e.target.checked);
              }}
              className="mr-1"
            />
            Enhanced Viewers
          </label>
        </div>
      </div>

      {/* Content Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAndSortedContents.map((content, index) => (
            <ContentItem
              key={`${content.url}-${index}`}
              content={content}
              onView={() => setSelectedContent(content)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAndSortedContents.map((content, index) => (
            <div
              key={`${content.url}-${index}`}
              className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedContent(content)}
            >
              {/* Thumbnail/Icon */}
              <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                {content.content_type === 'image' ? '🖼️' :
                 content.content_type === 'pdf' ? '📄' :
                 content.content_type === 'audio' ? '🎵' :
                 content.content_type === 'video' ? '🎬' : '📁'}
              </div>
              
              {/* Content Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">
                  {content.title || content.filename || 'Untitled'}
                </h4>
                <p className="text-sm text-gray-500 truncate">{content.url}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                  <span>{content.content_type}</span>
                  {content.file_size && (
                    <span>{(content.file_size / 1024).toFixed(1)} KB</span>
                  )}
                  {content.downloaded_at && (
                    <span>{new Date(content.downloaded_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex-shrink-0 flex space-x-2">
                {content.content_type === 'audio' && (
                  <EnhancedAudioPlayer content={content} compact />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedContent(content);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Viewer Modal */}
      {renderEnhancedViewer()}
    </div>
  );
};
