import React, { useState, useEffect } from 'react';
import api from '../api/config';

interface Bull {
  id: number;
  name: string;
  breed: string;
  stock_available: number;
}

interface Vet {
  id: number;
  full_name: string;
  county: string;
  verified: number;
}

const AdminDash = () => {
  const [bulls, setBulls] = useState<Bull[]>([]);
  const [vets, setVets] = useState<Vet[]>([]);

  const [newBullName, setNewBullName] = useState('');
  const [newBullBreed, setNewBullBreed] = useState('');
  const [newBullPrice, setNewBullPrice] = useState('');
  const [newBullMilk, setNewBullMilk] = useState('');

  const fetchBulls = async () => {
    const res = await api.get('/bulls');
    setBulls(res.data);
  };

  const fetchVets = async () => {
    // Admins need a way to see all vets. The endpoint /vets gets all if no filter is applied.
    const res = await api.get('/vets');
    setVets(res.data);
  };

  useEffect(() => {
    fetchBulls();
    fetchVets();
  }, []);

  const handleVerifyVet = async (id: number, verify: boolean) => {
    try {
      await api.put(`/vets/${id}/verify`, { verified: verify });
      fetchVets();
    } catch (err) {
      alert("Failed to update vet verification status");
    }
  };

  const handleDeleteBull = async (id: number) => {
    if (confirm("Are you sure you want to delete this bull?")) {
      try {
        await api.delete(`/bulls/${id}`);
        fetchBulls();
      } catch (err) {
        alert("Failed to delete bull");
      }
    }
  };

  const handleCreateBull = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/bulls', {
        name: newBullName,
        breed: newBullBreed,
        semen_price: parseFloat(newBullPrice),
        milk_yield: parseFloat(newBullMilk),
      });
      fetchBulls();
      setNewBullName('');
      setNewBullBreed('');
      setNewBullPrice('');
      setNewBullMilk('');
      alert("Bull created successfully");
    } catch (err) {
      alert("Failed to create bull");
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1f2937' }}>System Administration</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

        {/* Bulls Management */}
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
            Bull Catalog Management
          </h3>

          <form onSubmit={handleCreateBull} style={{ marginBottom: '2rem', display: 'grid', gap: '0.5rem' }}>
            <h4 style={{ fontWeight: '500' }}>Add Quick Bull</h4>
            <input type="text" placeholder="Name" value={newBullName} onChange={e => setNewBullName(e.target.value)} required style={{ padding: '0.5rem' }} />
            <input type="text" placeholder="Breed" value={newBullBreed} onChange={e => setNewBullBreed(e.target.value)} required style={{ padding: '0.5rem' }} />
            <input type="number" placeholder="Price" value={newBullPrice} onChange={e => setNewBullPrice(e.target.value)} required style={{ padding: '0.5rem' }} />
            <input type="number" placeholder="Milk Yield" value={newBullMilk} onChange={e => setNewBullMilk(e.target.value)} required style={{ padding: '0.5rem' }} />
            <button type="submit" style={{ padding: '0.5rem', backgroundColor: '#10b981', color: 'white', border: 'none', cursor: 'pointer' }}>Add Bull</button>
          </form>

          <div>
            <h4 style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Existing Bulls</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {bulls.map(bull => (
                <li key={bull.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
                  <span>{bull.name} ({bull.breed})</span>
                  <button onClick={() => handleDeleteBull(bull.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Vet Management */}
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
            Veterinarian Verification
          </h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {vets.map(vet => (
              <li key={vet.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{vet.full_name}</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{vet.county}</div>
                </div>
                <div>
                  {vet.verified ? (
                    <button onClick={() => handleVerifyVet(vet.id, false)} style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.25rem 0.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Revoke</button>
                  ) : (
                    <button onClick={() => handleVerifyVet(vet.id, true)} style={{ backgroundColor: '#10b981', color: 'white', padding: '0.25rem 0.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Verify</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {vets.length === 0 && <p style={{ color: '#6b7280' }}>No registered vets found.</p>}
        </div>

      </div>
    </div>
  );
};

export default AdminDash;
