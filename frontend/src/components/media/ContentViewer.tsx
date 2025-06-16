import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, RotateCw, Maximize } from 'lucide-react';
import type { ScrapedContent } from '../../types/api';
import { Button } from '../common/Button';
import { ImageViewer } from './ImageViewer';
import { PDFViewer } from './PDFViewer';
import { VideoViewer } from './VideoViewer';
import { TextViewer } from './TextViewer';
import { apiService } from '../../services/api';
import { useScrapingStore } from '../../store/scrapingStore';

interface ContentViewerProps {
  content: ScrapedContent;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
}

export const ContentViewer: React.FC<ContentViewerProps> = ({
  content,
  onClose,
  onNext,
  onPrevious,
  showNavigation = false,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { currentSession } = useScrapingStore();

  const handleDownload = () => {
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        if (showNavigation && onPrevious) onPrevious();
        break;
      case 'ArrowRight':
        if (showNavigation && onNext) onNext();
        break;
      case 'f':
      case 'F':
        setIsFullscreen(!isFullscreen);
        break;
    }
  };

  const renderContent = () => {
    switch (content.content_type) {
      case 'image':
        return (
          <ImageViewer
            content={content}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          />
        );
      
      case 'pdf':
        return (
          <PDFViewer
            content={content}
            isFullscreen={isFullscreen}
          />
        );
      
      case 'video':
        return (
          <VideoViewer
            content={content}
            isFullscreen={isFullscreen}
          />
        );
      
      case 'text':
      case 'document':
        return (
          <TextViewer
            content={content}
            isFullscreen={isFullscreen}
          />
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <div className="text-gray-400 mb-2">
                <Download size={48} className="mx-auto" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Preview not available for this file type
              </p>
              <Button onClick={handleDownload}>
                <Download size={16} className="mr-2" />
                Download File
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4 ${
        isFullscreen ? 'p-0' : ''
      }`}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-full overflow-hidden ${
        isFullscreen ? 'max-w-none max-h-none rounded-none' : ''
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
              {content.title || content.url.split('/').pop() || 'Untitled'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {content.url}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {/* Navigation buttons */}
            {showNavigation && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPrevious}
                  disabled={!onPrevious}
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNext}
                  disabled={!onNext}
                >
                  <ChevronRight size={16} />
                </Button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
              </>
            )}
            
            {/* Action buttons */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize size={16} />
            </Button>
            
            {content.file_path && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
              >
                <Download size={16} />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className={`overflow-auto ${isFullscreen ? 'h-screen' : 'max-h-96'}`}>
          {renderContent()}
        </div>

        {/* Footer with metadata */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Type: {content.content_type}</span>
              {content.file_size && (
                <span>Size: {(content.file_size / 1024).toFixed(1)} KB</span>
              )}
              {content.mime_type && (
                <span>MIME: {content.mime_type}</span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                content.success 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {content.success ? 'Downloaded' : 'Failed'}
              </span>
              
              <span>
                {new Date(content.downloaded_at).toLocaleString()}
              </span>
            </div>
          </div>
          
          {content.error && (
            <div className="mt-2 p-2 bg-red-100 dark:bg-red-900 rounded text-sm text-red-800 dark:text-red-200">
              Error: {content.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
