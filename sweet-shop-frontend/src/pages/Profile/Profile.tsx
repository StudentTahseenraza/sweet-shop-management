import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaCalendar, FaEdit, FaSave, FaTimes, FaShoppingBag, FaHistory } from 'react-icons/fa';
import Button from '../../components/common/Button/Button';
import { useAuth } from '../../contexts/AuthContext';
// import { sweetService } from '../../services/sweet.service';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  // const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      // Here you would call an API to update the user profile
      // For now, we'll just update the local state
      const updatedUser = { ...user, ...formData };
      updateUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-amber-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-display gradient-text">My Profile</h1>
            <p className="text-gray-600">Manage your account and view your activity</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Card */}
              <div className="card p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <FaUser className="text-2xl text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                      <p className="text-gray-600">{user?.email}</p>
                      <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${user?.role === 'ADMIN' ? 'bg-secondary-100 text-secondary-800' : 'bg-primary-100 text-primary-800'}`}>
                        {user?.role === 'ADMIN' ? 'Admin' : 'Customer'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        icon={FaEdit}
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          icon={FaTimes}
                          onClick={handleCancel}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          icon={FaSave}
                          onClick={handleSave}
                          isLoading={loading}
                        >
                          Save
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Edit Form */}
                {isEditing && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">0</div>
                    <div className="text-sm text-gray-600">Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">$0.00</div>
                    <div className="text-sm text-gray-600">Total Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">0</div>
                    <div className="text-sm text-gray-600">Favorites</div>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Account Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaUser className="text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Member Since</div>
                      <div className="font-medium">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaEnvelope className="text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Email Verified</div>
                      <div className="font-medium text-green-600">Verified</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaCalendar className="text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Last Updated</div>
                      <div className="font-medium">
                        {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Actions */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    icon={FaShoppingBag}
                    fullWidth
                    onClick={() => window.location.href = '/sweets'}
                  >
                    Browse Sweets
                  </Button>
                  <Button
                    variant="outline"
                    icon={FaHistory}
                    fullWidth
                    onClick={() => window.location.href = '/orders'}
                  >
                    Order History
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleLogout}
                    fullWidth
                  >
                    Sign Out
                  </Button>
                </div>
              </div>

              {/* Account Status */}
              <div className="card p-6 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                <h3 className="text-lg font-semibold mb-2">Account Status</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{user?.role === 'ADMIN' ? 'Admin' : 'Standard'}</div>
                    <div className="text-sm opacity-90">Account Type</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">Active</div>
                    <div className="text-sm opacity-90">Status</div>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Contact our support team for assistance with your account.
                </p>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => window.location.href = '/contact'}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;