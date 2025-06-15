import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Play, Trash2 } from 'lucide-react';
import { useScrapeStore } from '../store/scrapeStore';

const SessionHistory: React.FC = () => {
  const { sessions, setCurrentSession } = useScrapeStore();

  const loadSession = (session: any) => {
    setCurrentSession(session);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
          <Clock className="w-5 h-5 text-accent-600 dark:text-accent-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recent Sessions
        </h2>
      </div>
      
      {sessions.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No sessions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.slice(0, 5).map((session, index) => (
            <motion.div
              key={session.session_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
              onClick={() => loadSession(session)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {session.domain}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      session.status.status === 'completed' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : session.status.status === 'error'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {session.status.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {session.urls.length} URLs
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {formatDuration(session.statistics.duration_seconds)}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(session.status.started_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    loadSession(session);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-all"
                  title="Load session"
                >
                  <Play className="w-3 h-3 text-primary-600 dark:text-primary-400" />
                </button>
              </div>
            </motion.div>
          ))}
          
          {sessions.length > 5 && (
            <div className="text-center pt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{sessions.length - 5} more sessions
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default SessionHistory;
