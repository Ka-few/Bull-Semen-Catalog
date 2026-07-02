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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Bull Catalog</h2>
        <p className="text-gray-500 mt-2">Browse and order premium bull semen for your herd.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">Breed</label>
          <select
            value={breed}
            onChange={e => setBreed(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50"
          >
            <option value="">All Breeds</option>
            <option value="Holstein">Holstein</option>
            <option value="Jersey">Jersey</option>
            <option value="Ayrshire">Ayrshire</option>
            <option value="Guernsey">Guernsey</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">Min Milk Yield (kg)</label>
          <input
            type="number"
            value={minMilkYield}
            onChange={e => setMinMilkYield(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50"
            placeholder="e.g. 5000"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">Max Price (KES)</label>
          <input
            type="number"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50"
            placeholder="e.g. 1500"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading catalog...</p>
        </div>
      ) : bulls.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-lg font-medium">No bulls found matching your criteria.</p>
          <button onClick={() => {setBreed(''); setMinMilkYield(''); setMaxPrice('');}} className="mt-4 text-blue-600 hover:underline font-bold">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bulls.map(bull => (
            <BullCard key={bull.id} bull={bull} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;
