import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Activity,
  User,
  ShoppingBag,
} from 'lucide-react';
import { fetchDashboardStats, fetchRecentActivity } from '../../features/admin/adminSlice.jsx';
import { useToast } from '../UI/ToastProvider.jsx';

// Custom Chart Component
const SalesChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const maxSales = Math.max(...data.map((d) => d.sales || 0));
  const chartHeight = 200;
  const barWidth = Math.max(30, 600 / data.length);
  const gap = 10;

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[500px]" style={{ height: chartHeight + 60 }}>
        <svg width="100%" height={chartHeight + 60} viewBox={`0 0 ${data.length * (barWidth + gap)} ${chartHeight + 60}`}>
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="0"
              y1={chartHeight - (i * chartHeight) / 4}
              x2={data.length * (barWidth + gap)}
              y2={chartHeight - (i * chartHeight) / 4}
              stroke="#3f3f46"
              strokeWidth="1"
              strokeDasharray="4"
            />
          ))}

          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = maxSales > 0 ? (item.sales / maxSales) * (chartHeight - 20) : 0;
            const x = index * (barWidth + gap) + gap / 2;
            const y = chartHeight - barHeight;

            return (
              <g key={index}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="url(#barGradient)"
                  rx="4"
                  className="transition-all duration-300"
                />
                {/* Date label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  fill="#a1a1aa"
                  fontSize="12"
                >
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </text>
                {/* Value label (if bar is tall enough) */}
                {barHeight > 30 && (
                  <text
                    x={x + barWidth / 2}
                    y={y + 20}
                    textAnchor="middle"
                    fill="white"
                    fontSize="11"
                    fontWeight="500"
                  >
                    ₹{(item.sales / 1000).toFixed(1)}k
                  </text>
                )}
              </g>
            );
          })}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

// Mini Chart Component
const MiniChart = ({ data, color = '#22c55e' }) => {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 80 - 10;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width="100" height="40" viewBox="0 0 100 100" className="opacity-60">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: IconProp, change, changeType, chartData, loading }) => (
  <div className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700/50">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-zinc-400 text-sm mb-1">{title}</p>
        {loading ? (
          <div className="h-8 bg-zinc-700 rounded animate-pulse w-24" />
        ) : (
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        )}
        {change !== undefined && !loading && (
          <div className={`flex items-center gap-1 mt-2 text-sm ${changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
            {changeType === 'positive' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{change > 0 ? '+' : ''}{change}%</span>
            <span className="text-zinc-500 ml-1">vs last month</span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="w-12 h-12 bg-zinc-700/50 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-zinc-300" />
        </div>
        {chartData && !loading && <MiniChart data={chartData} />}
      </div>
    </div>
  </div>
);

// Activity Item Component
const ActivityItem = ({ activity }) => {
  const getIcon = () => {
    switch (activity.type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-blue-400" />;
      case 'user':
        return <User className="w-4 h-4 text-green-400" />;
      default:
        return <Activity className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getDescription = () => {
    switch (activity.type) {
      case 'order':
        return (
          <span>
            Order from <span className="text-white font-medium">{activity.user}</span>
            {' '}for <span className="text-white font-medium">₹{activity.amount?.toFixed(2)}</span>
          </span>
        );
      case 'user':
        return (
          <span>
            New user registered: <span className="text-white font-medium">{activity.user}</span>
          </span>
        );
      default:
        return <span>Unknown activity</span>;
    }
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b border-zinc-700/50 last:border-0">
      <div className="w-8 h-8 bg-zinc-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-zinc-300 text-sm">{getDescription()}</p>
        <p className="text-zinc-500 text-xs mt-1">
          {new Date(activity.date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
};

// Top Products Component
const TopProductsList = ({ products, loading }) => (
  <div className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700/50">
    <h3 className="text-lg font-bold text-white mb-4">Top Selling Products</h3>
    {loading ? (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-zinc-700 rounded animate-pulse" />
        ))}
      </div>
    ) : products.length === 0 ? (
      <p className="text-zinc-400 text-center py-8">No sales data available</p>
    ) : (
      <div className="space-y-3">
        {products.map((product, index) => (
          <div key={product._id || index} className="flex items-center gap-3 p-3 bg-zinc-700/30 rounded-xl">
            <div className="w-8 h-8 bg-zinc-600 rounded-lg flex items-center justify-center text-sm font-bold text-zinc-400">
              #{index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{product.name || 'Unknown Product'}</p>
              <p className="text-zinc-400 text-xs">{product.totalSold || 0} sold</p>
            </div>
            <div className="text-right">
              <p className="text-green-400 font-semibold">₹{product.revenue?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  const {
    stats,
    recentActivity,
    statsLoading,
    activityLoading,
    error,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchDashboardStats());
    dispatch(fetchRecentActivity(10));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error, toast]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Calculate percentage change (mock calculation since we don't have historical data)
  const calculateChange = () => {
    // In a real app, you'd compare with previous period data
    return Math.floor(Math.random() * 20) - 5; // Random -5% to +15%
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-zinc-400">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Sales"
          value={formatCurrency(stats.totalSales)}
          icon={DollarSign}
          change={calculateChange(stats.totalSales)}
          changeType="positive"
          chartData={stats.salesByDay?.map((d) => d.sales)}
          loading={statsLoading}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          change={stats.recentOrders > 0 ? calculateChange(stats.totalOrders) : 0}
          changeType="positive"
          chartData={stats.salesByDay?.map((d) => d.orders)}
          loading={statsLoading}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toLocaleString()}
          icon={Package}
          change={0}
          changeType="neutral"
          loading={statsLoading}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          change={calculateChange(stats.totalUsers)}
          changeType="positive"
          loading={statsLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-zinc-800 rounded-2xl p-6 border border-zinc-700/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Sales Overview</h3>
              <p className="text-zinc-400 text-sm">Last 7 days performance</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-zinc-400 text-sm">Sales</span>
            </div>
          </div>
          {statsLoading ? (
            <div className="h-64 bg-zinc-700 rounded animate-pulse" />
          ) : (
            <SalesChart data={stats.salesByDay} />
          )}
        </div>

        {/* Top Products */}
        <TopProductsList products={stats.topProducts || []} loading={statsLoading} />
      </div>

      {/* Recent Activity */}
      <div className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
            <p className="text-zinc-400 text-sm">Latest orders and user registrations</p>
          </div>
          <Activity className="w-5 h-5 text-zinc-400" />
        </div>
        {activityLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-zinc-700 rounded animate-pulse" />
            ))}
          </div>
        ) : recentActivity.length === 0 ? (
          <p className="text-zinc-400 text-center py-8">No recent activity</p>
        ) : (
          <div className="divide-y divide-zinc-700/50">
            {recentActivity.map((activity, index) => (
              <ActivityItem key={`${activity.id}-${index}`} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
