import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapUI = dynamic(() => import('./Map'), { ssr: false });

interface IncomingMessage {
    type: string;
    payload?: {
        role?: string;
        rider_id?: string;
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
    const [activeTripID, setActiveTripID] = useState<string | null>(null);

    useEffect(() => {
        if (serverMessage?.type === "new_ride") {
            setNewRider(serverMessage?.payload?.rider_id ?? null);
            setPickupLatitude(serverMessage?.payload?.pickup_latitude ?? null);
            setPickupLongitude(serverMessage?.payload?.pickup_longitude ?? null);
            setDropoffLatitude(serverMessage?.payload?.dropoff_latitude ?? null);
            setDropoffLongitude(serverMessage?.payload?.dropoff_longitude ?? null);
            setActiveTripID(serverMessage?.payload?.trip_id ?? null);
        }
        else if (serverMessage?.type === "cancel_trip") {
            setNewRider(null);
            setPickupLatitude(null);
            setPickupLongitude(null);
            setDropoffLatitude(null);
            setDropoffLongitude(null);
            setActiveTripID(null);
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
        <div className="border-4 border-yellow-500 rounded-xl p-6 bg-gray-950 shadow-lg min-h-[600px]">
        <p>DRIVER</p>
        <br></br>
        <p>Update your Coordinates</p>
        <input type="text" inputMode="numeric" onChange={(e) => setUpdatedLatitude(e.target.value)} maxLength={10} placeholder="Update Latitude" />
        <input type="text" inputMode="numeric" onChange={(e) => setUpdatedLongitude(e.target.value)} maxLength={10} placeholder="Update Longitude" />
        <br></br>
        <br></br>
        <p className="font-bold text-blue-400" text-center>
        <br></br>
        <MapUI markers={[
            ...(pickupLatitude && pickupLongitude ? [{ latitude: pickupLatitude, longitude: pickupLongitude }] : []),
            ...(dropoffLatitude && dropoffLongitude ? [{ latitude: dropoffLatitude, longitude: dropoffLongitude }] : [])
            ]} />
        </p>
        <br></br>
        <button className="disabled:cursor-not-allowed cursor-pointer bg-blue-800 text-white p-2 rounded" onClick={sendUpdatedLocation} disabled={!(status === "Connected")}>
            Update Location
        </button>
        {activeTripID && (
            <div>
                <br></br>
                <p className="font-bold text-blue-500">New Ride for {newRider}!</p> 
                <p className="font-bold text-yellow-400">Pickup at: ({pickupLatitude}, {pickupLongitude})</p>
                <p className="font-bold text-yellow-400">Dropoff to: ({dropoffLatitude}, {dropoffLongitude})</p>
                <br></br>
                <br></br>
                <button className="disabled:cursor-not-allowed cursor-pointer bg-red-500 text-white p-2 rounded" onClick={sendCancelTrip} disabled={!(status === "Connected")}>
                    Cancel Trip
                </button>
            </div>
        )}
        {serverMessage?.type == "cancel_trip" && (
            <p className="font-bold text-red-600">Cancelled Trip {serverMessage?.payload?.trip_id}</p>
        )}
        </div>
    );
} 