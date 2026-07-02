import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/config';
import { Lock, User, ArrowRight } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', { username, password });
            login(response.data.user, response.data.token);

            if (response.data.user.role === 'admin') navigate('/admin');
            else if (response.data.user.role === 'vet') navigate('/vet');
            else if (response.data.user.role === 'agri-supplier') navigate('/supplier');
            else navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in relative">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-100/40 blur-3xl" />
                <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-indigo-100/40 blur-3xl" />
            </div>

            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-8 md:p-10 relative overflow-hidden">
                {/* Decorative top gradient bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />
                
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
                        <Lock className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
                    <p className="text-slate-500 mt-2 font-medium">Please enter your details to sign in.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-semibold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-4 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-wait hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {loading ? 'Signing in...' : <>Sign In <ArrowRight className="w-5 h-5" /></>}
                    </button>
                </form>

                <p className="text-center mt-8 text-sm font-medium text-slate-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 hover:underline">
                        Create one now
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
