import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart } from 'lucide-react';
import { addToWishlist, removeFromWishlist } from '../../features/wishlist/wishlistSlice.jsx';
import { useToast } from '../UI/ToastProvider.jsx';

const WishlistButton = ({ 
  productId, 
  size = 'md',
  variant = 'default',
  className = '',
  wishlistItemId = null // Optional: pass if you already know the wishlist ID
}) => {
  const dispatch = useDispatch();
  const { error: showError } = useToast();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { wishlistedProductIds, items, loading } = useSelector((state) => state.wishlist);
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if product is in wishlist
  useEffect(() => {
    const inWishlist = wishlistedProductIds.includes(productId);
    setIsWishlisted(inWishlist);
  }, [wishlistedProductIds, productId]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showError('Please sign in to add items to your wishlist', 3000);
      return;
    }

    setIsLoading(true);

    try {
      if (isWishlisted) {
        // Find the wishlist item ID
        const wishlistItem = items.find(item => item.product?._id === productId);
        const targetId = wishlistItemId || wishlistItem?._id;
        
        if (targetId) {
          await dispatch(removeFromWishlist(targetId)).unwrap();
          setIsWishlisted(false);
        }
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
        setIsWishlisted(true);
      }
    } catch {
      // Error is handled by the slice
    } finally {
      setIsLoading(false);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  // Variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return isWishlisted
          ? 'border-red-500 text-red-500 bg-red-500/10'
          : 'border-zinc-600 text-zinc-400 hover:border-white hover:text-white bg-transparent';
      case 'filled':
        return isWishlisted
          ? 'bg-red-500 text-white border-transparent'
          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border-transparent';
      case 'ghost':
        return isWishlisted
          ? 'bg-transparent text-red-500 border-transparent'
          : 'bg-transparent text-zinc-400 hover:text-white border-transparent';
      default: // default with border
        return isWishlisted
          ? 'border-red-500 text-red-500 bg-red-500/10'
          : 'border-zinc-600 text-zinc-400 hover:border-white hover:text-white bg-zinc-900/50';
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading || loading}
      className={`
        ${sizeClasses[size]}
        ${getVariantClasses()}
        rounded-full border-2
        flex items-center justify-center
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        className={`
          ${iconSizes[size]}
          ${isWishlisted ? 'fill-current' : ''}
          transition-transform duration-200
          ${isLoading ? 'animate-pulse' : ''}
        `} 
      />
    </button>
  );
};

export default WishlistButton;
