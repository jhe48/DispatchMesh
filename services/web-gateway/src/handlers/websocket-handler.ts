import { WebSocket } from 'ws';
import { subscribeToChannel } from '../services/broker';
import { MatchRequest, LocationUpdate, TripState, TripStatus } from '../types/contracts';
import { DispatchEngine } from '../services/dispatch-engine';

/**
 * Handle an incoming WebSocket text message.
 */

const dispatchEngine = new DispatchEngine();

export function handleWebSocketMessage(ws: WebSocket, message: string): void {
  // TODO: parse message, route to appropriate service action
  try {
    const received_message = JSON.parse(message);
    switch (received_message.type) {
      case "request_match":
        dispatchEngine.findMatch(received_message.payload)
        console.log("request_match");
        break;
      case "update_location":
        dispatchEngine.updateDriverLocation(received_message.payload)
        console.log("update_location");
        break;
      case "cancel_trip":
        dispatchEngine.cancelTrip(received_message.payload)
        console.log("cancel_trip");
        break;
      default:
        console.log("Invalid Message");
    }
  } catch (error) {
    console.error("Failed to parse JSON String: ", error);
  }
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