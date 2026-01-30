import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UpperBorder from "../Micro/UpperBorder.jsx";
import ProductCard from "../Main/ProductCard.jsx";
import { fetchProducts } from '../../features/products/productsSlice.jsx';
import { ProductGridSkeleton } from '../UI/Skeletons.jsx';
import { useToast } from '../UI/ToastProvider.jsx';
import { AlertCircle, RefreshCw } from 'lucide-react';

const NewArrivalsSection = () => {
  const dispatch = useDispatch();
  const { success, error: showError } = useToast();
  const { products, loading, error } = useSelector(state => state.products);

  useEffect(() => {
    // Fetch products when component mounts
    dispatch(fetchProducts({ pageNumber: 1 }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showError('Failed to load products. Please try again.', 5000);
    }
  }, [error, showError]);

  const handleRetry = () => {
    dispatch(fetchProducts({ pageNumber: 1 }));
    success('Retrying...', 2000);
  };

  if (loading) {
    return (
      <div>
        <UpperBorder title="New Arrivals" buttonTitle="Discover"/>
        <ProductGridSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <UpperBorder title="New Arrivals" buttonTitle="Discover"/>
        <div className="flex flex-col justify-center items-center px-20 py-20">
          <div className="bg-zinc-800 rounded-2xl p-8 text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Failed to Load</h3>
            <p className="text-zinc-400 mb-6">Unable to fetch products. Please check your connection.</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 rounded-full font-semibold hover:bg-zinc-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UpperBorder title="New Arrivals" buttonTitle="Discover"/>
      <div className="flex flex-wrap px-20 py-10 gap-10">
        {products && products.length > 0 ? (
          products.slice(0, 6).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="w-full text-center py-20">
            <div className="bg-zinc-800 rounded-2xl p-8 inline-block">
              <p className="text-zinc-400 text-xl">No products available</p>
              <p className="text-zinc-500 text-sm mt-2">Check back later for new arrivals</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrivalsSection;
