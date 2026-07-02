import React, { useState, useEffect, useContext } from 'react';
import api from '../api/config';
import { AuthContext } from '../context/AuthContext';
import { Stethoscope, Package, MapPin, CheckCircle, Clock, Truck, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

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
            toast.success('Profile created! Awaiting admin verification.');
            fetchData();
        } catch (err) {
            toast.error('Failed to register profile');
        }
    };

    const handleUpdateOrderStatus = async (orderId: number, status: string) => {
        try {
            await api.put(`/orders/${orderId}/status`, { order_status: status });
            toast.success(`Order marked as ${status.replace(/_/g, ' ')}`);
            fetchData();
        } catch (err) {
            toast.error('Failed to update status');
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
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 rounded-xl">
                    <Stethoscope className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Veterinary Dashboard</h2>
                    <p className="text-gray-500">Manage your profile and service requests</p>
                </div>
            </div>

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
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8 hover:shadow-md transition-shadow duration-300">
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                                <Stethoscope className="h-10 w-10 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-gray-800 text-xl">{vetProfile.full_name}</h3>
                            <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
                                <MapPin className="h-3 w-3" /> {vetProfile.county}, {vetProfile.sub_county}
                            </p>
                        </div>
                        <div className="space-y-4 text-sm bg-gray-50 p-4 rounded-xl">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-medium">Status</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${vetProfile.verified ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                                    {vetProfile.verified ? '✓ Verified' : '⏳ Pending'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-medium">Service Fee</span>
                                <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">KES {vetProfile.service_fee}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-medium">Phone</span>
                                <span className="font-medium text-gray-700">{vetProfile.phone_number}</span>
                            </div>
                        </div>
                        <hr className="my-6 border-gray-100" />
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
                            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                                <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Stethoscope className="h-10 w-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-700 mb-2">No service requests yet</h3>
                                <p className="text-gray-500 text-sm max-w-sm mx-auto">Farmers will allocate you when they place orders. Make sure your profile is verified and active.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order: any) => {
                                    const statusCfg = STATUS_CONFIG[order.order_status] || { color: 'bg-gray-100 text-gray-600', label: order.order_status, icon: null };
                                    return (
                                        <div key={order.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden group">
                                            {/* Card Header */}
                                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-white p-2 rounded-lg shadow-sm">
                                                        <Package className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-gray-800 text-lg tracking-tight">Order #BSC-{String(order.id).padStart(5, '0')}</span>
                                                        <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm border border-white/50 ${statusCfg.color}`}>
                                                    {statusCfg.icon} {statusCfg.label}
                                                </span>
                                            </div>

                                            {/* Card Body */}
                                            <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {/* Items */}
                                                <div className="space-y-3">
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1"><Package className="w-3 h-3"/> Semen Items</p>
                                                    <ul className="space-y-2">
                                                        {order.items?.map((item: any) => (
                                                            <li key={item.id} className="text-sm text-gray-700 flex items-center gap-2">
                                                                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">{item.quantity}×</span> 
                                                                <span className="font-medium">{item.bull_name}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                {/* Supplier */}
                                                <div className="space-y-3">
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1"><MapPin className="w-3 h-3"/> Pickup Depot</p>
                                                    {order.supplier ? (
                                                        <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100">
                                                            <p className="text-sm font-bold text-orange-800">{order.supplier.business_name}</p>
                                                            <p className="text-xs text-orange-600/80 mt-1">{order.supplier.address}</p>
                                                            <p className="text-xs font-medium text-orange-700 mt-2">📞 {order.supplier.phone_number}</p>
                                                        </div>
                                                    ) : <p className="text-sm text-gray-400 italic">Not assigned</p>}
                                                </div>
                                                {/* Farmer / Delivery */}
                                                <div className="space-y-3">
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1"><MapPin className="w-3 h-3"/> Delivery Location</p>
                                                    {order.delivery_lat ? (
                                                        <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                                                            <a href={`https://maps.google.com/?q=${order.delivery_lat},${order.delivery_lng}`} target="_blank" rel="noreferrer" className="text-sm text-blue-700 font-mono flex items-center gap-1 hover:underline">
                                                                <MapPin className="h-4 w-4 text-blue-500" />
                                                                {Number(order.delivery_lat).toFixed(4)}, {Number(order.delivery_lng).toFixed(4)}
                                                            </a>
                                                        </div>
                                                    ) : <p className="text-sm text-gray-400 italic">N/A</p>}
                                                    <div className="pt-2">
                                                        <p className="text-xs text-gray-500">Total Value</p>
                                                        <p className="text-lg font-bold text-gray-800">KES {Number(order.total_amount).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            {(order.order_status === 'allocated' || order.order_status === 'processing') && (
                                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                                                    <button
                                                        onClick={() => handleUpdateOrderStatus(order.id, 'fetched_by_vet')}
                                                        className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition shadow-sm hover:shadow flex items-center gap-2 group-hover:scale-[1.02] transform duration-200"
                                                    >
                                                        Mark as Fetched from Supplier <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                            {order.order_status === 'fetched_by_vet' && (
                                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                                                    <button
                                                        onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                                        className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition shadow-sm hover:shadow flex items-center gap-2 group-hover:scale-[1.02] transform duration-200"
                                                    >
                                                        Mark as Completed <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                            {order.order_status === 'completed' && (
                                                <div className="px-6 py-4 bg-green-50/50 border-t border-green-100 flex items-center justify-center gap-2 text-green-700 font-medium">
                                                    <CheckCircle className="h-5 w-5" /> Service successfully delivered
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
