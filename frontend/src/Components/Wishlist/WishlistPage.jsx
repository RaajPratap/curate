import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchWishlist, 
  removeFromWishlist, 
  clearWishlist 
} from '../../features/wishlist/wishlistSlice.jsx';
import { addItemToCart } from '../../features/cart/cartSlice.jsx';
import { useToast } from '../UI/ToastProvider.jsx';
import Header from '../Main/Header.jsx';
import { 
  Heart, 
  Trash2, 
  ShoppingBag, 
  Share2, 
  ArrowRight,
  X,
  Package
} from 'lucide-react';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  
  const { items, loading, count } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = (wishlistId, productName) => {
    dispatch(removeFromWishlist(wishlistId));
    success(`${productName} removed from wishlist`, 2000);
  };

  const handleAddToCart = (product) => {
    if (product.countInStock > 0) {
      dispatch(addItemToCart(product));
      success(`${product.name} added to cart!`, 3000);
    } else {
      showError(`${product.name} is out of stock`, 3000);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'My Curate Wishlist',
      text: `Check out my wishlist with ${count} items on Curate!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
    } catch {
      // User cancelled
    }
    } else {
      navigator.clipboard.writeText(window.location.href);
      success('Wishlist link copied to clipboard!', 2000);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      dispatch(clearWishlist());
      success('Wishlist cleared', 2000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-900">
        <Header />
        <div className="pt-[10vw] px-4 sm:px-6 lg:px-8 xl:px-12 pb-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Heart className="w-16 h-16 text-zinc-600 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Please Sign In</h2>
            <p className="text-zinc-400 mb-6">Sign in to view and manage your wishlist</p>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-white text-zinc-900 rounded-full font-semibold hover:bg-zinc-200 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <Header />
      
      <div className="pt-[10vw] px-4 sm:px-6 lg:px-8 xl:px-12 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Wishlist</h1>
            <p className="text-zinc-400">
              {count} {count === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          
          <div className="flex gap-3">
            {count > 0 && (
              <>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 text-white border border-zinc-600 rounded-full hover:border-white transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2 text-red-400 border border-red-500/30 rounded-full hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear All</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-zinc-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-zinc-700" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-zinc-700 rounded w-3/4" />
                  <div className="h-4 bg-zinc-700 rounded w-1/2" />
                  <div className="flex justify-between">
                    <div className="h-6 bg-zinc-700 rounded w-20" />
                    <div className="h-10 bg-zinc-700 rounded-full w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && count === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-zinc-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Your wishlist is empty</h2>
            <p className="text-zinc-400 mb-8 text-center max-w-md">
              Save your favorite items to your wishlist and they'll appear here. 
              You can add them to your cart anytime!
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="flex items-center gap-2 px-8 py-4 bg-white text-zinc-900 rounded-full font-semibold hover:bg-zinc-200 transition-colors"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Wishlist Grid */}
        {!loading && count > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => {
              const product = item.product;
              if (!product) return null;

              return (
                <div 
                  key={item._id}
                  className="bg-zinc-800 rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-300"
                >
                  {/* Image */}
                  <div 
                    className="relative aspect-square overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <img
                      src={product.image || 'https://placehold.co/600x600/1a202c/ffffff?text=No+Image'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item._id, product.name);
                      }}
                      className="absolute top-3 right-3 p-2 bg-zinc-900/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Out of Stock Badge */}
                    {product.countInStock === 0 && (
                      <div className="absolute inset-0 bg-zinc-900/80 flex items-center justify-center">
                        <span className="px-4 py-2 bg-zinc-800 text-zinc-400 rounded-full text-sm font-medium">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                      {product.brand}
                    </p>
                    <h3 
                      className="text-lg font-semibold text-white mb-2 line-clamp-1 cursor-pointer hover:text-zinc-300 transition-colors"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    {product.rating > 0 && (
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-sm">
                              {i < Math.floor(product.rating) ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span className="text-zinc-500 text-xs">
                          ({product.numReviews || 0})
                        </span>
                      </div>
                    )}

                    {/* Price & Actions */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xl font-bold text-white">₹{product.price}</p>
                      
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.countInStock === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          product.countInStock === 0
                            ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                            : 'bg-white text-zinc-900 hover:bg-zinc-200'
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span className="hidden sm:inline">
                          {product.countInStock === 0 ? 'Out of Stock' : 'Add'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Continue Shopping */}
        {!loading && count > 0 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
