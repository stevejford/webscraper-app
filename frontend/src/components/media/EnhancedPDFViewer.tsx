import React, { useState, useEffect } from 'react';
import { ScrapedContent } from '../../types/api';
import { useScrapingStore } from '../../store/scrapingStore';

interface EnhancedPDFViewerProps {
  content: ScrapedContent;
  onClose: () => void;
}

type ViewMode = 'embed' | 'object' | 'iframe';

export const EnhancedPDFViewer: React.FC<EnhancedPDFViewerProps> = ({ content, onClose }) => {
  const { currentSession } = useScrapingStore();
  const [viewMode, setViewMode] = useState<ViewMode>('iframe');
  const [hideToolbar, setHideToolbar] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Get PDF URL with fallback logic
  useEffect(() => {
    const getPdfUrl = () => {
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

    const url = getPdfUrl();
    setPdfUrl(url);
    setLoading(false);
  }, [content, currentSession]);

  // Get URL with toolbar control for iframe
  const getDisplayUrl = () => {
    if (viewMode === 'iframe' && hideToolbar) {
      return `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`;
    }
    return pdfUrl;
  };

  // Download PDF with specific filename
  const downloadPdf = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = content.title || content.filename || 'document.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open in new tab
  const openInNewTab = () => {
    window.open(pdfUrl, '_blank');
  };

  // Render PDF based on view mode
  const renderPDF = () => {
    const displayUrl = getDisplayUrl();
    const commonProps = {
      width: "100%",
      height: "100%",
      style: { border: 'none' }
    };

    switch (viewMode) {
      case 'embed':
        return (
          <embed
            src={displayUrl}
            type="application/pdf"
            {...commonProps}
            onError={() => setError('Failed to load PDF with embed tag')}
          />
        );

      case 'object':
        return (
          <object
            data={displayUrl}
            type="application/pdf"
            {...commonProps}
            onError={() => setError('Failed to load PDF with object tag')}
          >
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <p className="text-gray-600 mb-4">
                Your browser does not support PDF viewing with the object tag.
              </p>
              <div className="space-x-4">
                <button
                  onClick={downloadPdf}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Download PDF
                </button>
                <button
                  onClick={openInNewTab}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Open in New Tab
                </button>
              </div>
            </div>
          </object>
        );

      case 'iframe':
      default:
        return (
          <iframe
            src={displayUrl}
            {...commonProps}
            onError={() => setError('Failed to load PDF with iframe')}
            onLoad={() => setError('')}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-center">Loading PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[95vw] h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <div className="flex-1">
            <h3 className="text-lg font-semibold truncate">
              {content.title || content.filename || 'PDF Document'}
            </h3>
            <p className="text-sm text-gray-500">
              {content.file_size && `${(content.file_size / 1024 / 1024).toFixed(1)} MB`}
              {content.mime_type && ` • ${content.mime_type}`}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* View Mode Selector */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">View Mode:</label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as ViewMode)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="iframe">IFrame (Recommended)</option>
                <option value="embed">Embed</option>
                <option value="object">Object</option>
              </select>
            </div>

            {/* Toolbar Toggle (for iframe only) */}
            {viewMode === 'iframe' && (
              <div className="flex items-center space-x-2">
                <label className="text-sm">
                  <input
                    type="checkbox"
                    checked={hideToolbar}
                    onChange={(e) => setHideToolbar(e.target.checked)}
                    className="mr-1"
                  />
                  Hide Toolbar
                </label>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={downloadPdf}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                title="Download PDF"
              >
                📥 Download
              </button>
              <button
                onClick={openInNewTab}
                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                title="Open in New Tab"
              >
                🔗 New Tab
              </button>
              <button
                onClick={onClose}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                title="Close"
              >
                ✕ Close
              </button>
            </div>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 relative">
          {error ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="text-red-600 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-lg font-semibold">{error}</p>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  Try a different view mode or download the PDF directly.
                </p>
                
                <div className="flex space-x-4 justify-center">
                  <button
                    onClick={downloadPdf}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    📥 Download PDF
                  </button>
                  <button
                    onClick={openInNewTab}
                    className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
                  >
                    🔗 Open in New Tab
                  </button>
                </div>

                <div className="text-sm text-gray-500">
                  <p><strong>Original URL:</strong> {content.url}</p>
                  {content.source_page_url && (
                    <p><strong>Source Page:</strong> {content.source_page_url}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            renderPDF()
          )}
        </div>

        {/* Footer with PDF Info */}
        <div className="border-t bg-gray-50 p-3">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              <span><strong>Source:</strong> {content.url}</span>
              {content.source_page_url && (
                <span className="ml-4"><strong>Found on:</strong> {content.source_page_url}</span>
              )}
            </div>
            <div>
              {content.downloaded_at && (
                <span>Downloaded: {new Date(content.downloaded_at).toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
