import React from 'react';
import { Eye, Download, FileText, Image, Video, File, AlertCircle, CheckCircle } from 'lucide-react';
import type { ScrapedContent } from '../../types/api';
import { Button } from '../common/Button';
import { formatFileSize, formatDate } from '../../utils/helpers';
import { apiService } from '../../services/api';
import { useScrapingStore } from '../../store/scrapingStore';

interface ContentItemProps {
  content: ScrapedContent;
  viewMode: 'grid' | 'list';
  selected: boolean;
  onSelect: (selected: boolean) => void;
  onView: () => void;
}

export const ContentItem: React.FC<ContentItemProps> = ({
  content,
  viewMode,
  selected,
  onSelect,
  onView,
}) => {
  const { currentSession } = useScrapingStore();
  const getContentIcon = () => {
    switch (content.content_type) {
      case 'image':
        return <Image size={20} className="text-blue-500" />;
      case 'pdf':
        return <FileText size={20} className="text-red-500" />;
      case 'video':
        return <Video size={20} className="text-purple-500" />;
      case 'document':
        return <FileText size={20} className="text-green-500" />;
      default:
        return <File size={20} className="text-gray-500" />;
    }
  };

  const getThumbnail = () => {
    if (content.content_type === 'image') {
      // Use public_url if available, otherwise fall back to API endpoint
      if (content.public_url) {
        return content.public_url;
      }
      if (content.file_path && currentSession) {
        return apiService.getContentFileUrl(currentSession.id, content.file_path);
      }
    }
    if (content.thumbnail) {
      return content.thumbnail;
    }
    return null;
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Use public_url if available, otherwise fall back to API endpoint
    let downloadUrl = '';
    if (content.public_url) {
      downloadUrl = content.public_url;
    } else if (content.file_path && currentSession) {
      downloadUrl = apiService.getContentFileUrl(currentSession.id, content.file_path);
    }

    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = content.title || content.filename || content.url.split('/').pop() || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onView();
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(!selected);
  };

  if (viewMode === 'grid') {
    return (
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border-2 ${
          selected ? 'border-blue-500' : 'border-transparent'
        }`}
        onClick={handleView}
      >
        {/* Selection checkbox */}
        <div className="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            checked={selected}
            onChange={handleSelect}
            onClick={(e) => e.stopPropagation()}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        {/* Status indicator */}
        <div className="absolute top-2 right-2 z-10">
          {content.success ? (
            <CheckCircle size={16} className="text-green-500" />
          ) : (
            <AlertCircle size={16} className="text-red-500" />
          )}
        </div>

        {/* Thumbnail or icon */}
        <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
          {getThumbnail() ? (
            <img
              src={getThumbnail()!}
              alt={content.title || 'Content'}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to icon if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`${getThumbnail() ? 'hidden' : ''} w-full h-full flex items-center justify-center`}>
            {getContentIcon()}
          </div>
        </div>

        {/* Content info */}
        <div className="p-3">
          <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate mb-1">
            {content.title || content.url.split('/').pop() || 'Untitled'}
          </h3>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">
            {content.url}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{content.content_type}</span>
            {content.file_size && (
              <span>{formatFileSize(content.file_size)}</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleView}
              className="text-xs"
            >
              <Eye size={12} className="mr-1" />
              View
            </Button>
            
            {content.file_path && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="text-xs"
              >
                <Download size={12} className="mr-1" />
                Download
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div
      className={`flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border-2 ${
        selected ? 'border-blue-500' : 'border-transparent'
      }`}
      onClick={handleView}
    >
      {/* Selection checkbox */}
      <input
        type="checkbox"
        checked={selected}
        onChange={handleSelect}
        onClick={(e) => e.stopPropagation()}
        className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />

      {/* Icon or thumbnail */}
      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden mr-3 flex-shrink-0">
        {getThumbnail() ? (
          <img
            src={getThumbnail()!}
            alt={content.title || 'Content'}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`${getThumbnail() ? 'hidden' : ''} w-full h-full flex items-center justify-center`}>
          {getContentIcon()}
        </div>
      </div>

      {/* Content info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">
            {content.title || content.url.split('/').pop() || 'Untitled'}
          </h3>
          
          <div className="flex items-center space-x-2 ml-4">
            {content.success ? (
              <CheckCircle size={16} className="text-green-500" />
            ) : (
              <AlertCircle size={16} className="text-red-500" />
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-1">
          {content.url}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span className="capitalize">{content.content_type}</span>
            {content.file_size && (
              <span>{formatFileSize(content.file_size)}</span>
            )}
            <span>{formatDate(content.downloaded_at)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleView}
              className="text-xs"
            >
              <Eye size={12} className="mr-1" />
              View
            </Button>
            
            {content.file_path && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="text-xs"
              >
                <Download size={12} className="mr-1" />
                Download
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
