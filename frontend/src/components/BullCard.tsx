import React, { useContext, useState } from 'react';
import { ShoppingCart, Droplets, TrendingUp, Award } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

interface Bull {
  id: number;
  name: string;
  breed: string;
  milk_yield: number;
  calving_ease?: number;
  semen_price: number;
  image_url: string;
}

interface BullCardProps {
  bull: Bull;
}

// Breed-to-gradient mapping for visual variety
const BREED_STYLES: Record<string, { gradient: string; badge: string }> = {
  Holstein:  { gradient: 'from-slate-700 to-slate-900',   badge: 'bg-slate-100 text-slate-700' },
  Jersey:    { gradient: 'from-amber-600 to-orange-800',  badge: 'bg-amber-100 text-amber-700' },
  Ayrshire:  { gradient: 'from-red-600 to-rose-800',      badge: 'bg-red-100 text-red-700' },
  Guernsey:  { gradient: 'from-yellow-500 to-amber-700',  badge: 'bg-yellow-100 text-yellow-700' },
  default:   { gradient: 'from-blue-700 to-indigo-900',   badge: 'bg-blue-100 text-blue-700' },
};

const BullCard: React.FC<BullCardProps> = ({ bull }) => {
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);

  const style = BREED_STYLES[bull.breed] ?? BREED_STYLES.default;

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login as a farmer to add to cart.');
      return;
    }
    setAdding(true);
    try {
      await addToCart(bull.id, 1);
      toast.success(`${bull.name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col border border-gray-100 hover:-translate-y-1">

      {/* Image area */}
      <div className="relative overflow-hidden h-52">
        {bull.image_url && !imgError ? (
          <img
            src={bull.image_url}
            alt={bull.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          /* Fallback: breed-coloured gradient with silhouette */
          <div className={`w-full h-full bg-gradient-to-br ${style.gradient} flex items-center justify-center`}>
            <svg viewBox="0 0 120 80" className="w-32 h-32 opacity-20 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 60 Q10 40 15 20 Q30 5 50 15 Q60 5 80 12 Q100 5 105 25 Q115 40 100 60 Q90 70 70 68 Q50 72 30 68 Z"/>
              <circle cx="35" cy="18" r="7"/>
              <circle cx="85" cy="15" r="7"/>
              <rect x="38" y="60" width="8" height="18" rx="3"/>
              <rect x="56" y="62" width="8" height="18" rx="3"/>
              <rect x="74" y="60" width="8" height="18" rx="3"/>
            </svg>
            <span className="absolute text-white/30 text-6xl font-black select-none">{bull.breed[0]}</span>
          </div>
        )}

        {/* Overlay gradient at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Breed badge - top left */}
        <div className={`absolute top-3 left-3 ${style.badge} text-xs font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-sm`}>
          {bull.breed}
        </div>

        {/* Premium badge - top right (high yield) */}
        {bull.milk_yield >= 8000 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <Award className="w-3 h-3" /> Elite
          </div>
        )}

        {/* Bull name overlaid at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-black text-xl drop-shadow-lg leading-tight group-hover:text-yellow-300 transition-colors duration-300">
            {bull.name}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-2xl p-3 flex items-center gap-2">
            <div className="bg-blue-100 p-1.5 rounded-xl">
              <Droplets className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Milk Yield</p>
              <p className="text-sm font-black text-blue-800">{bull.milk_yield.toLocaleString()} kg</p>
            </div>
          </div>

          {bull.calving_ease !== undefined ? (
            <div className="bg-green-50 rounded-2xl p-3 flex items-center gap-2">
              <div className="bg-green-100 p-1.5 rounded-xl">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Calving Ease</p>
                <p className="text-sm font-black text-green-800">{bull.calving_ease}%</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-3 flex items-center gap-2">
              <div className="bg-gray-100 p-1.5 rounded-xl">
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Breed</p>
                <p className="text-sm font-black text-gray-600">{bull.breed}</p>
              </div>
            </div>
          )}
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Per straw</p>
            <p className="text-2xl font-black text-gray-900">
              <span className="text-sm font-bold text-gray-500 mr-0.5">KES</span>
              {bull.semen_price.toLocaleString()}
            </p>
          </div>

          {user?.role === 'farmer' ? (
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className={`flex items-center gap-2 font-bold py-3 px-5 rounded-2xl transition-all duration-200 shadow-md
                ${adding
                  ? 'bg-gray-200 text-gray-400 cursor-wait'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md'
                }`}
            >
              {adding ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <ShoppingCart size={16} />
              )}
              {adding ? 'Adding…' : 'Add'}
            </button>
          ) : (
            <div className="text-xs text-gray-400 font-medium italic">Login to order</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BullCard;
