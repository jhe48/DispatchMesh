import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';

const MapUI = dynamic(() => import('./Map'), { ssr: false });

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
        pickup_latitude: number;  
        pickup_longitude: number;
        dropoff_latitude: number;
        dropoff_longitude?: number;
    }
}

interface RiderDashboardProps {
    ws: React.RefObject<WebSocket | null>;
    status: string;
    serverMessage: IncomingMessage | null;
}

export default function RiderDashboard({ ws, status, serverMessage }: RiderDashboardProps) {
    const [pickupLatitude, setPickupLatitude] = useState<number | null>(null);
    const [pickupLongitude, setPickupLongitude] = useState<number | null>(null);
    const [dropoffLatitude, setDropoffLatitude] = useState<number | null>(null);
    const [dropoffLongitude, setDropoffLongitude] = useState<number | null>(null);
    const [activeTripID, setActiveTripID] = useState<string | null>(null);
    const [assignedDriverID, setAssignedDriverID] = useState<string | null>(null);
    const [updatedLatitude, setUpdatedLatitude] = useState<number | null>(null);
    const [updatedLongitude, setUpdatedLongitude] = useState<number | null>(null);

    useEffect(() => {
        if (serverMessage?.type == "match_found") {
            setActiveTripID(serverMessage?.payload?.trip_id ?? null);
            setAssignedDriverID(serverMessage?.payload?.driver_id ?? null);
            setPickupLatitude(serverMessage?.payload?.pickup_latitude ?? null);
            setPickupLongitude(serverMessage?.payload?.pickup_longitude ?? null);
            setDropoffLatitude(serverMessage?.payload?.dropoff_latitude ?? null);
            setDropoffLongitude(serverMessage?.payload?.dropoff_longitude ?? null);
        } else if (serverMessage?.type === "cancel_trip") {
            setActiveTripID(null);
            setAssignedDriverID(null);
            setUpdatedLatitude(null);
            setUpdatedLongitude(null);
        }
        else if (serverMessage?.type === "driver_location") {
            setUpdatedLatitude(serverMessage?.payload?.latitude ?? null);
            setUpdatedLongitude(serverMessage?.payload?.longitude ?? null);
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

    const handleMapClick = (lat: number, lng: number) => {
        if (!pickupLatitude) {
            setPickupLatitude(lat);
            setPickupLongitude(lng);
        } else if (!dropoffLatitude) {
            setDropoffLatitude(lat);
            setDropoffLongitude(lng);
        }
    }
    return (
        <div className="border-4 border-blue-500 rounded-xl p-6 bg-gray-950 shadow-lg min-h-[600px]">
        <p>RIDER</p>
        <br></br>
        <p className="font-bold text-yellow-300">Active Trips: <br></br>{activeTripID}</p>
        <br></br>
        
        {/**
            <p>Pickup Coordinates</p>
            <input type="text" inputMode="numeric" onChange={(e) => setPickupLatitude(e.target.value)} maxLength={10} placeholder="Pickup Latitude" />
            <input type="text" inputMode="numeric" onChange={(e) => setPickupLongitude(e.target.value)} maxLength={10} placeholder="Pickup Longitude" />
            <p>Dropoff Coordinates</p>
            <input type="text" inputMode="numeric" onChange={(e) => setDropoffLatitude(e.target.value)} maxLength={10} placeholder="Dropoff Latitude" />
            <input type="text" inputMode="numeric" onChange={(e) => setDropoffLongitude(e.target.value)} maxLength={10} placeholder="Dropoff Longitude" />
        */}
        <p className="font-bold text-blue-400" text-center>
        {!pickupLatitude ? "Click Map to select Pickup" : !dropoffLatitude ? "Click Map to select Dropoff" : "Ready to Request Match!"}
        </p>
        <br></br>
        <MapUI onMapClick={handleMapClick} markers={[
            ...(pickupLatitude && pickupLongitude ? [{ latitude: pickupLatitude, longitude: pickupLongitude, type: "pickup" as const }] : []),
            ...(dropoffLatitude && dropoffLongitude? [{ latitude: dropoffLatitude, longitude: dropoffLongitude, type: "dropoff" as const }] : []),
            ...(updatedLatitude && updatedLongitude ? [{ latitude: updatedLatitude, longitude: updatedLongitude, type: "driver" as const }] : [])
            ]}
        />
        <br></br>
        {!activeTripID && (
            <button className="cursor-pointer bg-blue-400 text-white p-2 rounded" onClick={() => { setPickupLatitude(null); setDropoffLatitude(null); }} disabled={!(status === "Connected")}> Clear Map </button>
        )}

        <br></br>
        <br></br>
        {!activeTripID && (
            <button className="disabled:cursor-not-allowed cursor-pointer bg-green-500 text-black p-2 rounded" onClick={sendRequestMatch} disabled={!(status === "Connected")}>
            Request Match
            </button>
        )}
        {activeTripID && (
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