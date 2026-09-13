import { useEffect, useState } from "react";

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
    const [activeTripID, setActiveTripID] = useState<string | null>(null);
    const [assignedDriverID, setAssignedDriverID] = useState<string | null>(null);

    useEffect(() => {
        if (serverMessage?.type == "match_found") {
            setActiveTripID(serverMessage?.payload?.trip_id ?? null);
            setAssignedDriverID(serverMessage?.payload?.driver_id ?? null);
        } else if (serverMessage?.type === "cancel_trip") {
            setActiveTripID(null);
            setAssignedDriverID(null);
        }
    }, [serverMessage]);

    const sendRequestMatch = () => {
        if (ws.current && status === "Connected") {
            const payload = JSON.stringify({
                "type": "request_match",
                "payload": {
                    "pickup_latitude": pickupLatitude,
                    "pickup_longitude": pickupLongitude,
                    "dropoff_latitude": dropoffLatitude,
                    "dropoff_longitude": dropoffLongitude
            }});
            ws.current.send(payload);
        }
    }
    const sendCancelTrip = () => {
        if (ws.current && status === "Connected" && serverMessage?.payload?.trip_id) {
            const payload = JSON.stringify({
                "type": "cancel_trip",
                "payload": serverMessage.payload.trip_id
            });
            ws.current.send(payload);
        }
    }
    return (
        <div className="border-4 border-blue-500 rounded-xl p-6 bg-gray-950 shadow-lg min-h-[600px]">
        <p>RIDER</p>
        <br></br>
        <p className="font-bold text-yellow-300">Active Trips: <br></br>{activeTripID}</p>
        <br></br>
        <p>Pickup Coordinates</p>
        <input type="text" inputMode="numeric" onChange={(e) => setPickupLatitude(e.target.value)} maxLength={10} placeholder="Pickup Latitude" />
        <input type="text" inputMode="numeric" onChange={(e) => setPickupLongitude(e.target.value)} maxLength={10} placeholder="Pickup Longitude" />
        <p>Dropoff Coordinates</p>
        <input type="text" inputMode="numeric" onChange={(e) => setDropoffLatitude(e.target.value)} maxLength={10} placeholder="Dropoff Latitude" />
        <input type="text" inputMode="numeric" onChange={(e) => setDropoffLongitude(e.target.value)} maxLength={10} placeholder="Dropoff Longitude" />
        <br></br>
        <br></br>
        {!activeTripID && (
            <button className="disabled:cursor-not-allowed cursor-pointer bg-green-500 text-black p-2 rounded" onClick={sendRequestMatch} disabled={!(status === "Connected")}>
            Request Match
            </button>
        )}
        {serverMessage?.type == "match_found" && (
            <p className="font-bold text-green-600">Match Found! Your Driver is: {assignedDriverID}</p>
        )}
        <br></br>
        <br></br>
        {activeTripID && (
            <button className="disabled:cursor-not-allowed cursor-pointer bg-red-500 text-white p-2 rounded" onClick={sendCancelTrip} disabled={!(status === "Connected")}>
            Cancel Trip
            </button>
        )}
        {serverMessage?.type == "cancel_trip" && (
            <p className="font-bold text-red-600">Cancelled Trip {serverMessage?.payload?.trip_id}</p>
        )}
        </div>
    );
} 