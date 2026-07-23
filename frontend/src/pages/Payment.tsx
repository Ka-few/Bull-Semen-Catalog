import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/config';
import { CheckCircle, CreditCard, MapPin, User, Package, Truck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Payment() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    useContext(AuthContext);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paid, setPaid] = useState(false);

    const fetchOrder = async () => {
        try {
            const res = await api.get(`/orders/single/${orderId}`);
            setOrder(res.data);
            if (res.data.payment_status === 'completed') setPaid(true);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load order.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orderId) fetchOrder();
    }, [orderId]);

    const handlePayment = async () => {
        setProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const res = await api.put(`/orders/${orderId}/pay`);
            if (res.data) {
                setPaid(true);
                toast.success("Payment successful!");
                await fetchOrder();
            } else {
                toast.error("Payment failed. Please try again.");
            }
        } catch (err: any) {
            const message = err.response?.data?.error || 'Payment failed. Please try again.';
            toast.error(message);
            console.error('Payment error:', err.response?.status, err.response?.data || err);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!order) return <div className="text-center p-16 text-red-500">Order not found.</div>;

    // ---- RECEIPT VIEW (after payment) ----
    if (paid || order.payment_status === 'completed') {
        return (
            <div className="max-w-2xl mx-auto my-10 p-0 bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Receipt Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
                    <CheckCircle className="w-16 h-16 mx-auto mb-3 animate-bounce" />
                    <h1 className="text-3xl font-bold">Order Confirmed!</h1>
                    <p className="text-green-100 mt-2">Your semen order has been successfully placed and allocated.</p>
                </div>

                {/* Order Number */}
                <div className="bg-green-50 border-b border-green-100 px-8 py-4 text-center">
                    <p className="text-sm text-green-700 font-medium">ORDER REFERENCE</p>
                    <p className="text-2xl font-bold text-green-800 font-mono">#BSC-{String(order.id).padStart(5, '0')}</p>
                </div>

                <div className="p-8 space-y-6">
                    {/* Order Items */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-3">
                            <Package className="mr-2 h-5 w-5 text-blue-500" /> Semen Order Items
                        </h3>
                        <div className="bg-gray-50 rounded-xl overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-600">
                                        <th className="text-left px-4 py-3">Bull</th>
                                        <th className="text-center px-4 py-3">Qty</th>
                                        <th className="text-right px-4 py-3">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items?.map((item: any) => (
                                        <tr key={item.id} className="border-t border-gray-200">
                                            <td className="px-4 py-3 font-medium text-gray-800">{item.bull_name}</td>
                                            <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                                            <td className="px-4 py-3 text-right font-medium">KES {(item.quantity * item.unit_price).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between items-center mt-3 px-1">
                            <span className="font-bold text-gray-800">Total Paid</span>
                            <span className="text-xl font-bold text-green-600">KES {Number(order.total_amount).toLocaleString()}</span>
                        </div>
                    </div>

                    <hr />

                    {/* Delivery Info */}
                    {order.delivery_lat && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-3">
                                <MapPin className="mr-2 h-5 w-5 text-red-500" /> Delivery Location
                            </h3>
                            <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm font-mono">
                                {Number(order.delivery_lat).toFixed(5)}, {Number(order.delivery_lng).toFixed(5)}
                            </p>
                        </div>
                    )}

                    {/* Vet Allocation */}
                    {order.vet ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <h3 className="text-base font-semibold text-blue-800 flex items-center mb-2">
                                <User className="mr-2 h-4 w-4" /> Allocated Vet
                            </h3>
                            <p className="font-bold text-gray-800">{order.vet.full_name}</p>
                            <p className="text-sm text-gray-600">{order.vet.county} | 📞 {order.vet.phone_number}</p>
                            <p className="text-xs text-blue-600 mt-2 font-medium">
                                ✓ This vet has been notified and will fetch the semen from the supplier and service your animals.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <p className="text-yellow-700 text-sm font-medium">⚠️ No vet was allocated. An admin will assign one shortly.</p>
                        </div>
                    )}

                    {/* Supplier Info */}
                    {order.supplier && (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                            <h3 className="text-base font-semibold text-orange-800 flex items-center mb-2">
                                <Truck className="mr-2 h-4 w-4" /> Pickup Supplier
                            </h3>
                            <p className="font-bold text-gray-800">{order.supplier.business_name}</p>
                            <p className="text-sm text-gray-600">{order.supplier.address} | 📞 {order.supplier.phone_number}</p>
                            <p className="text-xs text-orange-600 mt-2 font-medium">
                                ✓ The vet will collect the semen from this depot.
                            </p>
                        </div>
                    )}

                    {/* Status */}
                    <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                        <span className="text-sm text-gray-600">Order Status</span>
                        <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800 capitalize">
                            {order.order_status}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => window.print()}
                            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                        >
                            🖨️ Print Receipt
                        </button>
                        <button
                            onClick={() => navigate('/catalog')}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ---- PAYMENT VIEW (before payment) ----
    return (
        <div className="max-w-lg mx-auto my-10">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center">
                    <CreditCard className="w-12 h-12 mx-auto mb-3" />
                    <h1 className="text-2xl font-bold">Complete Payment</h1>
                    <p className="text-blue-100 mt-1 text-sm">Order #BSC-{String(order.id).padStart(5, '0')}</p>
                </div>

                <div className="p-8 space-y-6">
                    {/* Summary */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        {order.items?.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.quantity}x {item.bull_name}</span>
                                <span className="font-medium">KES {(item.quantity * item.unit_price).toLocaleString()}</span>
                            </div>
                        ))}
                        <hr />
                        <div className="flex justify-between font-bold text-base">
                            <span>Total</span>
                            <span className="text-green-600">KES {Number(order.total_amount).toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Allocations summary */}
                    {order.vet_id && (
                        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                            <User className="h-4 w-4 text-blue-500 shrink-0" />
                            <span className="text-blue-800">Vet allocated — will service your animals on delivery</span>
                        </div>
                    )}
                    {order.agri_supplier_id && (
                        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm">
                            <Truck className="h-4 w-4 text-orange-500 shrink-0" />
                            <span className="text-orange-800">Semen to be collected from the allocated supplier depot</span>
                        </div>
                    )}

                    <button
                        onClick={handlePayment}
                        disabled={processing}
                        className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all shadow-lg ${
                            processing
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                        }`}
                    >
                        {processing ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Processing...
                            </span>
                        ) : `Pay KES ${Number(order.total_amount).toLocaleString()}`}
                    </button>

                    <p className="text-xs text-center text-gray-400">
                        🔒 Secured by MockPay · Payments are simulated for demo purposes
                    </p>
                </div>
            </div>
        </div>
    );
}
