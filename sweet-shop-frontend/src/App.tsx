import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SweetProvider } from './contexts/SweetContext';
import Layout from './components/layout/Layout/Layout';
import toast from 'react-hot-toast';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Sweets from './pages/Sweets/Sweets';
import SweetDetails from './pages/SweetDetails/SweetDetails';
import Cart from './pages/Cart/Cart';
import Profile from './pages/Profile/Profile';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminSweets from './pages/Admin/Sweets';
import AdminUsers from './pages/Admin/Users';
import AdminOrders from './pages/Admin/Orders';
import { CartProvider } from './contexts/CartContext';

// Protected Route Component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  adminOnly?: boolean;
  redirectTo?: string;
}> = ({ 
  children, 
  adminOnly = false,
  redirectTo = '/login'
}) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }

  if (adminOnly && user) {
    try {
      const userData = JSON.parse(user);
      if (userData.role !== 'ADMIN') {
        toast.error('Admin access required');
        return <Navigate to="/" replace />;
      }
    } catch {
      return <Navigate to={redirectTo} replace />;
    }
  }

  return <>{children}</>;
};

// Admin Layout Component
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
          <nav className="mt-6">
            <a href="/admin/dashboard" className="block py-3 px-6 hover:bg-gray-800">Dashboard</a>
            <a href="/admin/sweets" className="block py-3 px-6 hover:bg-gray-800">Manage Sweets</a>
            <a href="/admin/orders" className="block py-3 px-6 hover:bg-gray-800">Orders</a>
            <a href="/admin/users" className="block py-3 px-6 hover:bg-gray-800">Users</a>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SweetProvider>
          <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'white',
                color: '#333',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: 'white',
                },
              },
            }}
          />
          
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="sweets" element={<Sweets />} />
              <Route path="sweets/:id" element={<SweetDetails />} />
              
              {/* Protected Routes */}
              <Route path="cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              
              <Route path="profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Admin Routes */}
            // In App.tsx
              <Route path="admin/*" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <Routes>
                      <Route index element={<AdminDashboard />} />
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="sweets" element={<AdminSweets />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="add-sweet" element={<AdminSweets />} />
                      <Route path="low-stock" element={<AdminSweets showLowStock />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              } />
            
            {/* 404 Route */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-amber-50">
                <div className="text-center p-8">
                  <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">Page not found</p>
                  <a href="/" className="btn-primary">
                    Go Home
                  </a>
                </div>
              </div>
            } />
          </Routes>
          </CartProvider>
        </SweetProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;