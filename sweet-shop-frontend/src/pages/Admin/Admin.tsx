import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './Dashboard';
import AdminSweets from './Sweets';
import AdminUsers from './Users';
import AdminOrders from './Orders';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';

const Admin: React.FC = () => {
  return (
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
  );
};

export default Admin;