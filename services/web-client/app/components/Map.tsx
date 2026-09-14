import { useMapEvents, MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import L from 'leaflet';

const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

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
            {markers.map((marker, index) => (
                <Marker key={index} position={[marker.latitude, marker.longitude]} />
            ))}
        </MapContainer>
        </>
    )
}