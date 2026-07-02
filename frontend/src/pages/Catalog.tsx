import { useState, useEffect } from 'react';
import api from '../api/config';
import BullCard from '../components/BullCard';

interface Bull {
  id: number;
  name: string;
  breed: string;
  milk_yield: number;
  calving_ease: number;
  semen_price: number;
  image_url: string;
}

const Catalog = () => {
  const [bulls, setBulls] = useState<Bull[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [breed, setBreed] = useState('');
  const [minMilkYield, setMinMilkYield] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchBulls = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (breed) params.append('breed', breed);
      if (minMilkYield) params.append('minMilkYield', minMilkYield);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const response = await api.get(`/bulls?${params.toString()}`);
      setBulls(response.data);
    } catch (err) {
      console.error('Failed to fetch bulls', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBulls();
  }, [breed, minMilkYield, maxPrice]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>Bull Catalog</h2>

      <div style={{
        display: 'flex', gap: '1rem', marginBottom: '2rem',
        backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.25rem' }}>Breed</label>
          <select
            value={breed}
            onChange={e => setBreed(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
          >
            <option value="">All Breeds</option>
            <option value="Holstein">Holstein</option>
            <option value="Jersey">Jersey</option>
            <option value="Ayrshire">Ayrshire</option>
            <option value="Guernsey">Guernsey</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.25rem' }}>Min Milk Yield (kg)</label>
          <input
            type="number"
            value={minMilkYield}
            onChange={e => setMinMilkYield(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
            placeholder="e.g. 5000"
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.25rem' }}>Max Price (KES)</label>
          <input
            type="number"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
            placeholder="e.g. 1500"
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading catalog...</div>
      ) : bulls.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>No bulls found matching your criteria.</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {bulls.map(bull => (
            <BullCard key={bull.id} bull={bull} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;
