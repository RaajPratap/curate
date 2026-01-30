import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

// Get dashboard statistics
const getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Total counts
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalUsers = await User.countDocuments();

  // Sales calculations
  const orders = await Order.find({ isPaid: true });
  const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  // Recent orders (last 30 days)
  const recentOrders = await Order.find({
    createdAt: { $gte: thirtyDaysAgo },
  }).countDocuments();

  // Recent sales (last 30 days)
  const recentPaidOrders = await Order.find({
    isPaid: true,
    createdAt: { $gte: thirtyDaysAgo },
  });
  const recentSales = recentPaidOrders.reduce((acc, order) => acc + order.totalPrice, 0);

  // Sales by day (last 7 days)
  const salesByDay = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        createdAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        sales: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
  ]);

  // Top selling products
  const topProducts = await Order.aggregate([
    { $match: { isPaid: true } },
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        name: { $first: '$orderItems.name' },
        totalSold: { $sum: '$orderItems.qty' },
        revenue: { $sum: { $multiply: ['$orderItems.qty', '$orderItems.price'] } },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  // Order status distribution
  const orderStatusDistribution = await Order.aggregate([
    {
      $group: {
        _id: '$orderStatus',
        count: { $sum: 1 },
      },
    },
  ]);

  res.json({
    totalSales,
    totalOrders,
    totalProducts,
    totalUsers,
    recentOrders,
    recentSales,
    salesByDay: salesByDay.map((day) => ({
      date: `${day._id.year}-${String(day._id.month).padStart(2, '0')}-${String(day._id.day).padStart(2, '0')}`,
      sales: day.sales,
      orders: day.orders,
    })),
    topProducts,
    orderStatusDistribution: orderStatusDistribution.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {}),
  });
});

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;
    user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Toggle user admin status
const toggleUserAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.isAdmin = !user.isAdmin;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      message: `User ${updatedUser.isAdmin ? 'promoted to' : 'removed from'} admin`,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Toggle user active status
const toggleUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('Cannot disable your own account');
    }
    
    // Add isActive field if not exists (default to true)
    if (user.isActive === undefined) {
      user.isActive = true;
    }
    
    user.isActive = !user.isActive;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isActive: updatedUser.isActive,
      message: `User account ${updatedUser.isActive ? 'enabled' : 'disabled'}`,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Get all orders (admin view)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'id name email')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// Get recent activity
const getRecentActivity = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 10;

  // Recent orders
  const recentOrders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit);

  // Recent users
  const recentUsers = await User.find({})
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(limit);

  // Combine and sort by date
  const activity = [
    ...recentOrders.map((order) => ({
      type: 'order',
      id: order._id,
      user: order.user?.name || 'Unknown',
      email: order.user?.email,
      amount: order.totalPrice,
      status: order.orderStatus,
      date: order.createdAt,
    })),
    ...recentUsers.map((user) => ({
      type: 'user',
      id: user._id,
      user: user.name,
      email: user.email,
      date: user.createdAt,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);

  res.json(activity);
});

export {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserAdmin,
  toggleUserActive,
  getAllOrders,
  getRecentActivity,
};
