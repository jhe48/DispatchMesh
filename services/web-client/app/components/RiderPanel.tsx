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
        <div className="min-h-[600px] rounded-xl border border-emerald-300/20 bg-[#06110d]/90 p-4 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-6">
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4"><p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Rider channel</p><span className="rounded-full border border-emerald-300/20 px-2 py-1 text-[10px] text-emerald-300">{status}</span></div>
        <div className="space-y-5">
        <p className="mb-0 text-sm font-bold uppercase tracking-[0.18em] text-slate-300">Active trip <span className="ml-2 font-mono text-sm font-semibold normal-case text-emerald-200/80">{activeTripID || "No active trip"}</span></p>
        <br></br>
        {/**
            <p>Pickup Coordinates</p>
            <input type="text" inputMode="numeric" onChange={(e) => setPickupLatitude(e.target.value)} maxLength={10} placeholder="Pickup Latitude" />
            <input type="text" inputMode="numeric" onChange={(e) => setPickupLongitude(e.target.value)} maxLength={10} placeholder="Pickup Longitude" />
            <p>Dropoff Coordinates</p>
            <input type="text" inputMode="numeric" onChange={(e) => setDropoffLatitude(e.target.value)} maxLength={10} placeholder="Dropoff Latitude" />
            <input type="text" inputMode="numeric" onChange={(e) => setDropoffLongitude(e.target.value)} maxLength={10} placeholder="Dropoff Longitude" />
        */}
        <div className="rounded-xl border border-emerald-300/25 bg-emerald-300/[0.06] p-3 text-center text-sm font-semibold leading-relaxed tracking-wide text-emerald-200/80 shadow-[0_0_18px_rgba(110,231,183,0.08)]">
        {!pickupLatitude ? "Click Map to select Pickup" : !dropoffLatitude ? "Click Map to select Dropoff" : "Ready to Request Match!"}
        <div className="mt-4 overflow-hidden rounded-lg border border-white/10"><MapUI onMapClick={handleMapClick} markers={[
            ...(pickupLatitude && pickupLongitude ? [{ latitude: pickupLatitude, longitude: pickupLongitude, type: "pickup" as const }] : []),
            ...(dropoffLatitude && dropoffLongitude? [{ latitude: dropoffLatitude, longitude: dropoffLongitude, type: "dropoff" as const }] : []),
            ...(updatedLatitude && updatedLongitude ? [{ latitude: updatedLatitude, longitude: updatedLongitude, type: "driver" as const }] : [])
            ]}
        /></div>
        </div>
        {!activeTripID && (
            <button className="cursor-pointer rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/15" onClick={() => { setPickupLatitude(null); setDropoffLatitude(null); }} disabled={!(status === "Connected")}> Clear Map </button>
        )}

        {!activeTripID && (
            <button className="disabled:cursor-not-allowed cursor-pointer rounded-lg bg-emerald-300 px-4 py-2 text-xs font-semibold text-[#03120c] shadow-[0_0_20px_rgba(110,231,183,0.2)] transition-transform hover:-translate-y-0.5 disabled:opacity-40" onClick={sendRequestMatch} disabled={!(status === "Connected")}>
            Request Match
            </button>
        )}
        {activeTripID && (
            <p className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-3 text-xs font-semibold text-emerald-300">Match Found! Your Driver is: {assignedDriverID}</p>
        )}
        {activeTripID && (
            <button className="disabled:cursor-not-allowed cursor-pointer rounded-lg border border-red-300/20 bg-red-400/15 px-4 py-2 text-xs font-semibold text-red-200 transition-colors hover:bg-red-400/25 disabled:opacity-40" onClick={sendCancelTrip} disabled={!(status === "Connected")}>
            Cancel Trip
            </button>
        )}
        {serverMessage?.type == "cancel_trip" && (
            <p className="font-bold text-red-600">Cancelled Trip {serverMessage?.payload?.trip_id}</p>
        )}
        </div>
        </div>
    );
} 
