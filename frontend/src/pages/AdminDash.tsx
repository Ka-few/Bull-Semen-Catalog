import React, { useState, useEffect } from 'react';
import api from '../api/config';
import toast from 'react-hot-toast';
import { ShieldAlert, Trash2, PlusCircle, CheckCircle, XCircle, Edit2 } from 'lucide-react';

interface Bull {
  id: number;
  name: string;
  breed: string;
  stock_available: number;
  semen_price?: number;
  milk_yield?: number;
  image_url?: string;
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
  const [newBullImage, setNewBullImage] = useState('');

  const [editingBullId, setEditingBullId] = useState<number | null>(null);

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
      toast.success(verify ? "Vet verified successfully!" : "Vet verification revoked");
      fetchVets();
    } catch (err) {
      toast.error("Failed to update vet verification status");
    }
  };

  const handleDeleteBull = async (id: number) => {
    if (confirm("Are you sure you want to delete this bull?")) {
      try {
        await api.delete(`/bulls/${id}`);
        toast.success("Bull deleted successfully");
        fetchBulls();
      } catch (err) {
        toast.error("Failed to delete bull");
      }
    }
  };

  const handleEditBull = (bull: Bull) => {
    setEditingBullId(bull.id);
    setNewBullName(bull.name);
    setNewBullBreed(bull.breed);
    setNewBullPrice(bull.semen_price?.toString() || '');
    setNewBullMilk(bull.milk_yield?.toString() || '');
    setNewBullImage(bull.image_url || '');
  };

  const cancelEdit = () => {
    setEditingBullId(null);
    setNewBullName('');
    setNewBullBreed('');
    setNewBullPrice('');
    setNewBullMilk('');
    setNewBullImage('');
  };

  const handleSubmitBull = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: newBullName,
        breed: newBullBreed,
        semen_price: parseFloat(newBullPrice),
        milk_yield: parseFloat(newBullMilk),
        image_url: newBullImage || undefined,
      };

      if (editingBullId) {
        await api.put(`/bulls/${editingBullId}`, payload);
        toast.success("Bull updated successfully");
      } else {
        await api.post('/bulls', payload);
        toast.success("Bull created successfully");
      }
      
      fetchBulls();
      cancelEdit();
    } catch (err) {
      toast.error(editingBullId ? "Failed to update bull" : "Failed to create bull");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gray-800 rounded-xl">
          <ShieldAlert className="h-8 w-8 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">System Administration</h2>
          <p className="text-gray-500">Manage catalog and verify service providers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Bulls Management */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[700px]">
          <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">
            Bull Catalog Management
          </h3>

          <form onSubmit={handleSubmitBull} className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4 mb-8">
            <h4 className="font-bold text-gray-700 flex items-center gap-2">
              <PlusCircle className="w-5 h-5"/> {editingBullId ? 'Update Bull' : 'Add Quick Bull'}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Name" value={newBullName} onChange={e => setNewBullName(e.target.value)} required className="p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-200" />
              <input type="text" placeholder="Breed" value={newBullBreed} onChange={e => setNewBullBreed(e.target.value)} required className="p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-200" />
              <input type="number" placeholder="Price (KES)" value={newBullPrice} onChange={e => setNewBullPrice(e.target.value)} required className="p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-200" />
              <input type="number" placeholder="Milk Yield (kg)" value={newBullMilk} onChange={e => setNewBullMilk(e.target.value)} required className="p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-200" />
              <input type="text" placeholder="Image URL (optional)" value={newBullImage} onChange={e => setNewBullImage(e.target.value)} className="col-span-2 p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="flex-1 p-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-md">
                {editingBullId ? 'Update Bull' : 'Add Bull to Catalog'}
              </button>
              {editingBullId && (
                <button type="button" onClick={cancelEdit} className="p-3 bg-gray-300 text-gray-800 font-bold rounded-xl hover:bg-gray-400 transition shadow-md">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="flex-1 overflow-hidden flex flex-col">
            <h4 className="font-bold text-gray-700 mb-4">Existing Bulls</h4>
            <ul className="overflow-y-auto space-y-3 pr-2 custom-scrollbar flex-1">
              {bulls.map(bull => (
                <li key={bull.id} className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition group">
                  <div>
                    <span className="font-bold text-gray-800 block">{bull.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{bull.breed}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEditBull(bull)} className="text-blue-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition" title="Edit">
                      <Edit2 className="w-5 h-5"/>
                    </button>
                    <button onClick={() => handleDeleteBull(bull.id)} className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition" title="Delete">
                      <Trash2 className="w-5 h-5"/>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Vet Management */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[700px]">
          <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">
            Veterinarian Verification
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <ul className="space-y-4">
              {vets.map(vet => (
                <li key={vet.id} className="flex justify-between items-center p-5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white hover:shadow-md transition">
                  <div>
                    <div className="font-bold text-gray-800 text-lg flex items-center gap-2">
                      {vet.full_name}
                      {vet.verified ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-gray-400" />}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{vet.county}</div>
                  </div>
                  <div>
                    {vet.verified ? (
                      <button onClick={() => handleVerifyVet(vet.id, false)} className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg font-bold hover:bg-red-50 transition text-sm">
                        Revoke Access
                      </button>
                    ) : (
                      <button onClick={() => handleVerifyVet(vet.id, true)} className="bg-green-600 text-white border border-green-600 px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition shadow-sm text-sm">
                        Verify Vet
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {vets.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 font-medium">No registered vets found.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDash;
