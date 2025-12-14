import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaFilter, FaTimes, FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import SweetCard from '../../components/sweets/SweetCard/SweetCard';
import Button from '../../components/common/Button/Button';
import Modal from '../../components/common/Modal/Modal';
import SweetForm from '../../components/sweets/SweetForm/SweetForm';
import { useSweets } from '../../contexts/SweetContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useCart } from '../../contexts/CartContext';

const Sweets: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { sweets, loading, categories, searchSweets, deleteSweet, refreshSweets } = useSweets();
  const { isAdmin, isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState(searchParams.get('name') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || '',
  });
  const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true');

  useEffect(() => {
    const params: any = {};
    if (searchParams.get('name')) params.name = searchParams.get('name');
    if (searchParams.get('category')) params.category = searchParams.get('category');
    if (searchParams.get('minPrice')) params.minPrice = Number(searchParams.get('minPrice'));
    if (searchParams.get('maxPrice')) params.maxPrice = Number(searchParams.get('maxPrice'));
    if (searchParams.get('inStock')) params.inStock = searchParams.get('inStock') === 'true';

    if (Object.keys(params).length > 0) {
      searchSweets(params);
    }
  }, []);

  useEffect(() => {
    const params: any = {};
    if (searchTerm) params.name = searchTerm;
    if (selectedCategory) params.category = selectedCategory;
    if (priceRange.min) params.minPrice = priceRange.min;
    if (priceRange.max) params.maxPrice = priceRange.max;
    if (inStock) params.inStock = inStock;

    setSearchParams(params);
  }, [searchTerm, selectedCategory, priceRange, inStock]);

  const handleSearch = () => {
    const params: any = {
      name: searchTerm || undefined,
      category: selectedCategory || undefined,
      minPrice: priceRange.min ? Number(priceRange.min) : undefined,
      maxPrice: priceRange.max ? Number(priceRange.max) : undefined,
      inStock: inStock || undefined,
    };
    searchSweets(params);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setInStock(false);
    setSearchParams({});
    searchSweets({});
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    const params: any = { category };
    if (searchTerm) params.name = searchTerm;
    if (priceRange.min) params.minPrice = priceRange.min;
    if (priceRange.max) params.maxPrice = priceRange.max;
    if (inStock) params.inStock = inStock;

    searchSweets(params);
  };

  const handleViewDetails = (sweetId: string) => {
    navigate(`/sweets/${sweetId}`);
  };

  const handleEdit = (sweet: any) => {
    setEditingSweet(sweet);
    setShowAddModal(true);
  };

  const handleDelete = async (sweetId: string) => {
    try {
      await deleteSweet(sweetId);
      setDeleteConfirm(null);
      toast.success('Sweet deleted successfully!');
    } catch (error) {
      console.error(error);
      // Error handled in context
    }
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    setEditingSweet(null);
    refreshSweets();
  };

  const handleAddToCart = (sweet: any) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    addToCart({
      id: sweet.id,
      name: sweet.name,
      price: sweet.price,
      imageUrl: sweet.imageUrl,
      category: sweet.category,
      maxQuantity: sweet.quantity,
    });

    toast.success(`Added ${sweet.name} to cart!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-amber-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-display gradient-text text-center mb-4">
            Our Sweet Collection
          </h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Discover our delicious range of sweets, candies, and treats.
            Freshly made with love and the finest ingredients.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 card p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search sweets by name..."
                  className="input-field pl-12"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={showFilters ? 'primary' : 'outline'}
                icon={FaFilter}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
              <Button
                variant="primary"
                onClick={handleSearch}
              >
                Search
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
              >
                Reset
              </Button>
              {isAdmin && (
                <Button
                  variant="secondary"
                  icon={FaPlus}
                  onClick={() => setShowAddModal(true)}
                >
                  Add Sweet
                </Button>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-6 border-t border-gray-200 space-y-6 animate-fadeIn">
              {/* Quick Category Filters */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Quick Categories</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategoryClick('')}
                    className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === '' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === category ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Price Range ($)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="input-field"
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="input-field"
                        placeholder="100"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {/* Stock Filter */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Availability</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                        className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-gray-700">Show only in-stock items</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={!inStock}
                        onChange={(e) => setInStock(!e.target.checked)}
                        className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-gray-700">Include out-of-stock</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Apply Filters Button */}
              <div className="flex justify-end">
                <Button onClick={handleSearch} variant="primary">
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <p className="text-gray-600">
              Showing <span className="font-semibold text-primary-600">{sweets.length}</span> sweet{sweets.length !== 1 ? 's' : ''}
              {selectedCategory && (
                <span className="ml-2">
                  in <span className="font-semibold text-secondary-600">{selectedCategory}</span>
                </span>
              )}
            </p>
            {searchTerm && (
              <p className="text-sm text-gray-500">
                Search results for: "{searchTerm}"
              </p>
            )}
          </div>

          {isAdmin && (
            <Button
              variant="secondary"
              icon={FaPlus}
              onClick={() => setShowAddModal(true)}
            >
              Add New Sweet
            </Button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading delicious sweets...</p>
            </div>
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-20 card">
            <div className="text-6xl mb-4">🍬</div>
            <h3 className="text-2xl font-display text-gray-700 mb-2">No sweets found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory || priceRange.min || priceRange.max || inStock
                ? 'Try adjusting your search filters'
                : 'No sweets available yet. Check back soon!'}
            </p>
            <Button onClick={handleReset}>
              {searchTerm || selectedCategory ? 'Reset Filters' : 'Refresh'}
            </Button>
          </div>
        ) : (
          <>
            {/* Category Filter Chips */}
            {categories.length > 0 && (
              <div className="mb-6 overflow-x-auto">
                <div className="flex space-x-2 pb-2">
                  <button
                    onClick={() => handleCategoryClick('')}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${selectedCategory === '' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${selectedCategory === category ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {category} ({sweets.filter(s => s.category === category).length})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sweets.map((sweet) => (
                <div key={sweet.id} className="relative group">
                  <SweetCard
                    sweet={sweet}
                    onViewDetails={() => handleViewDetails(sweet.id)}
                    onAddToCart={() => handleAddToCart(sweet)} // Pass the handler to SweetCard
                  />

                  {/* Admin Actions Overlay */}
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleEdit(sweet)}
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg"
                        title="Edit"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(sweet.id)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        title="Delete"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* No More Results */}
            {sweets.length > 0 && (
              <div className="mt-12 text-center">
                <p className="text-gray-500 mb-4">
                  {sweets.length === 1 ? 'Showing 1 sweet' : `Showing all ${sweets.length} sweets`}
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Back to Top
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Sweet Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingSweet(null);
        }}
        title={editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
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

export default Sweets;