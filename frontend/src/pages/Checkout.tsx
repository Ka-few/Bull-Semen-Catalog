import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/config';
import { CartContext } from '../context/CartContext';
import { LocationPicker } from '../components/LocationPicker';
import { GeospatialView } from '../components/GeospatialView';
import { MapPin } from 'lucide-react';

export default function Checkout() {
    const { cartItems, fetchCart } = useContext(CartContext);
    const [step, setStep] = useState<number>(1);
    
    const [farmerLocation, setFarmerLocation] = useState<{lat: number, lng: number} | null>(null);
    
    const [vets, setVets] = useState<any[]>([]);
    const [agriSuppliers, setAgriSuppliers] = useState<any[]>([]);
    
    const [selectedVet, setSelectedVet] = useState<number | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
    
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const totalSemenCost = cartItems.reduce((sum, item) => sum + (item.quantity * item.semen_price), 0);
    const selectedVetDetails = vets.find(v => v.id === selectedVet);
    const vetFee = selectedVetDetails ? selectedVetDetails.service_fee : 0;
    const finalTotal = totalSemenCost + vetFee;

    const handleLocationSelect = async (lat: number, lng: number) => {
        setFarmerLocation({ lat, lng });
        try {
            const [vetsRes, suppliersRes] = await Promise.all([
                api.get(`/vets?lat=${lat}&lng=${lng}&verified=true&radius_km=10000`),
                api.get(`/agri-suppliers?lat=${lat}&lng=${lng}&radius_km=10000`)
            ]);
            setVets(vetsRes.data);
            setAgriSuppliers(suppliersRes.data);
            setStep(2); // Move to selection step
        } catch (err) {
            console.error('Failed to fetch nearby providers', err);
            alert("Could not load nearby providers.");
        }
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            alert("Cart is empty");
            return;
        }

        if (!farmerLocation) {
            alert("Please select a delivery location.");
            return;
        }

        if (!selectedSupplier) {
            alert("Please select a supplier for semen pickup.");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/orders', {
                vet_id: selectedVet,
                agri_supplier_id: selectedSupplier,
                delivery_lat: farmerLocation.lat,
                delivery_lng: farmerLocation.lng
            });
            fetchCart(); // Clear cart
            navigate(`/payment/${res.data.id}`);
        } catch (err) {
            alert("Failed to place order.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return <div className="py-16 text-center"><h2 className="text-2xl font-bold">Cart is empty. Nothing to checkout.</h2></div>;
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Checkout Flow</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Process Area */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Step 1: Location */}
                    <div className={`bg-white p-6 rounded-xl shadow border ${step === 1 ? 'border-blue-500' : 'border-gray-200'}`}>
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white mr-3 ${step === 1 ? 'bg-blue-600' : 'bg-gray-400'}`}>1</span>
                            Set Delivery Location
                        </h3>
                        {step === 1 ? (
                            <div className="animate-fade-in">
                                <p className="text-gray-600 mb-4">Click on the map to set where the animals are located for service.</p>
                                <LocationPicker onLocationSelect={handleLocationSelect} />
                            </div>
                        ) : (
                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center text-green-700 font-medium">
                                    <MapPin className="mr-2" /> Location Set ({farmerLocation?.lat.toFixed(4)}, {farmerLocation?.lng.toFixed(4)})
                                </div>
                                <button onClick={() => setStep(1)} className="text-blue-600 hover:underline text-sm">Change Location</button>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Provider Selection */}
                    {step >= 2 && (
                        <div className={`bg-white p-6 rounded-xl shadow border ${step === 2 ? 'border-blue-500' : 'border-gray-200'} animate-fade-in`}>
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <span className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-3 bg-blue-600">2</span>
                                Select Vet and Supplier
                            </h3>
                            <p className="text-gray-600 mb-4">Choose a Vet for the service, and a Supplier where they will pick up the semen. Click the pins on the map, or select from the lists below.</p>

                            <GeospatialView
                                farmerLocation={farmerLocation!}
                                vets={vets}
                                agriSuppliers={agriSuppliers}
                                selectedVetId={selectedVet}
                                selectedSupplierId={selectedSupplier}
                                onSelectVet={setSelectedVet}
                                onSelectSupplier={setSelectedSupplier}
                            />

                            {/* Vet List */}
                            <div className="mt-6">
                                <h4 className="font-semibold text-green-700 mb-2">🩺 Available Vets</h4>
                                {vets.length === 0 ? (
                                    <p className="text-gray-400 text-sm">No vets found.</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {vets.map(vet => (
                                            <button
                                                key={vet.id}
                                                onClick={() => setSelectedVet(vet.id)}
                                                className={`text-left p-3 rounded-lg border-2 transition-all ${selectedVet === vet.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                                            >
                                                <div className="font-bold text-gray-800">{vet.full_name}</div>
                                                <div className="text-sm text-gray-500">{vet.county}, {vet.sub_county}</div>
                                                {vet.service_fee && <div className="text-sm font-medium text-green-700">KES {vet.service_fee} service fee</div>}
                                                {vet.distance_km && <div className="text-xs text-gray-400">{vet.distance_km.toFixed(0)} km away</div>}
                                                {selectedVet === vet.id && <div className="text-xs font-bold text-green-600 mt-1">✓ Selected</div>}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Supplier List */}
                            <div className="mt-6">
                                <h4 className="font-semibold text-orange-600 mb-2">🏪 Available Suppliers (Pickup Points)</h4>
                                {agriSuppliers.length === 0 ? (
                                    <p className="text-gray-400 text-sm">No suppliers found.</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {agriSuppliers.map(supplier => (
                                            <button
                                                key={supplier.id}
                                                onClick={() => setSelectedSupplier(supplier.id)}
                                                className={`text-left p-3 rounded-lg border-2 transition-all ${selectedSupplier === supplier.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}
                                            >
                                                <div className="font-bold text-gray-800">{supplier.business_name}</div>
                                                <div className="text-sm text-gray-500">{supplier.address}</div>
                                                {supplier.phone_number && <div className="text-sm text-gray-500">{supplier.phone_number}</div>}
                                                {supplier.distance_km && <div className="text-xs text-gray-400">{supplier.distance_km.toFixed(0)} km away</div>}
                                                {selectedSupplier === supplier.id && <div className="text-xs font-bold text-orange-600 mt-1">✓ Selected</div>}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Order Summary Sidebar */}
                <div className="bg-white p-6 rounded-xl shadow border border-gray-200 h-fit sticky top-8">
                    <h3 className="text-xl font-semibold mb-6 text-gray-800">Order Summary</h3>

                    <div className="space-y-3 mb-6">
                        {cartItems.map(item => (
                            <div key={item.cart_id} className="flex justify-between text-gray-600 text-sm">
                                <span>{item.quantity}x {item.name}</span>
                                <span>KES {item.quantity * item.semen_price}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4 mb-4 space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Semen Subtotal:</span>
                            <span>KES {totalSemenCost}</span>
                        </div>
                        {selectedVetDetails && (
                            <div className="flex justify-between text-blue-600 font-medium">
                                <span>Vet Service Fee ({selectedVetDetails.full_name}):</span>
                                <span>KES {vetFee}</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t pt-4 flex justify-between items-center mb-6">
                        <span className="text-lg font-bold text-gray-800">Total:</span>
                        <span className="text-2xl font-bold text-green-600">KES {finalTotal}</span>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={loading || !farmerLocation || !selectedSupplier}
                        className={`w-full p-4 rounded-lg font-bold text-lg transition ${
                            loading || !farmerLocation || !selectedSupplier 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                        }`}
                    >
                        {loading ? 'Processing...' : 'Confirm Allocation'}
                    </button>
                    {(!farmerLocation || !selectedSupplier) && (
                        <p className="text-xs text-red-500 text-center mt-2">
                            Please set your location and select a supplier.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
