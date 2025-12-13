import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
      />
      <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300" />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
        >
          ×
        </button>
      )}
      <button
        onClick={onSearch}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-md transition-colors"
      >
        <FaSearch />
      </button>
    </div>
  );
};

export default SearchBar;
