import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Package, User, MapPin } from 'lucide-react';

export default function SupplierDash() {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const fetchSupplierData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const headers = { Authorization: `Bearer ${token}` };
                
                // Fetch profile
                try {
                    const profileRes = await axios.get('http://localhost:5000/api/agri-suppliers/profile', { headers });
                    setProfile(profileRes.data);
                } catch (e: any) {
                    if (e.response && e.response.status === 404) {
                        // Profile not found, this is fine
                    } else {
                        throw e;
                    }
                }

                // Fetch allocated orders
                const ordersRes = await axios.get('http://localhost:5000/api/orders', { headers });
                setOrders(ordersRes.data);
            } catch (err) {
                console.error("Failed to fetch supplier data", err);
            }
        };

        fetchSupplierData();
    }, []);

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const data = {
                business_name: formData.get('business_name'),
                phone_number: formData.get('phone_number'),
                address: formData.get('address'),
                latitude: parseFloat(formData.get('latitude') as string),
                longitude: parseFloat(formData.get('longitude') as string)
            };
            const method = profile ? 'put' : 'post';
            const res = await axios[method]('http://localhost:5000/api/agri-suppliers/profile', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
            alert('Profile updated successfully');
        } catch (err) {
            console.error('Failed to update profile', err);
            alert('Failed to update profile');
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Agri-Supplier Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Section */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <User className="mr-2 h-5 w-5 text-orange-600" />
                        Business Profile
                    </h2>
                    <form onSubmit={updateProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Business Name</label>
                            <input name="business_name" defaultValue={profile?.business_name || ''} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input name="phone_number" defaultValue={profile?.phone_number || ''} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input name="address" defaultValue={profile?.address || ''} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Latitude</label>
                                <input name="latitude" type="number" step="any" defaultValue={profile?.latitude || ''} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Longitude</label>
                                <input name="longitude" type="number" step="any" defaultValue={profile?.longitude || ''} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">
                            Hint: Nairobi is around Latitude: -1.2921, Longitude: 36.8219
                        </p>
                        <button type="submit" className="w-full bg-orange-600 text-white p-2 rounded-md hover:bg-orange-700 transition">
                            Save Profile
                        </button>
                    </form>
                </div>

                {/* Orders Section */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <Package className="mr-2 h-5 w-5 text-blue-600" />
                        Pickups Assigned to You
                    </h2>
                    {orders.length === 0 ? (
                        <p className="text-gray-500">No pickups currently assigned.</p>
                    ) : (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div key={order.id} className="border p-4 rounded-md bg-gray-50">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold">Order #{order.id}</span>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                            order.order_status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                                            order.order_status === 'allocated' ? 'bg-blue-200 text-blue-800' :
                                            order.order_status === 'fetched_by_vet' ? 'bg-purple-200 text-purple-800' :
                                            'bg-green-200 text-green-800'
                                        }`}>
                                            {order.order_status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-sm">Vet ID: {order.vet_id}</p>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <strong>Items:</strong>
                                        <ul className="list-disc list-inside">
                                            {order.items?.map((item: any) => (
                                                <li key={item.id}>{item.quantity}x {item.bull_name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
