import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2 } from 'lucide-react';

const Cart = () => {
    const { cartItems, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.quantity * item.semen_price), 0);

    if (cartItems.length === 0) {
        return (
            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Your Cart is Empty</h2>
                <p style={{ color: '#4b5563', marginBottom: '2rem' }}>Browse our catalog to find premium genetics.</p>
                <button
                    onClick={() => navigate('/catalog')}
                    style={{ padding: '0.75rem 1.5rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Go to Catalog
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>Your Shopping Cart</h2>

            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#4b5563', fontWeight: '500' }}>Product</th>
                            <th style={{ padding: '1rem', textAlign: 'center', color: '#4b5563', fontWeight: '500' }}>Price</th>
                            <th style={{ padding: '1rem', textAlign: 'center', color: '#4b5563', fontWeight: '500' }}>Quantity</th>
                            <th style={{ padding: '1rem', textAlign: 'right', color: '#4b5563', fontWeight: '500' }}>Total</th>
                            <th style={{ padding: '1rem' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map(item => (
                            <tr key={item.cart_id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <img src={item.image_url || 'https://via.placeholder.com/50'} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                        <div>
                                            <div style={{ fontWeight: 'bold', color: '#1f2937' }}>{item.name}</div>
                                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{item.breed}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center', color: '#4b5563' }}>KES {item.semen_price}</td>
                                <td style={{ padding: '1rem', textAlign: 'center', color: '#4b5563' }}>{item.quantity}</td>
                                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: '#1f2937' }}>KES {item.semen_price * item.quantity}</td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <button
                                        onClick={() => removeFromCart(item.cart_id)}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                        title="Remove item"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ padding: '2rem', backgroundColor: '#f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ color: '#4b5563', marginBottom: '0.25rem' }}>Subtotal</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>KES {totalAmount}</div>
                    </div>
                    <button
                        onClick={() => navigate('/checkout')}
                        style={{ padding: '1rem 2rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
