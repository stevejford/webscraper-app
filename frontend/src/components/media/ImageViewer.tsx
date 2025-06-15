import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Move, Maximize } from 'lucide-react';
import type { ScrapedContent } from '../../types/api';
import { Button } from '../common/Button';
import { apiService } from '../../services/api';
import { useScrapingStore } from '../../store/scrapingStore';

interface ImageViewerProps {
  content: ScrapedContent;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  content,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentSession } = useScrapingStore();

  const imageUrl = content.file_path && currentSession
    ? apiService.getContentFileUrl(currentSession.id, content.file_path)
    : content.url;

  useEffect(() => {
    // Reset view when content changes
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setImageLoaded(false);
    setImageError(false);
  }, [content.url]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 0.1));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.1, Math.min(5, prev * delta)));
  };

  if (imageError) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-700">
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Failed to load image
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-100 dark:bg-gray-700">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          disabled={zoom <= 0.1}
        >
          <ZoomOut size={16} />
        </Button>
        
        <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem] text-center">
          {Math.round(zoom * 100)}%
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          disabled={zoom >= 5}
        >
          <ZoomIn size={16} />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRotate}
        >
          <RotateCw size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
        >
          Reset
        </Button>
        
        {onToggleFullscreen && (
          <>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFullscreen}
            >
              <Maximize size={16} />
            </Button>
          </>
        )}
      </div>

      {/* Image container */}
      <div
        ref={containerRef}
        className={`overflow-hidden ${isFullscreen ? 'h-screen' : 'h-96'} flex items-center justify-center cursor-${
          zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        <img
          ref={imageRef}
          src={imageUrl}
          alt={content.title || 'Image'}
          className="max-w-none transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            opacity: imageLoaded ? 1 : 0,
          }}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          draggable={false}
        />
      </div>

      {/* Image info */}
      {imageLoaded && imageRef.current && (
        <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 text-sm text-gray-600 dark:text-gray-400">
          {imageRef.current.naturalWidth} × {imageRef.current.naturalHeight}
        </div>
      )}
    </div>
  );
};
