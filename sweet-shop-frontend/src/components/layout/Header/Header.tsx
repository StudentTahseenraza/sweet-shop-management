import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaUser, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaHome,
  FaStore,
  FaCog,
  FaCandyCane
} from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../common/Button/Button';

const Header: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 glass-effect shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <FaCandyCane className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold gradient-text">
                Sweet Shop
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Delicious Treats</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg hover:bg-primary-50 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <FaHome className="inline mr-2" />
              Home
            </Link>
            <Link
              to="/sweets"
              className="px-4 py-2 rounded-lg hover:bg-primary-50 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <FaStore className="inline mr-2" />
              Sweets
            </Link>
            
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 rounded-lg hover:bg-secondary-50 text-gray-700 hover:text-secondary-600 transition-colors"
              >
                <FaCog className="inline mr-2" />
                Admin
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Cart Icon */}
                <Link
                  to="/cart"
                  className="relative p-2 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <FaShoppingCart className="text-xl text-gray-700" />
                  <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <FaUser className="text-white text-sm" />
                    </div>
                    <span className="hidden md:inline text-gray-700 font-medium">
                      {user?.name.split(' ')[0]}
                    </span>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border py-1 z-10">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-secondary-100 text-secondary-800 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <FaSignOutAlt className="inline mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <FaTimes className="text-xl text-gray-700" />
              ) : (
                <FaBars className="text-xl text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="px-4 py-2 rounded-lg hover:bg-primary-50 text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaHome className="inline mr-2" />
                Home
              </Link>
              <Link
                to="/sweets"
                className="px-4 py-2 rounded-lg hover:bg-primary-50 text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaStore className="inline mr-2" />
                Sweets
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-lg hover:bg-secondary-50 text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaCog className="inline mr-2" />
                  Admin
                </Link>
              )}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg hover:bg-primary-50 text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-lg bg-primary-500 text-white text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;