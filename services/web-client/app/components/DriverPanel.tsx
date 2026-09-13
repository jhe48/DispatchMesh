import { setAbortedLogsStyle } from "next/dist/server/node-environment-extensions/console-dim.external";
import { useEffect, useState } from "react";

interface IncomingMessage {
    type: string;
    payload?: {
        role?: string;
        rider?: string;
        pickup_latitude?: number;
        pickup_longitude?: number;
        dropoff_latitude?: number;
        dropoff_longitude?: number;
        trip_id?: string;
        trip_status?: string;
    }
}

interface DriverDashboardProps {
    ws: React.RefObject<WebSocket | null>;
    status: string;
    serverMessage: IncomingMessage | null;
}

export default function DriverDashboard({ ws, status, serverMessage }: DriverDashboardProps) {
    const [updatedLatitude, setUpdatedLatitude] = useState("");
    const [updatedLongitude, setUpdatedLongitude] = useState("");
    const [newRider, setNewRider] = useState<string | null>(null);
    const [pickupLatitude, setPickupLatitude] = useState<number | null>(null);
    const [pickupLongitude, setPickupLongitude] = useState<number | null>(null);
    const [dropoffLatitude, setDropoffLatitude] = useState<number | null>(null);
    const [dropoffLongitude, setDropoffLongitude] = useState<number | null>(null);

    useEffect(() => {
        if (serverMessage?.type === "new_ride") {
            setNewRider(serverMessage?.payload?.rider ?? null);
            setPickupLatitude(serverMessage?.payload?.pickup_latitude ?? null);
            setPickupLongitude(serverMessage?.payload?.pickup_longitude ?? null);
            setDropoffLatitude(serverMessage?.payload?.dropoff_latitude ?? null);
            setDropoffLongitude(serverMessage?.payload?.dropoff_longitude ?? null);
        }
    }, [serverMessage]); 

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
        <div className="border-4 border-yellow-500 rounded-xl p-6 bg-gray-50 shadow-lg min-h-[600px]">
        <p>DRIVER</p>
        <p>Update your Coordinates</p>
        <input type="text" inputMode="numeric" onChange={(e) => setUpdatedLatitude(e.target.value)} maxLength={10} placeholder="Update Latitude" />
        <input type="text" inputMode="numeric" onChange={(e) => setUpdatedLongitude(e.target.value)} maxLength={10} placeholder="Update Longitude" />
        <button className="disabled:cursor-not-allowed cursor-pointer" onClick={sendUpdatedLocation} disabled={!(status === "Connected")}>
            Update Location
        </button>
        {serverMessage?.type == 'new_ride' && (
            <div>
                <p className="font-bold text-blue-600">New Ride for {newRider}! 
                <br></br>
                <p className="font-bold text-yellow-600">Pickup at: (Latitude){pickupLatitude}, (Longitude){pickupLongitude}</p>
                <br></br>
                <p className="font-bold text-yellow-600">Dropoff to: (Latitude){dropoffLatitude}, (Longitude){dropoffLongitude}</p>
            </div>
        )}
        </div>
    );
} 