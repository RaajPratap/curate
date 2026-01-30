import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../features/cart/cartSlice.jsx'
import { useToast } from '../UI/ToastProvider.jsx'
import { Plus, ShoppingBag } from 'lucide-react'

// --- The Main Product Card Component ---
const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { success, error } = useToast();

  const handleQuickAdd = () => {
    if (product.countInStock > 0) {
      dispatch(addItemToCart(product));
      success(`${product.name} added to cart!`, 3000)
    } else {
      error(`${product.name} is out of stock`, 3000)
    }
  };

  // Extract product data with fallbacks for backend structure
  const { 
    name, 
    price, 
    image, 
    countInStock = 0,
    rating = 0,
    numReviews = 0 
  } = product;

  // Create images array - use single image from backend or fallback images
  const images = image ? [
    image,
    'https://placehold.co/600x600/2d3748/ffffff?text=View+2',
    'https://placehold.co/600x600/4a5568/ffffff?text=View+3',
    'https://placehold.co/600x600/718096/ffffff?text=View+4',
  ] : [
    'https://placehold.co/600x600/1a202c/ffffff?text=No+Image',
  ];

  const imageCount = images.length;

  // Total time in milliseconds for one full cycle through all images.
  const CYCLE_DURATION = 10000; // 10 seconds

  // State to track the current active image and the overall progress percentage.
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // This effect sets up a timer to update the progress bar and active image.
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev >= 100 ? 0 : prev + 0.5; // Increment progress

        // Determine which image should be active based on the progress.
        // The progress is divided into segments, one for each image.
        const imageSegmentWidth = 100 / imageCount;
        const newActiveIndex = Math.min(
          Math.floor(newProgress / imageSegmentWidth),
          imageCount - 1
        );
        
        setActiveImageIndex(newActiveIndex);

        return newProgress;
      });
    }, CYCLE_DURATION / 200); // Update progress every 50ms for a smooth animation

    // Cleanup function to clear the interval when the component unmounts.
    return () => clearInterval(interval);
  }, [imageCount]); // Dependency array ensures this effect runs only once.

  return (
    <div className="w-full max-w-sm bg-zinc-800 text-white rounded-2xl shadow-2xl overflow-hidden font-sans">
      
      {/* Segmented Progress Bar Container */}
      <div className="relative top-0 left-0 flex w-full items-center gap-1.5 px-4 pt-3">
        {images.map((_, index) => {
          const imageSegmentWidth = 100 / imageCount;
          
          // Check if the current segment is completed
          const isCompleted = index < activeImageIndex;
          
          // Check if the current segment is the active one
          const isActive = index === activeImageIndex;

          // Calculate the fill percentage for the active segment
          const segmentStartProgress = index * imageSegmentWidth;
          const progressInSegment = ((progress - segmentStartProgress) / imageSegmentWidth) * 100;
          
          return (
            <div key={index} className="h-[3px] flex-1 bg-zinc-700 rounded-full overflow-hidden">
              {/* This inner div represents the fill of the progress bar segment */}
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

      {/* Image Gallery and Quick Add Button */}
      <div className="relative aspect-square mt-2">
        {/* This container holds the images and clips them. */}
        <div className="w-full h-full overflow-hidden">
          {/* This inner div acts as a "film strip" that moves vertically. */}
          <div
            className="w-full h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateY(-${activeImageIndex * 100}%)` }}
          >
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`${name} - view ${index + 1}`}
                className="w-full h-full object-cover"
                // Handle image loading errors with a fallback
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src = 'https://placehold.co/600x600/1a202c/ff0000?text=Error'; 
                }}
              />
            ))}
          </div>
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-auto">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleQuickAdd();
            }}
            disabled={countInStock === 0}
            className={`flex items-center justify-center px-6 py-3 bg-zinc-900 bg-opacity-50 backdrop-blur-sm text-white rounded-full text-sm font-semibold transition-all duration-300 shadow-lg ${
              countInStock === 0 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-opacity-70 cursor-pointer'
            }`}
          >
            <Plus className="w-4 h-4 mr-2" />
            {countInStock === 0 ? 'Out of Stock' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-6 pt-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-100 mb-1">{name}</h3>
            {rating > 0 && (
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-400 text-sm ml-2">
                  ({numReviews} {numReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}
            <p className="text-sm text-gray-400">
              {countInStock > 0 ? `${countInStock} in stock` : 'Out of stock'}
            </p>
          </div>
          <p className="text-lg font-medium text-gray-300">₹{price}</p>
        </div>
      </div>
    </div>
  );
};


// --- Main App Component ---

export default ProductCard;
