import React, { useState } from 'react';
import { History, Search, Download, Trash2, Eye, Calendar, Globe } from 'lucide-react';
import { useScrapingStore } from '../../store/scrapingStore';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { formatDate, formatDuration, formatNumber } from '../../utils/helpers';

export const SessionHistory: React.FC = () => {
  const { sessions, setCurrentSession } = useScrapingStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'pages'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredSessions = sessions
    .filter(session => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        session.id.toLowerCase().includes(searchLower) ||
        session.config.url.toLowerCase().includes(searchLower) ||
        session.status.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let aValue: number, bValue: number;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'duration':
          aValue = a.result?.statistics?.duration_seconds || 0;
          bValue = b.result?.statistics?.duration_seconds || 0;
          break;
        case 'pages':
          aValue = a.result?.statistics?.total_pages_scraped || 0;
          bValue = b.result?.statistics?.total_pages_scraped || 0;
          break;
        default:
          return 0;
      }
      
      const comparison = aValue - bValue;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleViewSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    // TODO: Implement session deletion
    console.log('Delete session:', sessionId);
  };

  const handleExportSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      const dataStr = JSON.stringify(session, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `session-${sessionId}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'running':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
      case 'error':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            <History size={24} className="inline mr-2" />
            Session History ({filteredSessions.length})
          </h2>
        </div>

        {/* Search and filters */}
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={16} />}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as 'date' | 'duration' | 'pages');
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="duration-desc">Longest Duration</option>
              <option value="duration-asc">Shortest Duration</option>
              <option value="pages-desc">Most Pages</option>
              <option value="pages-asc">Fewest Pages</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <History size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No sessions found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm 
                ? 'Try adjusting your search term'
                : 'Start your first scraping session to see it here'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Session header */}
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {session.id.slice(0, 8)}...
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(typeof session.status === 'string' ? session.status : session.status?.status || 'unknown')}`}>
                        {typeof session.status === 'string' ? session.status : session.status?.status || 'unknown'}
                      </span>
                    </div>

                    {/* URL */}
                    <div className="flex items-center space-x-2 mb-2">
                      <Globe size={14} className="text-gray-400" />
                      <a
                        href={session.config.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                      >
                        {session.config.url}
                      </a>
                    </div>

                    {/* Session details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div>
                        <span className="font-medium">Created:</span>
                        <div>{formatDate(session.created_at)}</div>
                      </div>
                      
                      {session.result?.statistics && (
                        <>
                          <div>
                            <span className="font-medium">Duration:</span>
                            <div>{formatDuration(session.result.statistics.duration_seconds)}</div>
                          </div>
                          
                          <div>
                            <span className="font-medium">Pages:</span>
                            <div>{formatNumber(session.result.statistics.total_pages_scraped)}</div>
                          </div>
                          
                          <div>
                            <span className="font-medium">Content:</span>
                            <div>{formatNumber(session.result.statistics.content_downloaded)}</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewSession(session.id)}
                      title="View Session"
                    >
                      <Eye size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleExportSession(session.id)}
                      title="Export Session"
                    >
                      <Download size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSession(session.id)}
                      title="Delete Session"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                {/* Configuration preview */}
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Max Pages: {session.config.max_pages}</span>
                    <span>Delay: {session.config.delay}s</span>
                    <span>External: {session.config.include_external ? 'Yes' : 'No'}</span>
                    <span>Download: {session.config.download_content ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
