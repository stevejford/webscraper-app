// WebSocket types and interfaces

import { ScrapeStatus, ScrapeResult, ScrapedContent } from './api';

export type WebSocketMessage = 
  | ConnectionEstablishedMessage
  | StatusUpdateMessage
  | ContentDownloadedMessage
  | ScrapeCompleteMessage
  | ErrorMessage
  | HeartbeatMessage;

export interface ConnectionEstablishedMessage {
  type: 'connection_established';
  session_id: string;
  message: string;
  timestamp: string;
}

export interface StatusUpdateMessage {
  type: 'status_update';
  data: ScrapeStatus;
  timestamp: string;
}

export interface ContentDownloadedMessage {
  type: 'content_downloaded';
  data: ScrapedContent;
  timestamp: string;
}

export interface ScrapeCompleteMessage {
  type: 'scrape_complete';
  data: ScrapeResult;
  timestamp: string;
}

export interface ErrorMessage {
  type: 'error';
  message: string;
  details?: string;
  session_id?: string;
  timestamp: string;
}

export interface HeartbeatMessage {
  type: 'heartbeat';
  timestamp: string;
}

// WebSocket connection states
export type ConnectionStatus = 
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error';

export interface ConnectionState {
  status: ConnectionStatus;
  lastConnected?: Date;
  reconnectAttempts: number;
  error?: string;
}

// WebSocket configuration
export interface WebSocketConfig {
  url: string;
  maxReconnectAttempts: number;
  reconnectDelay: number;
  heartbeatInterval: number;
  connectionTimeout: number;
}

// Message handlers
export interface MessageHandlers {
  onConnectionEstablished?: (data: ConnectionEstablishedMessage) => void;
  onStatusUpdate?: (data: StatusUpdateMessage) => void;
  onContentDownloaded?: (data: ContentDownloadedMessage) => void;
  onScrapeComplete?: (data: ScrapeCompleteMessage) => void;
  onError?: (data: ErrorMessage) => void;
  onHeartbeat?: (data: HeartbeatMessage) => void;
}

// WebSocket manager interface
export interface WebSocketManager {
  connect(sessionId: string): Promise<WebSocket>;
  disconnect(): void;
  reconnect(): Promise<void>;
  sendMessage(data: any): Promise<void>;
  getConnectionState(): ConnectionState;
  setMessageHandlers(handlers: MessageHandlers): void;
}

// Queue for messages when disconnected
export interface QueuedMessage {
  data: any;
  timestamp: Date;
  retries: number;
}
