import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Mail, ArrowRight, Home, ShoppingBag } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../features/cart/cartSlice.jsx';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const orderId = searchParams.get('orderId') || 'Unknown';
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(clearCart());

    const fetchOrderDetails = async () => {
      if (orderId && orderId !== 'Unknown') {
        try {
          const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            headers: {
              ...(localStorage.getItem('token') && {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              }),
            },
          });

          if (response.ok) {
            const data = await response.json();
            setOrderDetails(data);
          }
        } catch (error) {
          console.error('Failed to fetch order details:', error);
        }
      }
      setLoading(false);
    };

    fetchOrderDetails();
  }, [orderId, dispatch]);

  const orderNumber = orderId !== 'Unknown' 
    ? orderId.slice(-8).toUpperCase() 
    : 'N/A';

  return (
    <div className="min-h-screen bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Order Confirmed!
          </h1>
          <p className="text-gray-400 text-lg">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Card */}
        <div className="bg-zinc-800 rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Order Details</h2>
              <p className="text-sm text-gray-400">Order #{orderNumber}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-zinc-700">
              <span className="text-gray-400">Order Status</span>
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                Confirmed
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-zinc-700">
              <span className="text-gray-400">Payment Status</span>
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                Paid
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-zinc-700">
              <span className="text-gray-400">Order Date</span>
              <span className="text-white">
                {new Date().toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            {orderDetails?.totalPrice && (
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-400">Total Amount</span>
                <span className="text-white font-bold text-lg">
                  ₹{orderDetails.totalPrice.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Email Notification */}
        <div className="bg-zinc-800 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Confirmation Email Sent</h3>
              <p className="text-gray-400 text-sm">
                We've sent a confirmation email with your order details and tracking information.
                Please check your inbox.
              </p>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-zinc-800 rounded-2xl p-6 mb-6">
          <h3 className="text-white font-bold mb-4">What's Next?</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span>Your order is being processed</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span>You'll receive shipping updates via email</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span>Estimated delivery: 3-5 business days</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <Link
            to="/shop"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-zinc-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Support Link */}
        <p className="text-center text-gray-500 text-sm mt-8">
          Need help?{' '}
          <a href="mailto:support@curate.com" className="text-white hover:underline">
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
