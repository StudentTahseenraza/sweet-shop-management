import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaBoxOpen,
  FaExclamationTriangle,
  FaChartBar,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEye,
  FaArchive,
  FaRedo,
  FaTags
} from 'react-icons/fa';
import Button from '../../components/common/Button/Button';
import Modal from '../../components/common/Modal/Modal';
import SweetForm from '../../components/sweets/SweetForm/SweetForm';
import { useSweets } from '../../contexts/SweetContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Sweet {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminSweetsProps {
  showLowStock?: boolean;
}

const AdminSweets: React.FC<AdminSweetsProps> = ({ showLowStock = false }) => {
  const { sweets, loading, categories, deleteSweet, refreshSweets } = useSweets();
  const { isAdmin } = useAuth();
  
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState<keyof Sweet>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewingSweet, setViewingSweet] = useState<Sweet | null>(null);
  const [activeOnly, setActiveOnly] = useState(true);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    outOfStock: 0,
    lowStock: 0,
    totalValue: 0,
    categories: 0,
  });

  useEffect(() => {
    if (sweets.length > 0) {
      calculateStats();
      filterAndSortSweets();
    }
  }, [sweets, searchTerm, selectedCategory, stockFilter, sortBy, sortOrder, activeOnly, showLowStock]);

  const calculateStats = () => {
    const activeSweets = sweets.filter(s => s.isActive);
    const outOfStock = activeSweets.filter(s => s.quantity === 0).length;
    const lowStock = activeSweets.filter(s => s.quantity > 0 && s.quantity <= 10).length;
    const totalValue = activeSweets.reduce((sum, sweet) => sum + (sweet.price * sweet.quantity), 0);
    const uniqueCategories = new Set(activeSweets.map(s => s.category)).size;

    setStats({
      total: sweets.length,
      active: activeSweets.length,
      outOfStock,
      lowStock,
      totalValue,
      categories: uniqueCategories,
    });
  };

  const filterAndSortSweets = () => {
    let filtered = [...sweets];

    // Apply low stock filter if enabled
    if (showLowStock) {
      filtered = filtered.filter(s => s.quantity > 0 && s.quantity <= 10);
    }

    // Apply active filter
    if (activeOnly) {
      filtered = filtered.filter(s => s.isActive);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term) ||
        s.category.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

    // Apply stock filter
    if (stockFilter === 'inStock') {
      filtered = filtered.filter(s => s.quantity > 0);
    } else if (stockFilter === 'outOfStock') {
      filtered = filtered.filter(s => s.quantity === 0);
    } else if (stockFilter === 'lowStock') {
      filtered = filtered.filter(s => s.quantity > 0 && s.quantity <= 10);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredSweets(filtered);
  };

  const handleSort = (field: keyof Sweet) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: keyof Sweet) => {
    if (sortBy !== field) return <FaSort className="ml-1 text-gray-400" />;
    return sortOrder === 'asc' 
      ? <FaSortUp className="ml-1 text-blue-500" /> 
      : <FaSortDown className="ml-1 text-blue-500" />;
  };

  const handleDelete = async (sweetId: string) => {
    try {
      await deleteSweet(sweetId);
      setDeleteConfirm(null);
      toast.success('Sweet deleted successfully!');
      refreshSweets();
    } catch (error) {
      toast.error('Failed to delete sweet');
    }
  };

  const handleToggleActive = async (sweet: Sweet) => {
    try {
      // In real app, call API to update sweet
      toast.success(`Sweet ${sweet.isActive ? 'deactivated' : 'activated'}!`);
      refreshSweets();
    } catch (error) {
      toast.error('Failed to update sweet status');
    }
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    setEditingSweet(null);
    refreshSweets();
    toast.success(editingSweet ? 'Sweet updated successfully!' : 'Sweet added successfully!');
  };

  const handleRestock = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setShowAddModal(true);
  };

  const getStockStatusColor = (quantity: number) => {
    if (quantity === 0) return 'bg-red-100 text-red-800';
    if (quantity <= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStockStatusText = (quantity: number) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= 10) return 'Low Stock';
    return 'In Stock';
  };

  const handleExport = () => {
    // Export functionality
    toast.success('Export started!');
  };

  const handleBulkAction = (action: string) => {
    // Bulk action functionality
    toast.info(`Bulk ${action} action performed`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {showLowStock ? 'Low Stock Alert' : 'Sweet Management'}
          </h1>
          <p className="text-gray-600">
            {showLowStock 
              ? `Manage ${stats.lowStock} low stock items` 
              : 'Manage all sweets in your inventory'}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={handleExport}
          >
            Export Inventory
          </Button>
          <Button 
            variant="primary" 
            icon={FaPlus}
            onClick={() => setShowAddModal(true)}
          >
            Add New Sweet
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sweets</p>
              <h3 className="text-xl font-bold text-gray-900">{stats.total}</h3>
            </div>
            <FaBoxOpen className="text-2xl text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <h3 className="text-xl font-bold text-gray-900">{stats.active}</h3>
            </div>
            <FaChartBar className="text-2xl text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <h3 className="text-xl font-bold text-gray-900">{stats.outOfStock}</h3>
            </div>
            <FaExclamationTriangle className="text-2xl text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <h3 className="text-xl font-bold text-gray-900">{stats.lowStock}</h3>
            </div>
            <FaExclamationTriangle className="text-2xl text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <h3 className="text-xl font-bold text-gray-900">{stats.categories}</h3>
            </div>
            <FaTags className="text-2xl text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <h3 className="text-xl font-bold text-gray-900">${stats.totalValue.toFixed(2)}</h3>
            </div>
            <FaChartBar className="text-2xl text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search sweets by name, description, or category..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Stock Status</option>
              <option value="inStock">In Stock</option>
              <option value="outOfStock">Out of Stock</option>
              <option value="lowStock">Low Stock (&lt;= 10)</option>
            </select>
          </div>
        </div>

        {/* Additional Filters */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(e) => setActiveOnly(e.target.checked)}
              className="h-4 w-4 text-primary-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Show Active Only</span>
          </label>

          <div className="flex space-x-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setStockFilter('all');
                setActiveOnly(true);
              }}
            >
              Clear Filters
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={FaFilter}
            >
              More Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-gray-700">
            Showing <span className="font-semibold">{filteredSweets.length}</span> of{' '}
            <span className="font-semibold">{sweets.length}</span> sweets
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              onChange={(e) => handleBulkAction(e.target.value)}
              defaultValue=""
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
            >
              <option value="" disabled>Bulk Actions</option>
              <option value="activate">Activate Selected</option>
              <option value="deactivate">Deactivate Selected</option>
              <option value="delete">Delete Selected</option>
              <option value="export">Export Selected</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshSweets()}
              icon={FaRedo}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Sweets Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    Category
                    {getSortIcon('category')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center">
                    Price
                    {getSortIcon('price')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('quantity')}
                >
                  <div className="flex items-center">
                    Stock
                    {getSortIcon('quantity')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('isActive')}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon('isActive')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSweets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FaBoxOpen className="text-4xl mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900">No sweets found</h3>
                      <p className="mt-1 text-gray-600">
                        {searchTerm || selectedCategory !== 'all' || stockFilter !== 'all'
                          ? 'Try adjusting your search filters'
                          : 'No sweets available yet. Add your first sweet!'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSweets.map((sweet) => (
                  <tr 
                    key={sweet.id} 
                    className={`hover:bg-gray-50 ${!sweet.isActive ? 'bg-gray-50 opacity-75' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={sweet.imageUrl || 'https://images.unsplash.com/photo-1563805042-7684c019e1cb'}
                            alt={sweet.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{sweet.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {sweet.description || 'No description'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {sweet.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        ${sweet.price.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStockStatusColor(sweet.quantity)}`}>
                          {getStockStatusText(sweet.quantity)}
                        </span>
                        <span className="ml-2 text-sm text-gray-600">
                          ({sweet.quantity} units)
                        </span>
                        {sweet.quantity <= 10 && sweet.quantity > 0 && (
                          <FaExclamationTriangle className="ml-2 text-yellow-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        sweet.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {sweet.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setViewingSweet(sweet)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => {
                            setEditingSweet(sweet);
                            setShowAddModal(true);
                          }}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        {sweet.quantity <= 10 && (
                          <button
                            onClick={() => handleRestock(sweet)}
                            className="text-yellow-600 hover:text-yellow-900 p-1"
                            title="Restock"
                          >
                            <FaRedo />
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleActive(sweet)}
                          className="text-purple-600 hover:text-purple-900 p-1"
                          title={sweet.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <FaArchive />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(sweet.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredSweets.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-semibold">1</span> to{' '}
                <span className="font-semibold">{Math.min(filteredSweets.length, 10)}</span> of{' '}
                <span className="font-semibold">{filteredSweets.length}</span> sweets
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Previous</Button>
                <span className="px-3 py-1 text-sm">Page 1 of 1</span>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      {showLowStock && stats.lowStock > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Low Stock Alert</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  You have <strong>{stats.lowStock} items</strong> with low stock (10 or fewer units). 
                  Consider restocking these items to avoid running out.
                </p>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Navigate to restock page or show restock modal
                      toast.info('Restock all low stock items');
                    }}
                  >
                    Restock All Low Stock Items
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Sweet Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingSweet(null);
        }}
        title={editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
        size="lg"
      >
        <SweetForm
          sweet={editingSweet}
          onSuccess={handleAddSuccess}
          onCancel={() => {
            setShowAddModal(false);
            setEditingSweet(null);
          }}
        />
      </Modal>

      {/* View Sweet Modal */}
      <Modal
        isOpen={!!viewingSweet}
        onClose={() => setViewingSweet(null)}
        title="Sweet Details"
        size="lg"
      >
        {viewingSweet && (
          <div className="space-y-6">
            <div className="flex items-start space-x-6">
              <img
                src={viewingSweet.imageUrl || 'https://images.unsplash.com/photo-1563805042-7684c019e1cb'}
                alt={viewingSweet.name}
                className="w-48 h-48 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">{viewingSweet.name}</h3>
                <p className="text-gray-600 mt-2">{viewingSweet.description}</p>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-semibold">{viewingSweet.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-semibold text-green-600">${viewingSweet.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Stock</p>
                    <p className={`font-semibold ${
                      viewingSweet.quantity === 0 ? 'text-red-600' :
                      viewingSweet.quantity <= 10 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {viewingSweet.quantity} units
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`font-semibold ${
                      viewingSweet.isActive ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {viewingSweet.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Additional Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Created</p>
                  <p>{new Date(viewingSweet.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p>{new Date(viewingSweet.updatedAt).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Inventory Value</p>
                  <p className="font-bold text-lg">
                    ${(viewingSweet.price * viewingSweet.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingSweet(viewingSweet);
                  setViewingSweet(null);
                  setShowAddModal(true);
                }}
              >
                Edit Sweet
              </Button>
              <Button
                variant="primary"
                onClick={() => setViewingSweet(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTrash className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Sweet
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this sweet? This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminSweets;