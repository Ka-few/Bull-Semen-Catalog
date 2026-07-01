import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/config';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'farmer' | 'vet' | 'agri-supplier'>('farmer');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { username, password, role });
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        }
    };

    const containerStyle = {
        maxWidth: '400px', margin: '4rem auto', padding: '2rem',
        backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    };
    const inputStyle = {
        width: '100%', padding: '0.75rem', marginBottom: '1rem',
        border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' as const
    };
    const btnStyle = {
        width: '100%', padding: '0.75rem', backgroundColor: '#3b82f6',
        color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer',
        fontWeight: 'bold'
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1f2937' }}>Create an Account</h2>
            {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4b5563' }}>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4b5563' }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4b5563' }}>I am a...</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as 'farmer' | 'vet' | 'agri-supplier')}
                        style={inputStyle}
                    >
                        <option value="farmer">Dairy Farmer</option>
                        <option value="vet">Veterinary AI Technician</option>
                        <option value="agri-supplier">Agri-Supplier Depot</option>
                    </select>
                </div>
                <button type="submit" style={btnStyle}>Register</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem', color: '#6b7280' }}>
                Already have an account? <Link to="/login" style={{ color: '#3b82f6' }}>Log in</Link>
            </p>
        </div>
    );
};

export default Register;
