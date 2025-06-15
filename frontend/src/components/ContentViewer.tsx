import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Download, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut,
  RotateCw,
  Eye
} from 'lucide-react';
import { ScrapedContent } from '../types';

interface ContentViewerProps {
  content: ScrapedContent;
  onClose: () => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ content, onClose }) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleDownload = () => {
    if (content.file_path) {
      const link = document.createElement('a');
      link.href = content.file_path;
      link.download = content.url.split('/').pop() || 'download';
      link.click();
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 300));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const renderContent = () => {
    switch (content.content_type) {
      case 'image':
        return (
          <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg">
            <img
              src={content.file_path || content.url}
              alt={content.title || 'Scraped image'}
              className="max-w-full max-h-full object-contain transition-transform duration-200"
              style={{ 
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = content.url; // Fallback to original URL
              }}
            />
          </div>
        );

      case 'pdf':
        return (
          <div className="h-full bg-gray-100 dark:bg-gray-800 rounded-lg">
            {content.file_path ? (
              <iframe
                src={content.file_path}
                className="w-full h-full rounded-lg"
                title={content.title || 'PDF Document'}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Eye className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    PDF preview not available
                  </p>
                  <button
                    onClick={() => window.open(content.url, '_blank')}
                    className="btn-primary"
                  >
                    Open Original PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="h-full bg-white dark:bg-gray-900 rounded-lg p-6 overflow-auto">
            <div className="prose dark:prose-invert max-w-none">
              {content.title && (
                <h1 className="text-2xl font-bold mb-4">{content.title}</h1>
              )}
              {content.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-6">{content.description}</p>
              )}
              {content.text_content ? (
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {content.text_content}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No text content available</p>
              )}
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg">
            {content.file_path ? (
              <video
                controls
                className="max-w-full max-h-full rounded-lg"
                style={{ transform: `scale(${zoom / 100})` }}
              >
                <source src={content.file_path} />
                Your browser does not support video playback.
              </video>
            ) : (
              <div className="text-center">
                <Eye className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Video preview not available
                </p>
                <button
                  onClick={() => window.open(content.url, '_blank')}
                  className="btn-primary"
                >
                  Open Original Video
                </button>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <Eye className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Preview not available for this content type
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                {content.mime_type}
              </p>
              <button
                onClick={() => window.open(content.url, '_blank')}
                className="btn-primary"
              >
                Open Original
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {content.title || new URL(content.url).pathname.split('/').pop() || 'Content'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {content.url}
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-2 ml-4">
            {(content.content_type === 'image' || content.content_type === 'video') && (
              <>
                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem] text-center">
                  {zoom}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </>
            )}
            
            {content.content_type === 'image' && (
              <button
                onClick={handleRotate}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Rotate"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={() => window.open(content.url, '_blank')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Open original"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            
            {content.file_path && (
              <button
                onClick={handleDownload}
                className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/50 text-primary-600 dark:text-primary-400 transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 overflow-hidden">
          {renderContent()}
        </div>

        {/* Footer with metadata */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Type:</span>
              <span className="ml-2 font-medium capitalize">{content.content_type}</span>
            </div>
            {content.file_size && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Size:</span>
                <span className="ml-2 font-medium">{(content.file_size / 1024).toFixed(1)} KB</span>
              </div>
            )}
            {content.mime_type && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Format:</span>
                <span className="ml-2 font-medium font-mono text-xs">{content.mime_type}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500 dark:text-gray-400">Downloaded:</span>
              <span className="ml-2 font-medium">
                {new Date(content.downloaded_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContentViewer;
