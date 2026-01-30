import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAPI } from '../../services/api.js';

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await adminAPI.getDashboardStats();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const data = await adminAPI.getAllUsers();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const data = await adminAPI.updateUser(userId, userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await adminAPI.deleteUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleUserAdmin = createAsyncThunk(
  'admin/toggleUserAdmin',
  async (userId, { rejectWithValue }) => {
    try {
      const data = await adminAPI.toggleUserAdmin(userId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleUserActive = createAsyncThunk(
  'admin/toggleUserActive',
  async (userId, { rejectWithValue }) => {
    try {
      const data = await adminAPI.toggleUserActive(userId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'admin/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const data = await adminAPI.getAllOrders();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const data = await adminAPI.updateOrderStatus(orderId, status);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRecentActivity = createAsyncThunk(
  'admin/fetchRecentActivity',
  async (limit = 10, { rejectWithValue }) => {
    try {
      const data = await adminAPI.getRecentActivity(limit);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: {
      totalSales: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalUsers: 0,
      recentOrders: 0,
      recentSales: 0,
      salesByDay: [],
      topProducts: [],
      orderStatusDistribution: {},
    },
    users: [],
    orders: [],
    recentActivity: [],
    loading: false,
    error: null,
    statsLoading: false,
    usersLoading: false,
    ordersLoading: false,
    activityLoading: false,
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    resetAdminState: (state) => {
      state.stats = {
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        recentOrders: 0,
        recentSales: 0,
        salesByDay: [],
        topProducts: [],
        orderStatusDistribution: {},
      };
      state.users = [];
      state.orders = [];
      state.recentActivity = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      })
      // Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...action.payload };
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      })
      .addCase(toggleUserAdmin.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index].isAdmin = action.payload.isAdmin;
        }
      })
      .addCase(toggleUserActive.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index].isActive = action.payload.isActive;
        }
      })
      // Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.ordersLoading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      // Recent activity
      .addCase(fetchRecentActivity.pending, (state) => {
        state.activityLoading = true;
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.activityLoading = false;
        state.recentActivity = action.payload;
      })
      .addCase(fetchRecentActivity.rejected, (state, action) => {
        state.activityLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminError, resetAdminState } = adminSlice.actions;
export default adminSlice.reducer;
