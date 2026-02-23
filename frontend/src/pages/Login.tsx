import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/config';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username, password });
            login(response.data.user, response.data.token);

            // Redirect based on role
            if (response.data.user.role === 'admin') navigate('/admin');
            else if (response.data.user.role === 'vet') navigate('/vet');
            else navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
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
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1f2937' }}>Welcome Back</h2>
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
                <button type="submit" style={btnStyle}>Log In</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem', color: '#6b7280' }}>
                Don't have an account? <Link to="/register" style={{ color: '#3b82f6' }}>Sign up</Link>
            </p>
        </div>
    );
};

export default Login;
