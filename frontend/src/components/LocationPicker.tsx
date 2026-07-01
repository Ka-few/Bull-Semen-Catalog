import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
    initialPosition?: [number, number];
    onLocationSelect: (lat: number, lng: number) => void;
}

const LocationMarker = ({ position, setPosition, onLocationSelect }: any) => {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
};

export const LocationPicker: React.FC<LocationPickerProps> = ({ initialPosition, onLocationSelect }) => {
    // Default to Nairobi, Kenya if no initial position
    const defaultCenter: [number, number] = initialPosition || [-1.2921, 36.8219];
    const [position, setPosition] = useState<L.LatLng | null>(initialPosition ? new L.LatLng(initialPosition[0], initialPosition[1]) : null);

    return (
        <div style={{ height: '400px', width: '100%', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <MapContainer center={defaultCenter} zoom={10} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} />
            </MapContainer>
            <p className="text-sm text-gray-500 mt-2">Click on the map to set your location.</p>
        </div>
    );
};
