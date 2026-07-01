import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface UserLocation {
    lat: number;
    lng: number;
}

interface Provider {
    id: number;
    full_name?: string;
    business_name?: string;
    phone_number: string;
    latitude: number;
    longitude: number;
    distance_km?: number;
    service_fee?: number;
}

interface GeospatialViewProps {
    farmerLocation: UserLocation;
    vets: Provider[];
    agriSuppliers: Provider[];
    selectedVetId: number | null;
    selectedSupplierId: number | null;
    onSelectVet: (id: number) => void;
    onSelectSupplier: (id: number) => void;
}

// Custom Icons
const farmerIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconAnchor: [12, 41]
});

const vetIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconAnchor: [12, 41]
});

const supplierIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconAnchor: [12, 41]
});


export const GeospatialView: React.FC<GeospatialViewProps> = ({
    farmerLocation,
    vets,
    agriSuppliers,
    selectedVetId,
    selectedSupplierId,
    onSelectVet,
    onSelectSupplier
}) => {
    return (
        <div style={{ height: '500px', width: '100%', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
            <MapContainer center={[farmerLocation.lat, farmerLocation.lng]} zoom={11} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Farmer Location */}
                <Marker position={[farmerLocation.lat, farmerLocation.lng]} icon={farmerIcon}>
                    <Popup>
                        <strong>Your Delivery Location</strong>
                    </Popup>
                </Marker>
                
                <Circle 
                    center={[farmerLocation.lat, farmerLocation.lng]} 
                    pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }} 
                    radius={50000} // 50km visual radius
                />

                {/* Vets */}
                {vets.map(vet => (
                    <Marker key={`vet-${vet.id}`} position={[vet.latitude, vet.longitude]} icon={vetIcon}>
                        <Popup>
                            <div className="p-1">
                                <h3 className="font-bold text-green-700">{vet.full_name} (Vet)</h3>
                                <p className="text-sm">{vet.phone_number}</p>
                                {vet.distance_km && <p className="text-xs text-gray-500">{vet.distance_km.toFixed(1)} km away</p>}
                                {vet.service_fee && <p className="text-xs text-gray-500">Service Fee: ${vet.service_fee}</p>}
                                <button 
                                    className={`mt-2 w-full py-1 px-2 text-xs text-white rounded ${selectedVetId === vet.id ? 'bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                                    onClick={() => onSelectVet(vet.id)}
                                >
                                    {selectedVetId === vet.id ? 'Selected Vet' : 'Select this Vet'}
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Agri Suppliers */}
                {agriSuppliers.map(supplier => (
                    <Marker key={`supplier-${supplier.id}`} position={[supplier.latitude, supplier.longitude]} icon={supplierIcon}>
                        <Popup>
                            <div className="p-1">
                                <h3 className="font-bold text-orange-600">{supplier.business_name} (Supplier)</h3>
                                <p className="text-sm">{supplier.phone_number}</p>
                                {supplier.distance_km && <p className="text-xs text-gray-500">{supplier.distance_km.toFixed(1)} km away</p>}
                                <button 
                                    className={`mt-2 w-full py-1 px-2 text-xs text-white rounded ${selectedSupplierId === supplier.id ? 'bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                                    onClick={() => onSelectSupplier(supplier.id)}
                                >
                                    {selectedSupplierId === supplier.id ? 'Selected Supplier' : 'Select for Pickup'}
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};
