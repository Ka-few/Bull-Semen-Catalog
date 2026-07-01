import React, { useState, useEffect, useContext } from 'react';
import api from '../api/config';
import { AuthContext } from '../context/AuthContext';
import { Stethoscope, Package, MapPin, CheckCircle, Clock, Truck } from 'lucide-react';

const STATUS_CONFIG: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
    pending:        { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Payment', icon: <Clock className="h-4 w-4" /> },
    allocated:      { color: 'bg-blue-100 text-blue-800',    label: 'Allocated to You', icon: <Stethoscope className="h-4 w-4" /> },
    processing:     { color: 'bg-purple-100 text-purple-800', label: 'Processing', icon: <Package className="h-4 w-4" /> },
    fetched_by_vet: { color: 'bg-indigo-100 text-indigo-800', label: 'Semen Fetched', icon: <Truck className="h-4 w-4" /> },
    completed:      { color: 'bg-green-100 text-green-800',   label: 'Completed', icon: <CheckCircle className="h-4 w-4" /> },
    cancelled:      { color: 'bg-red-100 text-red-800',       label: 'Cancelled', icon: null },
};

const VetDash = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState<any[]>([]);
    const [vetProfile, setVetProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Profile Form
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [county, setCounty] = useState('');
    const [subCounty, setSubCounty] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [fee, setFee] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            // Get orders assigned to this vet
            const orderRes = await api.get('/orders/my-orders');
            setOrders(orderRes.data);

            // Get this vet's profile
            const vetRes = await api.get('/vets');
            const profile = vetRes.data.find((v: any) => v.user_id === user?.id);
            if (profile) setVetProfile(profile);
        } catch (err) {
            console.error('Error fetching vet dashboard data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRegisterProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/vets/register', {
                full_name: fullName, phone_number: phone, county, sub_county: subCounty,
                latitude: parseFloat(latitude), longitude: parseFloat(longitude), service_fee: parseFloat(fee)
            });
            alert('Profile created! Awaiting admin verification.');
            fetchData();
        } catch (err) {
            alert('Failed to register profile');
        }
    };

    const handleUpdateOrderStatus = async (orderId: number, status: string) => {
        try {
            await api.put(`/orders/${orderId}/status`, { order_status: status });
            fetchData();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const pendingOrders  = orders.filter(o => o.order_status === 'allocated' || o.order_status === 'processing');
    const activeOrders   = orders.filter(o => o.order_status === 'fetched_by_vet');
    const doneOrders     = orders.filter(o => o.order_status === 'completed');

    return (
        <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1f2937' }}>
                🩺 Veterinary Dashboard
            </h2>

            {!vetProfile ? (
                /* ---- No Profile Yet ---- */
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '500px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Complete Your Professional Profile</h3>
                    <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                        Fill in your details so farmers can find and allocate you for semen AI services.
                    </p>
                    <form onSubmit={handleRegisterProfile} style={{ display: 'grid', gap: '0.75rem' }}>
                        <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required className="p-3 border rounded-lg w-full" />
                        <input type="text" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required className="p-3 border rounded-lg w-full" />
                        <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="County" value={county} onChange={e => setCounty(e.target.value)} required className="p-3 border rounded-lg" />
                            <input type="text" placeholder="Sub-county" value={subCounty} onChange={e => setSubCounty(e.target.value)} required className="p-3 border rounded-lg" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <input type="number" step="any" placeholder="Latitude" value={latitude} onChange={e => setLatitude(e.target.value)} required className="p-3 border rounded-lg" />
                            <input type="number" step="any" placeholder="Longitude" value={longitude} onChange={e => setLongitude(e.target.value)} required className="p-3 border rounded-lg" />
                        </div>
                        <p className="text-xs text-gray-400">Nairobi hint: lat -1.2921, lng 36.8219</p>
                        <input type="number" placeholder="Service Fee (KES)" value={fee} onChange={e => setFee(e.target.value)} required className="p-3 border rounded-lg w-full" />
                        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">
                            Submit Profile for Verification
                        </button>
                    </form>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }}>

                    {/* ---- Profile Card ---- */}
                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <div className="text-center mb-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Stethoscope className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg">{vetProfile.full_name}</h3>
                            <p className="text-sm text-gray-500">{vetProfile.county}, {vetProfile.sub_county}</p>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${vetProfile.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {vetProfile.verified ? '✓ Verified' : '⏳ Pending'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Service Fee</span>
                                <span className="font-bold text-green-600">KES {vetProfile.service_fee}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Phone</span>
                                <span className="font-medium">{vetProfile.phone_number}</span>
                            </div>
                        </div>
                        <hr className="my-4" />
                        <div className="grid grid-cols-3 text-center text-sm gap-2">
                            <div>
                                <p className="font-bold text-blue-600 text-xl">{pendingOrders.length}</p>
                                <p className="text-gray-400 text-xs">Pending</p>
                            </div>
                            <div>
                                <p className="font-bold text-purple-600 text-xl">{activeOrders.length}</p>
                                <p className="text-gray-400 text-xs">Active</p>
                            </div>
                            <div>
                                <p className="font-bold text-green-600 text-xl">{doneOrders.length}</p>
                                <p className="text-gray-400 text-xs">Done</p>
                            </div>
                        </div>
                    </div>

                    {/* ---- Orders ---- */}
                    <div className="space-y-6">

                        {/* New Requests Banner */}
                        {pendingOrders.length > 0 && (
                            <div className="bg-blue-600 text-white rounded-xl p-4 flex items-center gap-3 animate-pulse">
                                <Stethoscope className="h-6 w-6 shrink-0" />
                                <div>
                                    <p className="font-bold">You have {pendingOrders.length} new service request{pendingOrders.length > 1 ? 's' : ''}!</p>
                                    <p className="text-blue-100 text-sm">Review the orders below and mark your progress.</p>
                                </div>
                            </div>
                        )}

                        {orders.length === 0 ? (
                            <div className="bg-white rounded-xl p-10 text-center shadow">
                                <Stethoscope className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">No service requests yet.</p>
                                <p className="text-gray-400 text-sm">Farmers will allocate you when they place orders.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order: any) => {
                                    const statusCfg = STATUS_CONFIG[order.order_status] || { color: 'bg-gray-100 text-gray-600', label: order.order_status, icon: null };
                                    return (
                                        <div key={order.id} className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                                            {/* Card Header */}
                                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                                <div>
                                                    <span className="font-bold text-gray-800 text-lg">Order #BSC-{String(order.id).padStart(5, '0')}</span>
                                                    <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleString()}</p>
                                                </div>
                                                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${statusCfg.color}`}>
                                                    {statusCfg.icon} {statusCfg.label}
                                                </span>
                                            </div>

                                            {/* Card Body */}
                                            <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {/* Items */}
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">Semen Items</p>
                                                    <ul className="space-y-1">
                                                        {order.items?.map((item: any) => (
                                                            <li key={item.id} className="text-sm text-gray-700">
                                                                <span className="font-medium">{item.quantity}×</span> {item.bull_name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                {/* Supplier */}
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">Pickup Depot</p>
                                                    {order.supplier ? (
                                                        <>
                                                            <p className="text-sm font-bold text-orange-700">{order.supplier.business_name}</p>
                                                            <p className="text-xs text-gray-500">{order.supplier.address}</p>
                                                            <p className="text-xs text-gray-500">📞 {order.supplier.phone_number}</p>
                                                        </>
                                                    ) : <p className="text-sm text-gray-400">Not assigned</p>}
                                                </div>
                                                {/* Farmer / Delivery */}
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">Delivery Location</p>
                                                    {order.delivery_lat ? (
                                                        <p className="text-sm text-gray-600 font-mono flex items-center gap-1">
                                                            <MapPin className="h-3 w-3 text-red-400" />
                                                            {Number(order.delivery_lat).toFixed(4)}, {Number(order.delivery_lng).toFixed(4)}
                                                        </p>
                                                    ) : <p className="text-sm text-gray-400">N/A</p>}
                                                    <p className="text-xs text-gray-500 mt-1">Total: <strong>KES {Number(order.total_amount).toLocaleString()}</strong></p>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            {(order.order_status === 'allocated' || order.order_status === 'processing') && (
                                                <div className="px-5 pb-4">
                                                    <button
                                                        onClick={() => handleUpdateOrderStatus(order.id, 'fetched_by_vet')}
                                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
                                                    >
                                                        ✓ Mark as Fetched from Supplier
                                                    </button>
                                                </div>
                                            )}
                                            {order.order_status === 'fetched_by_vet' && (
                                                <div className="px-5 pb-4">
                                                    <button
                                                        onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                                                    >
                                                        ✓ Mark as Completed (Service Delivered)
                                                    </button>
                                                </div>
                                            )}
                                            {order.order_status === 'completed' && (
                                                <div className="px-5 pb-4 flex items-center gap-2 text-green-600 text-sm font-medium">
                                                    <CheckCircle className="h-4 w-4" /> Service successfully delivered
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VetDash;
