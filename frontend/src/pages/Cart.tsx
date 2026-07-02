import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, PackageSearch } from 'lucide-react';

const Cart = () => {
    const { cartItems, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.quantity * item.semen_price), 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in px-4">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-12 h-12 text-slate-300" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3 text-center">Your Cart is Empty</h2>
                <p className="text-slate-500 mb-8 text-center max-w-sm">
                    Looks like you haven't added any elite genetics to your cart yet.
                </p>
                <Link
                    to="/catalog"
                    className="flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                    <PackageSearch className="w-5 h-5" /> Browse Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Your Shopping Cart</h2>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items List */}
                <div className="flex-1 space-y-4">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                            <div className="col-span-6">Product</div>
                            <div className="col-span-2 text-center">Price</div>
                            <div className="col-span-2 text-center">Qty</div>
                            <div className="col-span-2 text-right pr-2">Total</div>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {cartItems.map(item => (
                                <div key={item.cart_id} className="p-4 md:p-5 flex flex-col md:grid md:grid-cols-12 gap-4 items-center group transition-colors hover:bg-slate-50/50">
                                    <div className="col-span-6 flex items-center gap-4 w-full">
                                        {/* Mobile remove button - absolute top right */}
                                        <button
                                            onClick={() => removeFromCart(item.cart_id)}
                                            className="md:hidden absolute right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>

                                        <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 relative">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-300 font-black text-3xl">
                                                    {item.breed[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mb-1">{item.breed}</div>
                                            <div className="font-bold text-slate-900 text-lg leading-tight">{item.name}</div>
                                        </div>
                                    </div>

                                    {/* Mobile labels */}
                                    <div className="w-full md:hidden flex justify-between items-center py-2 border-t border-slate-100 mt-2">
                                        <span className="text-slate-500 text-sm font-semibold">Qty: {item.quantity}</span>
                                        <span className="font-black text-slate-900">KES {(item.semen_price * item.quantity).toLocaleString()}</span>
                                    </div>

                                    {/* Desktop columns */}
                                    <div className="hidden md:block col-span-2 text-center text-slate-600 font-semibold">
                                        KES {item.semen_price.toLocaleString()}
                                    </div>
                                    <div className="hidden md:block col-span-2 text-center">
                                        <span className="inline-block bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-lg">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="hidden md:flex col-span-2 items-center justify-end gap-3">
                                        <div className="font-black text-slate-900">
                                            KES {(item.semen_price * item.quantity).toLocaleString()}
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.cart_id)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                            title="Remove item"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:w-80 flex-shrink-0">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
                        <h3 className="text-lg font-black text-slate-900 mb-6">Order Summary</h3>
                        
                        <div className="space-y-4 text-sm mb-6">
                            <div className="flex justify-between items-center text-slate-600 font-medium">
                                <span>Subtotal ({totalItems} items)</span>
                                <span>KES {totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-600 font-medium">
                                <span>Service & Vet Fees</span>
                                <span className="italic text-slate-400">Calculated at checkout</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="text-slate-900 font-bold">Estimated Total</span>
                                <div className="text-right">
                                    <span className="text-xs text-slate-500 font-bold mr-1">KES</span>
                                    <span className="text-2xl font-black text-slate-900 leading-none">{totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Proceed to Checkout <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
