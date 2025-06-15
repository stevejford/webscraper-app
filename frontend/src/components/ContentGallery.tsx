import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image, 
  FileText, 
  Play, 
  Download,
  Eye,
  Grid,
  List,
  Search,
  Filter
} from 'lucide-react';
import { ScrapedContent } from '../types';
import ContentViewer from './ContentViewer';

interface ContentGalleryProps {
  content: ScrapedContent[];
  contentType: string;
}

const ContentGallery: React.FC<ContentGalleryProps> = ({ content, contentType }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedContent, setSelectedContent] = useState<ScrapedContent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Filter content based on search and type
  const filteredContent = content.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.url.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || item.content_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  // Get unique content types for filter
  const contentTypes = ['all', ...Array.from(new Set(content.map(item => item.content_type)))];

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'video': return <Play className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pdf': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'video': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'document': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const GridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {filteredContent.map((item, index) => (
        <motion.div
          key={`${item.url}-${index}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
          onClick={() => setSelectedContent(item)}
        >
          {/* Thumbnail */}
          <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            {item.content_type === 'image' ? (
              <img
                src={item.thumbnail || item.file_path || item.url}
                alt={item.title || 'Content'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : (
              <div className="text-center p-4">
                <div className={`inline-flex p-3 rounded-full ${getTypeColor(item.content_type)}`}>
                  {getIcon(item.content_type)}
                </div>
              </div>
            )}
            <div className="hidden flex items-center justify-center w-full h-full">
              {getIcon(item.content_type)}
            </div>
          </div>

          {/* Content info */}
          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {item.title || item.url.split('/').pop() || 'Untitled'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatFileSize(item.file_size)}
            </p>
          </div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedContent(item);
                }}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                title="View"
              >
                <Eye className="w-4 h-4 text-white" />
              </button>
              {item.file_path && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const link = document.createElement('a');
                    link.href = item.file_path!;
                    link.download = item.url.split('/').pop() || 'download';
                    link.click();
                  }}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-2">
      {filteredContent.map((item, index) => (
        <motion.div
          key={`${item.url}-${index}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.02 }}
          className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer"
          onClick={() => setSelectedContent(item)}
        >
          {/* Icon/Thumbnail */}
          <div className="flex-shrink-0">
            {item.content_type === 'image' ? (
              <img
                src={item.thumbnail || item.file_path || item.url}
                alt={item.title || 'Content'}
                className="w-12 h-12 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : (
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(item.content_type)}`}>
                {getIcon(item.content_type)}
              </div>
            )}
            <div className="hidden w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700">
              {getIcon(item.content_type)}
            </div>
          </div>

          {/* Content details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {item.title || item.url.split('/').pop() || 'Untitled'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {item.url}
            </p>
            <div className="flex items-center space-x-4 mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.content_type)}`}>
                {getIcon(item.content_type)}
                <span className="ml-1 capitalize">{item.content_type}</span>
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(item.file_size)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(item.downloaded_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedContent(item);
              }}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            {item.file_path && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const link = document.createElement('a');
                  link.href = item.file_path!;
                  link.download = item.url.split('/').pop() || 'download';
                  link.click();
                }}
                className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/50 text-primary-600 dark:text-primary-400 transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
            >
              {contentTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* View toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {filteredContent.length} of {content.length} items
        {searchTerm && ` matching "${searchTerm}"`}
        {filterType !== 'all' && ` (${filterType})`}
      </div>

      {/* Content grid/list */}
      {filteredContent.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {getIcon(contentType)}
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || filterType !== 'all' ? 'No matching content found' : 'No content available'}
          </p>
        </div>
      ) : (
        viewMode === 'grid' ? <GridView /> : <ListView />
      )}

      {/* Content viewer modal */}
      <AnimatePresence>
        {selectedContent && (
          <ContentViewer
            content={selectedContent}
            onClose={() => setSelectedContent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentGallery;
