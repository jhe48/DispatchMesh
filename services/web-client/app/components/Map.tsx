import { useMapEvents, MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"

type Coordinate = {
    latitude: number;
    longitude: number;
};

interface MapProps {
    markers: Coordinate[];
    onMapClick?: (lat: number, lng: number) => void;
}

function MapClickHandler({ onMapClick }: {onMapClick?: (lat: number, lng: number) => void}) {
    useMapEvents({
        click(e) {
            if (onMapClick) {
                onMapClick(e.latlng.lat, e.latlng.lng);
            }
        }
    });
    return null;
}

export default function MapUI({ markers, onMapClick }: MapProps) {

    return (
        <>
        <MapContainer center={[40.72, -73.55]} zoom={13} style={{ height: "500px", width: "100%" }}>
            <MapClickHandler onMapClick={onMapClick} />
            <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'></TileLayer>
        </MapContainer>
        </>
    )
}