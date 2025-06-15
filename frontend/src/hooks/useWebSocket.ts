// Advanced WebSocket React hook with comprehensive state management

import { useEffect, useCallback, useRef } from 'react';
import type {
  ConnectionState,
  WebSocketMessage,
  MessageHandlers
} from '../types/websocket';
import type { ScrapeRequest } from '../types/api';
import { webSocketManager } from '../services';
import { useScrapingStore } from '../store/scrapingStore';
import { useNotificationStore } from '../store/notificationStore';

export const useWebSocket = () => {
  const {
    setConnectionState,
    setCurrentSession,
    updateSessionStatus,
    addContentItem,
    completeSession,
    setIsSubmitting,
  } = useScrapingStore();

  const { addNotification } = useNotificationStore();
  
  const connectionStateRef = useRef<ConnectionState>({
    status: 'disconnected',
    reconnectAttempts: 0,
  });

  // Update connection state
  const handleConnectionStateChange = useCallback((state: ConnectionState) => {
    connectionStateRef.current = state;
    setConnectionState(state);

    // Show notifications for connection state changes
    switch (state.status) {
      case 'connected':
        addNotification({
          type: 'success',
          title: 'Connected',
          message: 'WebSocket connection established',
          duration: 3000,
        });
        break;
      case 'disconnected':
        addNotification({
          type: 'warning',
          title: 'Disconnected',
          message: 'WebSocket connection lost',
          duration: 5000,
        });
        break;
      case 'reconnecting':
        addNotification({
          type: 'info',
          title: 'Reconnecting',
          message: `Attempting to reconnect (${state.reconnectAttempts}/5)`,
          duration: 3000,
        });
        break;
      case 'error':
        addNotification({
          type: 'error',
          title: 'Connection Error',
          message: state.error || 'WebSocket connection failed',
          duration: 10000,
        });
        break;
    }
  }, [setConnectionState, addNotification]);

  // Message handlers
  const messageHandlers: MessageHandlers = {
    onConnectionEstablished: useCallback((message) => {
      console.log('✅ Connection established:', message.session_id);
      addNotification({
        type: 'success',
        title: 'Session Started',
        message: `Scraping session ${message.session_id} has begun`,
        duration: 5000,
      });
    }, [addNotification]),

    onStatusUpdate: useCallback((message) => {
      console.log('📊 Status update received:', message.data);
      console.log('📊 Pages scraped:', message.data.pages_scraped, 'URLs found:', message.data.urls_found, 'Progress:', message.data.progress);
      updateSessionStatus(message.data);
      console.log('📊 Status update processed');
    }, [updateSessionStatus]),

    onContentDownloaded: useCallback((message) => {
      console.log('📥 Content downloaded:', message.data.url);
      addContentItem(message.data);
      
      // Show notification for successful downloads
      if (message.data.success) {
        addNotification({
          type: 'success',
          title: 'Content Downloaded',
          message: `Downloaded: ${message.data.title || message.data.url}`,
          duration: 3000,
        });
      }
    }, [addContentItem, addNotification]),

    onScrapeComplete: useCallback((message) => {
      console.log('🎉 Scraping complete:', message.data);
      completeSession(message.data);
      setIsSubmitting(false);
      
      addNotification({
        type: 'success',
        title: 'Scraping Complete',
        message: `Found ${message.data.urls.length} URLs and downloaded ${message.data.scraped_content.length} items`,
        duration: 10000,
      });
    }, [completeSession, setIsSubmitting, addNotification]),

    onError: useCallback((message) => {
      console.error('❌ WebSocket error:', message.message);
      setIsSubmitting(false);
      
      addNotification({
        type: 'error',
        title: 'Scraping Error',
        message: message.message,
        duration: 10000,
        persistent: true,
      });
    }, [setIsSubmitting, addNotification]),

    onHeartbeat: useCallback((message) => {
      console.log('💓 Heartbeat received');
      // Update last heartbeat time if needed
    }, []),

    onConnectionStateChange: handleConnectionStateChange,
  };

  // Set up message handlers
  useEffect(() => {
    webSocketManager.setMessageHandlers(messageHandlers);
  }, [messageHandlers]);

  // Connect to WebSocket
  const connect = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      console.log('🔌 Connecting to WebSocket for session:', sessionId);
      await webSocketManager.connect(sessionId);
      return true;
    } catch (error) {
      console.error('❌ Failed to connect:', error);
      addNotification({
        type: 'error',
        title: 'Connection Failed',
        message: error instanceof Error ? error.message : 'Failed to connect to server',
        duration: 10000,
      });
      return false;
    }
  }, [addNotification]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    console.log('🔌 Disconnecting WebSocket');
    webSocketManager.disconnect();
    setIsSubmitting(false);
  }, [setIsSubmitting]);

  // Send message
  const sendMessage = useCallback(async (data: any): Promise<void> => {
    try {
      await webSocketManager.sendMessage(data);
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      addNotification({
        type: 'error',
        title: 'Send Failed',
        message: 'Failed to send message to server',
        duration: 5000,
      });
    }
  }, [addNotification]);

  // Start scraping
  const startScraping = useCallback(async (request: ScrapeRequest): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      
      // Generate session ID
      const sessionId = crypto.randomUUID();
      
      // Connect to WebSocket
      const connected = await connect(sessionId);
      if (!connected) {
        setIsSubmitting(false);
        return false;
      }

      // Create session object
      const session = {
        id: sessionId,
        config: request,
        status: {
          session_id: sessionId,
          status: 'running' as const,
          pages_scraped: 0,
          urls_found: 0,
          external_urls_found: 0,
          content_downloaded: 0,
          progress: 0,
          started_at: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setCurrentSession(session);

      // Send scraping request
      await sendMessage(request);
      
      addNotification({
        type: 'info',
        title: 'Scraping Started',
        message: `Starting to scrape ${request.url}`,
        duration: 5000,
      });

      return true;
    } catch (error) {
      console.error('❌ Failed to start scraping:', error);
      setIsSubmitting(false);
      
      addNotification({
        type: 'error',
        title: 'Failed to Start',
        message: error instanceof Error ? error.message : 'Failed to start scraping',
        duration: 10000,
      });
      
      return false;
    }
  }, [connect, sendMessage, setCurrentSession, setIsSubmitting, addNotification]);

  // Stop scraping
  const stopScraping = useCallback(async (): Promise<void> => {
    try {
      // Send stop message if connected
      if (webSocketManager.isConnected()) {
        await sendMessage({ type: 'stop' });
      }
      
      // Disconnect
      disconnect();
      
      addNotification({
        type: 'info',
        title: 'Scraping Stopped',
        message: 'Scraping session has been stopped',
        duration: 5000,
      });
    } catch (error) {
      console.error('❌ Failed to stop scraping:', error);
      disconnect(); // Force disconnect
    }
  }, [sendMessage, disconnect, addNotification]);

  // Get connection state
  const getConnectionState = useCallback((): ConnectionState => {
    return webSocketManager.getConnectionState();
  }, []);

  // Check if connected
  const isConnected = useCallback((): boolean => {
    return webSocketManager.isConnected();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      webSocketManager.disconnect();
    };
  }, []);

  return {
    connect,
    disconnect,
    sendMessage,
    startScraping,
    stopScraping,
    getConnectionState,
    isConnected,
    connectionState: connectionStateRef.current,
  };
};
