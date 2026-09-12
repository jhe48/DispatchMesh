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
const JWT_KEY = process.env.JWT_SECRET_KEY || "default_fallback_for_local_dev";

subscribeToChannel("trip.matched", (message) => {
  try {
    const received_message = JSON.parse(message);
    const received_rider_id = received_message.rider_id;
    const received_driver_id = received_message.driver_id;
    // Pickup Location
    const received_pickup_latitude = received_message.pickup_latitude, received_pickup_longitude = received_message.pickup_longitude;
    // Dropoff Location
    const received_dropoff_latitude = received_message.dropoff_latitude, received_dropoff_longitude = received_message.dropoff_longitude;
    const received_trip_id = received_message.trip_id,
    received_trip_status = received_message.status;
    for (const [ws, id] of active_connections.entries()) {
      if (id == received_rider_id) {
        ws.send(JSON.stringify({ 
          "type": "match_found", 
          "payload": {
            "role": "Rider",
            "driver_id": received_driver_id,
            "trip_id": received_trip_id,
            "trip_status": received_trip_status
          }
        }));
      }
      if (id == received_driver_id) {
        ws.send(JSON.stringify({ 
          "type": "new_ride",
          "payload": {
            "role": "Driver",
            "rider": received_rider_id,
            "pickup_latitude": received_pickup_latitude,
            "pickup_longitude": received_pickup_longitude,
            "dropoff_latitude": received_dropoff_latitude,
            "dropoff_longitude": received_dropoff_longitude,
            "trip_id": received_trip_id,
            "trip_status": received_trip_status
          } 
        }));
      }
    } 
  } catch (err) {
    console.error("Failed to parse JSON String: ", err);
  }
});

subscribeToChannel("driver.location.updated", (message) => {
  try {
    const received_message = JSON.parse(message);
    const received_rider_id = received_message.rider_id, received_latitude = received_message.latitude, received_longitude = received_message.longitude;
    for (const [ws, id] of active_connections.entries()) {
      if (id == received_rider_id) {
        ws.send(JSON.stringify({
          "type": "driver_location",
          "payload": {
            "latitude": received_latitude,
            "longitude": received_longitude
          }
        }));
      }
    }
  } catch (err) {
    console.error("Failed to parse JSON String: ", err);
  }
});

subscribeToChannel("trip.cancelled", (message) => {
  try {
    const received_message = JSON.parse(message);
    const received_trip_id = received_message.trip_id, 
    received_rider_id = received_message.rider_id, 
    received_driver_id = received_message.driver_id, 
    received_status = received_message.status;
    for (const [ws, id] of active_connections.entries()) {
      if (id == received_rider_id || id == received_driver_id) {
        ws.send(JSON.stringify({
          "type": "cancel_trip",
          "payload": {
            "trip_id": received_trip_id,
            "rider_id": received_rider_id,
            "driver_id": received_driver_id,
            "trip_status": received_status
          }
        }));
      }
    }
  } catch (err) {
    console.error("Failed to parse JSON String: ", err);
  }
});

export async function handleWebSocketMessage(ws: WebSocket, message: string): Promise<void> {
  try {
    const received_message = JSON.parse(message);
    if (!active_connections.has(ws) && received_message.type!=="auth") return
    switch (received_message.type) {
      case "auth":
        try {
          const decoded = jwt.verify(received_message.payload, JWT_KEY) as { userId: string };
          active_connections.set(ws, decoded.userId);
          const active_trip_id = await dispatchEngine.trip_exists(decoded.userId);
          if (active_trip_id) {
            ws.send(JSON.stringify({
              "type": "match_found",
              "payload": {
                "trip_id": active_trip_id
              }
            }));
          }
          ws.send(JSON.stringify({ status: "Success", message: "Authenticated Successfully!" }));
          console.log(`User ${decoded.userId} connected!`);
        } catch (err) {
          ws.send(JSON.stringify({ status: 'Error', message: "Invalid Token!"}));
        }
        break;
      case "request_match":
        const real_rider_id = active_connections.get(ws);
        received_message.payload.rider_id = real_rider_id;
        await dispatchEngine.findMatch(received_message.payload);
        ws.send(JSON.stringify({ status: "success", message: "Match Requested!"}));
        console.log("request_match");
        break;
      case "update_location":
        const real_driver_id = active_connections.get(ws);
        received_message.payload.driver_id = real_driver_id;
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
    ws.on('message', (data) => {
      handleWebSocketMessage(ws, data.toString())
    });
    ws.on('close', () => {
      active_connections.delete(ws);
    })
}