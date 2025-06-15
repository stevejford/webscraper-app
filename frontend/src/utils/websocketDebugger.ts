/**
 * WebSocket Debugger Utility
 * 
 * This utility helps diagnose WebSocket connection issues between the frontend and backend.
 * It provides functions to test connections, monitor WebSocket events, and analyze errors.
 */

/**
 * Tests a WebSocket connection to the specified URL
 * @param url The WebSocket URL to test
 * @param timeoutMs Timeout in milliseconds
 * @returns Promise that resolves with connection details or rejects with error
 */
export const testWebSocketConnection = (url: string, timeoutMs: number = 5000): Promise<any> => {
  console.log(`🔍 Testing WebSocket connection to: ${url}`);
  
  return new Promise((resolve, reject) => {
    try {
      const ws = new WebSocket(url);
      const startTime = Date.now();
      let connectionTime: number;
      
      // Set timeout
      const timeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          ws.close();
          reject(new Error(`Connection timeout after ${timeoutMs}ms`));
        }
      }, timeoutMs);
      
      ws.onopen = () => {
        connectionTime = Date.now() - startTime;
        console.log(`✅ Connection established in ${connectionTime}ms`);
        clearTimeout(timeout);
        
        // Send a ping message
        try {
          ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
        } catch (error) {
          console.warn('Could not send ping message', error);
        }
        
        // Auto-close after 2 seconds
        setTimeout(() => {
          ws.close();
          resolve({
            success: true,
            connectionTime,
            url,
            readyState: 'OPEN',
            protocol: ws.protocol
          });
        }, 2000);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📥 Received message:', data);
        } catch (error) {
          console.log('📥 Received non-JSON message:', event.data);
        }
      };
      
      ws.onclose = (event) => {
        clearTimeout(timeout);
        if (event.wasClean) {
          console.log(`🔌 Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
        } else {
          console.warn('🔌 Connection died');
        }
        
        // Only reject if we haven't resolved yet
        if (!connectionTime) {
          reject(new Error(`Connection closed: ${event.code} - ${event.reason || 'No reason provided'}`));
        }
      };
      
      ws.onerror = (error) => {
        clearTimeout(timeout);
        console.error('❌ WebSocket error:', error);
        reject(new Error('WebSocket connection error'));
      };
    } catch (error) {
      console.error('❌ Failed to create WebSocket:', error);
      reject(error);
    }
  });
};

/**
 * Diagnoses common WebSocket connection issues
 */
export const diagnoseWebSocketIssues = async (): Promise<string[]> => {
  const issues: string[] = [];
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.hostname === '' ? 'localhost' : window.location.hostname;
  const port = '8000';
  const testSessionId = 'test-' + Date.now();
  const wsUrl = `${protocol}//${host}:${port}/ws/scrape/${testSessionId}`;
  
  console.log('🔍 Starting WebSocket diagnostics...');
  
  // Check if backend is reachable via HTTP
  try {
    const response = await fetch(`http://${host}:${port}/health`);
    if (response.ok) {
      console.log('✅ Backend HTTP endpoint is reachable');
    } else {
      issues.push(`Backend server returned status ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Backend HTTP endpoint is not reachable', error);
    issues.push('Backend server is not reachable. Make sure it is running on port 8000.');
  }
  
  // Test WebSocket connection
  try {
    await testWebSocketConnection(wsUrl);
  } catch (error) {
    console.error('❌ WebSocket test failed:', error);
    
    // Type guard to ensure error is an Error object with message property
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    issues.push(`WebSocket connection failed: ${errorMessage}`);
    
    // Additional diagnostics based on error
    if (errorMessage.includes('timeout')) {
      issues.push('Connection timeout. Check if the backend WebSocket endpoint is properly configured.');
    }
    
    if (errorMessage.includes('refused')) {
      issues.push('Connection refused. Make sure the backend server is running and WebSocket is enabled.');
    }
  }
  
  // Check browser WebSocket support
  if (!window.WebSocket) {
    issues.push('Your browser does not support WebSockets.');
  }
  
  // Return diagnostic results
  if (issues.length === 0) {
    console.log('✅ No WebSocket issues detected');
    return ['No issues detected. WebSocket connection appears to be working properly.'];
  } else {
    console.warn(`❌ Found ${issues.length} WebSocket issues`);
    return issues;
  }
};

/**
 * Creates a monitored WebSocket that logs all events for debugging
 * @param url WebSocket URL
 * @returns WebSocket instance with enhanced logging
 */
export const createMonitoredWebSocket = (url: string): WebSocket => {
  console.log(`🔍 Creating monitored WebSocket connection to: ${url}`);
  const ws = new WebSocket(url);
  
  ws.onopen = (event) => {
    console.log('✅ WebSocket OPEN', event);
  };
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('📥 WebSocket MESSAGE', data);
    } catch (error) {
      console.log('📥 WebSocket MESSAGE (non-JSON)', event.data);
    }
  };
  
  ws.onclose = (event) => {
    console.log(`🔌 WebSocket CLOSE: code=${event.code}, reason=${event.reason}, clean=${event.wasClean}`, event);
  };
  
  ws.onerror = (event) => {
    console.error('❌ WebSocket ERROR', event);
  };
  
  return ws;
};

/**
 * Exports all debugging functions
 */
export default {
  testWebSocketConnection,
  diagnoseWebSocketIssues,
  createMonitoredWebSocket
};
