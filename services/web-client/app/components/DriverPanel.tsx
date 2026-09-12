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

interface DriverDashboardProps {
    ws: React.RefObject<WebSocket | null>;
    status: string;
    serverMessage: IncomingMessage | null;
}

export default function DriverDashboard({ ws, status }: DriverDashboardProps) {
    const [updatedLatitude, setUpdatedLatitude] = useState("");
    const [updatedLongitude, setUpdatedLongitude] = useState("");
    const sendUpdatedLocation = () => {
    if (ws.current && status === "Connected") {
      const payload = JSON.stringify({
        "type": "update_location",
        "payload": {
            "latitude": updatedLatitude,
            "longitude": updatedLongitude
        }
      });
      ws.current.send(payload);
    }
    }
    return (
        <>
        <p>DRIVER</p>
        <p>Update your Coordinates</p>
        <input type="text" inputMode="numeric" onChange={(e) => setUpdatedLatitude(e.target.value)} maxLength={10} placeholder="Update Latitude" />
        <input type="text" inputMode="numeric" onChange={(e) => setUpdatedLongitude(e.target.value)} maxLength={10} placeholder="Update Longitude" />
        <button className="disabled:cursor-not-allowed cursor-pointer" onClick={sendUpdatedLocation} disabled={!(status === "Connected")}>
            Update Location
        </button>
        </>
    );
} 