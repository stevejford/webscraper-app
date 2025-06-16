import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, History, Star, Clock, Globe, Eye } from 'lucide-react';
import { useScrapingStore } from '../../store/scrapingStore';
import { Button } from '../common/Button';
import { formatDate } from '../../utils/helpers';
import type { ScrapeSession } from '../../types/api';

interface SessionSwitcherProps {
  maxRecentSessions?: number;
}

export const SessionSwitcher: React.FC<SessionSwitcherProps> = ({ 
  maxRecentSessions = 5 
}) => {
  const { sessions, currentSession, setCurrentSession } = useScrapingStore();
  const [isOpen, setIsOpen] = useState(false);
  const [favoriteSessionIds, setFavoriteSessionIds] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteSessionIds');
    if (savedFavorites) {
      setFavoriteSessionIds(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  // Get recent sessions (excluding current)
  const recentSessions = sessions
    .filter(s => s.id !== currentSession?.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, maxRecentSessions);

  // Get favorite sessions (excluding current)
  const favoriteSessions = sessions
    .filter(s => s.id !== currentSession?.id && favoriteSessionIds.has(s.id))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  const handleSessionSelect = (session: ScrapeSession) => {
    setCurrentSession(session);
    setIsOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'interrupted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (!currentSession && sessions.length === 0) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 max-w-xs"
      >
        <div className="flex items-center space-x-2 min-w-0">
          <History size={16} className="text-gray-500 flex-shrink-0" />
          <div className="min-w-0">
            {currentSession ? (
              <div className="text-left">
                <div className="font-medium text-sm truncate">
                  {getSessionTitle(currentSession)}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {formatDate(currentSession.created_at)}
                </div>
              </div>
            ) : (
              <span className="text-sm text-gray-500">No active session</span>
            )}
          </div>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Switch Session
            </h3>

            {/* Current Session */}
            {currentSession && (
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Current
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {getSessionTitle(currentSession)}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {formatDate(currentSession.created_at)}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      typeof currentSession.status === 'string' ? currentSession.status : currentSession.status?.status || 'unknown'
                    )}`}>
                      {typeof currentSession.status === 'string' ? currentSession.status : currentSession.status?.status || 'unknown'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Favorite Sessions */}
            {favoriteSessions.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center">
                  <Star size={12} className="mr-1" />
                  Favorites
                </div>
                <div className="space-y-1">
                  {favoriteSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => handleSessionSelect(session)}
                      className="w-full p-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {getSessionTitle(session)}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {formatDate(session.created_at)}
                          </div>
                        </div>
                        <Star size={12} className="text-yellow-500 fill-current ml-2" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Sessions */}
            {recentSessions.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center">
                  <Clock size={12} className="mr-1" />
                  Recent
                </div>
                <div className="space-y-1">
                  {recentSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => handleSessionSelect(session)}
                      className="w-full p-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {getSessionTitle(session)}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {formatDate(session.created_at)}
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          typeof session.status === 'string' ? session.status : session.status?.status || 'unknown'
                        )}`}>
                          {typeof session.status === 'string' ? session.status : session.status?.status || 'unknown'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* View All Sessions Link */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // This would need to be connected to navigation
                  // onNavigateToSessions?.();
                }}
                className="w-full p-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center"
              >
                <Eye size={14} className="mr-2" />
                View All Sessions ({sessions.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
