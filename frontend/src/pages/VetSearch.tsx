import { useState, useEffect } from 'react';
import api from '../api/config';
import { MapPin, Phone, Star, Search, ShieldCheck } from 'lucide-react';

interface Vet {
  id: number;
  full_name: string;
  phone_number: string;
  county: string;
  sub_county: string;
  service_fee: number;
  rating: number;
  verified: number;
}

const VetSearch = () => {
  const [vets, setVets] = useState<Vet[]>([]);
  const [countyFilter, setCountyFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchVets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('verified', 'true');
      if (countyFilter) params.append('county', countyFilter);

      const response = await api.get(`/vets?${params.toString()}`);
      setVets(response.data);
    } catch (err) {
      console.error('Failed to fetch vets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVets();
  }, [countyFilter]);

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header Area */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Find a Verified Vet</h2>
          <p className="text-lg text-slate-500 mb-8">
            Connect with certified Veterinary AI Technicians in your local area for professional insemination services.
          </p>

          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <input
              type="text"
              value={countyFilter}
              onChange={e => setCountyFilter(e.target.value)}
              placeholder="Search by County (e.g. Kiambu)"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-full focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Results Area */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-bold tracking-wide">Searching for specialists...</p>
        </div>
      ) : vets.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-500 text-lg font-bold">No verified vets found in this area.</p>
          <button onClick={() => setCountyFilter('')} className="mt-4 text-indigo-600 hover:underline font-bold">Clear search</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vets.map(vet => (
            <div key={vet.id} className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-1 flex flex-col">
              
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-blue-50 rounded-2xl flex items-center justify-center text-indigo-700 font-black text-xl shadow-inner">
                    {vet.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">{vet.full_name}</h3>
                    <div className="flex items-center gap-1 mt-1 text-yellow-500 font-bold text-sm">
                      <Star className="w-4 h-4 fill-yellow-500" /> {vet.rating.toFixed(1)}
                    </div>
                  </div>
                </div>
                
                {vet.verified === 1 && (
                  <div className="bg-green-50 text-green-700 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-3 text-slate-600 font-medium">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="truncate">{vet.sub_county}, {vet.county}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-medium">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-slate-400" />
                  </div>
                  <span>{vet.phone_number}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-end justify-between mt-auto">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Service Fee</p>
                  <p className="text-xl font-black text-slate-900 leading-none">
                    <span className="text-sm font-bold text-slate-500 mr-1">KES</span>
                    {vet.service_fee.toLocaleString()}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VetSearch;
