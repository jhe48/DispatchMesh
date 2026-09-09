import { useState } from "react";

interface IncomingMessage {
    type: string;
    driver_id?: string;
    rider?: string;
    pickup_latitude?: number;
    pickup_longitude?: number;
    dropoff_latitude?: number;
    dropoff_longitude?: number;
    
}

interface RiderDashboardProps {
    ws: React.RefObject<WebSocket | null>;
    status: string;
}

export default function RiderDashboard({ ws, status }: RiderDashboardProps) {
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
        </>
    );
} 