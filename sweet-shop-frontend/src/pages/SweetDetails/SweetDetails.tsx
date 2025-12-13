import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaShoppingCart, FaArrowLeft, FaEdit, FaTrash, FaTruck, FaClock } from 'react-icons/fa';
import Button from '../../components/common/Button/Button';
import Modal from '../../components/common/Modal/Modal';
import SweetForm from '../../components/sweets/SweetForm/SweetForm';
import { useSweets } from '../../contexts/SweetContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useCart } from '../../contexts/CartContext';


const SweetDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSweetById, purchaseSweet, deleteSweet, refreshSweets } = useSweets();
  const { isAdmin, isAuthenticated } = useAuth();

  const [sweet, setSweet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [ setPurchasing] = useState(false);
  const { addToCart, getItemQuantity } = useCart();

  useEffect(() => {
    fetchSweet();
  }, [id]);

  const fetchSweet = async () => {
    try {
      setLoading(true);
      if (id) {
        const data = await getSweetById(id);
        setSweet(data);
      }
    } catch (error) {
      toast.error('Failed to load sweet details');
      console.error('Error fetching sweet:', error);
      navigate('/sweets');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase');
      navigate('/login');
      return;
    }

    try {
      setPurchasing(true);
      await purchaseSweet(sweet.id, quantity);
      toast.success(`Purchased ${quantity} ${sweet.name}(s)!`);
      await fetchSweet(); // Refresh sweet data
      setQuantity(1);
    } catch (error) {
      console.error('Purchase failed:', error);
      // Error handled in context
    } finally {
      setPurchasing(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSweet(sweet.id);
      toast.success('Sweet deleted successfully');
      navigate('/sweets');
    } catch (error) {
      console.error('Delete failed:', error);
      // Error handled in context
    }
  };

  const handleAddToCart = () => {
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

    toast.success(`Added ${quantity} ${sweet.name}(s) to cart!`);
    setQuantity(1);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    fetchSweet();
    refreshSweets();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!sweet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Sweet not found</h2>
          <Link to="/sweets">
            <Button variant="primary">Browse Sweets</Button>
          </Link>
        </div>
      </div>
    );
  }

  const maxQuantity = Math.min(sweet.quantity, 10);
  const totalPrice = (sweet.price * quantity).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-amber-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            icon={FaArrowLeft}
            onClick={() => navigate('/sweets')}
          >
            Back to Sweets
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={sweet.imageUrl || 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000'}
                alt={sweet.name}
                className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="flex space-x-4">
                <Button
                  variant="secondary"
                  icon={FaEdit}
                  onClick={() => setShowEditModal(true)}
                  className="flex-1"
                >
                  Edit Sweet
                </Button>
                <Button
                  variant="danger"
                  icon={FaTrash}
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex-1"
                >
                  Delete Sweet
                </Button>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-4xl font-display font-bold text-gray-800">{sweet.name}</h1>
                <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-semibold rounded-full">
                  {sweet.category}
                </span>
              </div>
              <p className="text-3xl font-bold gradient-text">${sweet.price.toFixed(2)}</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600">{sweet.description || 'No description available.'}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaTruck className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Stock</p>
                    <p className={`text-lg font-semibold ${sweet.quantity > 10 ? 'text-green-600' : sweet.quantity > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {sweet.quantity} available
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaClock className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Added</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {new Date(sweet.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Section */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Purchase</h3>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={maxQuantity}
                      value={quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        setQuantity(Math.min(Math.max(1, value), maxQuantity));
                      }}
                      className="w-16 text-center border-0 focus:ring-0"
                    />
                    <button
                      onClick={() => setQuantity(prev => Math.min(maxQuantity, prev + 1))}
                      disabled={quantity >= maxQuantity}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Max: {maxQuantity} {sweet.quantity <= 10 && '(Limited stock)'}
                  </span>
                </div>
              </div>

              {/* Total Price */}
              <div className="mb-6">
                <div className="flex justify-between items-center p-4 bg-primary-50 rounded-lg">
                  <span className="text-gray-700">Total Price</span>
                  <span className="text-2xl font-bold text-primary-600">${totalPrice}</span>
                </div>
              </div>

              {/* Purchase Button */}
              <Button
                variant="primary"
                size="lg"
                icon={FaShoppingCart}
                onClick={handleAddToCart}
                disabled={sweet.quantity === 0 || !isAuthenticated}
                fullWidth
              >
                {!isAuthenticated ? 'Login to Add to Cart' :
                  sweet.quantity === 0 ? 'Out of Stock' :
                    `Add to Cart (${getItemQuantity(sweet.id)} in cart)`}
              </Button>

              {!isAuthenticated && (
                <p className="mt-3 text-sm text-center text-gray-600">
                  <Link to="/login" className="text-primary-600 hover:text-primary-500">
                    Sign in
                  </Link>{' '}
                  to purchase sweets
                </p>
              )}
            </div>

            {/* Related Info */}
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Sweet Info</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-gray-800">{sweet.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${sweet.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {sweet.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium text-gray-800">
                    {new Date(sweet.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Sweet"
        size="lg"
      >
        <SweetForm
          sweet={sweet}
          onSuccess={handleEditSuccess}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTrash className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete {sweet.name}?
          </h3>
          <p className="text-gray-600 mb-6">
            This sweet will be permanently deleted. This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete Sweet
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SweetDetails;