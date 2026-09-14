import { useMapEvents, MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import L from 'leaflet';

const pickupIcon = new L.DivIcon({
    className: 'custom-icon',
    html: `<div style="background-color: red; width: 20px; height: 20px; border-radius:
        50%; border: 2px solid white;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

const dropoffIcon = new L.DivIcon({
    className: 'custom-icon',
    html: `<div style="background-color: green; width: 20px; height: 20px; border-radius:
        50%; border: 2px solid white;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

const driverIcon = new L.DivIcon({
    className: 'custom-icon',
    html: `<div style="background-color: blue; width: 20px; height: 20px; border-radius:
        50%; border: 2px solid white;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

type Coordinate = {
    latitude: number;
    longitude: number;
    type: "pickup" | "dropoff" | "driver";
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
            {markers.map((marker, index) => {
                let iconToUse = pickupIcon;
                if (marker.type === "dropoff") iconToUse = dropoffIcon;
                if (marker.type === "driver") iconToUse = driverIcon;
                return <Marker key={index} position={[marker.latitude, marker.longitude]} icon={iconToUse} />
            }
            )}
        </MapContainer>
        </>
    )
}