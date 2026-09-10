import { useState } from "react";

interface IncomingMessage {
    type: string;
    payload?: {
        role?: string;
        driver_id?: string;
        rider_id?: string;
        latitude?: number;
        longitude?: number;
        trip_id?: string;
        trip_status?: string;
    }
}

interface RiderDashboardProps {
    ws: React.RefObject<WebSocket | null>;
    status: string;
    serverMessage: IncomingMessage | null;
}

export default function RiderDashboard({ ws, status, serverMessage }: RiderDashboardProps) {
    const [pickupLatitude, setPickupLatitude] = useState("");
    const [pickupLongitude, setPickupLongitude] = useState("");
    const [dropoffLatitude, setDropoffLatitude] = useState("");
    const [dropoffLongitude, setDropoffLongitude] = useState("");
    
    const sendRequestMatch = () => {
    if (ws.current && status === "Connected") {
      const payload = JSON.stringify({
        "type": "request_match",
        "payload": {
            "pickup_latitude": pickupLatitude,
            "pickup_longitude": pickupLongitude,
            "dropoff_latitude": dropoffLatitude,
            "dropoff_longitude": dropoffLongitude
        }
      });
      ws.current.send(payload);
    }
    }
    return (
        <>
        <p>RIDER</p>
        <p>Pickup Coordinates</p>
        <input type="text" inputMode="numeric" onChange={(e) => setPickupLatitude(e.target.value)} maxLength="10" placeholder="Pickup Latitude" />
        <input type="text" inputMode="numeric" onChange={(e) => setPickupLongitude(e.target.value)} maxLength="10" placeholder="Pickup Longitude" />
        <p>Dropoff Coordinates</p>
        <input type="text" inputMode="numeric" onChange={(e) => setDropoffLatitude(e.target.value)} maxLength="10" placeholder="Dropoff Latitude" />
        <input type="text" inputMode="numeric" onChange={(e) => setDropoffLongitude(e.target.value)} maxLength="10" placeholder="Dropoff Longitude" />
        <button className="disabled:cursor-not-allowed cursor-pointer" onClick={sendRequestMatch} disabled={!(status === "Connected")}>
            Request Match
        </button>
        {serverMessage?.type == "match_found" && (
            <p className="font-bold text-green-600">Match Found! Your Driver is: {serverMessage?.payload?.driver_id}</p>
        )}
        </>
    );
} 