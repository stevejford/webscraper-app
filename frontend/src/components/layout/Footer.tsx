import React from 'react';
import { Wifi, WifiOff, Activity, Clock } from 'lucide-react';
import { useScrapingStore } from '../../store/scrapingStore';
import useOnlineStatus from '../../hooks/useOnlineStatus';

export const Footer: React.FC = () => {
  const { connectionState, currentSession } = useScrapingStore();
  const isOnline = useOnlineStatus();

  const getConnectionStatusColor = () => {
    if (!isOnline) return 'text-red-500';
    
    switch (connectionState.status) {
      case 'connected':
        return 'text-green-500';
      case 'connecting':
        return 'text-yellow-500';
      case 'disconnected':
        return 'text-gray-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getConnectionStatusText = () => {
    if (!isOnline) return 'Offline';
    
    switch (connectionState.status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000);
    
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3">
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        {/* Left side - Connection status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi size={16} className={getConnectionStatusColor()} />
            ) : (
              <WifiOff size={16} className="text-red-500" />
            )}
            <span className={getConnectionStatusColor()}>
              {getConnectionStatusText()}
            </span>
          </div>

          {connectionState.reconnectAttempts > 0 && (
            <div className="flex items-center space-x-1">
              <Activity size={14} className="text-yellow-500" />
              <span>Reconnect attempts: {connectionState.reconnectAttempts}</span>
            </div>
          )}
        </div>

        {/* Center - Session duration */}
        {currentSession && (
          <div className="hidden md:flex items-center space-x-2">
            <Clock size={16} />
            <span>
              Duration: {formatDuration(
                currentSession.created_at,
                (typeof currentSession.status === 'string' ? currentSession.status : currentSession.status?.status) === 'completed' ? currentSession.updated_at : undefined
              )}
            </span>
          </div>
        )}

        {/* Right side - App info */}
        <div className="flex items-center space-x-4">
          <span>Web Scraper v1.0.0</span>
          <span className="text-gray-400">•</span>
          <span>
            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </footer>
  );
};
