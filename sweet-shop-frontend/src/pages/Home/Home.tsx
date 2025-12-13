import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingBag, FaCandyCane, FaBirthdayCake, FaCookieBite, FaChartLine, FaUsers, FaStar } from 'react-icons/fa';
import SweetCard from '../../components/sweets/SweetCard/SweetCard';
import SearchBar from '../../components/common/SearchBar/SearchBar';
import Button from '../../components/common/Button/Button';
import { useSweets } from '../../contexts/SweetContext';
import { useAuth } from '../../contexts/AuthContext';
import { checkApiHealth } from '../../services/api';

const Home: React.FC = () => {
  const { sweets, loading, categories, searchSweets } = useSweets();
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [apiStatus, setApiStatus] = useState<boolean | null>(null);

  const featuredSweets = sweets.slice(0, 6);
  const popularCategories = categories.slice(0, 4);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkApiHealth();
      setApiStatus(status);
    };
    checkStatus();
  }, []);

  const handleSearch = () => {
    searchSweets({ name: searchTerm });
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'chocolate': return FaCandyCane;
      case 'cake': return FaBirthdayCake;
      case 'cookie': return FaCookieBite;
      default: return FaShoppingBag;
    }
  };

  // Calculate statistics
  const totalStock = sweets.reduce((acc, sweet) => acc + sweet.quantity, 0);
  const availableCategories = new Set(sweets.map(s => s.category)).size;
  const averagePrice = sweets.length > 0 
    ? (sweets.reduce((acc, sweet) => acc + sweet.price, 0) / sweets.length).toFixed(2)
    : '0.00';

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-amber-50">
      {/* API Status Indicator */}
      {apiStatus === false && (
        <div className="bg-red-500 text-white py-2 px-4 text-center">
          ⚠️ Backend server is not responding. Some features may be limited.
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 text-white py-20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-64 -translate-x-64" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-display mb-6 animate-float">
              Welcome to Sweet Heaven 🍬
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Discover the most delicious sweets and candies. Freshly made with love and care.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1">
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  onSearch={handleSearch}
                  placeholder="Search for sweets..."
                  className="bg-white/20 backdrop-blur-sm border-white/30"
                />
              </div>
              <Button 
                variant="secondary" 
                size="lg"
                icon={FaSearch}
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>

            {!isAuthenticated ? (
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link to="/register">
                  <Button variant="outline" size="lg">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="mt-10">
                <p className="text-lg mb-4">Welcome back, {user?.name}! 👋</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/sweets">
                    <Button variant="outline" size="lg">
                      Browse Sweets
                    </Button>
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link to="/admin">
                      <Button variant="secondary" size="lg">
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-white/50 backdrop-blur-sm -mt-1">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 glass-effect rounded-2xl hover:scale-105 transition-transform duration-300">
              <FaShoppingBag className="text-3xl text-primary-600 mx-auto mb-3" />
              <div className="text-4xl font-bold gradient-text mb-2">{sweets.length}</div>
              <div className="text-gray-600">Sweet Varieties</div>
            </div>
            <div className="text-center p-6 glass-effect rounded-2xl hover:scale-105 transition-transform duration-300">
              <FaChartLine className="text-3xl text-secondary-600 mx-auto mb-3" />
              <div className="text-4xl font-bold gradient-text mb-2">{availableCategories}</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div className="text-center p-6 glass-effect rounded-2xl hover:scale-105 transition-transform duration-300">
              <FaUsers className="text-3xl text-primary-600 mx-auto mb-3" />
              <div className="text-4xl font-bold gradient-text mb-2">{totalStock}</div>
              <div className="text-gray-600">In Stock</div>
            </div>
            <div className="text-center p-6 glass-effect rounded-2xl hover:scale-105 transition-transform duration-300">
              <FaStar className="text-3xl text-secondary-600 mx-auto mb-3" />
              <div className="text-4xl font-bold gradient-text mb-2">${averagePrice}</div>
              <div className="text-gray-600">Avg. Price</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 container mx-auto px-4">
        <h2 className="text-4xl font-display text-center mb-12 gradient-text">
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {popularCategories.map((category) => {
            const Icon = getCategoryIcon(category);
            const categorySweets = sweets.filter(s => s.category === category);
            return (
              <Link 
                key={category}
                to={`/sweets?category=${category}`}
                className="card p-6 text-center hover:shadow-2xl transition-all duration-300 cursor-pointer group block"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="text-3xl text-primary-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">{category}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  {categorySweets.length} {categorySweets.length === 1 ? 'item' : 'items'}
                </p>
                {categorySweets.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    From ${Math.min(...categorySweets.map(s => s.price)).toFixed(2)}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Featured Sweets */}
      <div className="py-16 bg-gradient-to-b from-white to-pink-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-display gradient-text">Featured Sweets</h2>
              <p className="text-gray-600 mt-2">Most popular sweet treats</p>
            </div>
            <Link to="/sweets">
              <Button variant="outline">View All Sweets</Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : featuredSweets.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🍬</div>
              <h3 className="text-2xl font-display text-gray-700 mb-2">No sweets available</h3>
              <p className="text-gray-600">Check back soon for delicious treats!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredSweets.map((sweet) => (
                <SweetCard 
                  key={sweet.id} 
                  sweet={sweet}
                  onViewDetails={() => window.location.href = `/sweets/${sweet.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-display mb-6">
            Ready to Satisfy Your Sweet Tooth?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Join thousands of happy customers enjoying our delicious sweets
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/sweets">
                  <Button variant="outline" size="lg">Browse Sweets</Button>
                </Link>
                <Link to="/profile">
                  <Button variant="secondary" size="lg">My Profile</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="outline" size="lg">Create Account</Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg">Sign In Now</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;