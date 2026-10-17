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
  Holstein:  { gradient: 'from-[#52645a] to-[#26352d]', badge: 'bg-[#efeee7] text-[#52645a]' },
  Jersey:    { gradient: 'from-[#b87643] to-[#75523d]', badge: 'bg-[#f4e8dc] text-[#8d5735]' },
  Ayrshire:  { gradient: 'from-[#9c5949] to-[#633d35]', badge: 'bg-[#f3e3dd] text-[#8b4c3d]' },
  Guernsey:  { gradient: 'from-[#b49a53] to-[#7b6330]', badge: 'bg-[#f2edda] text-[#78632d]' },
  default:   { gradient: 'from-[#71834b] to-[#24543c]', badge: 'bg-[#e9efdf] text-[#24543c]' },
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

  /* Image area */
  const imageArea = (
    <div className="relative overflow-hidden h-40 bg-[#e7e5d9]">
      {bull.image_url && !imgError ? (
        <img
          src={bull.image_url}
          alt={bull.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
      ) : (
        <div className={`w-full h-full bg-linear-to-br ${style.gradient} flex items-center justify-center`}>
          <span className="absolute text-white/20 text-5xl font-black select-none">{bull.breed[0]}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-linear-to-t from-[#17251d]/70 via-transparent to-transparent" />
      {/* Breed badge */}
      <div className={`absolute top-2 left-2 ${style.badge} text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm`}>
        {bull.breed}
      </div>
      {/* Elite badge */}
      {bull.milk_yield >= 8000 && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
          <Award className="w-2.5 h-2.5" /> Elite
        </div>
      )}
      {/* Name overlay */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2">
        <h3 className="text-white font-black text-base leading-tight drop-shadow-lg group-hover:text-[#dce6a2] transition-colors duration-300 line-clamp-1">
          {bull.name}
        </h3>
      </div>
    </div>
  );

  return (
    <div className="group relative bg-[#fffefa] rounded-2xl overflow-hidden shadow-[0_5px_18px_rgba(49,59,44,.06)] hover:shadow-[0_16px_36px_rgba(49,59,44,.14)] transition-all duration-300 flex flex-col border border-[#e8e7dc] hover:-translate-y-1">
      {imageArea}

      {/* Body */}
      <div className="p-3 flex-1 flex flex-col gap-3">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#edf2e7] rounded-xl p-2 flex items-center gap-1.5">
            <div className="bg-[#dce6cc] p-1 rounded-lg flex-shrink-0">
              <Droplets className="w-3 h-3 text-[#55713c]" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] text-[#71834b] font-bold uppercase tracking-wider leading-none">Yield</p>
              <p className="text-xs font-black text-[#24543c] leading-tight">{bull.milk_yield.toLocaleString()} kg</p>
            </div>
          </div>

          {bull.calving_ease !== undefined ? (
          <div className="bg-[#f4e8dc] rounded-xl p-2 flex items-center gap-1.5">
            <div className="bg-[#ead9ca] p-1 rounded-lg flex-shrink-0">
              <TrendingUp className="w-3 h-3 text-[#a65d3b]" />
              </div>
              <div className="min-w-0">
              <p className="text-[9px] text-[#a65d3b] font-bold uppercase tracking-wider leading-none">Calving</p>
              <p className="text-xs font-black text-[#75523d] leading-tight">{bull.calving_ease}%</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-2 flex items-center gap-1.5">
              <div className="bg-gray-100 p-1 rounded-lg flex-shrink-0">
                <TrendingUp className="w-3 h-3 text-gray-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none">Breed</p>
                <p className="text-xs font-black text-gray-600 leading-tight truncate">{bull.breed}</p>
              </div>
            </div>
          )}
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#eeede5]">
          <div>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-0.5">Per straw</p>
            <p className="text-base font-black text-[#26352d] leading-tight">
              <span className="text-xs font-bold text-gray-400 mr-0.5">KES</span>
              {bull.semen_price.toLocaleString()}
            </p>
          </div>

          {user?.role === 'farmer' ? (
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className={`flex items-center gap-1 font-bold py-2 px-3 rounded-xl text-sm transition-all duration-200 shadow-sm
                ${ adding
                  ? 'bg-gray-200 text-gray-400 cursor-wait'
                  : 'bg-gradient-to-r from-[#24543c] to-[#527048] hover:from-[#173b2a] hover:to-[#3e6038] text-white hover:shadow-md hover:shadow-[#dce6cc] hover:-translate-y-0.5 active:translate-y-0'
                }`}
            >
              {adding
                ? <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <ShoppingCart size={13} />}
              {adding ? '…' : 'Add'}
            </button>
          ) : (
            <div className="text-[10px] text-gray-400 font-medium italic">Login to order</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BullCard;
