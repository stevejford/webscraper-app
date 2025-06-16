import React, { useState, useEffect } from 'react';
import { History, Search, Filter, Calendar, Globe, Star, Clock, FileText, Image, Video, Eye, Download, Trash2, RefreshCw } from 'lucide-react';
import { useScrapingStore } from '../../store/scrapingStore';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { formatDate, formatDuration, formatNumber } from '../../utils/helpers';
import type { ScrapeSession } from '../../types/api';

interface SessionBrowserProps {
  onSessionSelect?: (session: ScrapeSession) => void;
  showHeader?: boolean;
  compact?: boolean;
}

export const SessionBrowser: React.FC<SessionBrowserProps> = ({ 
  onSessionSelect, 
  showHeader = true,
  compact = false 
}) => {
  const { sessions, setCurrentSession, loadSessions, currentSession } = useScrapingStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'domain' | 'pages' | 'duration'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterDomain, setFilterDomain] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [favoriteSessionIds, setFavoriteSessionIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

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

  // Get session title from domain/URL
  const getSessionTitle = (session: ScrapeSession): string => {
    try {
      const domain = session.domain || new URL(session.config?.url || session.target_url || '').hostname;
      const cleanDomain = domain.replace(/^www\./, '');
      return cleanDomain.charAt(0).toUpperCase() + cleanDomain.slice(1);
    } catch {
      return `Session ${session.id.slice(0, 8)}...`;
    }
  };

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

  // Filter and sort sessions
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
      const matchesFavorites = !showFavoritesOnly || favoriteSessionIds.has(session.id);
      
      return matchesSearch && matchesDomain && matchesStatus && matchesFavorites;
    })
    .sort((a, b) => {
      // Favorites first if not filtering by favorites only
      if (!showFavoritesOnly) {
        const aIsFavorite = favoriteSessionIds.has(a.id);
        const bIsFavorite = favoriteSessionIds.has(b.id);
        if (aIsFavorite && !bIsFavorite) return -1;
        if (!aIsFavorite && bIsFavorite) return 1;
      }
      
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
    });

  const handleSessionSelect = (session: ScrapeSession) => {
    if (onSessionSelect) {
      onSessionSelect(session);
    } else {
      setCurrentSession(session);
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
      case 'interrupted':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {showHeader && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              <History size={24} className="inline mr-2" />
              Session History ({filteredSessions.length})
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={showFavoritesOnly ? 'bg-yellow-100 text-yellow-800' : ''}
              >
                <Star size={16} className={showFavoritesOnly ? 'fill-current' : ''} />
                {showFavoritesOnly ? 'Show All' : 'Favorites'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadSessions()}
                disabled={isLoading}
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Search and filters */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search by domain, URL, or session ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search size={16} />}
                />
              </div>
              
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as 'date' | 'domain' | 'pages' | 'duration');
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="domain-asc">Domain A-Z</option>
                <option value="domain-desc">Domain Z-A</option>
                <option value="pages-desc">Most Pages</option>
                <option value="pages-asc">Fewest Pages</option>
                <option value="duration-desc">Longest Duration</option>
                <option value="duration-asc">Shortest Duration</option>
              </select>
            </div>

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
                  Loading...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Session list */}
      <div className={compact ? "p-4" : "p-6"}>
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <History size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {showFavoritesOnly ? 'No favorite sessions' : 'No sessions found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm 
                ? 'Try adjusting your search criteria'
                : showFavoritesOnly
                ? 'Star some sessions to see them here'
                : 'Start your first scraping session to see it here'
              }
            </p>
          </div>
        ) : (
          <div className={`space-y-${compact ? '2' : '4'}`}>
            {filteredSessions.map((session) => {
              const isActive = currentSession?.id === session.id;
              const sessionStatus = typeof session.status === 'string' ? session.status : session.status?.status || 'unknown';
              
              return (
                <div
                  key={session.id}
                  className={`border rounded-lg p-${compact ? '3' : '4'} transition-all cursor-pointer ${
                    isActive 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  onClick={() => handleSessionSelect(session)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Session header */}
                      <div className="flex items-center space-x-3 mb-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(session.id);
                          }}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {favoriteSessionIds.has(session.id) ? (
                            <Star size={14} className="text-yellow-500 fill-current" />
                          ) : (
                            <Star size={14} className="text-gray-400" />
                          )}
                        </Button>
                        
                        <h3 className={`font-medium text-gray-900 dark:text-white truncate ${compact ? 'text-sm' : 'text-lg'}`}>
                          {getSessionTitle(session)}
                        </h3>
                        
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sessionStatus)}`}>
                          {sessionStatus}
                        </span>
                        
                        {isActive && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Active
                          </span>
                        )}
                      </div>

                      {/* Session metadata */}
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                        <span className="flex items-center space-x-1">
                          <Clock size={12} />
                          <span>{formatDate(session.created_at)}</span>
                        </span>
                        <span>ID: {session.id.slice(0, 8)}...</span>
                      </div>

                      {/* Statistics */}
                      {session.result?.statistics && !compact && (
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <FileText size={14} className="text-blue-500" />
                            <span>{formatNumber(session.result.statistics.total_pages_scraped || 0)} pages</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Image size={14} className="text-green-500" />
                            <span>{formatNumber(session.result.scraped_content?.filter(c => c.content_type === 'image').length || 0)} images</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock size={14} className="text-orange-500" />
                            <span>{formatDuration(session.result.statistics.duration_seconds)}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {!compact && (
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSessionSelect(session);
                          }}
                          title="View Session"
                        >
                          <Eye size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
