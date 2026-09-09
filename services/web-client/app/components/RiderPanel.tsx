import { useState } from "react";

interface RiderDashboardProps {
    ws: React.RefObject<WebSocket | null>;
    status: string;
}

export default function RiderDashboard({ ws, status }: RiderDashboardProps) {
    const [PickupLatitude, setPickupLatitude] = useState("");
    const [PickupLongitude, setPickupLongitude] = useState("");
    const [DropoffLatitude, setDropoffLatitude] = useState("");
    const [DropoffLongitude, setDropoffLongitude] = useState("");
    
    const sendRequestMatch = () => {
    if (ws.current && status === "Connected") {
      const payload = JSON.stringify({
        "type": "request_match",
        "payload": {
            "pickup_latitude": PickupLatitude,
            "pickup_longitude": PickupLongitude,
            "dropoff_latitude": DropoffLatitude,
            "dropoff_longitude": DropoffLongitude
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