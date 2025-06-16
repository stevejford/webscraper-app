// Session Recovery Component following realtime.md recommendations
// Handles detection and resumption of interrupted sessions

import React, { useState, useEffect } from 'react';
import { RefreshCw, Play, X, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '../common/Button';
import { useScrapingStore } from '../../store/scrapingStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useWebSocket } from '../../hooks/useWebSocket';

interface InterruptedSession {
  id: string;
  domain: string;
  status: string;
  target_url: string;
  progress: {
    pages_scraped: number;
    files_downloaded: number;
    last_checkpoint: string;
  };
  start_time: string;
  last_updated: string;
}

export const SessionRecovery: React.FC = () => {
  const [interruptedSessions, setInterruptedSessions] = useState<InterruptedSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resumingSessionId, setResumingSessionId] = useState<string | null>(null);
  
  const { loadInterruptedSessions, resumeInterruptedSession } = useScrapingStore();
  const { addNotification } = useNotificationStore();
  const { connect } = useWebSocket();

  // Load interrupted sessions on component mount
  useEffect(() => {
    loadInterruptedSessionsData();
  }, []);

  const loadInterruptedSessionsData = async () => {
    setIsLoading(true);
    try {
      const sessions = await loadInterruptedSessions();
      setInterruptedSessions(sessions.map(session => ({
        id: session.id,
        domain: session.domain,
        status: session.status,
        target_url: session.config?.url || `https://${session.domain}`,
        progress: {
          pages_scraped: session.progress?.pages_scraped || 0,
          files_downloaded: session.progress?.files_downloaded || 0,
          last_checkpoint: session.progress?.last_checkpoint || session.updated_at
        },
        start_time: session.start_time || session.created_at,
        last_updated: session.last_updated || session.updated_at
      })));
    } catch (error) {
      console.error('Failed to load interrupted sessions:', error);
      addNotification({
        type: 'error',
        title: 'Recovery Error',
        message: 'Failed to load interrupted sessions',
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeSession = async (sessionId: string) => {
    setResumingSessionId(sessionId);
    try {
      console.log('🔄 Attempting to resume session:', sessionId);
      
      // Resume the session using the enhanced session manager
      const resumedSession = await resumeInterruptedSession(sessionId);
      
      if (resumedSession) {
        // Connect to WebSocket for real-time updates
        const connected = await connect(sessionId);
        
        if (connected) {
          addNotification({
            type: 'success',
            title: 'Session Resumed',
            message: `Successfully resumed scraping session for ${resumedSession.domain}`,
            duration: 5000
          });
          
          // Remove from interrupted sessions list
          setInterruptedSessions(prev => prev.filter(s => s.id !== sessionId));
        } else {
          addNotification({
            type: 'warning',
            title: 'Partial Resume',
            message: 'Session resumed but WebSocket connection failed',
            duration: 5000
          });
        }
      } else {
        addNotification({
          type: 'error',
          title: 'Resume Failed',
          message: 'Failed to resume the session. It may no longer be valid.',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Failed to resume session:', error);
      addNotification({
        type: 'error',
        title: 'Resume Error',
        message: error instanceof Error ? error.message : 'Failed to resume session',
        duration: 5000
      });
    } finally {
      setResumingSessionId(null);
    }
  };

  const handleDismissSession = (sessionId: string) => {
    setInterruptedSessions(prev => prev.filter(s => s.id !== sessionId));
    addNotification({
      type: 'info',
      title: 'Session Dismissed',
      message: 'Interrupted session has been dismissed',
      duration: 3000
    });
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (isLoading) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-5 h-5 text-yellow-600 animate-spin" />
          <span className="text-yellow-800 dark:text-yellow-200">
            Checking for interrupted sessions...
          </span>
        </div>
      </div>
    );
  }

  if (interruptedSessions.length === 0) {
    return null; // Don't show anything if no interrupted sessions
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            Interrupted Sessions Found
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
            We found {interruptedSessions.length} session{interruptedSessions.length > 1 ? 's' : ''} that were interrupted. 
            You can resume them to continue where you left off.
          </p>
          
          <div className="space-y-3">
            {interruptedSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-yellow-200 dark:border-yellow-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {session.domain}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        session.status === 'interrupted' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <div>
                        Progress: {session.progress.pages_scraped} pages, {session.progress.files_downloaded} files
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Last active: {formatTimeAgo(session.last_updated)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleResumeSession(session.id)}
                      disabled={resumingSessionId === session.id}
                      className="flex items-center space-x-1"
                    >
                      {resumingSessionId === session.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      <span>Resume</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismissSession(session.id)}
                      disabled={resumingSessionId === session.id}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-yellow-200 dark:border-yellow-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadInterruptedSessionsData}
              disabled={isLoading}
              className="text-yellow-700 dark:text-yellow-300 hover:text-yellow-800 dark:hover:text-yellow-200"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
