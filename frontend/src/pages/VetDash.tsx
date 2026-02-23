import React, { useState, useEffect, useContext } from 'react';
import api from '../api/config';
import { AuthContext } from '../context/AuthContext';

const VetDash = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState<any[]>([]);
  const [vetProfile, setVetProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Profile Form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [county, setCounty] = useState('');
  const [subCounty, setSubCounty] = useState('');
  const [fee, setFee] = useState('');

  const fetchOrdersAndProfile = async () => {
    setLoading(true);
    try {
      const orderRes = await api.get('/orders/0');
      setOrders(orderRes.data);

      const vetRes = await api.get('/vets');
      const profile = vetRes.data.find((v: any) => v.user_id === user?.id);
      if (profile) {
        setVetProfile(profile);
      }
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndProfile();
  }, []);

  const handleRegisterProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/vets/register', {
        full_name: fullName, phone_number: phone, county, sub_county: subCounty, service_fee: parseFloat(fee)
      });
      alert("Profile created! Awaiting admin verification.");
      fetchOrdersAndProfile();
    } catch (err) {
      alert("Failed to register profile");
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { order_status: status });
      fetchOrdersAndProfile();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1f2937' }}>Veterinary Dashboard</h2>

      {!vetProfile ? (
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Complete Your Professional Profile</h3>
          <form onSubmit={handleRegisterProfile} style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
            <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required style={{ padding: '0.75rem' }} />
            <input type="text" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required style={{ padding: '0.75rem' }} />
            <input type="text" placeholder="County" value={county} onChange={e => setCounty(e.target.value)} required style={{ padding: '0.75rem' }} />
            <input type="text" placeholder="Sub-county" value={subCounty} onChange={e => setSubCounty(e.target.value)} required style={{ padding: '0.75rem' }} />
            <input type="number" placeholder="Service Fee (KES)" value={fee} onChange={e => setFee(e.target.value)} required style={{ padding: '0.75rem' }} />
            <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Submit Profile for Verification</button>
          </form>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
          {/* Profile Status */}
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', alignSelf: 'start' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Profile Status</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              Status:
              {vetProfile.verified ? (
                <span style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 'bold' }}>Verified</span>
              ) : (
                <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 'bold' }}>Pending Admin Review</span>
              )}
            </div>
            <p><strong>Name:</strong> {vetProfile.full_name}</p>
            <p><strong>Region:</strong> {vetProfile.county}</p>
            <p><strong>Fee:</strong> KES {vetProfile.service_fee}</p>
          </div>

          {/* Assigned Orders */}
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Service Requests</h3>
            {orders.length === 0 ? (
              <p style={{ color: '#6b7280' }}>No service requests currently.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.map((order: any) => (
                  <div key={order.id} style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 'bold' }}>Order #{order.id}</span>
                      <span>Status: <strong style={{ color: order.order_status === 'completed' ? '#10b981' : '#f59e0b' }}>{order.order_status.toUpperCase()}</strong></span>
                    </div>
                    <div style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '1rem' }}>
                      Items: {order.items.map((i: any) => `${i.quantity}x ${i.bull_name}`).join(', ')}
                    </div>
                    {order.order_status !== 'completed' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                        style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VetDash;
