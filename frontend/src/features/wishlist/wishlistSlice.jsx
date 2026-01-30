import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistAPI } from '../../services/api.js';

// Async thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const data = await wishlistAPI.getWishlist();
      return data.wishlist || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const data = await wishlistAPI.addToWishlist(productId);
      return data.item;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (wishlistId, { rejectWithValue }) => {
    try {
      await wishlistAPI.removeFromWishlist(wishlistId);
      return wishlistId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleWishlistItem = createAsyncThunk(
  'wishlist/toggleWishlistItem',
  async (productId, { rejectWithValue }) => {
    try {
      const data = await wishlistAPI.toggleWishlist(productId);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const clearWishlist = createAsyncThunk(
  'wishlist/clearWishlist',
  async (_, { rejectWithValue }) => {
    try {
      await wishlistAPI.clearWishlist();
      return [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const checkWishlistStatus = createAsyncThunk(
  'wishlist/checkStatus',
  async (productId, { rejectWithValue }) => {
    try {
      const data = await wishlistAPI.checkWishlistStatus(productId);
      return { productId, ...data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Helper to save wishlist IDs to localStorage for quick lookup
const saveWishlistIdsToStorage = (wishlistItems) => {
  const productIds = wishlistItems.map(item => item.product?._id).filter(Boolean);
  localStorage.setItem('wishlistProductIds', JSON.stringify(productIds));
};

const getWishlistIdsFromStorage = () => {
  try {
    const ids = localStorage.getItem('wishlistProductIds');
    return ids ? JSON.parse(ids) : [];
  } catch {
    return [];
  }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    wishlistedProductIds: getWishlistIdsFromStorage(),
    count: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
    updateLocalWishlistIds: (state, action) => {
      state.wishlistedProductIds = action.payload;
      saveWishlistIdsToStorage(action.payload.map(id => ({ product: { _id: id } })));
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.count = action.payload.length;
        state.wishlistedProductIds = action.payload.map(item => item.product?._id).filter(Boolean);
        saveWishlistIdsToStorage(action.payload);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.count = state.items.length;
        if (action.payload.product?._id) {
          state.wishlistedProductIds.push(action.payload.product._id);
        }
        saveWishlistIdsToStorage(state.items);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const removedItem = state.items.find(item => item._id === action.payload);
        state.items = state.items.filter(item => item._id !== action.payload);
        state.count = state.items.length;
        if (removedItem?.product?._id) {
          state.wishlistedProductIds = state.wishlistedProductIds.filter(
            id => id !== removedItem.product._id
          );
        }
        saveWishlistIdsToStorage(state.items);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle wishlist
      .addCase(toggleWishlistItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        state.loading = false;
        const { isWishlisted, item } = action.payload;
        
        if (isWishlisted && item) {
          // Item was added
          state.items.push(item);
          if (item.product?._id) {
            state.wishlistedProductIds.push(item.product._id);
          }
        } else {
          // Item was removed - find by product ID
          const productId = action.meta.arg;
          const removedItem = state.items.find(
            wishlistItem => wishlistItem.product?._id === productId
          );
          if (removedItem) {
            state.items = state.items.filter(
              wishlistItem => wishlistItem._id !== removedItem._id
            );
          }
          state.wishlistedProductIds = state.wishlistedProductIds.filter(
            id => id !== productId
          );
        }
        state.count = state.items.length;
        saveWishlistIdsToStorage(state.items);
      })
      .addCase(toggleWishlistItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clear wishlist
      .addCase(clearWishlist.fulfilled, (state) => {
        state.items = [];
        state.count = 0;
        state.wishlistedProductIds = [];
        localStorage.removeItem('wishlistProductIds');
      });
  },
});

export const { clearWishlistError, updateLocalWishlistIds } = wishlistSlice.actions;
export default wishlistSlice.reducer;
