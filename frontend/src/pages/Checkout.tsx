import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/config';
import { CartContext } from '../context/CartContext';

interface Vet {
    id: number;
    full_name: string;
    county: string;
    service_fee: number;
}

const Checkout = () => {
    const { cartItems, fetchCart } = useContext(CartContext);
    const [vets, setVets] = useState<Vet[]>([]);
    const [selectedVet, setSelectedVet] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const totalSemenCost = cartItems.reduce((sum, item) => sum + (item.quantity * item.semen_price), 0);
    const selectedVetDetails = vets.find(v => v.id.toString() === selectedVet);
    const vetFee = selectedVetDetails ? selectedVetDetails.service_fee : 0;
    const finalTotal = totalSemenCost + vetFee;

    useEffect(() => {
        const fetchVerifiedVets = async () => {
            try {
                const response = await api.get('/vets?verified=true');
                setVets(response.data);
            } catch (err) {
                console.error('Failed to fetch vets', err);
            }
        };
        fetchVerifiedVets();
    }, []);

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            alert("Cart is empty");
            return;
        }

        setLoading(true);
        try {
            await api.post('/orders', {
                vet_id: selectedVet ? parseInt(selectedVet, 10) : null
            });
            alert('Order placed successfully!');
            fetchCart(); // Clear cart in context
            navigate('/');
        } catch (err) {
            alert("Failed to place order.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return <div style={{ padding: '4rem 2rem', textAlign: 'center' }}><h2>Cart is empty. Nothing to checkout.</h2></div>;
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>Checkout</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>1. Select AI Technician (Optional)</h3>
                    <p style={{ color: '#4b5563', marginBottom: '1rem', fontSize: '0.875rem' }}>If you need a professional to perform the AI, select a verified vet from the list below.</p>

                    <select
                        value={selectedVet}
                        onChange={(e) => setSelectedVet(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #d1d5db', marginBottom: '1rem' }}
                    >
                        <option value="">No Vet - I will handle it myself</option>
                        {vets.map(vet => (
                            <option key={vet.id} value={vet.id}>
                                {vet.full_name} ({vet.county}) - Fee: KES {vet.service_fee}
                            </option>
                        ))}
                    </select>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', marginTop: '2rem', color: '#1f2937' }}>2. Payment Method</h3>
                    <div style={{ padding: '1rem', border: '1px solid #d1d5db', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="radio" id="mpesa" name="payment" defaultChecked />
                        <label htmlFor="mpesa" style={{ fontWeight: '500' }}>M-Pesa (Pay on Delivery / Collection)</label>
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', alignSelf: 'start' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Order Summary</h3>

                    <div style={{ marginBottom: '1rem' }}>
                        {cartItems.map(item => (
                            <div key={item.cart_id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#4b5563' }}>
                                <span>{item.quantity}x {item.name}</span>
                                <span>KES {item.quantity * item.semen_price}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#4b5563' }}>
                            <span>Semen Subtotal:</span>
                            <span>KES {totalSemenCost}</span>
                        </div>
                        {selectedVetDetails && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#4b5563' }}>
                                <span>Vet Service Fee:</span>
                                <span>KES {vetFee}</span>
                            </div>
                        )}
                    </div>

                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937' }}>Total:</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>KES {finalTotal}</span>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        style={{
                            width: '100%', padding: '1rem', backgroundColor: '#3b82f6', color: 'white',
                            border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold', fontSize: '1.1rem', opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Processing...' : 'Confirm Order'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
