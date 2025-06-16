import React, { useState, useEffect } from 'react';
import { useScrapingStore } from '../../store/scrapingStore';
import { supabaseService } from '../../services/supabase';

export const DataDebugger: React.FC = () => {
  const { sessions, currentSession, loadSessions } = useScrapingStore();
  const [supabaseData, setSupabaseData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchSupabaseData = async () => {
    setLoading(true);
    try {
      console.log('🔍 Starting direct Supabase fetch...');
      const data = await supabaseService.getSessions();
      setSupabaseData(data);
      console.log('🔍 Direct Supabase fetch result:', data);
      console.log('🔍 First session content:', data[0]?.content?.length || 0);
      console.log('🔍 First session pages:', data[0]?.pages?.length || 0);
    } catch (error) {
      console.error('❌ Direct Supabase fetch error:', error);
      setSupabaseData({ error: error.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSupabaseData();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 max-w-md max-h-96 overflow-y-auto z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Data Debug</h3>
        <div className="flex space-x-1">
          <button
            onClick={fetchSupabaseData}
            disabled={loading}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button
            onClick={() => loadSessions()}
            className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
          >
            Reload Store
          </button>
        </div>
      </div>
      
      <div className="space-y-3 text-xs">
        <div>
          <strong className="text-gray-700 dark:text-gray-300">Store Sessions:</strong>
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1">
            <div>Count: {sessions.length}</div>
            {sessions.length > 0 && (
              <div>Latest: {sessions[0].id.slice(0, 8)}...</div>
            )}
          </div>
        </div>

        <div>
          <strong className="text-gray-700 dark:text-gray-300">Current Session:</strong>
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1">
            {currentSession ? (
              <div>
                <div>ID: {currentSession.id.slice(0, 8)}...</div>
                <div>Status: {typeof currentSession.status === 'string' ? currentSession.status : currentSession.status?.status || 'unknown'}</div>
                <div>Content: {currentSession.result?.scraped_content?.length || 0}</div>
                <div>Pages: {currentSession.result?.page_contents?.length || 0}</div>
              </div>
            ) : (
              <div>None</div>
            )}
          </div>
        </div>

        <div>
          <strong className="text-gray-700 dark:text-gray-300">Direct Supabase:</strong>
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1">
            {supabaseData ? (
              <div>
                {supabaseData.error ? (
                  <div className="text-red-600">Error: {supabaseData.error}</div>
                ) : (
                  <div>
                    <div>Count: {supabaseData.length}</div>
                    {supabaseData.length > 0 && (
                      <div>
                        <div>Latest: {supabaseData[0].id.slice(0, 8)}...</div>
                        <div>Domain: {supabaseData[0].domain}</div>
                        <div>Status: {typeof supabaseData[0].status === 'string' ? supabaseData[0].status : supabaseData[0].status?.status || 'unknown'}</div>
                        <div>Content: {supabaseData[0].result?.scraped_content?.length || 0}</div>
                        <div>Pages: {supabaseData[0].result?.page_contents?.length || 0}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>

        <div>
          <strong className="text-gray-700 dark:text-gray-300">Data Match:</strong>
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1">
            {supabaseData && sessions.length > 0 ? (
              <div className={supabaseData.length === sessions.length ? 'text-green-600' : 'text-red-600'}>
                {supabaseData.length === sessions.length ? '✅ Match' : '❌ Mismatch'}
              </div>
            ) : (
              <div className="text-yellow-600">⏳ Checking...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
