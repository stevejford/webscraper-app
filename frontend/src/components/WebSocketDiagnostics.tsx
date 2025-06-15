import React, { useState, useEffect } from 'react';
import { diagnoseWebSocketIssues, testWebSocketConnection } from '../utils/websocketDebugger';

const WebSocketDiagnostics: React.FC = () => {
  const [issues, setIssues] = useState<string[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [testResults, setTestResults] = useState<any>(null);
  const [customUrl, setCustomUrl] = useState('');
  
  // Get default WebSocket URL
  const getDefaultWebSocketUrl = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname === '' ? 'localhost' : window.location.hostname;
    const port = '8000';
    const testSessionId = 'diagnostic-' + Date.now();
    return `${protocol}//${host}:${port}/ws/scrape/${testSessionId}`;
  };
  
  useEffect(() => {
    setCustomUrl(getDefaultWebSocketUrl());
  }, []);
  
  const runDiagnostics = async () => {
    setIsRunningTests(true);
    setIssues([]);
    
    try {
      const diagnosticIssues = await diagnoseWebSocketIssues();
      setIssues(diagnosticIssues);
    } catch (error: any) {
      setIssues([`Error running diagnostics: ${error.message || 'Unknown error'}`]);
    } finally {
      setIsRunningTests(false);
    }
  };
  
  const testConnection = async () => {
    setConnectionStatus('connecting');
    setTestResults(null);
    
    try {
      const url = customUrl || getDefaultWebSocketUrl();
      const results = await testWebSocketConnection(url);
      setTestResults(results);
      setConnectionStatus('connected');
    } catch (error: any) {
      setTestResults({ error: error.message || 'Unknown connection error' });
      setConnectionStatus('error');
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">WebSocket Diagnostics</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Connection Test</h3>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="WebSocket URL"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={testConnection}
            disabled={isRunningTests || connectionStatus === 'connecting'}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {connectionStatus === 'connecting' ? 'Connecting...' : 'Test Connection'}
          </button>
        </div>
        
        {testResults && (
          <div className={`mt-4 p-4 rounded-md ${testResults.error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
            {testResults.error ? (
              <>
                <h4 className="font-semibold text-red-800">Connection Failed</h4>
                <p className="text-red-700">{testResults.error}</p>
              </>
            ) : (
              <>
                <h4 className="font-semibold text-green-800">Connection Successful</h4>
                <div className="mt-2 text-sm text-green-700">
                  <p>Connected in: {testResults.connectionTime}ms</p>
                  <p>URL: {testResults.url}</p>
                  <p>Status: {testResults.readyState}</p>
                  {testResults.protocol && <p>Protocol: {testResults.protocol}</p>}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Automatic Diagnostics</h3>
        <button
          onClick={runDiagnostics}
          disabled={isRunningTests}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isRunningTests ? 'Running Diagnostics...' : 'Run Diagnostics'}
        </button>
        
        {issues.length > 0 && (
          <div className={`mt-4 p-4 rounded-md ${issues[0].includes('No issues') ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <h4 className="font-semibold mb-2">{issues[0].includes('No issues') ? 'Diagnostics Results' : 'Issues Found'}</h4>
            <ul className="list-disc pl-5 space-y-1">
              {issues.map((issue, index) => (
                <li key={index} className={issue.includes('No issues') ? 'text-green-700' : 'text-yellow-700'}>
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Troubleshooting Tips</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Make sure the backend server is running on port 8000</li>
          <li>Check that CORS is properly configured on the backend</li>
          <li>Verify that the WebSocket endpoint is correctly implemented</li>
          <li>Ensure there are no firewalls blocking WebSocket connections</li>
          <li>Try using Chrome DevTools Network tab to monitor WebSocket traffic</li>
          <li>Check browser console for any JavaScript errors</li>
        </ul>
      </div>
    </div>
  );
};

export default WebSocketDiagnostics;
