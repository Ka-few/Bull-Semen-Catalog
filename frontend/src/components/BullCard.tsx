import React, { useContext } from 'react';
import { ShoppingCart } from 'lucide-react';
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

const BullCard: React.FC<BullCardProps> = ({ bull }) => {
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = async () => {
    try {
      if (!user) {
        toast.error("Please login as a farmer to add to cart.");
        return;
      }
      await addToCart(bull.id, 1);
      toast.success(`Added ${bull.name} to cart!`);
    } catch (err) {
      toast.error("Failed to add to cart.");
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={bull.image_url || 'https://via.placeholder.com/400x300?text=Bull+Image'}
          alt={bull.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm border border-white/50">
          {bull.breed}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">{bull.name}</h3>
        
        <div className="space-y-1 mb-4 flex-1">
          <p className="text-gray-500 text-sm flex justify-between">
            <span>Milk Yield</span>
            <span className="font-semibold text-gray-700">{bull.milk_yield} kg</span>
          </p>
          {bull.calving_ease !== undefined && (
            <p className="text-gray-500 text-sm flex justify-between">
              <span>Calving Ease</span>
              <span className="font-semibold text-gray-700">{bull.calving_ease}%</span>
            </p>
          )}
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Price per straw</span>
            <span className="text-xl font-black text-green-600">KES {bull.semen_price}</span>
          </div>

          {user?.role === 'farmer' && (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShoppingCart size={18} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BullCard;
