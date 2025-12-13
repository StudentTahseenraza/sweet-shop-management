import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaTrash, 
  FaPlus, 
  FaMinus, 
  FaArrowLeft, 
  FaCreditCard,
  FaTruck,
  FaShieldAlt,
  FaTag
} from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button/Button';
import Modal from '../../components/common/Modal/Modal';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { 
    items, 
    totalItems, 
    totalPrice, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();
  
  const { isAuthenticated } = useAuth();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);

  const shippingCost = totalPrice > 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08; // 8% tax
  const grandTotal = totalPrice + shippingCost + tax;

  const handleQuantityChange = (id: string, change: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      const newQuantity = item.quantity + change;
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setShowCheckoutModal(true);
  };

  const handlePlaceOrder = () => {
    // In a real app, you would process payment and create order
    toast.success('Order placed successfully!');
    clearCart();
    setShowCheckoutModal(false);
    navigate('/profile');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-amber-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link to="/sweets">
                <Button variant="outline" icon={FaArrowLeft}>
                  Continue Shopping
                </Button>
              </Link>
            </div>

            <div className="card p-8 text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                <FaShoppingCart className="text-6xl text-primary-500" />
              </div>
              
              <h1 className="text-4xl font-display gradient-text mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any sweets to your cart yet. Start shopping to fill it up with delicious treats!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/sweets">
                  <Button variant="primary" size="lg">
                    Browse Sweets
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" size="lg">
                    Go to Home
                  </Button>
                </Link>
              </div>

              {/* Popular Categories */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Popular Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Chocolate', 'Cake', 'Cookie', 'Pastry'].map((category) => (
                    <Link
                      key={category}
                      to={`/sweets?category=${category}`}
                      className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
                    >
                      <div className="text-3xl mb-2">🍫</div>
                      <span className="font-medium text-gray-800">{category}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-amber-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-display gradient-text mb-2">Shopping Cart</h1>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <p className="text-gray-600">
                {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowClearConfirm(true)}
                  icon={FaTrash}
                >
                  Clear Cart
                </Button>
                <Link to="/sweets">
                  <Button variant="outline" icon={FaArrowLeft}>
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="card overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-gray-50 border-b">
                  <div className="col-span-6 font-semibold text-gray-700">Product</div>
                  <div className="col-span-2 font-semibold text-gray-700">Price</div>
                  <div className="col-span-3 font-semibold text-gray-700">Quantity</div>
                  <div className="col-span-1 font-semibold text-gray-700">Total</div>
                </div>

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Product Info */}
                      <div className="col-span-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.imageUrl || 'https://images.unsplash.com/photo-1563805042-7684c019e1cb'}
                              alt={item.name}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                              <Link to={`/sweets/${item.id}`}>
                                {item.name}
                              </Link>
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Max: {item.maxQuantity} in stock
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2">
                        <div className="text-lg font-bold text-gray-900">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-span-3">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaMinus className="text-gray-600" />
                          </button>
                          
                          <input
                            type="number"
                            min="1"
                            max={item.maxQuantity}
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 h-10 text-center border-t border-b border-gray-300 focus:ring-0 focus:border-primary-500"
                          />
                          
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            disabled={item.quantity >= item.maxQuantity}
                            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaPlus className="text-gray-600" />
                          </button>
                          
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-4 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove item"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="col-span-1">
                        <div className="text-lg font-bold text-primary-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="mt-6 card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cart Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className={shippingCost === 0 ? 'text-green-600 font-semibold' : 'font-semibold'}>
                      {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold text-gray-900">Grand Total</span>
                      <span className="font-bold text-primary-600 text-xl">
                        ${grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                {totalPrice < 50 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <FaTruck className="inline mr-2" />
                      Add ${(50 - totalPrice).toFixed(2)} more to get <strong>FREE shipping</strong>!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Checkout Panel */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({totalItems})</span>
                    <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className={shippingCost === 0 ? 'text-green-600 font-semibold' : ''}>
                      {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-primary-600">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  icon={FaCreditCard}
                  onClick={handleCheckout}
                  fullWidth
                  className="mt-6"
                >
                  Proceed to Checkout
                </Button>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    or{' '}
                    <Link to="/sweets" className="text-primary-600 hover:text-primary-700 font-medium">
                      continue shopping
                    </Link>
                  </p>
                </div>
              </div>

              {/* Security Badges */}
              <div className="card p-6">
                <div className="flex items-center justify-center space-x-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FaShieldAlt className="text-2xl text-green-600" />
                    </div>
                    <p className="text-xs text-gray-600">Secure Payment</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FaTruck className="text-2xl text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-600">Fast Delivery</p>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="card p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Have a Promo Code?</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 input-field"
                  />
                  <Button variant="outline" icon={FaTag}>
                    Apply
                  </Button>
                </div>
              </div>

              {/* Help Section */}
              <div className="card p-6 bg-gradient-to-r from-primary-50 to-secondary-50">
                <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Our support team is here to help with your order.
                </p>
                <Link to="/contact">
                  <Button variant="outline" size="sm" fullWidth>
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Recently Viewed */}
          <div className="mt-12">
            <h3 className="text-2xl font-display gradient-text mb-6">You Might Also Like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="w-full h-40 bg-gray-200 rounded-lg mb-3"></div>
                  <h4 className="font-medium text-gray-900">Featured Sweet {item}</h4>
                  <p className="text-sm text-gray-600">From $12.99</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      <Modal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Clear Cart"
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTrash className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Clear Shopping Cart?
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to remove all items from your cart? This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowClearConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                clearCart();
                setShowClearConfirm(false);
              }}
            >
              Clear Cart
            </Button>
          </div>
        </div>
      </Modal>

      {/* Checkout Modal */}
      <Modal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        title="Checkout"
        size="lg"
      >
        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex justify-between items-center mb-6">
            <div className={`flex items-center ${checkoutStep >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${checkoutStep >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span>Shipping</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200"></div>
            <div className={`flex items-center ${checkoutStep >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${checkoutStep >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span>Payment</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200"></div>
            <div className={`flex items-center ${checkoutStep >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${checkoutStep >= 3 ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span>Confirm</span>
            </div>
          </div>

          {checkoutStep === 1 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Shipping Address</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="input-field" />
                  <input type="text" placeholder="Last Name" className="input-field" />
                </div>
                <input type="text" placeholder="Address" className="input-field" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="City" className="input-field" />
                  <input type="text" placeholder="Zip Code" className="input-field" />
                </div>
                <select className="input-field">
                  <option>Select Country</option>
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                </select>
              </div>
            </div>
          )}

          {checkoutStep === 2 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Payment Method</h4>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <label className="flex items-center">
                    <input type="radio" name="payment" className="mr-3" defaultChecked />
                    <div>
                      <div className="font-medium">Credit Card</div>
                      <div className="text-sm text-gray-600">Pay with your credit card</div>
                    </div>
                  </label>
                </div>
                <div className="border rounded-lg p-4">
                  <label className="flex items-center">
                    <input type="radio" name="payment" className="mr-3" />
                    <div>
                      <div className="font-medium">PayPal</div>
                      <div className="text-sm text-gray-600">Pay with your PayPal account</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {checkoutStep === 3 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Order Summary</h4>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary-600">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            {checkoutStep > 1 ? (
              <Button
                variant="outline"
                onClick={() => setCheckoutStep(checkoutStep - 1)}
              >
                Back
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowCheckoutModal(false)}
              >
                Cancel
              </Button>
            )}
            
            {checkoutStep < 3 ? (
              <Button
                variant="primary"
                onClick={() => setCheckoutStep(checkoutStep + 1)}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;