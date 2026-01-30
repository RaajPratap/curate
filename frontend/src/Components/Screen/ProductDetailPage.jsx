import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../features/products/productsSlice.jsx';
import { addItemToCart } from '../../features/cart/cartSlice.jsx';
import { useToast } from '../UI/ToastProvider.jsx';
import Header from '../Main/Header.jsx';
import { ProductDetailSkeleton } from '../UI/Skeletons.jsx';
import { 
  ChevronLeft, 
  ShoppingBag, 
  Heart, 
  Share2, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw,
  Minus,
  Plus
} from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { success, error: showError } = useToast();
  
  const { currentProduct: product, loading, error } = useSelector(
    state => state.products
  );
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (product.countInStock > 0) {
      for (let i = 0; i < quantity; i++) {
        dispatch(addItemToCart(product));
      }
      success(`${quantity} x ${product.name} added to cart!`, 3000);
    } else {
      showError('This product is out of stock', 3000);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!', 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Curate!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      success('Link copied to clipboard!', 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900">
        <Header />
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-zinc-900">
        <Header />
        <div className="flex flex-col justify-center items-center h-[70vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
            <p className="text-zinc-400 mb-6">The product you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 rounded-full font-semibold hover:bg-zinc-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images = product.image ? [
    product.image,
    'https://placehold.co/600x600/2d3748/ffffff?text=View+2',
    'https://placehold.co/600x600/4a5568/ffffff?text=View+3',
    'https://placehold.co/600x600/718096/ffffff?text=View+4',
  ] : ['https://placehold.co/600x600/1a202c/ffffff?text=No+Image'];

  return (
    <div className="min-h-screen bg-zinc-900">
      <Header />
      
      <div className="pt-[10vw] px-4 sm:px-6 lg:px-8 xl:px-12 pb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
          <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/shop')} className="hover:text-white transition-colors">Shop</button>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-zinc-800 rounded-2xl overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-white' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-zinc-400 text-sm mb-2">{product.category}</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-zinc-400">
                  {product.numReviews || 0} reviews
                </span>
              </div>

              <p className="text-3xl font-bold text-white">₹{product.price}</p>
            </div>

            <p className="text-zinc-300 leading-relaxed">{product.description}</p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-zinc-800">
              <div className="text-center">
                <Truck className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">Secure Payment</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">Easy Returns</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-white font-medium">Quantity:</span>
              <div className="flex items-center gap-3 bg-zinc-800 rounded-full px-4 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="text-white hover:text-zinc-300 disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-white font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                  disabled={quantity >= product.countInStock}
                  className="text-white hover:text-zinc-300 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className={`text-sm ${product.countInStock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold transition-all ${
                  product.countInStock === 0
                    ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                    : 'bg-white text-zinc-900 hover:bg-zinc-200'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              
              <button
                onClick={handleWishlist}
                className={`p-4 rounded-full border-2 transition-all ${
                  isWishlisted
                    ? 'border-red-500 text-red-500'
                    : 'border-zinc-600 text-zinc-400 hover:border-white hover:text-white'
                }`}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={handleShare}
                className="p-4 rounded-full border-2 border-zinc-600 text-zinc-400 hover:border-white hover:text-white transition-all"
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;