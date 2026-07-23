import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/config';
import { Lock, User, ShieldCheck, Stethoscope, Briefcase, ArrowRight } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<'farmer' | 'vet' | 'agri-supplier'>('farmer');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/register', { username, password, role });
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fade-in relative">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-indigo-100/40 blur-3xl" />
                <div className="absolute bottom-[20%] left-[20%] w-[30%] h-[30%] rounded-full bg-blue-100/40 blur-3xl" />
            </div>

            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-8 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-blue-600" />
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
                    <p className="text-slate-500 mt-2 font-medium">Join PrimeGenetics today.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Role Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-3">I am a...</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <label className={`cursor-pointer rounded-xl border-2 p-3 flex flex-col items-center gap-2 transition-all ${role === 'farmer' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'}`}>
                                <input type="radio" name="role" value="farmer" checked={role === 'farmer'} onChange={() => setRole('farmer')} className="hidden" />
                                <ShieldCheck className={`w-6 h-6 ${role === 'farmer' ? 'text-blue-600' : ''}`} />
                                <span className="text-xs font-bold text-center">Farmer</span>
                            </label>
                            
                            <label className={`cursor-pointer rounded-xl border-2 p-3 flex flex-col items-center gap-2 transition-all ${role === 'vet' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'}`}>
                                <input type="radio" name="role" value="vet" checked={role === 'vet'} onChange={() => setRole('vet')} className="hidden" />
                                <Stethoscope className={`w-6 h-6 ${role === 'vet' ? 'text-indigo-600' : ''}`} />
                                <span className="text-xs font-bold text-center">Vet Tech</span>
                            </label>
                            
                            <label className={`cursor-pointer rounded-xl border-2 p-3 flex flex-col items-center gap-2 transition-all ${role === 'agri-supplier' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'}`}>
                                <input type="radio" name="role" value="agri-supplier" checked={role === 'agri-supplier'} onChange={() => setRole('agri-supplier')} className="hidden" />
                                <Briefcase className={`w-6 h-6 ${role === 'agri-supplier' ? 'text-orange-600' : ''}`} />
                                <span className="text-xs font-bold text-center text-balance leading-tight">Supplier</span>
                            </label>
                        </div>
                    </div>

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
                                placeholder="Choose a username"
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
                                placeholder="Create a strong password"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-xl focus:ring-2 outline-none transition-all font-medium text-slate-900 ${
                                    confirmPassword && password !== confirmPassword 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-slate-200 focus:ring-blue-500 focus:border-blue-500'
                                }`}
                                placeholder="Repeat your password"
                                required
                            />
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 py-4 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-wait hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {loading ? 'Registering...' : <>Create Account <ArrowRight className="w-5 h-5" /></>}
                    </button>
                </form>

                <p className="text-center mt-8 text-sm font-medium text-slate-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
