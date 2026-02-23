import React, { useContext } from 'react';
import { ShoppingCart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

interface Bull {
  id: number;
  name: string;
  breed: string;
  milk_yield: number;
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
        alert("Please login as a farmer to add to cart.");
        return;
      }
      await addToCart(bull.id, 1);
      alert(`Added ${bull.name} to cart!`);
    } catch (err) {
      alert("Failed to add to cart.");
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <img
        src={bull.image_url || 'https://via.placeholder.com/300x200?text=Bull+Image'}
        alt={bull.name}
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
      />
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>{bull.name}</h3>
        <p style={{ color: '#4b5563', marginBottom: '0.25rem' }}>Breed: <span style={{ fontWeight: '500' }}>{bull.breed}</span></p>
        <p style={{ color: '#4b5563', marginBottom: '0.25rem' }}>Milk Yield: {bull.milk_yield} kg</p>
        <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>KES {bull.semen_price}</span>

          {user?.role === 'farmer' && (
            <button
              onClick={handleAddToCart}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                backgroundColor: '#3b82f6', color: 'white', border: 'none',
                padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer'
              }}
            >
              <ShoppingCart size={16} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BullCard;
