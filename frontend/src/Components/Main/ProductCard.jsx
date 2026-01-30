import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addItemToCart } from '../../features/cart/cartSlice.jsx'
import { useToast } from '../UI/ToastProvider.jsx'
import { WishlistButton } from '../Wishlist/index.js'
import { Plus, Tag } from 'lucide-react'

// --- The Main Product Card Component ---
const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, error } = useToast();

  // Handle both old and new schema structures
  const {
    _id,
    name,
    sku,
    // Support both old single image and new images array
    image,
    images,
    // Support both old simple price and new price object
    price,
    // Support both old countInStock and new inventory object
    countInStock,
    inventory,
    // Support both old rating/numReviews and new ratings object
    rating,
    numReviews,
    ratings,
    // New fields from synthetic data
    tags = [],
    brand,
    isActive = true,
    categoryId,
  } = product;

  // Extract price information (handle both schemas)
  const displayPrice = price?.discounted || price?.base || price || 0;
  const originalPrice = price?.base || price || 0;
  const discountPercent = price?.discountPercent || 0;
  const currency = price?.currency || 'INR';

  // Convert USD to INR if needed (approximate rate: 1 USD = 83 INR)
  const convertToINR = (amount) => {
    if (currency === 'USD') {
      return Math.round(amount * 83);
    }
    return amount;
  };

  const displayPriceINR = convertToINR(displayPrice);
  const originalPriceINR = convertToINR(originalPrice);

  // Extract inventory info (handle both schemas)
  const stockQuantity = inventory?.quantity ?? countInStock ?? 0;
  const lowStockThreshold = inventory?.lowStockThreshold || 10;
  const isAvailable = inventory?.isAvailable ?? stockQuantity > 0;

  // Extract rating info (handle both schemas)
  const avgRating = ratings?.average || rating || 0;
  const reviewCount = ratings?.count || numReviews || 0;

  // Handle images (support both old single image and new images array)
  const getImages = () => {
    if (images && Array.isArray(images) && images.length > 0) {
      // New schema: images array
      const primaryImage = images.find(img => img.isPrimary)?.url || images[0].url;
      return [primaryImage, ...images.slice(1).map(img => img.url)];
    } else if (image) {
      // Old schema: single image string
      return [image];
    }
    return ['https://placehold.co/600x600/1a202c/ffffff?text=No+Image'];
  };

  const productImages = getImages();
  const imageCount = productImages.length;

  const handleQuickAdd = () => {
    if (stockQuantity > 0 && isAvailable) {
      // Add to cart with INR pricing
      const cartProduct = {
        ...product,
        price: displayPriceINR, // Ensure cart uses INR
      };
      dispatch(addItemToCart(cartProduct));
      success(`${name} added to cart!`, 3000);
    } else {
      error(`${name} is out of stock`, 3000);
    }
  };

  // Image carousel state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (imageCount <= 1) return;

    const CYCLE_DURATION = 10000;
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev >= 100 ? 0 : prev + 0.5;
        const imageSegmentWidth = 100 / imageCount;
        const newActiveIndex = Math.min(
          Math.floor(newProgress / imageSegmentWidth),
          imageCount - 1
        );
        setActiveImageIndex(newActiveIndex);
        return newProgress;
      });
    }, CYCLE_DURATION / 200);

    return () => clearInterval(interval);
  }, [imageCount]);

  const handleCardClick = () => {
    navigate(`/product/${_id}`);
  };

  // Show only fashion-related tags
  const fashionTags = tags.filter(tag => 
    ['sale', 'new', 'popular', 'bestseller'].includes(tag)
  );

  if (!isActive) return null; // Don't show inactive products

  return (
    <div 
      onClick={handleCardClick}
      className="w-full max-w-sm bg-zinc-800 text-white rounded-2xl shadow-2xl overflow-hidden font-sans cursor-pointer hover:shadow-3xl transition-shadow relative"
    >
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <div className="absolute top-3 left-3 z-20 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Tag className="w-3 h-3" />
          {discountPercent}% OFF
        </div>
      )}

      {/* Product Tags */}
      {fashionTags.length > 0 && !discountPercent && (
        <div className="absolute top-3 left-3 z-20 flex gap-1">
          {fashionTags.slice(0, 2).map((tag, idx) => (
            <span 
              key={idx}
              className={`px-2 py-1 rounded-full text-xs font-bold ${
                tag === 'sale' ? 'bg-red-500' :
                tag === 'new' ? 'bg-green-500' :
                tag === 'bestseller' ? 'bg-yellow-500' :
                'bg-blue-500'
              } text-white`}
            >
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
      )}
      
      {/* Segmented Progress Bar Container (only if multiple images) */}
      {imageCount > 1 && (
        <div className="relative top-0 left-0 flex w-full items-center gap-1.5 px-4 pt-3">
          {productImages.map((_, index) => {
            const imageSegmentWidth = 100 / imageCount;
            const isCompleted = index < activeImageIndex;
            const isActive = index === activeImageIndex;
            const segmentStartProgress = index * imageSegmentWidth;
            const progressInSegment = ((progress - segmentStartProgress) / imageSegmentWidth) * 100;
            
            return (
              <div key={index} className="h-[3px] flex-1 bg-zinc-700 rounded-full overflow-hidden">
                {(isCompleted || isActive) && (
                  <div
                    className="h-full bg-white rounded-full transition-all duration-150 ease-linear"
                    style={{ width: isCompleted ? '100%' : `${progressInSegment}%` }}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Image Gallery and Quick Add Button */}
      <div className={`relative aspect-square ${imageCount === 1 ? '' : 'mt-2'}`}>
        <div className="w-full h-full overflow-hidden">
          <div
            className="w-full h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateY(-${activeImageIndex * 100}%)` }}
          >
            {productImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`${name} - view ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src = 'https://placehold.co/600x600/1a202c/ff0000?text=Error'; 
                }}
              />
            ))}
          </div>
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-4 right-4 z-10">
          <WishlistButton 
            productId={_id}
            size="md"
            variant="filled"
          />
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-auto">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleQuickAdd();
            }}
            disabled={stockQuantity === 0 || !isAvailable}
            className={`flex items-center justify-center px-6 py-3 bg-zinc-900 bg-opacity-50 backdrop-blur-sm text-white rounded-full text-sm font-semibold transition-all duration-300 shadow-lg ${
              stockQuantity === 0 || !isAvailable
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-opacity-70 cursor-pointer'
            }`}
          >
            <Plus className="w-4 h-4 mr-2" />
            {stockQuantity === 0 || !isAvailable ? 'Out of Stock' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-6 pt-4">
        {/* Brand Name */}
        {brand && (
          <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">{brand}</p>
        )}

        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-100 mb-1 line-clamp-1" title={name}>{name}</h3>
            
            {/* SKU */}
            {sku && (
              <p className="text-xs text-zinc-500 mb-2">SKU: {sku}</p>
            )}

            {/* Rating */}
            {avgRating > 0 && (
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(avgRating) ? 'text-yellow-400' : 'text-gray-600'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-400 text-xs ml-2">
                  ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}

            {/* Stock Status */}
            <p className={`text-xs ${
              stockQuantity === 0 ? 'text-red-400' :
              stockQuantity <= lowStockThreshold ? 'text-orange-400' :
              'text-green-400'
            }`}>
              {stockQuantity === 0 ? 'Out of stock' :
               stockQuantity <= lowStockThreshold ? `Only ${stockQuantity} left!` :
               'In stock'}
            </p>
          </div>

          {/* Price */}
          <div className="text-right">
            {discountPercent > 0 ? (
              <>
                <p className="text-xs text-zinc-500 line-through">₹{originalPriceINR.toLocaleString()}</p>
                <p className="text-lg font-bold text-green-400">₹{displayPriceINR.toLocaleString()}</p>
              </>
            ) : (
              <p className="text-lg font-bold text-gray-300">₹{displayPriceINR.toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
