import { WebSocket } from 'ws';
import { subscribeToChannel } from '../services/broker';
import { MatchRequest, LocationUpdate, TripState, TripStatus } from '../types/contracts';
import { DispatchEngine } from '../services/dispatch-engine';
import jwt from 'jsonwebtoken';


/**
 * Handle an incoming WebSocket text message.
 */

const dispatchEngine = new DispatchEngine();
const active_connections: Map<WebSocket, string> = new Map<WebSocket, string>();
const JWT_KEY = process.env.JWT_SECRET;


export async function handleWebSocketMessage(ws: WebSocket, message: string): Promise<void> {
  // TODO: parse message, route to appropriate service action
  try {
    const received_message = JSON.parse(message);
    switch (received_message.type) {
      case "request_match":
        await dispatchEngine.findMatch(received_message.payload);
        ws.send(JSON.stringify({ status: "success", message: "Match Requested!"}));
        console.log("request_match");
        break;
      case "update_location":
        await dispatchEngine.updateDriverLocation(received_message.payload);
        ws.send(JSON.stringify({ status: "success", message: "Location Updated!"}));

        console.log("update_location");
        break;
      case "cancel_trip":
        await dispatchEngine.cancelTrip(received_message.payload);
        ws.send(JSON.stringify({ status: "success", message: "Trip Cancelled!"}));
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