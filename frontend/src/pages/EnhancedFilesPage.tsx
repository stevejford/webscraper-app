import React, { useState, useEffect } from 'react';
import { useScrapingStore } from '../store/scrapingStore';
import { ContentGallery } from '../components/media/ContentGallery';
import { EnhancedContentGallery } from '../components/media/EnhancedContentGallery';
import { AdvancedFileUpload } from '../components/media/AdvancedFileUpload';
import { ScrapedContent } from '../types/api';

interface FileUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  filename?: string;
}

export const EnhancedFilesPage: React.FC = () => {
  const { currentSession } = useScrapingStore();
  const [files, setFiles] = useState<ScrapedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [useEnhancedGallery, setUseEnhancedGallery] = useState(true);
  const [activeTab, setActiveTab] = useState<'downloaded' | 'upload' | 'manage'>('downloaded');

  useEffect(() => {
    const fetchFiles = async () => {
      if (!currentSession) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/page-content/${currentSession.id}`);
        if (response.ok) {
          const data = await response.json();
          // Extract files from stored_files array
          setFiles(data.stored_files || []);
        } else {
          setError('Failed to fetch files');
        }
      } catch (err) {
        setError('Error loading files');
        console.error('Error fetching files:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [currentSession]);

  const handleUploadComplete = (result: FileUploadResult) => {
    if (result.success) {
      console.log('File uploaded successfully:', result);
      // Refresh files list
      window.location.reload();
    } else {
      console.error('Upload failed:', result.error);
    }
  };

  const handleUploadProgress = (progress: { loaded: number; total: number; percentage: number }) => {
    console.log('Upload progress:', progress);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );
  }

  if (!currentSession) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No active session. Start a scraping session to view files.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Enhanced Media Management</h1>
        <p className="text-gray-600">
          Session: {currentSession.domain} • {files.length} files
        </p>
        <p className="text-sm text-blue-600 mt-1">
          ✨ Enhanced with Supabase Storage features: image transformations, advanced PDF viewer, and audio player
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('downloaded')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'downloaded'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📁 Downloaded Files ({files.length})
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📤 Upload Files
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'manage'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ⚙️ Manage & Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'downloaded' && (
        <div className="space-y-6">
          {/* Gallery Type Toggle */}
          <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={useEnhancedGallery}
                  onChange={(e) => setUseEnhancedGallery(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium">✨ Use Enhanced Gallery</span>
              </label>
              <span className="text-xs text-gray-600">
                Enhanced gallery includes image transformations, advanced PDF viewer, and audio player
              </span>
            </div>
          </div>

          {/* Content Gallery */}
          {useEnhancedGallery ? (
            <EnhancedContentGallery
              contents={files}
              title="📁 Downloaded Media Files"
              useEnhancedViewers={true}
            />
          ) : (
            <ContentGallery
              contentType="all"
              showOnlySuccessful={true}
            />
          )}
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">📤 Upload Files to Supabase Storage</h2>
            <p className="text-gray-600 mb-6">
              Upload images, PDFs, audio files, and other media directly to your Supabase storage bucket.
              Files will be automatically processed and made available in your gallery with enhanced viewing capabilities.
            </p>
          </div>

          <AdvancedFileUpload
            bucketName="scraped-content"
            folder={currentSession.id}
            allowedTypes={['image/*', 'application/pdf', 'audio/*', 'video/*', 'text/*']}
            maxSize={100 * 1024 * 1024} // 100MB
            onUploadComplete={handleUploadComplete}
            onUploadProgress={handleUploadProgress}
            multiple={true}
          />

          {/* Upload Features */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-medium text-blue-900 mb-4">🚀 Enhanced Upload Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-2">🖼️ Image Features</h4>
                <ul className="space-y-1">
                  <li>• On-the-fly transformations (resize, format, quality)</li>
                  <li>• WebP conversion for optimal performance</li>
                  <li>• Automatic optimization via Supabase CDN</li>
                  <li>• Advanced viewer with transformation controls</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">📄 PDF Features</h4>
                <ul className="space-y-1">
                  <li>• Multiple viewing modes (iframe, embed, object)</li>
                  <li>• Toolbar hiding for clean presentation</li>
                  <li>• Direct download with custom filenames</li>
                  <li>• Fallback options for browser compatibility</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">🎵 Audio Features</h4>
                <ul className="space-y-1">
                  <li>• Enhanced playback controls</li>
                  <li>• Variable playback speed (0.5x to 2x)</li>
                  <li>• Progress tracking and seeking</li>
                  <li>• Compact and full-screen modes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">🔒 Security Features</h4>
                <ul className="space-y-1">
                  <li>• Client-side and server-side validation</li>
                  <li>• Automatic unique filename generation</li>
                  <li>• Progress tracking with retry logic</li>
                  <li>• Secure storage with RLS policies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">⚙️ Storage Management & Settings</h2>
          </div>

          {/* Storage Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">📊 Total Files</h3>
              <p className="text-2xl font-bold text-blue-600">{files.length}</p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">💾 Total Size</h3>
              <p className="text-2xl font-bold text-green-600">
                {(files.reduce((sum, file) => sum + (file.file_size || 0), 0) / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">🖼️ Images</h3>
              <p className="text-2xl font-bold text-purple-600">
                {files.filter(f => f.content_type === 'image').length}
              </p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">📄 PDFs</h3>
              <p className="text-2xl font-bold text-red-600">
                {files.filter(f => f.content_type === 'pdf').length}
              </p>
            </div>
          </div>

          {/* File Types Breakdown */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-4">📁 File Types Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {Object.entries(
                files.reduce((acc, file) => {
                  const type = file.content_type || 'other';
                  acc[type] = (acc[type] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="capitalize font-medium">
                    {type === 'image' ? '🖼️' : 
                     type === 'pdf' ? '📄' : 
                     type === 'audio' ? '🎵' : 
                     type === 'video' ? '🎬' : '📁'} {type}:
                  </span>
                  <span className="font-bold text-blue-600">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Display Settings */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-4">🎨 Display Settings</h3>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={useEnhancedGallery}
                  onChange={(e) => setUseEnhancedGallery(e.target.checked)}
                  className="mr-3"
                />
                <div>
                  <span className="font-medium">✨ Enhanced Gallery</span>
                  <p className="text-sm text-gray-600">
                    Use advanced viewers with image transformations, PDF controls, and audio players
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Supabase Storage Info */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-4">☁️ Supabase Storage Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p><strong>🪣 Bucket:</strong> scraped-content</p>
                <p><strong>📁 Session Folder:</strong> {currentSession.id}</p>
                <p><strong>🔐 Access:</strong> Public bucket with RLS policies</p>
              </div>
              <div>
                <p><strong>🌐 CDN:</strong> Global content delivery network enabled</p>
                <p><strong>🔄 Transformations:</strong> On-the-fly image optimization available</p>
                <p><strong>⚡ Performance:</strong> Optimized for fast content delivery</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
