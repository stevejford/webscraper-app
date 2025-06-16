import React, { useState } from 'react';
import { Database, Plus, Search, Filter, Calendar, Globe, Download, Trash2, Eye, MoreVertical } from 'lucide-react';
import { useScrapingStore } from '../store/scrapingStore';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { SessionHistory } from '../components/display/SessionHistory';

interface SessionsPageProps {
  onNavigateToSettings?: () => void;
}

export const SessionsPage: React.FC<SessionsPageProps> = ({ onNavigateToSettings }) => {
  const { sessions, currentSession, setCurrentSession } = useScrapingStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'running' | 'failed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'domain' | 'size'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Filter and sort sessions
  const filteredSessions = sessions
    .filter(session => {
      const matchesSearch = !searchTerm || 
        session.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const sessionStatus = session.status?.status || session.status || 'unknown';
      const matchesStatus = filterStatus === 'all' || sessionStatus === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'domain':
          return a.domain.localeCompare(b.domain);
        case 'size':
          const aSize = a.result?.scraped_content?.length || 0;
          const bSize = b.result?.scraped_content?.length || 0;
          return bSize - aSize;
        default:
          return 0;
      }
    });

  const getSessionStats = (session: any) => {
    const content = session.result?.scraped_content || [];
    const pages = session.result?.page_contents || [];
    
    return {
      pages: pages.length,
      files: content.length,
      images: content.filter((c: any) => c.content_type === 'image').length,
      pdfs: content.filter((c: any) => c.content_type === 'pdf').length,
      videos: content.filter((c: any) => c.content_type === 'video').length,
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleSessionSelect = (session: any) => {
    setCurrentSession(session);
  };

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      // Implementation would call delete API
      console.log('Delete session:', sessionId);
    }
  };

  const handleExportSession = (session: any) => {
    // Implementation would export session data
    console.log('Export session:', session.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Database className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sessions</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your web scraping sessions and view their results
              </p>
            </div>
          </div>
          
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Session</span>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search sessions by domain or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={16} />}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="running">Running</option>
              <option value="failed">Failed</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="date">Sort by Date</option>
              <option value="domain">Sort by Domain</option>
              <option value="size">Sort by Size</option>
            </select>
          </div>
        </div>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{sessions.length}</p>
            </div>
            <Database className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {sessions.filter(s => (s.status?.status || s.status) === 'completed').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Running</p>
              <p className="text-2xl font-bold text-blue-600">
                {sessions.filter(s => (s.status?.status || s.status) === 'running').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Files</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {sessions.reduce((total, session) => {
                  return total + (session.result?.scraped_content?.length || 0);
                }, 0).toLocaleString()}
              </p>
            </div>
            <Globe className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Sessions ({filteredSessions.length})
          </h3>
        </div>
        
        {filteredSessions.length === 0 ? (
          <div className="p-12 text-center">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No sessions found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm ? 'Try adjusting your search criteria' : 'Start your first scraping session'}
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Session
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredSessions.map((session) => {
              const stats = getSessionStats(session);
              const isActive = currentSession?.id === session.id;
              
              return (
                <div
                  key={session.id}
                  className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {session.domain}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status?.status || session.status)}`}>
                          {session.status?.status || session.status || 'unknown'}
                        </span>
                        {isActive && (
                          <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(session.created_at).toLocaleDateString()}</span>
                        </span>
                        <span>{stats.pages} pages</span>
                        <span>{stats.files} files</span>
                        <span>{stats.images} images</span>
                        {stats.pdfs > 0 && <span>{stats.pdfs} PDFs</span>}
                        {stats.videos > 0 && <span>{stats.videos} videos</span>}
                      </div>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ID: {session.id}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSessionSelect(session)}
                        disabled={isActive}
                      >
                        <Eye className="w-4 h-4" />
                        {isActive ? 'Active' : 'View'}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExportSession(session)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSession(session.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Session History Component (for additional functionality) */}
      {currentSession && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Session Details: {currentSession.domain}
            </h3>
          </div>
          <div className="p-6">
            <SessionHistory />
          </div>
        </div>
      )}
    </div>
  );
};
