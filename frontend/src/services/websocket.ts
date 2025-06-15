// Advanced WebSocket service with reconnection, queuing, and error handling

import type {
  WebSocketMessage,
  ConnectionStatus,
  ConnectionState,
  WebSocketConfig,
  MessageHandlers,
  QueuedMessage
} from '../types/websocket';
import { config, WS_CONSTANTS } from '../utils';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private connectionState: ConnectionState = {
    status: 'disconnected',
    reconnectAttempts: 0,
  };
  private messageQueue: QueuedMessage[] = [];
  private messageHandlers: MessageHandlers = {};
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private connectionTimeout: NodeJS.Timeout | null = null;
  private currentSessionId: string | null = null;

  private wsConfig: WebSocketConfig = {
    url: config.WS_BASE_URL,
    maxReconnectAttempts: config.RECONNECT_ATTEMPTS,
    reconnectDelay: WS_CONSTANTS.RECONNECT_DELAY,
    heartbeatInterval: config.HEARTBEAT_INTERVAL,
    connectionTimeout: WS_CONSTANTS.CONNECTION_TIMEOUT,
  };

  constructor(customConfig?: Partial<WebSocketConfig>) {
    if (customConfig) {
      this.wsConfig = { ...this.wsConfig, ...customConfig };
    }
  }

  // Connect to WebSocket with session ID
  async connect(sessionId: string): Promise<WebSocket> {
    this.currentSessionId = sessionId;
    const wsUrl = `${this.wsConfig.url}/ws/scrape/${sessionId}`;

    console.log(`🔌 Connecting to WebSocket: ${wsUrl}`);
    
    return new Promise((resolve, reject) => {
      try {
        // Close existing connection if any
        this.disconnect();

        // Update connection state
        this.updateConnectionState('connecting');

        // Create new WebSocket connection
        this.ws = new WebSocket(wsUrl);

        // Set connection timeout
        this.connectionTimeout = setTimeout(() => {
          if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
            console.error('❌ WebSocket connection timeout');
            this.ws.close();
            this.updateConnectionState('error', 'Connection timeout');
            reject(new Error('Connection timeout'));
          }
        }, this.wsConfig.connectionTimeout);

        // Handle connection open
        this.ws.onopen = () => {
          console.log('✅ WebSocket connected successfully');
          this.clearConnectionTimeout();
          this.connectionState = {
            ...this.connectionState,
            reconnectAttempts: 0,
            lastConnected: new Date(),
          };
          this.updateConnectionState('connected');
          
          // Start heartbeat
          this.startHeartbeat();
          
          // Flush queued messages
          this.flushMessageQueue();
          
          resolve(this.ws!);
        };

        // Handle incoming messages
        this.ws.onmessage = (event) => {
          this.handleMessage(event);
        };

        // Handle connection close
        this.ws.onclose = (event) => {
          this.clearConnectionTimeout();
          this.stopHeartbeat();
          
          console.log(`🔌 WebSocket disconnected: Code ${event.code}, Reason: ${event.reason}`);
          
          if (event.code !== 1000 && event.code !== 1001) {
            // Unexpected disconnection, attempt to reconnect
            this.handleDisconnection();
          } else {
            // Normal closure
            this.updateConnectionState('disconnected');
          }
        };

        // Handle connection errors
        this.ws.onerror = (error) => {
          this.clearConnectionTimeout();
          console.error('❌ WebSocket error:', error);
          this.updateConnectionState('error', 'Connection error');
          reject(error);
        };

      } catch (error) {
        console.error('❌ Failed to create WebSocket:', error);
        this.updateConnectionState('error', 'Failed to create connection');
        reject(error);
      }
    });
  }

  // Disconnect WebSocket
  disconnect(): void {
    console.log('🔌 Disconnecting WebSocket...');
    
    this.clearConnectionTimeout();
    this.clearReconnectTimeout();
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close(1000, 'Normal closure');
      this.ws = null;
    }
    
    this.updateConnectionState('disconnected');
    this.currentSessionId = null;
  }

  // Reconnect with exponential backoff
  private async reconnect(): Promise<void> {
    if (!this.currentSessionId) {
      console.error('❌ Cannot reconnect: No session ID');
      return;
    }

    if (this.connectionState.reconnectAttempts >= this.wsConfig.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      this.updateConnectionState('error', 'Max reconnection attempts reached');
      return;
    }

    this.connectionState = {
      ...this.connectionState,
      reconnectAttempts: this.connectionState.reconnectAttempts + 1,
    };
    const delay = this.wsConfig.reconnectDelay * Math.pow(2, this.connectionState.reconnectAttempts - 1);
    
    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.connectionState.reconnectAttempts}/${this.wsConfig.maxReconnectAttempts})`);
    
    this.updateConnectionState('reconnecting');
    
    this.reconnectTimeout = setTimeout(async () => {
      try {
        await this.connect(this.currentSessionId!);
      } catch (error) {
        console.error('❌ Reconnection failed:', error);
        this.reconnect(); // Try again
      }
    }, delay);
  }

  // Send message with queuing support
  async sendMessage(data: any): Promise<void> {
    const message: QueuedMessage = {
      data,
      timestamp: new Date(),
      retries: 0,
    };

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(data));
        console.log('📤 Message sent:', data.type || 'unknown');
      } catch (error) {
        console.error('❌ Failed to send message:', error);
        this.queueMessage(message);
      }
    } else {
      console.log('📥 Queuing message (not connected):', data.type || 'unknown');
      this.queueMessage(message);
    }
  }

  // Set message handlers
  setMessageHandlers(handlers: MessageHandlers): void {
    this.messageHandlers = { ...this.messageHandlers, ...handlers };
  }

  // Get current connection state
  getConnectionState(): ConnectionState {
    return { ...this.connectionState };
  }

  // Check if connected
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // Private methods
  private updateConnectionState(status: ConnectionStatus, error?: string): void {
    this.connectionState = {
      ...this.connectionState,
      status,
      error,
    };
    
    // Notify handlers about connection state change
    if (this.messageHandlers.onConnectionStateChange) {
      this.messageHandlers.onConnectionStateChange(this.connectionState);
    }
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      console.log('📨 Message received:', message.type);

      // Call appropriate handler
      switch (message.type) {
        case 'connection_established':
          this.messageHandlers.onConnectionEstablished?.(message);
          break;
        case 'status_update':
          this.messageHandlers.onStatusUpdate?.(message);
          break;
        case 'content_downloaded':
          this.messageHandlers.onContentDownloaded?.(message);
          break;
        case 'scrape_complete':
          this.messageHandlers.onScrapeComplete?.(message);
          break;
        case 'error':
          this.messageHandlers.onError?.(message);
          break;
        case 'heartbeat':
          this.messageHandlers.onHeartbeat?.(message);
          break;
        default:
          console.warn('⚠️ Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('❌ Failed to parse message:', error);
    }
  }

  private handleDisconnection(): void {
    this.updateConnectionState('disconnected');
    
    // Attempt to reconnect if we have a session ID
    if (this.currentSessionId) {
      this.reconnect();
    }
  }

  private queueMessage(message: QueuedMessage): void {
    if (this.messageQueue.length >= WS_CONSTANTS.MESSAGE_QUEUE_SIZE) {
      // Remove oldest message
      this.messageQueue.shift();
    }
    this.messageQueue.push(message);
  }

  private flushMessageQueue(): void {
    console.log(`📤 Flushing ${this.messageQueue.length} queued messages`);
    
    const messages = [...this.messageQueue];
    this.messageQueue = [];
    
    messages.forEach(async (message) => {
      try {
        await this.sendMessage(message.data);
      } catch (error) {
        console.error('❌ Failed to send queued message:', error);
        // Re-queue if retries available
        if (message.retries < 3) {
          message.retries++;
          this.queueMessage(message);
        }
      }
    });
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected()) {
        this.sendMessage({ type: 'heartbeat', timestamp: new Date().toISOString() });
      }
    }, this.wsConfig.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private clearConnectionTimeout(): void {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  // Cleanup method
  destroy(): void {
    this.disconnect();
    this.messageQueue = [];
    this.messageHandlers = {};
  }
}

// Create singleton instance
export const webSocketManager = new WebSocketManager();
