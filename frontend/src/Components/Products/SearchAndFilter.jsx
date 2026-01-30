import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useToast } from '../UI/ToastProvider.jsx';

const SearchAndFilter = ({ onSearch, initialKeyword = '' }) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    sortBy: 'newest',
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { info } = useToast();

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'accessories', label: 'Accessories' },
  ];

  const priceRanges = [
    { value: '', label: 'All Prices' },
    { value: '0-1000', label: 'Under ₹1,000' },
    { value: '1000-5000', label: '₹1,000 - ₹5,000' },
    { value: '5000-10000', label: '₹5,000 - ₹10,000' },
    { value: '10000+', label: 'Over ₹10,000' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch({ keyword, ...filters });
      info(`Searching for "${keyword}"`, 2000);
    }
  };

  const handleClear = () => {
    setKeyword('');
    setFilters({
      category: '',
      priceRange: '',
      sortBy: 'newest',
    });
    onSearch({ keyword: '', category: '', priceRange: '', sortBy: 'newest' });
  };

  const hasActiveFilters = keyword || filters.category || filters.priceRange || filters.sortBy !== 'newest';

  return (
    <div className="w-full">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center bg-zinc-800 rounded-full overflow-hidden">
          <div className="flex-1 flex items-center px-4">
            <Search className="w-5 h-5 text-zinc-400 mr-3" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent py-3 text-white placeholder-zinc-500 focus:outline-none"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword('')}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 border-l border-zinc-700 flex items-center gap-2 transition-colors ${
              showFilters || hasActiveFilters ? 'text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-white rounded-full"></span>
            )}
          </button>
          
          <button
            type="submit"
            className="px-6 py-3 bg-white text-zinc-900 font-semibold hover:bg-zinc-200 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mt-4 p-4 bg-zinc-800 rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full bg-zinc-900 text-white rounded-lg px-3 py-2 border border-zinc-700 focus:outline-none focus:border-white"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Price Range
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="w-full bg-zinc-900 text-white rounded-lg px-3 py-2 border border-zinc-700 focus:outline-none focus:border-white"
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full bg-zinc-900 text-white rounded-lg px-3 py-2 border border-zinc-700 focus:outline-none focus:border-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleClear}
                className="text-sm text-zinc-400 hover:text-white flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
