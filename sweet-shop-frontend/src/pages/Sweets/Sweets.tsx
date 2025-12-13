import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaFilter, FaTimes, FaSearch } from "react-icons/fa";
import SweetCard from "../../components/sweets/SweetCard/SweetCard";
import Button from "../../components/common/Button/Button";
import { useSweets } from "../../contexts/SweetContext";
import { useAuth } from "../../contexts/AuthContext";

const Sweets: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { sweets, loading, categories, searchSweets } = useSweets();
  const { isAdmin } = useAuth();
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get("minPrice") || "",
    max: searchParams.get("maxPrice") || "",
  });
  const [inStock, setInStock] = useState(searchParams.get("inStock") === "true");

  useEffect(() => {
    const params: any = {};
    if (searchTerm) params.q = searchTerm;
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
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setInStock(false);
    searchSweets({});
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
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={showFilters ? "primary" : "outline"}
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
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-6 border-t border-gray-200 space-y-6 animate-fadeIn">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Category</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`px-4 py-2 rounded-lg ${selectedCategory === "" ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg ${selectedCategory === category ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Price Range</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Min Price ($)</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="input-field"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Max Price ($)</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="input-field"
                      placeholder="100"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="inStock" className="ml-2 text-gray-700">
                  Show only in-stock items
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{sweets.length}</span> sweets
          </p>
          {isAdmin && (
            <Button variant="secondary">
              Add New Sweet
            </Button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-20 card">
            <div className="text-6xl mb-4">🍬</div>
            <h3 className="text-2xl font-display text-gray-700 mb-2">No sweets found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search filters</p>
            <Button onClick={handleReset}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <>
            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sweets.map((sweet) => (
                <SweetCard
                  key={sweet.id}
                  sweet={sweet}
                  onViewDetails={() => window.location.href = `/sweets/${sweet.id}`}
                />
              ))}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg">
                Load More Sweets
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sweets;
