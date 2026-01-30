import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ChevronRight,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '../UI/ToastProvider.jsx';
import { ordersAPI } from '../../services/api.js';

const OrdersSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 bg-zinc-800 rounded w-48" />
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <div className="h-5 bg-zinc-700 rounded w-32" />
              <div className="h-4 bg-zinc-700 rounded w-24" />
            </div>
            <div className="h-6 bg-zinc-700 rounded w-24" />
          </div>
          <div className="h-16 bg-zinc-700 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

const EmptyOrders = () => (
  <div className="text-center py-16">
    <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
      <ShoppingBag className="w-12 h-12 text-zinc-500" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
    <p className="text-zinc-400 mb-6 max-w-sm mx-auto">
      You haven't placed any orders yet. Start shopping to see your orders here.
    </p>
    <Link
      to="/shop"
      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
    >
      <ShoppingBag className="w-5 h-5" />
      Start Shopping
    </Link>
  </div>
);

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return <CheckCircle className="w-5 h-5" />;
    case 'shipped':
    case 'in transit':
      return <Truck className="w-5 h-5" />;
    case 'processing':
      return <Clock className="w-5 h-5" />;
    case 'pending':
      return <Package className="w-5 h-5" />;
    case 'cancelled':
    case 'failed':
      return <AlertCircle className="w-5 h-5" />;
    default:
      return <Package className="w-5 h-5" />;
  }
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'bg-green-500/20 text-green-400';
    case 'shipped':
    case 'in transit':
      return 'bg-blue-500/20 text-blue-400';
    case 'processing':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'pending':
      return 'bg-zinc-500/20 text-zinc-400';
    case 'cancelled':
    case 'failed':
      return 'bg-red-500/20 text-red-400';
    default:
      return 'bg-zinc-500/20 text-zinc-400';
  }
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getOrders();
      setOrders(data.orders || data || []);
    } catch (error) {
      toast.error('Failed to load orders');
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

  if (loading) {
    return <OrdersSkeleton />;
  }

  if (!orders.length) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>
        <EmptyOrders />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/account/orders/${order._id}`}
            className="block bg-zinc-800 rounded-2xl p-6 hover:bg-zinc-800/80 transition-colors"
          >
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Package className="w-5 h-5 text-zinc-400" />
                  <span className="text-white font-semibold">
                    Order #{formatOrderNumber(order._id)}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm ml-8">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status || 'Processing'}</span>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="flex items-center gap-4 py-4 border-y border-zinc-700/50">
              <div className="flex -space-x-2">
                {(order.orderItems || order.items || []).slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    className="w-12 h-12 rounded-lg bg-zinc-700 border-2 border-zinc-800 overflow-hidden"
                  >
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
                ))}
                {(order.orderItems || order.items || []).length > 3 && (
                  <div className="w-12 h-12 rounded-lg bg-zinc-700 border-2 border-zinc-800 flex items-center justify-center text-xs text-zinc-400 font-medium">
                    +{(order.orderItems || order.items || []).length - 3}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-zinc-400 text-sm">
                  {(order.orderItems || order.items || []).length} item
                  {(order.orderItems || order.items || []).length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-zinc-400 text-sm">Total</p>
                <p className="text-white font-bold text-lg">
                  ₹{order.totalPrice?.toFixed(2) || order.total?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>

            {/* View Details Link */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-zinc-500 text-sm">
                {order.isPaid ? 'Payment completed' : 'Payment pending'}
              </span>
              <span className="flex items-center gap-1 text-white font-medium">
                View Details
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
