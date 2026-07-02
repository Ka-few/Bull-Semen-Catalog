import { useState, useEffect, useContext } from 'react';
import api from '../api/config';
import { AuthContext } from '../context/AuthContext';
import { Package, User, Database, Trash2, PlusCircle, Edit2 } from 'lucide-react';

export default function SupplierDash() {
    useContext(AuthContext);
    const [orders, setOrders] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [inventory, setInventory] = useState<any[]>([]);
    const [globalBulls, setGlobalBulls] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);

    // Form states for adding/editing inventory
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedBullId, setSelectedBullId] = useState('');
    const [addQuantity, setAddQuantity] = useState('0');

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch profile
            try {
                const profileRes = await api.get('/agri-suppliers/profile');
                setProfile(profileRes.data);
            } catch (e: any) {
                if (e.response && e.response.status === 404) {
                    // No profile yet
                } else {
                    console.error('Failed to fetch profile', e);
                }
            }

            // Fetch orders
            const ordersRes = await api.get('/orders/my-orders');
            setOrders(ordersRes.data);

            // Fetch inventory
            try {
                const invRes = await api.get('/agri-suppliers/inventory');
                setInventory(invRes.data);
            } catch (e) {
                console.log('Failed to fetch inventory, maybe no profile yet');
            }

            // Fetch global bulls
            const bullsRes = await api.get('/bulls');
            setGlobalBulls(bullsRes.data);

        } catch (err) {
            console.error("Error fetching supplier data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        try {
            const data = {
                business_name: formData.get('business_name'),
                phone_number: formData.get('phone_number'),
                address: formData.get('address'),
                latitude: parseFloat(formData.get('latitude') as string),
                longitude: parseFloat(formData.get('longitude') as string)
            };
            const method = profile ? 'put' : 'post';
            const res = await api[method]('/agri-suppliers/profile', data);
            setProfile(res.data);
            alert('Profile updated successfully');
            fetchData(); // Refresh everything in case they just created a profile
        } catch (err) {
            console.error('Failed to update profile', err);
            alert('Failed to update profile');
        }
    };

    const handleAddOrUpdateInventory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBullId || !addQuantity) return;
        try {
            await api.put('/agri-suppliers/inventory', {
                bull_id: selectedBullId,
                quantity: addQuantity
            });
            setShowAddForm(false);
            setSelectedBullId('');
            setAddQuantity('0');
            fetchData();
        } catch (err) {
            alert('Failed to update inventory');
            console.error(err);
        }
    };

    const handleDeleteInventory = async (bullId: number) => {
        if (!window.confirm("Are you sure you want to remove this semen from your inventory?")) return;
        try {
            await api.delete(`/agri-suppliers/inventory/${bullId}`);
            fetchData();
        } catch (err) {
            alert('Failed to delete inventory');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 py-8">
            <h1 className="text-3xl font-bold text-gray-800">🏪 Agri-Supplier Dashboard</h1>

            {!profile && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="text-yellow-800 font-medium">Please create your business profile below to start managing inventory and receiving orders.</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Profile Section (Left Column) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <User className="mr-2 h-5 w-5 text-orange-600" />
                            Business Location & Profile
                        </h2>
                        <form onSubmit={updateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Business Name</label>
                                <input name="business_name" defaultValue={profile?.business_name || ''} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-orange-500 focus:border-orange-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input name="phone_number" defaultValue={profile?.phone_number || ''} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-orange-500 focus:border-orange-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Physical Address</label>
                                <input name="address" defaultValue={profile?.address || ''} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-orange-500 focus:border-orange-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Latitude</label>
                                    <input name="latitude" type="number" step="any" defaultValue={profile?.latitude || ''} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-orange-500 focus:border-orange-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Longitude</label>
                                    <input name="longitude" type="number" step="any" defaultValue={profile?.longitude || ''} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-orange-500 focus:border-orange-500" />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">
                                Exact coordinates help vets locate your depot on the map.
                            </p>
                            <button type="submit" className="w-full bg-orange-600 text-white p-3 rounded-md font-bold hover:bg-orange-700 transition">
                                {profile ? 'Update Profile' : 'Create Profile'}
                            </button>
                        </form>
                    </div>

                    {/* Orders Section */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <Package className="mr-2 h-5 w-5 text-blue-600" />
                            Pickups Assigned to You
                        </h2>
                        {orders.length === 0 ? (
                            <p className="text-gray-500 text-sm">No pickups currently assigned.</p>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {orders.map(order => (
                                    <div key={order.id} className="border p-4 rounded-lg bg-gray-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-gray-800">Order #{order.id}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                                                order.order_status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                                                order.order_status === 'allocated' ? 'bg-blue-200 text-blue-800' :
                                                order.order_status === 'fetched_by_vet' ? 'bg-purple-200 text-purple-800' :
                                                'bg-green-200 text-green-800'
                                            }`}>
                                                {order.order_status}
                                            </span>
                                        </div>
                                        {order.vet && (
                                            <p className="text-sm text-gray-600">
                                                <strong>Vet:</strong> {order.vet.full_name} ({order.vet.phone_number})
                                            </p>
                                        )}
                                        <div className="mt-3">
                                            <p className="text-xs font-semibold text-gray-500 uppercase">Items to prepare:</p>
                                            <ul className="mt-1 space-y-1">
                                                {order.items?.map((item: any) => (
                                                    <li key={item.id} className="text-sm flex items-center text-gray-700">
                                                        <span className="bg-gray-200 text-gray-800 text-xs font-bold px-2 py-0.5 rounded mr-2">{item.quantity}x</span> 
                                                        {item.bull_name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Inventory Section (Right Column) */}
                <div className="lg:col-span-2 space-y-6">
                    {profile && (
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold flex items-center text-gray-800">
                                    <Database className="mr-2 h-5 w-5 text-indigo-600" />
                                    Semen Inventory Management
                                </h2>
                                <button 
                                    onClick={() => setShowAddForm(!showAddForm)}
                                    className="flex items-center text-sm bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg font-medium hover:bg-indigo-100 transition"
                                >
                                    {showAddForm ? 'Cancel' : <><PlusCircle className="h-4 w-4 mr-1" /> Add Stock</>}
                                </button>
                            </div>

                            {showAddForm && (
                                <form onSubmit={handleAddOrUpdateInventory} className="bg-indigo-50 p-4 rounded-lg mb-6 border border-indigo-100">
                                    <h3 className="font-semibold text-indigo-800 mb-3">Add or Update Semen Stock</h3>
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Select Bull Semen</label>
                                            <select 
                                                value={selectedBullId} 
                                                onChange={e => setSelectedBullId(e.target.value)}
                                                required
                                                className="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">-- Choose Bull --</option>
                                                {globalBulls.map(b => (
                                                    <option key={b.id} value={b.id}>{b.name} ({b.breed})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-full md:w-32">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                                            <input 
                                                type="number" 
                                                min="0"
                                                value={addQuantity}
                                                onChange={e => setAddQuantity(e.target.value)}
                                                required
                                                className="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md font-bold hover:bg-indigo-700 transition">
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-indigo-600 mt-2">If the bull is already in your inventory, this will overwrite the quantity.</p>
                                </form>
                            )}

                            {inventory.length === 0 ? (
                                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <Database className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500 font-medium">Your inventory is empty.</p>
                                    <p className="text-gray-400 text-sm">Click "Add Stock" to list the semen you have available.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
                                                <th className="px-4 py-3 font-medium">Bull Name</th>
                                                <th className="px-4 py-3 font-medium">Breed</th>
                                                <th className="px-4 py-3 font-medium text-center">Quantity (Straws)</th>
                                                <th className="px-4 py-3 font-medium text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {inventory.map(item => (
                                                <tr key={item.id} className="hover:bg-gray-50 transition">
                                                    <td className="px-4 py-4 font-bold text-gray-800">{item.bull_name}</td>
                                                    <td className="px-4 py-4 text-gray-600 text-sm">{item.breed}</td>
                                                    <td className="px-4 py-4 text-center">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                                                            item.quantity > 10 ? 'bg-green-100 text-green-800' :
                                                            item.quantity > 0 ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {item.quantity}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-right space-x-2">
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedBullId(item.bull_id.toString());
                                                                setAddQuantity(item.quantity.toString());
                                                                setShowAddForm(true);
                                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                            }}
                                                            className="text-indigo-600 hover:text-indigo-900 p-1"
                                                            title="Edit Quantity"
                                                        >
                                                            <Edit2 className="h-5 w-5 inline" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteInventory(item.bull_id)}
                                                            className="text-red-500 hover:text-red-700 p-1"
                                                            title="Remove from inventory"
                                                        >
                                                            <Trash2 className="h-5 w-5 inline" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
