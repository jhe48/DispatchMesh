import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { parse } from "path";

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
    const [updatedLatitude, setUpdatedLatitude] = useState<number | null>(null);
    const [updatedLongitude, setUpdatedLongitude] = useState<number | null>(null);
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
        <div className="min-h-[600px] rounded-xl border border-amber-200/20 bg-[#11100a]/90 p-4 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-6">
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4"><p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">Driver channel</p><span className="rounded-full border border-amber-200/20 px-2 py-1 text-[10px] text-amber-200">{status}</span></div>
        <div className="space-y-5">
        <p className="mb-0 text-sm font-bold uppercase tracking-[0.18em] text-slate-300">Update your coordinates</p>
        <div className="grid gap-3 sm:grid-cols-2"><input className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm font-medium text-white outline-none transition-colors placeholder:text-slate-400 focus:border-amber-200/50" type="text" inputMode="numeric" onChange={(e) => setUpdatedLatitude(parseFloat(e.target.value))} maxLength={10} placeholder="Update Latitude" />
        <input className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm font-medium text-white outline-none transition-colors placeholder:text-slate-400 focus:border-amber-200/50" type="text" inputMode="numeric" onChange={(e) => setUpdatedLongitude(parseFloat(e.target.value))} maxLength={10} placeholder="Update Longitude" /></div>
        <div className="rounded-xl border border-amber-200/20 bg-amber-200/[0.05] p-3 text-center text-sm font-semibold leading-relaxed tracking-wide text-amber-100/80 shadow-[0_0_18px_rgba(253,230,138,0.06)]">
        <div className="overflow-hidden rounded-lg border border-white/10"><MapUI markers={[
            ...(updatedLatitude && updatedLongitude ? [{ latitude: updatedLatitude, longitude: updatedLongitude, type: "driver" as const }] : []),
            ...(pickupLatitude && pickupLongitude ? [{ latitude: pickupLatitude, longitude: pickupLongitude, type: "pickup" as const }] : []),
            ...(dropoffLatitude && dropoffLongitude ? [{ latitude: dropoffLatitude, longitude: dropoffLongitude, type: "dropoff" as const }] : [])
            ]} /></div>
        </div>
        <button className="disabled:cursor-not-allowed cursor-pointer rounded-lg bg-amber-200 px-4 py-2 text-xs font-semibold text-[#171006] shadow-[0_0_20px_rgba(253,230,138,0.14)] transition-transform hover:-translate-y-0.5 disabled:opacity-40" onClick={sendUpdatedLocation} disabled={!(status === "Connected")}>
            Update Location
        </button>
        {activeTripID && (
            <div className="space-y-3">
                <p className="rounded-lg border border-amber-200/20 bg-amber-200/10 p-3 text-xs font-semibold text-amber-100/80">New Ride for {newRider}!</p> 
                <p className="mt-2 text-xs text-amber-200/80">Pickup at: ({pickupLatitude}, {pickupLongitude})</p>
                <p className="text-xs text-amber-200/80">Dropoff to: ({dropoffLatitude}, {dropoffLongitude})</p>
                <button className="disabled:cursor-not-allowed cursor-pointer rounded-lg border border-red-300/20 bg-red-400/15 px-4 py-2 text-xs font-semibold text-red-200 transition-colors hover:bg-red-400/25 disabled:opacity-40" onClick={sendCancelTrip} disabled={!(status === "Connected")}>
                    Cancel Trip
                </button>
            </div>
        )}
        {serverMessage?.type == "cancel_trip" && (
            <p className="font-bold text-red-600">Cancelled Trip {serverMessage?.payload?.trip_id}</p>
        )}
        </div>
        </div>
    );
} 
