import { useEffect, useCallback } from 'react';
import { useScrapeStore } from '../store/scrapeStore';
import { ScrapeRequest, WebSocketMessage } from '../types';

export const useWebSocket = () => {
  const {
    websocket,
    setWebSocket,
    setIsConnected,
    setCurrentSession,
    updateSessionStatus,
    addSession,
    setIsSubmitting
  } = useScrapeStore();

  const connectWebSocket = useCallback((sessionId: string) => {
    // Get the correct backend URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Always use localhost for development
    const host = 'localhost';
    const port = '8000'; // Backend port
    const wsUrl = `${protocol}//${host}:${port}/ws/scrape/${sessionId}`;
    
    // Log frontend port for debugging
    console.log(`Frontend running on port: ${window.location.port || '80'}`);
    
    console.log(`Connecting to WebSocket at ${wsUrl}`);
    console.log('WebSocket readyState constants:', {
      CONNECTING: WebSocket.CONNECTING,
      OPEN: WebSocket.OPEN,
      CLOSING: WebSocket.CLOSING,
      CLOSED: WebSocket.CLOSED
    });
    const ws = new WebSocket(wsUrl);
    console.log('WebSocket created, initial readyState:', ws.readyState);
    
    // Set a connection timeout
    const connectionTimeout = setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        console.error('WebSocket connection timeout');
        ws.close();
      }
    }, 10000); // Increased timeout to 10 seconds
    
    ws.onopen = () => {
      console.log('WebSocket connected successfully');
      clearTimeout(connectionTimeout);
      setIsConnected(true);
      setWebSocket(ws);
    };
    
    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        console.log('WebSocket message received:', message.type);
        
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
