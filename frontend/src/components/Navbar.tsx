import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, LogOut, Search, PackageSearch, ShieldCheck, ClipboardList, LayoutDashboard, BookOpen, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [openMenuLocationKey, setOpenMenuLocationKey] = useState<string | null>(null);
    const mobileMenuOpen = openMenuLocationKey === location.key;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const isActive = (path: string) => path === '/articles'
        ? location.pathname.startsWith(path)
        : location.pathname === path;
    const navLinkClass = (path: string) => 
        `relative px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
            isActive(path) ? 'text-[#24543c]' : 'text-[#657068] hover:text-[#a65d3b]'
        }`;
    const mobileNavLinkClass = (path: string) =>
        `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
            isActive(path) ? 'bg-[#e9efdf] text-[#24543c]' : 'text-[#657068] hover:bg-[#efeee7]'
        }`;

    return (
        <nav className="sticky top-0 z-50 bg-[#fafaf6]/90 backdrop-blur-xl border-b border-[#e5e4d9] shadow-[0_4px_20px_rgba(44,59,46,.04)]">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo & Primary Nav */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-linear-to-br from-[#71834b] to-[#24543c] text-white p-1.5 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                                <span className="text-xl">🐂</span>
                            </div>
                            <span className="text-sm sm:text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#173b2a] to-[#75523d] tracking-tight">
                                PrimeGenetics
                            </span>
                        </Link>
                        
                        <div className="hidden md:flex items-center gap-1">
                            <Link to="/catalog" className={navLinkClass('/catalog')}>
                                <span className="flex items-center gap-1.5"><PackageSearch className="w-4 h-4"/> Catalog</span>
                            </Link>
                            <Link to="/articles" className={navLinkClass('/articles')}>
                                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4"/> Articles</span>
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
                    <div className="flex items-center gap-2 sm:gap-4">
                        {user?.role === 'farmer' && (
                            <Link 
                                to="/cart" 
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                                    cartCount > 0 
                                    ? 'bg-[#e9efdf] text-[#24543c] hover:bg-[#dce6cc]' 
                                    : 'text-slate-500 hover:bg-[#efeee7]'
                                }`}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="font-bold text-sm">{cartCount}</span>
                                )}
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-[#e5e4d9]">
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-sm font-bold text-slate-800 leading-none">{user.username}</span>
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#71834b]">{user.role}</span>
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
                            <div className="flex items-center gap-3 sm:pl-4 sm:border-l sm:border-slate-200">
                                <Link to="/login" className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                                    Sign In
                                </Link>
                                <Link to="/register" className="hidden sm:block text-sm font-bold bg-[#24543c] hover:bg-[#173b2a] text-white px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0">
                                    Get Started
                                </Link>
                            </div>
                        )}
                        <button
                            type="button"
                            className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-[#24543c] hover:bg-[#efeee7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24543c]"
                            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-navigation"
                            onClick={() => setOpenMenuLocationKey(mobileMenuOpen ? null : location.key)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                {mobileMenuOpen && (
                    <div id="mobile-navigation" className="md:hidden border-t border-[#e5e4d9] py-3">
                        <div className="grid gap-1">
                            <Link to="/catalog" className={mobileNavLinkClass('/catalog')}>
                                <PackageSearch className="w-4 h-4" /> Catalog
                            </Link>
                            <Link to="/articles" className={mobileNavLinkClass('/articles')}>
                                <BookOpen className="w-4 h-4" /> Articles
                            </Link>
                            <Link to="/vets" className={mobileNavLinkClass('/vets')}>
                                <Search className="w-4 h-4" /> Find Vet
                            </Link>
                            {user?.role === 'admin' && (
                                <Link to="/admin" className={mobileNavLinkClass('/admin')}>
                                    <ShieldCheck className="w-4 h-4" /> Admin Dash
                                </Link>
                            )}
                            {user?.role === 'vet' && (
                                <Link to="/vet" className={mobileNavLinkClass('/vet')}>
                                    <ClipboardList className="w-4 h-4" /> Vet Dash
                                </Link>
                            )}
                            {user?.role === 'agri-supplier' && (
                                <Link to="/supplier" className={mobileNavLinkClass('/supplier')}>
                                    <LayoutDashboard className="w-4 h-4" /> Supplier Dash
                                </Link>
                            )}
                            {!user && (
                                <div className="grid grid-cols-2 gap-2 border-t border-[#e5e4d9] mt-2 pt-3">
                                    <Link to="/login" className="rounded-xl px-3 py-3 text-center text-sm font-semibold text-[#657068] hover:bg-[#efeee7]">
                                        Sign In
                                    </Link>
                                    <Link to="/register" className="rounded-xl bg-[#24543c] px-3 py-3 text-center text-sm font-bold text-white hover:bg-[#173b2a]">
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
