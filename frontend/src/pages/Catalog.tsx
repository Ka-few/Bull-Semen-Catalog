import { useState, useEffect, useCallback } from 'react';
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
  const [loadError, setLoadError] = useState('');

  // Filters
  const [breed, setBreed] = useState('');
  const [minMilkYield, setMinMilkYield] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchBulls = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const params = new URLSearchParams();
      if (breed) params.append('breed', breed);
      if (minMilkYield) params.append('minMilkYield', minMilkYield);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const response = await api.get(`/bulls?${params.toString()}`);
      if (!Array.isArray(response.data)) {
        throw new Error('Catalog API returned an unexpected response');
      }
      setBulls(response.data);
    } catch (err) {
      console.error('Failed to fetch bulls', err);
      setLoadError('Unable to load the catalog. Check that the API is running and VITE_API_URL is configured correctly.');
    } finally {
      setLoading(false);
    }
  }, [breed, minMilkYield, maxPrice]);

  useEffect(() => {
    fetchBulls();
  }, [fetchBulls]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="mb-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#a65d3b]">The genetics collection</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-[#173b2a]">Bull Catalog</h2>
        <p className="text-[#68736a] mt-2">Browse and order premium bull semen for your herd.</p>
      </div>

      <div className="bg-[#fffefa] p-5 md:p-6 rounded-2xl shadow-[0_5px_18px_rgba(49,59,44,.05)] border border-[#e8e7dc] flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label className="block text-xs font-extrabold text-[#667168] mb-2 uppercase tracking-wider">Breed</label>
          <select
            value={breed}
            onChange={e => setBreed(e.target.value)}
            className="w-full p-3 rounded-xl border border-[#e1e2d7] focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none bg-[#f8f8f2]"
          >
            <option value="">All Breeds</option>
            <option value="Holstein">Holstein</option>
            <option value="Jersey">Jersey</option>
            <option value="Ayrshire">Ayrshire</option>
            <option value="Guernsey">Guernsey</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-extrabold text-[#667168] mb-2 uppercase tracking-wider">Min Milk Yield (kg)</label>
          <input
            type="number"
            value={minMilkYield}
            onChange={e => setMinMilkYield(e.target.value)}
            className="w-full p-3 rounded-xl border border-[#e1e2d7] focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none bg-[#f8f8f2]"
            placeholder="e.g. 5000"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-extrabold text-[#667168] mb-2 uppercase tracking-wider">Max Price (KES)</label>
          <input
            type="number"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="w-full p-3 rounded-xl border border-[#e1e2d7] focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none bg-[#f8f8f2]"
            placeholder="e.g. 1500"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading catalog...</p>
        </div>
      ) : loadError ? (
        <div role="alert" className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
          <p className="text-red-700 font-medium">{loadError}</p>
          <button onClick={fetchBulls} className="mt-4 text-green-600 hover:underline font-bold">Try again</button>
        </div>
      ) : bulls.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-lg font-medium">No bulls found matching your criteria.</p>
          <button onClick={() => {setBreed(''); setMinMilkYield(''); setMaxPrice('');}} className="mt-4 text-green-600 hover:underline font-bold">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {bulls.map(bull => (
            <BullCard key={bull.id} bull={bull} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;
