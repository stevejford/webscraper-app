/**
 * WebSocket-related TypeScript type definitions
 */

import { ScrapeStatus, ScrapeResult, ScrapedContent } from './api';

export interface WebSocketMessage {
  type: 'connection_established' | 'status_update' | 'scrape_complete' | 'error' | 'content_downloaded' | 'ping' | 'pong';
  data?: any;
  message?: string;
  session_id?: string;
  details?: string;
  timestamp?: number;
}

export interface ConnectionEstablishedMessage extends WebSocketMessage {
  type: 'connection_established';
  session_id: string;
  message: string;
}

export interface StatusUpdateMessage extends WebSocketMessage {
  type: 'status_update';
  data: ScrapeStatus;
}

export interface ScrapeCompleteMessage extends WebSocketMessage {
  type: 'scrape_complete';
  data: ScrapeResult;
}

export interface ContentDownloadedMessage extends WebSocketMessage {
  type: 'content_downloaded';
  data: ScrapedContent;
}

export interface ErrorMessage extends WebSocketMessage {
  type: 'error';
  message: string;
  details?: string;
}

export interface PingMessage extends WebSocketMessage {
  type: 'ping';
  timestamp: number;
}

export interface PongMessage extends WebSocketMessage {
  type: 'pong';
  timestamp: number;
}

export type WebSocketMessageType = 
  | ConnectionEstablishedMessage
  | StatusUpdateMessage
  | ScrapeCompleteMessage
  | ContentDownloadedMessage
  | ErrorMessage
  | PingMessage
  | PongMessage;

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error' | 'reconnecting';

export interface WebSocketConfig {
  maxReconnectAttempts: number;
  reconnectDelay: number;
  heartbeatInterval: number;
  connectionTimeout: number;
}

export interface WebSocketCallbacks {
  onOpen?: () => void;
  onMessage?: (message: WebSocketMessage) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: Event) => void;
  onReconnect?: () => void;
  onConnectionStateChange?: (state: ConnectionState) => void;
}
