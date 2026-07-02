import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/config';
import { CartContext } from '../context/CartContext';
import { LocationPicker } from '../components/LocationPicker';
import { GeospatialView } from '../components/GeospatialView';
import { MapPin, ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

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
            toast.error("Could not load nearby providers.");
        }
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            toast.error("Cart is empty");
            return;
        }

        if (!farmerLocation) {
            toast.error("Please select a delivery location.");
            return;
        }

        if (!selectedSupplier) {
            toast.error("Please select a supplier for semen pickup.");
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
            toast.success("Order allocated successfully!");
            navigate(`/payment/${res.data.id}`);
        } catch (err) {
            toast.error("Failed to place order.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return <div className="py-16 text-center"><h2 className="text-2xl font-bold">Cart is empty. Nothing to checkout.</h2></div>;
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <ShieldCheck className="h-8 w-8 text-blue-600" /> Secure Checkout
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Process Area */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Step 1: Location */}
                    <div className={`bg-white p-6 md:p-8 rounded-2xl shadow-sm border transition-all duration-300 ${step === 1 ? 'border-blue-400 shadow-md ring-4 ring-blue-50' : 'border-gray-200'}`}>
                        <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white mr-3 font-bold ${step === 1 ? 'bg-blue-600' : 'bg-gray-400'}`}>
                                {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                            </span>
                            Set Delivery Location
                        </h3>
                        {step === 1 ? (
                            <div className="animate-fade-in space-y-4">
                                <p className="text-gray-500 text-sm">Click on the map to set where the animals are located for service.</p>
                                <div className="rounded-xl overflow-hidden border border-gray-100 shadow-inner">
                                    <LocationPicker onLocationSelect={handleLocationSelect} />
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center bg-green-50 border border-green-100 p-4 rounded-xl mt-4">
                                <div className="flex items-center text-green-700 font-bold">
                                    <MapPin className="mr-2 h-5 w-5" /> Location Set ({farmerLocation?.lat.toFixed(4)}, {farmerLocation?.lng.toFixed(4)})
                                </div>
                                <button onClick={() => setStep(1)} className="text-blue-600 hover:text-blue-700 font-semibold hover:underline text-sm transition">Change Location</button>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Provider Selection */}
                    {step >= 2 && (
                        <div className={`bg-white p-6 md:p-8 rounded-2xl shadow-sm border transition-all duration-300 ${step === 2 ? 'border-blue-400 shadow-md ring-4 ring-blue-50' : 'border-gray-200'} animate-fade-in`}>
                            <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                                <span className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-3 font-bold bg-blue-600">2</span>
                                Select Vet and Supplier
                            </h3>
                            <p className="text-gray-500 text-sm mb-6">Choose a Vet for the service, and a Supplier where they will pick up the semen. Click the pins on the map, or select from the lists below.</p>

                            <div className="rounded-xl overflow-hidden border border-gray-100 shadow-inner mb-8">
                                <GeospatialView
                                    farmerLocation={farmerLocation!}
                                    vets={vets}
                                    agriSuppliers={agriSuppliers}
                                    selectedVetId={selectedVet}
                                    selectedSupplierId={selectedSupplier}
                                    onSelectVet={setSelectedVet}
                                    onSelectSupplier={setSelectedSupplier}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Vet List */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-green-700 flex items-center gap-2 border-b pb-2">🩺 Available Vets</h4>
                                    {vets.length === 0 ? (
                                        <p className="text-gray-400 text-sm italic">No vets found nearby.</p>
                                    ) : (
                                        <div className="space-y-3">
                                        {vets.map(vet => (
                                            <button
                                                key={vet.id}
                                                onClick={() => setSelectedVet(vet.id)}
                                                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group relative overflow-hidden ${selectedVet === vet.id ? 'border-green-500 bg-green-50 shadow-sm' : 'border-gray-100 hover:border-green-300 hover:shadow-md bg-white'}`}
                                            >
                                                {selectedVet === vet.id && <div className="absolute top-0 right-0 w-8 h-8 bg-green-500 rounded-bl-xl flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-white"/></div>}
                                                <div className="font-bold text-gray-800 text-lg group-hover:text-green-700 transition">{vet.full_name}</div>
                                                <div className="text-sm text-gray-500 mt-1">{vet.county}, {vet.sub_county}</div>
                                                <div className="mt-2 flex items-center justify-between">
                                                    {vet.service_fee && <div className="text-sm font-bold text-green-700 bg-green-100/50 px-2 py-0.5 rounded">KES {vet.service_fee} fee</div>}
                                                    {vet.distance_km && <div className="text-xs font-medium text-gray-400">{vet.distance_km.toFixed(1)} km</div>}
                                                </div>
                                            </button>
                                        ))}
                                        </div>
                                    )}
                                </div>

                                {/* Supplier List */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-orange-600 flex items-center gap-2 border-b pb-2">🏪 Available Pickups</h4>
                                    {agriSuppliers.length === 0 ? (
                                        <p className="text-gray-400 text-sm italic">No suppliers found nearby.</p>
                                    ) : (
                                        <div className="space-y-3">
                                        {agriSuppliers.map(supplier => (
                                            <button
                                                key={supplier.id}
                                                onClick={() => setSelectedSupplier(supplier.id)}
                                                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group relative overflow-hidden ${selectedSupplier === supplier.id ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-gray-100 hover:border-orange-300 hover:shadow-md bg-white'}`}
                                            >
                                                {selectedSupplier === supplier.id && <div className="absolute top-0 right-0 w-8 h-8 bg-orange-500 rounded-bl-xl flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-white"/></div>}
                                                <div className="font-bold text-gray-800 text-lg group-hover:text-orange-700 transition">{supplier.business_name}</div>
                                                <div className="text-sm text-gray-500 mt-1 line-clamp-1">{supplier.address}</div>
                                                <div className="mt-2 flex items-center justify-between">
                                                    {supplier.phone_number && <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{supplier.phone_number}</div>}
                                                    {supplier.distance_km && <div className="text-xs font-medium text-gray-400">{supplier.distance_km.toFixed(1)} km</div>}
                                                </div>
                                            </button>
                                        ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Order Summary Sidebar */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 h-fit sticky top-8">
                    <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Order Summary</h3>

                    <div className="space-y-4 mb-6">
                        {cartItems.map(item => (
                            <div key={item.cart_id} className="flex justify-between items-center group">
                                <div className="flex items-center gap-2">
                                    <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded text-xs">{item.quantity}x</span>
                                    <span className="text-gray-700 font-medium group-hover:text-blue-600 transition">{item.name}</span>
                                </div>
                                <span className="font-medium text-gray-600">KES {(item.quantity * item.semen_price).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6 border border-gray-100">
                        <div className="flex justify-between text-gray-600 text-sm">
                            <span>Semen Subtotal</span>
                            <span className="font-medium">KES {totalSemenCost.toLocaleString()}</span>
                        </div>
                        {selectedVetDetails && (
                            <div className="flex justify-between text-green-700 text-sm">
                                <span>Vet Fee <span className="opacity-75">({selectedVetDetails.full_name})</span></span>
                                <span className="font-bold">+ KES {vetFee.toLocaleString()}</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-dashed border-gray-300 pt-4 flex justify-between items-center mb-8">
                        <span className="text-lg font-bold text-gray-500">Total</span>
                        <span className="text-3xl font-black text-gray-800">KES {finalTotal.toLocaleString()}</span>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={loading || !farmerLocation || !selectedSupplier}
                        className={`w-full p-4 rounded-xl font-bold text-lg transition-all duration-300 flex justify-center items-center gap-2 ${
                            loading || !farmerLocation || !selectedSupplier 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                        }`}
                    >
                        {loading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : <>Confirm Allocation <ChevronRight className="w-5 h-5"/></>}
                    </button>
                    {(!farmerLocation || !selectedSupplier) && (
                        <p className="text-sm text-red-500 text-center mt-4 font-medium bg-red-50 p-2 rounded-lg">
                            Please set location and select a supplier.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
