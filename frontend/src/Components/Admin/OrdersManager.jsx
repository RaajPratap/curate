import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Package,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  Truck,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { fetchAllOrders } from '../../features/admin/adminSlice.jsx';
import { ordersAPI } from '../../services/api.js';
import { useToast } from '../UI/ToastProvider.jsx';

const OrdersManager = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { orders, ordersLoading, error } = useSelector((state) => state.admin);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error, toast]);

  // Status options
  const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      await ordersAPI.updateOrderStatus(orderId, newStatus);
      dispatch(fetchAllOrders());
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'Shipped':
        return <Truck className="w-4 h-4" />;
      case 'Processing':
        return <Clock className="w-4 h-4" />;
      case 'Pending':
        return <Package className="w-4 h-4" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Shipped':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Processing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Pending':
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
      case 'Cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  const formatOrderNumber = (id) => {
    return id?.slice(-8).toUpperCase() || 'N/A';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (ordersLoading && orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-zinc-800 rounded w-48" />
          <div className="h-12 bg-zinc-800 rounded" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-zinc-800 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Orders</h1>
          <p className="text-zinc-400">
            Manage customer orders ({filteredOrders.length} total)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
        <div className="relative sm:w-64">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="">All Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-800 rounded-2xl border border-zinc-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700/50">
                <th className="text-left px-6 py-4 text-zinc-400 font-medium text-sm">Order</th>
                <th className="text-left px-6 py-4 text-zinc-400 font-medium text-sm">Customer</th>
                <th className="text-left px-6 py-4 text-zinc-400 font-medium text-sm">Date</th>
                <th className="text-left px-6 py-4 text-zinc-400 font-medium text-sm">Total</th>
                <th className="text-left px-6 py-4 text-zinc-400 font-medium text-sm">Payment</th>
                <th className="text-left px-6 py-4 text-zinc-400 font-medium text-sm">Status</th>
                <th className="text-right px-6 py-4 text-zinc-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">#{formatOrderNumber(order._id)}</p>
                        <p className="text-zinc-400 text-xs">{order.orderItems?.length || 0} items</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white">{order.user?.name || 'Guest'}</p>
                    <p className="text-zinc-400 text-sm">{order.user?.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-zinc-300">{formatDate(order.createdAt)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white font-semibold">₹{order.totalPrice?.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${order.isPaid ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      disabled={updatingOrder === order._id}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20 ${getStatusColor(order.orderStatus)}`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status} className="bg-zinc-800 text-white">
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No orders found</h3>
            <p className="text-zinc-400">
              {searchTerm || statusFilter
                ? 'Try adjusting your search or filters'
                : 'No orders have been placed yet'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-700/50">
            <p className="text-zinc-400 text-sm">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of{' '}
              {filteredOrders.length} orders
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-zinc-400 text-sm px-3">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700/50">
              <div>
                <h2 className="text-xl font-bold text-white">Order Details</h2>
                <p className="text-zinc-400 text-sm">#{formatOrderNumber(selectedOrder._id)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Status & Payment */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor(selectedOrder.orderStatus)}`}>
                  {getStatusIcon(selectedOrder.orderStatus)}
                  {selectedOrder.orderStatus}
                </span>
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${selectedOrder.isPaid ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {selectedOrder.isPaid ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  {selectedOrder.isPaid ? `Paid on ${formatDate(selectedOrder.paidAt)}` : 'Payment Pending'}
                </span>
              </div>

              {/* Customer Info */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-zinc-400 mb-3">Customer Information</h3>
                <div className="bg-zinc-700/30 rounded-xl p-4">
                  <p className="text-white font-medium">{selectedOrder.user?.name || 'Guest'}</p>
                  <p className="text-zinc-400">{selectedOrder.user?.email}</p>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-zinc-400 mb-3">Shipping Address</h3>
                  <div className="bg-zinc-700/30 rounded-xl p-4">
                    <p className="text-white">{selectedOrder.shippingAddress.address}</p>
                    <p className="text-zinc-400">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                    </p>
                    <p className="text-zinc-400">{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-zinc-400 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {(selectedOrder.orderItems || []).map((item, index) => (
                    <div key={index} className="flex items-center gap-4 bg-zinc-700/30 rounded-xl p-3">
                      <div className="w-16 h-16 bg-zinc-600 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-8 h-8 text-zinc-500 m-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-zinc-400 text-sm">Qty: {item.qty}</p>
                      </div>
                      <p className="text-white font-semibold">₹{(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-zinc-700/50 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span>₹{(selectedOrder.totalPrice - selectedOrder.taxPrice - selectedOrder.shippingPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Tax</span>
                    <span>₹{selectedOrder.taxPrice?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping</span>
                    <span>₹{selectedOrder.shippingPrice?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-zinc-700/50">
                    <span>Total</span>
                    <span>₹{selectedOrder.totalPrice?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManager;
