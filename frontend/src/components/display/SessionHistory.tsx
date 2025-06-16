import React, { useState, useEffect } from 'react';
import { History, Search, Download, Trash2, Eye, Calendar, Globe, Clock, FileText, Image, Video, ExternalLink, Star, StarOff } from 'lucide-react';
import { useScrapingStore } from '../../store/scrapingStore';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { formatDate, formatDuration, formatNumber } from '../../utils/helpers';
import type { ScrapeSession } from '../../types/api';

interface SessionHistoryProps {
  showAllSessions?: boolean;
  onSessionSelect?: (session: ScrapeSession) => void;
  maxSessions?: number;
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({
  showAllSessions = true,
  onSessionSelect,
  maxSessions
}) => {
  const { sessions, setCurrentSession, loadSessions } = useScrapingStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'pages' | 'domain'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterDomain, setFilterDomain] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [favoriteSessionIds, setFavoriteSessionIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Load sessions on component mount
  useEffect(() => {
    const loadSessionData = async () => {
      setIsLoading(true);
      try {
        await loadSessions();
      } catch (error) {
        console.error('Failed to load sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionData();
  }, [loadSessions]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteSessionIds');
    if (savedFavorites) {
      setFavoriteSessionIds(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Get unique domains for filtering
  const uniqueDomains = Array.from(new Set(sessions.map(s => {
    try {
      return s.domain || new URL(s.config?.url || s.target_url || '').hostname;
    } catch {
      return 'unknown';
    }
  }).filter(Boolean)));

  // Toggle favorite status
  const toggleFavorite = (sessionId: string) => {
    const newFavorites = new Set(favoriteSessionIds);
    if (newFavorites.has(sessionId)) {
      newFavorites.delete(sessionId);
    } else {
      newFavorites.add(sessionId);
    }
    setFavoriteSessionIds(newFavorites);
    localStorage.setItem('favoriteSessionIds', JSON.stringify(Array.from(newFavorites)));
  };

  const filteredSessions = sessions
    .filter(session => {
      const searchLower = searchTerm.toLowerCase();
      const sessionDomain = (() => {
        try {
          return session.domain || new URL(session.config?.url || session.target_url || '').hostname;
        } catch {
          return 'unknown';
        }
      })();
      const sessionStatus = typeof session.status === 'string' ? session.status : session.status?.status || 'unknown';

      const matchesSearch = !searchTerm || (
        session.id.toLowerCase().includes(searchLower) ||
        sessionDomain.toLowerCase().includes(searchLower) ||
        (session.config?.url || session.target_url || '').toLowerCase().includes(searchLower) ||
        sessionStatus.toLowerCase().includes(searchLower)
      );

      const matchesDomain = !filterDomain || sessionDomain === filterDomain;
      const matchesStatus = filterStatus === 'all' || sessionStatus === filterStatus;

      return matchesSearch && matchesDomain && matchesStatus;
    })
    .sort((a, b) => {
      // Favorites first
      const aIsFavorite = favoriteSessionIds.has(a.id);
      const bIsFavorite = favoriteSessionIds.has(b.id);
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;

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
        case 'domain':
          try {
            const aDomain = a.domain || new URL(a.config?.url || a.target_url || '').hostname;
            const bDomain = b.domain || new URL(b.config?.url || b.target_url || '').hostname;
            return sortOrder === 'asc' ? aDomain.localeCompare(bDomain) : bDomain.localeCompare(aDomain);
          } catch {
            return 0;
          }
        default:
          return 0;
      }

      const comparison = aValue - bValue;
      return sortOrder === 'asc' ? comparison : -comparison;
    })
    .slice(0, maxSessions || (showAllSessions ? undefined : 10));

  // Helper function to get session title from domain/URL
  const getSessionTitle = (session: ScrapeSession): string => {
    try {
      // Try to get domain from session.domain first, then extract from URL
      const domain = session.domain || new URL(session.config?.url || session.target_url || '').hostname;

      // Remove 'www.' prefix if present
      const cleanDomain = domain.replace(/^www\./, '');

      // Capitalize first letter for better presentation
      return cleanDomain.charAt(0).toUpperCase() + cleanDomain.slice(1);
    } catch {
      // Fallback to truncated session ID if URL parsing fails
      return `Session ${session.id.slice(0, 8)}...`;
    }
  };

  const handleViewSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      if (onSessionSelect) {
        onSessionSelect(session);
      } else {
        setCurrentSession(session);
      }
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
        <div className="space-y-4">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Search by domain, URL, or session ID..."
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
                  setSortBy(field as 'date' | 'duration' | 'pages' | 'domain');
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="domain-asc">Domain A-Z</option>
                <option value="domain-desc">Domain Z-A</option>
                <option value="duration-desc">Longest Duration</option>
                <option value="duration-asc">Shortest Duration</option>
                <option value="pages-desc">Most Pages</option>
                <option value="pages-asc">Fewest Pages</option>
              </select>
            </div>
          </div>

          {/* Additional filters */}
          <div className="flex items-center space-x-4">
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Domains</option>
              {uniqueDomains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="running">Running</option>
              <option value="error">Error</option>
              <option value="interrupted">Interrupted</option>
            </select>

            {isLoading && (
              <div className="flex items-center text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Loading sessions...
              </div>
            )}
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
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(session.id)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                          title={favoriteSessionIds.has(session.id) ? "Remove from favorites" : "Add to favorites"}
                        >
                          {favoriteSessionIds.has(session.id) ? (
                            <Star size={16} className="text-yellow-500 fill-current" />
                          ) : (
                            <StarOff size={16} className="text-gray-400" />
                          )}
                        </Button>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                          {getSessionTitle(session)}
                        </h3>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(typeof session.status === 'string' ? session.status : session.status?.status || 'unknown')}`}>
                        {typeof session.status === 'string' ? session.status : session.status?.status || 'unknown'}
                      </span>
                    </div>

                    {/* URL and metadata */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <Globe size={14} className="text-gray-400" />
                        <a
                          href={session.config?.url || session.target_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline truncate flex-1"
                        >
                          {session.config?.url || session.target_url}
                        </a>
                        <ExternalLink size={12} className="text-gray-400" />
                      </div>

                      {/* Session ID for reference */}
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>ID: {session.id.slice(0, 8)}...</span>
                        <span>•</span>
                        <Clock size={12} />
                        <span>{formatDate(session.created_at)}</span>
                      </div>
                    </div>

                    {/* Session statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {session.result?.statistics ? (
                        <>
                          <div className="flex items-center space-x-2">
                            <FileText size={14} className="text-blue-500" />
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {formatNumber(session.result.statistics.total_pages_scraped || 0)}
                              </div>
                              <div className="text-xs text-gray-500">Pages</div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Image size={14} className="text-green-500" />
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {formatNumber(session.result.scraped_content?.filter(c => c.content_type === 'image').length || 0)}
                              </div>
                              <div className="text-xs text-gray-500">Images</div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Video size={14} className="text-purple-500" />
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {formatNumber(session.result.scraped_content?.filter(c => c.content_type === 'video').length || 0)}
                              </div>
                              <div className="text-xs text-gray-500">Videos</div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Clock size={14} className="text-orange-500" />
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {formatDuration(session.result.statistics.duration_seconds)}
                              </div>
                              <div className="text-xs text-gray-500">Duration</div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="col-span-full text-gray-500 text-sm">
                          No statistics available
                        </div>
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

                {/* Configuration and content preview */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>Max Pages: {session.config?.max_pages || 'N/A'}</span>
                      <span>Delay: {session.config?.delay || 0}ms</span>
                      <span>External: {session.config?.include_external ? 'Yes' : 'No'}</span>
                      {session.config?.content_types && (
                        <span>Types: {session.config.content_types.join(', ')}</span>
                      )}
                    </div>

                    {/* Content preview thumbnails */}
                    {session.result?.scraped_content && session.result.scraped_content.length > 0 && (
                      <div className="flex items-center space-x-1">
                        {session.result.scraped_content
                          .filter(c => c.content_type === 'image' && c.success)
                          .slice(0, 3)
                          .map((content, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-100 dark:bg-gray-700"
                            >
                              <img
                                src={content.public_url || content.local_path}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          ))}
                        {session.result.scraped_content.filter(c => c.content_type === 'image' && c.success).length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{session.result.scraped_content.filter(c => c.content_type === 'image' && c.success).length - 3} more
                          </div>
                        )}
                      </div>
                    )}
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
