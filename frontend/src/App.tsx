import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import VetSearch from './pages/VetSearch';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import AdminDash from './pages/AdminDash';
import VetDash from './pages/VetDash';
import SupplierDash from './pages/SupplierDash';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
        <Navbar />
        <main className="container" style={{ padding: '2rem 0' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/catalog" element={<Catalog />} />

            {/* Farmer Routes */}
            <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
              <Route path="/vets" element={<VetSearch />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment/:orderId" element={<Payment />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDash />} />
            </Route>

            {/* Vet Routes */}
            <Route element={<ProtectedRoute allowedRoles={['vet']} />}>
              <Route path="/vet" element={<VetDash />} />
            </Route>

            {/* Supplier Routes */}
            <Route element={<ProtectedRoute allowedRoles={['agri-supplier']} />}>
              <Route path="/supplier" element={<SupplierDash />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
