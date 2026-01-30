import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  Printer,
  HelpCircle,
} from 'lucide-react';
import { useToast } from '../UI/ToastProvider.jsx';
import { ordersAPI } from '../../services/api.js';

const OrderDetailSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-8 bg-zinc-800 rounded w-48" />
    <div className="bg-zinc-800 rounded-2xl p-6 space-y-6">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-6 bg-zinc-700 rounded w-32" />
          <div className="h-4 bg-zinc-700 rounded w-24" />
        </div>
        <div className="h-8 bg-zinc-700 rounded w-24" />
      </div>
      <div className="h-20 bg-zinc-700 rounded-xl" />
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 bg-zinc-700 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getOrderById(orderId);
      setOrder(data);
    } catch (error) {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const formatOrderNumber = (id) => {
    return id?.slice(-8).toUpperCase() || 'N/A';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusStep = (status) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = steps.indexOf(status?.toLowerCase());
    return currentIndex >= 0 ? currentIndex : 0;
  };

  const statusSteps = [
    { icon: Clock, label: 'Order Placed', description: 'Your order has been confirmed' },
    { icon: Package, label: 'Processing', description: 'Items are being prepared' },
    { icon: Truck, label: 'Shipped', description: 'Package is on the way' },
    { icon: CheckCircle, label: 'Delivered', description: 'Package has arrived' },
  ];

  if (loading) {
    return <OrderDetailSkeleton />;
  }

  if (!order) {
    return (
      <div className="max-w-4xl text-center py-16">
        <p className="text-zinc-400 mb-4">Order not found</p>
        <Link
          to="/account/orders"
          className="inline-flex items-center gap-2 text-white hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to orders
        </Link>
      </div>
    );
  }

  const currentStep = getStatusStep(order.status);
  const items = order.orderItems || order.items || [];

  return (
    <div className="max-w-4xl">
      {/* Back Button */}
      <Link
        to="/account/orders"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to orders
      </Link>

      {/* Order Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Order #{formatOrderNumber(order._id)}
          </h1>
          <p className="text-zinc-400">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <a
            href="mailto:support@curate.com"
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Help
          </a>
        </div>
      </div>

      {/* Tracking Progress */}
      {order.status?.toLowerCase() !== 'cancelled' && (
        <div className="bg-zinc-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-6">Order Status</h2>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-zinc-700 hidden sm:block">
              <div
                className="h-full bg-white transition-all"
                style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
              />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStep;
                const isCurrent = index === currentStep;
                const Icon = step.icon;

                return (
                  <div key={step.label} className="relative flex flex-col items-center text-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 z-10 transition-colors ${
                        isCompleted
                          ? isCurrent
                            ? 'bg-white text-zinc-900'
                            : 'bg-green-500/20 text-green-400'
                          : 'bg-zinc-700 text-zinc-500'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className={`font-medium ${isCompleted ? 'text-white' : 'text-zinc-500'}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Order Items ({items.length})
            </h2>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-zinc-900/50 rounded-xl"
                >
                  <div className="w-20 h-20 bg-zinc-700 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{item.name}</h3>
                    <p className="text-zinc-400 text-sm mt-1">
                      Qty: {item.qty || item.quantity}
                    </p>
                    {item.size && (
                      <p className="text-zinc-400 text-sm">Size: {item.size}</p>
                    )}
                    {item.color && (
                      <p className="text-zinc-400 text-sm">Color: {item.color}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">
                      ₹{((item.price || 0) * (item.qty || item.quantity || 1)).toFixed(2)}
                    </p>
                    <p className="text-zinc-400 text-sm">
                      ₹{item.price?.toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Payment Info */}
          <div className="bg-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-zinc-400" />
              <h2 className="text-lg font-semibold text-white">Payment</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Method</span>
                <span className="text-white">{order.paymentMethod || 'Card'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Status</span>
                <span
                  className={`font-medium ${
                    order.isPaid ? 'text-green-400' : 'text-yellow-400'
                  }`}
                >
                  {order.isPaid ? 'Paid' : 'Pending'}
                </span>
              </div>
              {order.paidAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Paid on</span>
                  <span className="text-white">{formatDate(order.paidAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-zinc-400" />
              <h2 className="text-lg font-semibold text-white">Shipping</h2>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-white font-medium">{order.shippingAddress?.name}</p>
              <p className="text-zinc-400">{order.shippingAddress?.address}</p>
              <p className="text-zinc-400">
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                {order.shippingAddress?.postalCode}
              </p>
              <p className="text-zinc-400">Phone: {order.shippingAddress?.phone}</p>
              {order.isDelivered && (
                <p className="text-green-400 mt-3">
                  Delivered on {formatDate(order.deliveredAt)}
                </p>
              )}
            </div>
          </div>

          {/* Order Totals */}
          <div className="bg-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Subtotal</span>
                <span className="text-white">₹{order.itemsPrice?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Shipping</span>
                <span className="text-white">
                  {order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice?.toFixed(2)}`}
                </span>
              </div>
              {order.taxPrice > 0 && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">Tax</span>
                  <span className="text-white">₹{order.taxPrice?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-400">Discount</span>
                <span className="text-green-400">-₹{order.discount?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="border-t border-zinc-700 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-white font-bold text-lg">
                    ₹{order.totalPrice?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
