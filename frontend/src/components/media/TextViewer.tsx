import React, { useState, useEffect } from 'react';
import { Copy, Download, Search } from 'lucide-react';
import type { ScrapedContent } from '../../types/api';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface TextViewerProps {
  content: ScrapedContent;
  isFullscreen?: boolean;
}

export const TextViewer: React.FC<TextViewerProps> = ({
  content,
  isFullscreen = false,
}) => {
  const [textContent, setTextContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);

  useEffect(() => {
    loadTextContent();
  }, [content]);

  useEffect(() => {
    if (searchTerm) {
      performSearch();
    } else {
      setSearchResults([]);
      setCurrentSearchIndex(-1);
    }
  }, [searchTerm, textContent]);

  const loadTextContent = async () => {
    try {
      setLoading(true);
      setError(null);

      let text = '';
      
      if (content.text_content) {
        // Use pre-extracted text content
        text = content.text_content;
      } else if (content.file_path) {
        // Fetch file content
        const response = await fetch(`/downloads/${content.file_path}`);
        if (!response.ok) {
          throw new Error('Failed to fetch file content');
        }
        text = await response.text();
      } else {
        // Fallback to URL content (might not work due to CORS)
        text = 'Content preview not available. Please download the file to view its contents.';
      }

      setTextContent(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const performSearch = () => {
    if (!searchTerm || !textContent) {
      setSearchResults([]);
      return;
    }

    const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = [];
    let match;

    while ((match = regex.exec(textContent)) !== null) {
      matches.push(match.index);
    }

    setSearchResults(matches);
    setCurrentSearchIndex(matches.length > 0 ? 0 : -1);
  };

  const highlightText = (text: string) => {
    if (!searchTerm || searchResults.length === 0) {
      return text;
    }

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (regex.test(part)) {
        const matchIndex = searchResults.findIndex(pos => 
          textContent.substring(pos, pos + searchTerm.length).toLowerCase() === part.toLowerCase()
        );
        const isCurrentMatch = matchIndex === currentSearchIndex;
        
        return (
          <span
            key={index}
            className={`${
              isCurrentMatch 
                ? 'bg-yellow-400 text-black' 
                : 'bg-yellow-200 dark:bg-yellow-600 text-black dark:text-white'
            } px-1 rounded`}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(textContent);
      // TODO: Show success toast
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const downloadText = () => {
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = content.title || 'content.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const navigateSearch = (direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = currentSearchIndex < searchResults.length - 1 ? currentSearchIndex + 1 : 0;
    } else {
      newIndex = currentSearchIndex > 0 ? currentSearchIndex - 1 : searchResults.length - 1;
    }
    
    setCurrentSearchIndex(newIndex);
    
    // Scroll to the current match
    const element = document.querySelector(`[data-search-index="${newIndex}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-700">
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Failed to load text content
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800">
      {/* Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search in text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={16} />}
            />
          </div>
          
          {searchResults.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentSearchIndex + 1} of {searchResults.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateSearch('prev')}
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateSearch('next')}
              >
                ↓
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
          >
            <Copy size={16} className="mr-2" />
            Copy
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadText}
          >
            <Download size={16} className="mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Text content */}
      <div className={`p-6 overflow-auto ${isFullscreen ? 'h-screen' : 'max-h-96'}`}>
        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
          {highlightText(textContent)}
        </pre>
      </div>
    </div>
  );
};
