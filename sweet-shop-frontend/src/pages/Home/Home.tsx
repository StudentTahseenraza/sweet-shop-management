import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingBag, FaCandyCane, FaBirthdayCake, FaCookieBite } from 'react-icons/fa';
import SweetCard from '../../components/sweets/SweetCard/SweetCard';
import SearchBar from '../../components/common/SearchBar/SearchBar';
import Button from '../../components/common/Button/Button';
import { useSweets } from '../../contexts/SweetContext';
import { useAuth } from '../../contexts/AuthContext';

const Home: React.FC = () => {
  const { sweets, loading, categories, searchSweets } = useSweets();
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const featuredSweets = sweets.slice(0, 6);
  const popularCategories = categories.slice(0, 4);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-amber-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-20">
        <div className="absolute inset-0 bg-black/10" />
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

            {!isAuthenticated && (
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
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 glass-effect rounded-2xl">
              <div className="text-4xl font-bold gradient-text mb-2">{sweets.length}</div>
              <div className="text-gray-600">Sweet Varieties</div>
            </div>
            <div className="text-center p-6 glass-effect rounded-2xl">
              <div className="text-4xl font-bold gradient-text mb-2">{categories.length}</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div className="text-center p-6 glass-effect rounded-2xl">
              <div className="text-4xl font-bold gradient-text mb-2">
                {sweets.reduce((acc, sweet) => acc + sweet.quantity, 0)}
              </div>
              <div className="text-gray-600">In Stock</div>
            </div>
            <div className="text-center p-6 glass-effect rounded-2xl">
              <div className="text-4xl font-bold gradient-text mb-2">100%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
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
            return (
              <div
                key={category}
                className="card p-6 text-center hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="text-3xl text-primary-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">{category}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  {sweets.filter(s => s.category === category).length} items
                </p>
              </div>
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
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredSweets.map((sweet) => (
                <SweetCard key={sweet.id} sweet={sweet} />
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
                {user?.role === 'ADMIN' && (
                  <Link to="/admin">
                    <Button variant="secondary" size="lg">Admin Panel</Button>
                  </Link>
                )}
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