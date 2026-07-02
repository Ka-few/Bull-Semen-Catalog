import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, LogOut, Search, PackageSearch, ShieldCheck, ClipboardList, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const isActive = (path: string) => location.pathname === path;
    const navLinkClass = (path: string) => 
        `relative px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
            isActive(path) ? 'text-blue-600' : 'text-slate-600 hover:text-blue-500'
        }`;

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo & Primary Nav */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-1.5 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                                <span className="text-xl">🐂</span>
                            </div>
                            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">
                                PrimeGenetics
                            </span>
                        </Link>
                        
                        <div className="hidden md:flex items-center gap-1">
                            <Link to="/catalog" className={navLinkClass('/catalog')}>
                                <span className="flex items-center gap-1.5"><PackageSearch className="w-4 h-4"/> Catalog</span>
                            </Link>
                            {user?.role === 'farmer' && (
                                <Link to="/vets" className={navLinkClass('/vets')}>
                                    <span className="flex items-center gap-1.5"><Search className="w-4 h-4"/> Find Vet</span>
                                </Link>
                            )}
                            {user?.role === 'admin' && (
                                <Link to="/admin" className={navLinkClass('/admin')}>
                                    <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4"/> Admin Dash</span>
                                </Link>
                            )}
                            {user?.role === 'vet' && (
                                <Link to="/vet" className={navLinkClass('/vet')}>
                                    <span className="flex items-center gap-1.5"><ClipboardList className="w-4 h-4"/> Vet Dash</span>
                                </Link>
                            )}
                            {user?.role === 'agri-supplier' && (
                                <Link to="/supplier" className={navLinkClass('/supplier')}>
                                    <span className="flex items-center gap-1.5"><LayoutDashboard className="w-4 h-4"/> Supplier Dash</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Secondary Nav & User Actions */}
                    <div className="flex items-center gap-4">
                        {user?.role === 'farmer' && (
                            <Link 
                                to="/cart" 
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                                    cartCount > 0 
                                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                                    : 'text-slate-500 hover:bg-slate-100'
                                }`}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="font-bold text-sm">{cartCount}</span>
                                )}
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-sm font-bold text-slate-800 leading-none">{user.username}</span>
                                    <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-600">{user.role}</span>
                                </div>
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold uppercase shadow-sm">
                                    {user.username.charAt(0)}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                                    Sign In
                                </Link>
                                <Link to="/register" className="text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
