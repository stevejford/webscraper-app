import React, { useState } from 'react';
import { FileText, Upload, Search, Filter, Grid, List, Download, Trash2, Eye, MoreVertical } from 'lucide-react';
import { useScrapingStore, useScrapingSelectors } from '../store/scrapingStore';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { ContentGallery } from '../components/media/ContentGallery';
import { ContentFilters } from '../components/media/ContentFilters';

export const FilesPage: React.FC = () => {
  const { currentSession, contentFilters, updateContentFilters, viewMode, setViewMode } = useScrapingStore();
  const { getFilteredContent } = useScrapingSelectors();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Debug: Log current session and content
  console.log('📁 FilesPage - Current session:', currentSession?.id);
  console.log('📁 FilesPage - Session has result:', !!currentSession?.result);
  console.log('📁 FilesPage - Scraped content count:', currentSession?.result?.scraped_content?.length || 0);

  // Get all content
  const allContent = getFilteredContent();
  console.log('📁 FilesPage - Filtered content count:', allContent.length);
  
  // Get content by type
  const contentByType = {
    all: allContent,
    image: allContent.filter(item => item.content_type === 'image'),
    pdf: allContent.filter(item => item.content_type === 'pdf'),
    video: allContent.filter(item => item.content_type === 'video'),
    document: allContent.filter(item => item.content_type === 'document'),
    text: allContent.filter(item => item.content_type === 'text'),
    other: allContent.filter(item => !['image', 'pdf', 'video', 'document', 'text'].includes(item.content_type))
  };

  const getTypeStats = () => {
    return {
      total: allContent.length,
      images: contentByType.image.length,
      pdfs: contentByType.pdf.length,
      videos: contentByType.video.length,
      documents: contentByType.document.length,
      text: contentByType.text.length,
      other: contentByType.other.length,
      totalSize: allContent.reduce((sum, item) => sum + (item.file_size || 0), 0)
    };
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const stats = getTypeStats();

  const fileTypes = [
    { id: 'all', label: 'All Files', count: stats.total, icon: FileText },
    { id: 'image', label: 'Images', count: stats.images, icon: FileText },
    { id: 'pdf', label: 'PDFs', count: stats.pdfs, icon: FileText },
    { id: 'video', label: 'Videos', count: stats.videos, icon: FileText },
    { id: 'document', label: 'Documents', count: stats.documents, icon: FileText },
    { id: 'text', label: 'Text Files', count: stats.text, icon: FileText },
    { id: 'other', label: 'Other', count: stats.other, icon: FileText }
  ];

  const handleBulkDownload = () => {
    // Implementation for bulk download
    console.log('Bulk download selected files');
  };

  const handleBulkDelete = () => {
    if (window.confirm('Are you sure you want to delete the selected files? This action cannot be undone.')) {
      // Implementation for bulk delete
      console.log('Bulk delete selected files');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Files</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Browse and manage all your scraped files and content
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search files by name, type, or content..."
              value={contentFilters.search}
              onChange={(e) => updateContentFilters({ search: e.target.value })}
              icon={<Search size={16} />}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <ContentFilters />
          </div>
        )}
      </div>

      {/* File Type Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {fileTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-4 rounded-lg border-2 transition-colors text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className={`text-lg font-bold ${isSelected ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
                  {type.count}
                </span>
              </div>
              <p className={`text-sm ${isSelected ? 'text-blue-700' : 'text-gray-600 dark:text-gray-400'}`}>
                {type.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Storage Usage */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Storage Usage</h3>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {formatFileSize(stats.totalSize)} total
          </span>
        </div>
        
        <div className="space-y-3">
          {fileTypes.slice(1).map((type) => {
            const typeContent = contentByType[type.id as keyof typeof contentByType];
            const typeSize = typeContent.reduce((sum, item) => sum + (item.file_size || 0), 0);
            const percentage = stats.totalSize > 0 ? (typeSize / stats.totalSize) * 100 : 0;
            
            if (type.count === 0) return null;
            
            return (
              <div key={type.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    type.id === 'image' ? 'bg-green-500' :
                    type.id === 'pdf' ? 'bg-red-500' :
                    type.id === 'video' ? 'bg-purple-500' :
                    type.id === 'document' ? 'bg-blue-500' :
                    type.id === 'text' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{type.label}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        type.id === 'image' ? 'bg-green-500' :
                        type.id === 'pdf' ? 'bg-red-500' :
                        type.id === 'video' ? 'bg-purple-500' :
                        type.id === 'document' ? 'bg-blue-500' :
                        type.id === 'text' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-16 text-right">
                    {formatFileSize(typeSize)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* File Content */}
      {currentSession ? (
        <ContentGallery 
          contentType={selectedType === 'all' ? 'all' : selectedType}
          showOnlySuccessful={false}
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Active Session
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start a scraping session to see files here, or select an existing session from the Sessions page.
          </p>
          <div className="space-x-2">
            <Button>
              Start New Session
            </Button>
            <Button variant="ghost">
              View Sessions
            </Button>
          </div>
        </div>
      )}

      {/* Bulk Actions (when files are selected) */}
      {/* This would be implemented with selection state from ContentGallery */}
      <div className="fixed bottom-6 right-6 space-y-2">
        <Button
          className="shadow-lg"
          onClick={handleBulkDownload}
        >
          <Download className="w-4 h-4 mr-2" />
          Download All
        </Button>
      </div>
    </div>
  );
};
