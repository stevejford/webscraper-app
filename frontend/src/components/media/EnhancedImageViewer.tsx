import React, { useState, useEffect } from 'react';
import { ScrapedContent } from '../../types/api';
import { useScrapingStore } from '../../store/scrapingStore';
import { supabase } from '../../services/supabase';

interface EnhancedImageViewerProps {
  content: ScrapedContent;
  onClose: () => void;
  showTransformControls?: boolean;
}

interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  resize?: 'cover' | 'contain' | 'fill';
}

export const EnhancedImageViewer: React.FC<EnhancedImageViewerProps> = ({ 
  content, 
  onClose, 
  showTransformControls = true 
}) => {
  const { currentSession } = useScrapingStore();
  const [transformOptions, setTransformOptions] = useState<ImageTransformOptions>({
    quality: 80,
    format: 'webp',
    resize: 'contain'
  });
  const [transformedUrl, setTransformedUrl] = useState<string>('');
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Get the base image URL
  useEffect(() => {
    const getImageUrl = () => {
      // Use public_url if available (from Supabase Storage)
      if (content.public_url) {
        return content.public_url;
      }
      // Fall back to API endpoint if file_path is available
      if (content.file_path && currentSession) {
        return `/api/content/${currentSession.id}/${content.file_path}`;
      }
      // Final fallback to original URL
      return content.url;
    };

    const baseUrl = getImageUrl();
    setOriginalUrl(baseUrl);
    setTransformedUrl(baseUrl);
  }, [content, currentSession]);

  // Generate transformed URL using Supabase's image transformation
  const generateTransformedUrl = async (options: ImageTransformOptions) => {
    if (!content.public_url || !content.file_path) {
      return originalUrl;
    }

    try {
      setLoading(true);
      
      // Use Supabase's built-in image transformation
      const { data } = supabase.storage
        .from('scraped-content')
        .getPublicUrl(content.file_path, {
          transform: {
            width: options.width,
            height: options.height,
            quality: options.quality,
            format: options.format,
            resize: options.resize
          }
        });

      return data.publicUrl;
    } catch (err) {
      console.error('Error generating transformed URL:', err);
      return originalUrl;
    } finally {
      setLoading(false);
    }
  };

  // Apply transformations
  const applyTransformations = async () => {
    const newUrl = await generateTransformedUrl(transformOptions);
    setTransformedUrl(newUrl);
  };

  // Reset to original
  const resetToOriginal = () => {
    setTransformedUrl(originalUrl);
    setTransformOptions({
      quality: 80,
      format: 'webp',
      resize: 'contain'
    });
  };

  // Download with transformations
  const downloadTransformed = async () => {
    try {
      const url = await generateTransformedUrl(transformOptions);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transformed_${content.title || content.filename || 'image'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download transformed image');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold truncate">
              {content.title || content.filename || 'Image'}
            </h3>
            <p className="text-sm text-gray-500">
              {content.file_size && `${(content.file_size / 1024).toFixed(1)} KB`}
              {content.mime_type && ` • ${content.mime_type}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Image Display */}
          <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Applying transformations...</p>
              </div>
            ) : (
              <img
                src={transformedUrl}
                alt={content.alt_text || content.title || 'Image'}
                className="max-w-full max-h-full object-contain"
                onError={() => setError('Failed to load image')}
              />
            )}
            {error && (
              <div className="text-center text-red-600">
                <p>{error}</p>
                <button 
                  onClick={() => setError('')}
                  className="mt-2 text-blue-600 hover:underline"
                >
                  Retry
                </button>
              </div>
            )}
          </div>

          {/* Transform Controls */}
          {showTransformControls && (
            <div className="w-80 border-l bg-white p-4 overflow-y-auto">
              <h4 className="font-semibold mb-4">Image Transformations</h4>
              
              {/* Dimensions */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Dimensions</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Width"
                    value={transformOptions.width || ''}
                    onChange={(e) => setTransformOptions(prev => ({
                      ...prev,
                      width: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                    className="border rounded px-2 py-1 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Height"
                    value={transformOptions.height || ''}
                    onChange={(e) => setTransformOptions(prev => ({
                      ...prev,
                      height: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                    className="border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>

              {/* Quality */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Quality: {transformOptions.quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={transformOptions.quality || 80}
                  onChange={(e) => setTransformOptions(prev => ({
                    ...prev,
                    quality: parseInt(e.target.value)
                  }))}
                  className="w-full"
                />
              </div>

              {/* Format */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Format</label>
                <select
                  value={transformOptions.format || 'webp'}
                  onChange={(e) => setTransformOptions(prev => ({
                    ...prev,
                    format: e.target.value as 'webp' | 'jpeg' | 'png'
                  }))}
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="webp">WebP (Recommended)</option>
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                </select>
              </div>

              {/* Resize Mode */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Resize Mode</label>
                <select
                  value={transformOptions.resize || 'contain'}
                  onChange={(e) => setTransformOptions(prev => ({
                    ...prev,
                    resize: e.target.value as 'cover' | 'contain' | 'fill'
                  }))}
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="contain">Contain (Maintain aspect ratio)</option>
                  <option value="cover">Cover (Fill dimensions)</option>
                  <option value="fill">Fill (Stretch to fit)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={applyTransformations}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Apply Transformations
                </button>
                <button
                  onClick={resetToOriginal}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                >
                  Reset to Original
                </button>
                <button
                  onClick={downloadTransformed}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                  Download Transformed
                </button>
              </div>

              {/* Image Info */}
              <div className="mt-6 pt-4 border-t">
                <h5 className="font-medium mb-2">Image Information</h5>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Original URL:</strong> {content.url}</p>
                  {content.source_page_url && (
                    <p><strong>Source Page:</strong> {content.source_page_url}</p>
                  )}
                  {content.alt_text && (
                    <p><strong>Alt Text:</strong> {content.alt_text}</p>
                  )}
                  {content.context && (
                    <p><strong>Context:</strong> {content.context}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
