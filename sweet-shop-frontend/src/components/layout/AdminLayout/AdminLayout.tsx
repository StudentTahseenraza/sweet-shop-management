import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaCandyCane, 
  FaUsers, 
  FaShoppingCart,
  FaChartBar,
  FaBoxOpen,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaExclamationTriangle,
  FaHome // Added Home icon
} from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lowStockCount] = useState(5); // Mock data

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/admin/sweets', icon: FaCandyCane, label: 'Sweets' },
    { path: '/admin/orders', icon: FaShoppingCart, label: 'Orders' },
    { path: '/admin/users', icon: FaUsers, label: 'Users' },
    { path: '/admin/low-stock', icon: FaExclamationTriangle, label: 'Low Stock', badge: lowStockCount },
    { path: '/admin/analytics', icon: FaChartBar, label: 'Analytics' },
    { path: '/admin/inventory', icon: FaBoxOpen, label: 'Inventory' },
    { path: '/admin/settings', icon: FaCog, label: 'Settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-gray-900 text-white rounded-lg"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <FaCandyCane className="text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Sweet Shop</h2>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{user?.name}</h3>
                <p className="text-sm text-gray-400">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-secondary-600 rounded-full">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive(item.path) 
                    ? 'bg-primary-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-1 text-xs font-semibold bg-red-500 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}

            {/* Home Button - Added here */}
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors mt-4 border-t border-gray-800 pt-4"
            >
              <FaHome className="w-5 h-5" />
              <span className="flex-1">Go to Home</span>
            </Link>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
                </h1>
                <p className="text-gray-600">Manage your sweet shop efficiently</p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Home Button in Header */}
                <Link
                  to="/"
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <FaHome className="w-4 h-4" />
                  <span className="hidden md:inline">Go to Home</span>
                </Link>

                {/* Notifications */}
                <div className="relative">
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <div className="relative">
                      <FaExclamationTriangle className="w-6 h-6" />
                      {lowStockCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {lowStockCount}
                        </span>
                      )}
                    </div>
                  </button>
                </div>

                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden md:block">
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-600">{user?.role}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Sweet Shop Admin. All rights reserved.
            </p>
            <div className="text-sm text-gray-600">
              <span className="inline-flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                System Status: Operational
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;