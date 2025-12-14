import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaChartBar, 
  FaShoppingBag, 
  FaUsers, 
  FaMoneyBillWave, 
  FaExclamationTriangle,
  FaCandyCane,
  FaArrowUp,
  FaArrowDown,
  FaHistory,
  FaHome // Added Home icon
} from 'react-icons/fa';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useSweets } from '../../contexts/SweetContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button/Button';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardStats {
  totalSweets: number;
  totalUsers: number;
  totalRevenue: number;
  lowStockItems: number;
  todaySales: number;
  activeCategories: number;
}

const AdminDashboard: React.FC = () => {
  const { sweets } = useSweets();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalSweets: 0,
    totalUsers: 0,
    totalRevenue: 0,
    lowStockItems: 0,
    todaySales: 0,
    activeCategories: 0
  });
  const [recentPurchases, setRecentPurchases] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoadingStats(true);
      
      const categories = new Set(sweets.map(s => s.category));
      const lowStock = sweets.filter(s => s.quantity <= 10).length;
      const revenue = sweets.reduce((acc, sweet) => {
        return acc + (sweet.price * (100 - sweet.quantity));
      }, 0);
      
      setStats({
        totalSweets: sweets.length,
        totalUsers: 150,
        totalRevenue: revenue,
        lowStockItems: lowStock,
        todaySales: 1250,
        activeCategories: categories.size
      });

      setRecentPurchases([
        { id: 1, customer: 'John Doe', item: 'Chocolate Truffle', quantity: 5, total: 14.95, time: '10:30 AM' },
        { id: 2, customer: 'Jane Smith', item: 'Strawberry Cheesecake', quantity: 2, total: 9.98, time: '11:15 AM' },
        { id: 3, customer: 'Bob Wilson', item: 'Macarons Assortment', quantity: 1, total: 12.99, time: '12:45 PM' },
        { id: 4, customer: 'Alice Johnson', item: 'Red Velvet Cake', quantity: 1, total: 29.99, time: '2:30 PM' },
      ]);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Chart Data
  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sales ($)',
        data: [1200, 1900, 1500, 2200, 1800, 2500, 2100],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const categoryData = {
    labels: Array.from(new Set(sweets.map(s => s.category))),
    datasets: [
      {
        label: 'Stock by Category',
        data: Array.from(new Set(sweets.map(s => s.category))).map(category => 
          sweets.filter(s => s.category === category).reduce((sum, s) => sum + s.quantity, 0)
        ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const lowStockData = {
    labels: sweets.filter(s => s.quantity <= 10).map(s => s.name),
    datasets: [
      {
        label: 'Low Stock Items',
        data: sweets.filter(s => s.quantity <= 10).map(s => s.quantity),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
      },
    ],
  };

  if (loadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}! 👋</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button 
                variant="primary" 
                icon={FaHome}
                className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
              >
                <span className="hidden md:inline">Go to Home</span>
                <span className="md:hidden">Home</span>
              </Button>
            </Link>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sweets</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalSweets}</h3>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <FaArrowUp className="mr-1" /> 12% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaCandyCane className="text-2xl text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</h3>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <FaArrowUp className="mr-1" /> 8% from last week
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FaMoneyBillWave className="text-2xl text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <FaArrowUp className="mr-1" /> 5 new today
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaUsers className="text-2xl text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.lowStockItems}</h3>
              <p className="text-sm text-red-600 flex items-center mt-1">
                <FaArrowDown className="mr-1" /> Needs attention
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <FaExclamationTriangle className="text-2xl text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Sales</h3>
            <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-64">
            <Line 
              data={salesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Category Distribution</h3>
            <span className="text-sm text-gray-600">{stats.activeCategories} Categories</span>
          </div>
          <div className="h-64">
            <Pie 
              data={categoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right' as const,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Purchases */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Purchases</h3>
            <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700 text-sm">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {purchase.customer}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {purchase.item}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {purchase.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      ${purchase.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {purchase.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <Link to="/admin/sweets">
              <Button variant="primary" fullWidth>
                <FaShoppingBag className="mr-2" />
                Manage Sweets
              </Button>
            </Link>
            
            <Link to="/admin/add-sweet">
              <Button variant="outline" fullWidth>
                <FaCandyCane className="mr-2" />
                Add New Sweet
              </Button>
            </Link>
            
            <Link to="/admin/users">
              <Button variant="outline" fullWidth>
                <FaUsers className="mr-2" />
                Manage Users
              </Button>
            </Link>
            
            <Link to="/admin/orders">
              <Button variant="outline" fullWidth>
                <FaHistory className="mr-2" />
                View Orders
              </Button>
            </Link>
            
            <Link to="/admin/low-stock">
              <Button variant="outline" fullWidth className="text-red-600 border-red-200 hover:bg-red-50">
                <FaExclamationTriangle className="mr-2" />
                Low Stock Alert ({stats.lowStockItems})
              </Button>
            </Link>

            {/* Home Button in Quick Actions */}
            <Link to="/">
              <Button variant="outline" fullWidth className="mt-4 border-primary-500 text-primary-600 hover:bg-primary-50">
                <FaHome className="mr-2" />
                Go to Home Page
              </Button>
            </Link>
          </div>

          {/* Low Stock Items */}
          {sweets.filter(s => s.quantity <= 10).length > 0 && (
            <div className="mt-8">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Low Stock Items</h4>
              <div className="space-y-3">
                {sweets
                  .filter(s => s.quantity <= 10)
                  .slice(0, 3)
                  .map(sweet => (
                    <div key={sweet.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{sweet.name}</p>
                        <p className="text-sm text-gray-600">{sweet.category}</p>
                      </div>
                      <span className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-full">
                        {sweet.quantity} left
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Low Stock Chart */}
      {lowStockData.labels.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Items</h3>
            <span className="text-sm text-red-600 font-semibold">
              {lowStockData.labels.length} items need restocking
            </span>
          </div>
          <div className="h-64">
            <Bar 
              data={lowStockData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y' as const,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 5,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Additional Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Today's Sales</p>
              <h3 className="text-2xl font-bold">${stats.todaySales.toFixed(2)}</h3>
            </div>
            <FaMoneyBillWave className="text-3xl opacity-75" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Average Order Value</p>
              <h3 className="text-2xl font-bold">$24.50</h3>
            </div>
            <FaChartBar className="text-3xl opacity-75" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Conversion Rate</p>
              <h3 className="text-2xl font-bold">3.2%</h3>
            </div>
            <FaUsers className="text-3xl opacity-75" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;