/**
 * Connection Store for WebSocket State Management
 * 
 * This store manages WebSocket connection state, including:
 * - Connection status and health
 * - Reconnection attempts
 * - Message queue status
 * - Error handling
 */

import { create } from 'zustand';
import { ConnectionState } from '../services/websocket';

export interface ConnectionInfo {
  state: ConnectionState;
  sessionId: string | null;
  connectedAt: Date | null;
  lastReconnectAt: Date | null;
  reconnectAttempts: number;
  queuedMessages: number;
  latency: number | null;
  error: string | null;
}

export interface ConnectionStats {
  totalConnections: number;
  totalReconnections: number;
  totalErrors: number;
  uptime: number;
  averageLatency: number;
}

interface ConnectionState {
  // Connection info
  connection: ConnectionInfo;
  stats: ConnectionStats;
  
  // UI state
  showConnectionDetails: boolean;
  notifications: Array<{
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    timestamp: Date;
    dismissed: boolean;
  }>;
  
  // Actions
  updateConnectionState: (state: ConnectionState) => void;
  setSessionId: (sessionId: string | null) => void;
  setQueuedMessages: (count: number) => void;
  setLatency: (latency: number | null) => void;
  setError: (error: string | null) => void;
  incrementReconnectAttempts: () => void;
  resetReconnectAttempts: () => void;
  recordConnection: () => void;
  recordReconnection: () => void;
  recordError: () => void;
  addNotification: (type: 'info' | 'warning' | 'error' | 'success', message: string) => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
  toggleConnectionDetails: () => void;
  resetStats: () => void;
}

const initialConnection: ConnectionInfo = {
  state: 'disconnected',
  sessionId: null,
  connectedAt: null,
  lastReconnectAt: null,
  reconnectAttempts: 0,
  queuedMessages: 0,
  latency: null,
  error: null,
};

const initialStats: ConnectionStats = {
  totalConnections: 0,
  totalReconnections: 0,
  totalErrors: 0,
  uptime: 0,
  averageLatency: 0,
};

export const useConnectionStore = create<ConnectionState>((set, get) => ({
  // Initial state
  connection: initialConnection,
  stats: initialStats,
  showConnectionDetails: false,
  notifications: [],
  
  // Actions
  updateConnectionState: (state: ConnectionState) => 
    set((current) => ({
      connection: {
        ...current.connection,
        state,
        ...(state === 'connected' && !current.connection.connectedAt 
          ? { connectedAt: new Date() } 
          : {}),
        ...(state === 'disconnected' || state === 'error' 
          ? { connectedAt: null } 
          : {}),
      }
    })),
  
  setSessionId: (sessionId) =>
    set((state) => ({
      connection: { ...state.connection, sessionId }
    })),
  
  setQueuedMessages: (count) =>
    set((state) => ({
      connection: { ...state.connection, queuedMessages: count }
    })),
  
  setLatency: (latency) =>
    set((state) => {
      const newStats = { ...state.stats };
      if (latency !== null) {
        // Update average latency
        const totalMeasurements = newStats.totalConnections + newStats.totalReconnections;
        if (totalMeasurements > 0) {
          newStats.averageLatency = 
            (newStats.averageLatency * (totalMeasurements - 1) + latency) / totalMeasurements;
        } else {
          newStats.averageLatency = latency;
        }
      }
      
      return {
        connection: { ...state.connection, latency },
        stats: newStats
      };
    }),
  
  setError: (error) =>
    set((state) => ({
      connection: { ...state.connection, error }
    })),
  
  incrementReconnectAttempts: () =>
    set((state) => ({
      connection: { 
        ...state.connection, 
        reconnectAttempts: state.connection.reconnectAttempts + 1 
      }
    })),
  
  resetReconnectAttempts: () =>
    set((state) => ({
      connection: { ...state.connection, reconnectAttempts: 0 }
    })),
  
  recordConnection: () =>
    set((state) => ({
      stats: { 
        ...state.stats, 
        totalConnections: state.stats.totalConnections + 1 
      }
    })),
  
  recordReconnection: () =>
    set((state) => ({
      connection: { ...state.connection, lastReconnectAt: new Date() },
      stats: { 
        ...state.stats, 
        totalReconnections: state.stats.totalReconnections + 1 
      }
    })),
  
  recordError: () =>
    set((state) => ({
      stats: { 
        ...state.stats, 
        totalErrors: state.stats.totalErrors + 1 
      }
    })),
  
  addNotification: (type, message) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: crypto.randomUUID(),
          type,
          message,
          timestamp: new Date(),
          dismissed: false,
        }
      ]
    })),
  
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.map(notification =>
        notification.id === id 
          ? { ...notification, dismissed: true }
          : notification
      )
    })),
  
  clearNotifications: () =>
    set({ notifications: [] }),
  
  toggleConnectionDetails: () =>
    set((state) => ({
      showConnectionDetails: !state.showConnectionDetails
    })),
  
  resetStats: () =>
    set({
      stats: initialStats,
      notifications: []
    }),
}));

// Utility functions for connection status
export const getConnectionStatusColor = (state: ConnectionState): string => {
  switch (state) {
    case 'connected':
      return 'text-green-500';
    case 'connecting':
    case 'reconnecting':
      return 'text-yellow-500';
    case 'disconnected':
      return 'text-gray-500';
    case 'error':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export const getConnectionStatusIcon = (state: ConnectionState): string => {
  switch (state) {
    case 'connected':
      return '🟢';
    case 'connecting':
    case 'reconnecting':
      return '🟡';
    case 'disconnected':
      return '⚪';
    case 'error':
      return '🔴';
    default:
      return '⚪';
  }
};

export const getConnectionStatusText = (state: ConnectionState): string => {
  switch (state) {
    case 'connected':
      return 'Connected';
    case 'connecting':
      return 'Connecting...';
    case 'reconnecting':
      return 'Reconnecting...';
    case 'disconnected':
      return 'Disconnected';
    case 'error':
      return 'Connection Error';
    default:
      return 'Unknown';
  }
};
