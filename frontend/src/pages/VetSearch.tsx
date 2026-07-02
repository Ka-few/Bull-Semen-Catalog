import { useState, useEffect } from 'react';
import api from '../api/config';
import { MapPin, Phone, Star } from 'lucide-react';

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
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>Find a Verified Vet</h2>

      <div style={{
        marginBottom: '2rem', backgroundColor: 'white', padding: '1rem',
        borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '400px'
      }}>
        <label style={{ display: 'block', fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.25rem' }}>Filter by County</label>
        <input
          type="text"
          value={countyFilter}
          onChange={e => setCountyFilter(e.target.value)}
          placeholder="e.g. Kiambu"
          style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
        />
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading veterinarians...</div>
      ) : vets.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No verified vets found in this area.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {vets.map(vet => (
            <div key={vet.id} style={{
              backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{vet.full_name}</h3>
                <span style={{
                  backgroundColor: '#d1fae5', color: '#065f46',
                  padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold'
                }}>Verified</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', marginBottom: '0.5rem' }}>
                <MapPin size={18} /> {vet.county}, {vet.sub_county}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', marginBottom: '0.5rem' }}>
                <Phone size={18} /> {vet.phone_number}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', marginBottom: '1rem' }}>
                <Star size={18} fill="currentColor" /> {vet.rating.toFixed(1)} / 5.0
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#4b5563' }}>Service Fee:</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#10b981' }}>KES {vet.service_fee}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VetSearch;
