import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navStyles = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#1f2937',
        color: 'white',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    };

    const linkStyles = {
        color: 'white',
        textDecoration: 'none',
        margin: '0 1rem',
        fontWeight: '500',
        transition: 'color 0.2s',
    };

    return (
        <nav style={navStyles}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link to="/" style={{ ...linkStyles, fontSize: '1.25rem', fontWeight: 'bold' }}>
                    🐂 PrimeGenetics
                </Link>
                <Link to="/catalog" style={linkStyles}>Catalog</Link>
                {user?.role === 'farmer' && <Link to="/vets" style={linkStyles}>Find Vet</Link>}
                {user?.role === 'admin' && <Link to="/admin" style={linkStyles}>Admin Dash</Link>}
                {user?.role === 'vet' && <Link to="/vet" style={linkStyles}>Vet Dash</Link>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {user?.role === 'farmer' && (
                    <Link to="/cart" style={{ ...linkStyles, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShoppingCart size={20} />
                        <span style={{
                            backgroundColor: '#3b82f6',
                            borderRadius: '50%',
                            padding: '0.1rem 0.5rem',
                            fontSize: '0.8rem'
                        }}>
                            {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                        </span>
                    </Link>
                )}

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={20} /> {user.username} ({user.role})
                        </span>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'none', border: 'none', color: 'white', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.3rem'
                            }}
                        >
                            <LogOut size={20} /> Logout
                        </button>
                    </div>
                ) : (
                    <div>
                        <Link to="/login" style={linkStyles}>Login</Link>
                        <Link to="/register" style={{
                            ...linkStyles,
                            backgroundColor: '#3b82f6',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                        }}>Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
