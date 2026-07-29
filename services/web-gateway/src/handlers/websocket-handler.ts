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
const JWT_KEY = process.env.JWT_SECRET || "default_fallback_for_local_dev";

subscribeToChannel("trip.matched", (message) => {
  try {
    const received_message = JSON.parse(message);
    const received_rider_Id = received_message.rider_id;
    for (const [ws, id] of active_connections.entries()) {
      if (id == received_rider_Id) {
        ws.send(JSON.stringify( {status: "Success", message: `A Driver has been Found, ${id}!` }));
      }
    }
  } catch (err) {
    console.error("Faled to parse JSON String: ", err);
  }
});

subscribeToChannel("driver.location.updated", (message) => {
  try {
    const received_message = JSON.parse(message);
    const received_latitude = received_message.latitude, received_longitude = received_message.longitude;
  } catch (err) {
    console.error("Failed to parse JSON String: ", err);
  }
});

export async function handleWebSocketMessage(ws: WebSocket, message: string): Promise<void> {
  // TODO: parse message, route to appropriate service action
  try {
    const received_message = JSON.parse(message);
    if (!active_connections.has(ws) && received_message.type!=="auth") return
    switch (received_message.type) {
      case "auth":
        try {
          const decoded = jwt.verify(received_message.payload, JWT_KEY) as { userId: string };
          active_connections.set(ws, decoded.userId);
          ws.send(JSON.stringify({ status: "Success", message: "Authenticated Successfully!" }));
          console.log(`User ${decoded.userId} connected!`);
        } catch (err) {
          ws.send(JSON.stringify({ status: 'Error', message: "Invalid Token!"}));
        }
        break;
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
  if (active_connections.has(ws)) {
    ws.on('message', (data) => {
      handleWebSocketMessage(ws, data.toString())
    });
  }
}