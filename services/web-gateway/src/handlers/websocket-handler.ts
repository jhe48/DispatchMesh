import { WebSocket } from 'ws';
import { subscribeToChannel } from '../services/broker';
/**
 * Handle an incoming WebSocket text message.
 */
export function handleWebSocketMessage(ws: WebSocket, message: string): void {
  // TODO: parse message, route to appropriate service action
}

/**
 * Handle a new WebSocket connection (set up listeners, auth, etc.).
 */
export function handleWebSocketConnection(ws: WebSocket): void {
  // TODO: register message/close/error listeners, perform auth handshake
  ws.on('message', (data) => {
    handleWebSocketMessage(ws, data.toString())
  });
}