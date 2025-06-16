import React, { useState } from 'react';
import { Database, Plus, Search, Filter, Calendar, Globe, Download, Trash2, Eye, MoreVertical } from 'lucide-react';
import { useScrapingStore } from '../store/scrapingStore';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { SessionBrowser } from '../components/session/SessionBrowser';
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
      {/* Enhanced Session Browser */}
      <SessionBrowser
        onSessionSelect={(session) => {
          setCurrentSession(session);
          // Optionally navigate to dashboard to view the session
          // onNavigateToSettings?.();
        }}
        showHeader={true}
        compact={false}
      />

      {/* Legacy session management - removed for cleaner interface */}


    </div>
  );
};
