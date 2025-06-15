import { useEffect, useCallback, useRef } from 'react';
import { useScrapeStore } from '../store/scrapeStore';
import { useConnectionStore } from '../store/connectionStore';
import { ScrapeRequest, WebSocketMessage } from '../types';
import { websocketService, ConnectionState } from '../services/websocket';

export const useWebSocket = () => {
  const {
    setCurrentSession,
    updateSessionStatus,
    addSession,
    setIsSubmitting
  } = useScrapeStore();

  const {
    updateConnectionState,
    setSessionId,
    setQueuedMessages,
    setLatency,
    setError,
    incrementReconnectAttempts,
    resetReconnectAttempts,
    recordConnection,
    recordReconnection,
    recordError,
    addNotification
  } = useConnectionStore();

  const connectionStartTime = useRef<number | null>(null);

  const handleConnectionStateChange = useCallback((state: ConnectionState) => {
    updateConnectionState(state);

    // Calculate latency for connection
    if (state === 'connected' && connectionStartTime.current) {
      const latency = Date.now() - connectionStartTime.current;
      setLatency(latency);
      connectionStartTime.current = null;
    }

    // Handle state-specific actions
    switch (state) {
      case 'connecting':
        connectionStartTime.current = Date.now();
        setError(null);
        addNotification('info', 'Connecting to server...');
        break;

      case 'connected':
        resetReconnectAttempts();
        recordConnection();
        setError(null);
        addNotification('success', 'Connected successfully!');
        break;

      case 'reconnecting':
        incrementReconnectAttempts();
        addNotification('warning', 'Connection lost, attempting to reconnect...');
        break;

      case 'disconnected':
        setError(null);
        addNotification('info', 'Disconnected from server');
        break;

      case 'error':
        recordError();
        addNotification('error', 'Connection error occurred');
        break;
    }
  }, [
    updateConnectionState,
    setLatency,
    setError,
    incrementReconnectAttempts,
    resetReconnectAttempts,
    recordConnection,
    recordReconnection,
    recordError,
    addNotification
  ]);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    console.log('📥 Processing WebSocket message:', message.type);

    switch (message.type) {
      case 'connection_established':
        console.log('✅ Connection established:', message.session_id);
        if (message.session_id) {
          setSessionId(message.session_id);
        }
        break;

      case 'status_update':
        if (message.data) {
          console.log('📊 Status update:', message.data);
          updateSessionStatus(message.data);
        }
        break;

      case 'scrape_complete':
        if (message.data) {
          console.log('✅ Scrape completed:', message.data);
          setCurrentSession(message.data);
          addSession(message.data);
          setIsSubmitting(false);
          addNotification('success', 'Scraping completed successfully!');
        }
        break;

      case 'content_downloaded':
        if (message.data) {
          console.log('📥 Content downloaded:', message.data);
          // Handle individual content downloads
          addNotification('info', `Downloaded: ${message.data.url}`);
        }
        break;

      case 'error':
        console.error('❌ WebSocket error from server:', message.message);
        const errorMsg = message.message || 'Unknown error occurred';
        setError(errorMsg);
        addNotification('error', `Scraping error: ${errorMsg}`);
        setIsSubmitting(false);
        break;

      default:
        console.warn('⚠️ Unknown message type:', message.type);
    }
  }, [
    setSessionId,
    updateSessionStatus,
    setCurrentSession,
    addSession,
    setIsSubmitting,
    setError,
    addNotification
  ]);

  const handleReconnect = useCallback(() => {
    recordReconnection();
    addNotification('success', 'Reconnected successfully!');
  }, [recordReconnection, addNotification]);

  const connectWebSocket = useCallback(async (sessionId: string) => {
    try {
      await websocketService.connect(sessionId, {
        onMessage: handleMessage,
        onConnectionStateChange: handleConnectionStateChange,
        onReconnect: handleReconnect,
        onError: (error) => {
          console.error('❌ WebSocket error:', error);
          setError('Connection error occurred');
        }
      });

      return websocketService;
    } catch (error) {
      console.error('❌ Failed to connect WebSocket:', error);
      setError(error instanceof Error ? error.message : 'Connection failed');
      throw error;
    }
  }, [handleMessage, handleConnectionStateChange, handleReconnect, setError]);
        
        switch (message.type) {
          case 'connection_established':
            console.log('WebSocket connection confirmed by server');
            break;
            
          case 'status_update':
            if (message.data) {
              updateSessionStatus(message.data);
            }
            break;
            
          case 'content_downloaded':
            // Handle individual content downloads
            console.log('Content downloaded:', message.data);
            break;
            
          case 'scrape_complete':
            if (message.data) {
              setCurrentSession(message.data);
              addSession(message.data);
              setIsSubmitting(false);
            }
            break;
            
          case 'error':
            console.error('WebSocket error from server:', message.message);
            // Show user-friendly error notification
            if (message.details) {
              console.error('Error details:', message.details);
            }
            // You could add a toast notification here
            alert(`Scraping error: ${message.message}`);
            setIsSubmitting(false);
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onclose = (event) => {
      clearTimeout(connectionTimeout);
      console.log(`WebSocket disconnected with code: ${event.code}, reason: ${event.reason}`);
      setIsConnected(false);
      setWebSocket(null);
      setIsSubmitting(false);
    };
    
    ws.onerror = (error) => {
      clearTimeout(connectionTimeout);
      console.error('WebSocket error:', error);
      console.error('WebSocket URL was:', wsUrl);
      setIsConnected(false);
      setIsSubmitting(false);
    };
    
    return ws;
  }, [setWebSocket, setIsConnected, setCurrentSession, updateSessionStatus, addSession, setIsSubmitting]);

  const startScraping = useCallback(async (request: ScrapeRequest) => {
    try {
      setIsSubmitting(true);

      // Generate session ID
      const sessionId = crypto.randomUUID();

      // Connect WebSocket
      const ws = connectWebSocket(sessionId);

      // Wait for connection and send request when connected
      ws.addEventListener('open', () => {
        console.log('WebSocket opened, sending request:', request);
        ws.send(JSON.stringify(request));
      }, { once: true });

    } catch (error) {
      console.error('Error starting scrape:', error);
      setIsSubmitting(false);
    }
  }, [connectWebSocket, setIsSubmitting]);

  const stopScraping = useCallback(() => {
    if (websocket) {
      websocket.close();
    }
    setIsSubmitting(false);
  }, [websocket, setIsSubmitting]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [websocket]);

  return {
    startScraping,
    stopScraping,
  };
};
