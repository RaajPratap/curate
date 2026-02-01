import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/components/product";
import { ordersService, BackendCart, BackendCartItem } from "@/lib/api/orders";

// Extended cart item that includes backend item ID for syncing
interface CartItem {
  product: Product;
  size: string;
  color?: string;
  quantity: number;
  backendItemId?: string; // MongoDB _id for the cart item
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  lastSyncedAt: string | null;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  isLoading: false,
  isSyncing: false,
  error: null,
  lastSyncedAt: null,
};

// Async thunk to sync cart with backend
export const syncCartWithBackend = createAsyncThunk(
  "cart/syncWithBackend",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ordersService.getCart();
      return response.data.cart;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to sync cart");
    }
  },
);

// Async thunk to add item to cart (syncs with backend)
export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async (
    payload: {
      product: Product;
      size: string;
      color?: string;
      quantity: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const { product, size, color, quantity } = payload;
      const response = await ordersService.addToCart(
        product.id,
        { size, color: color || product.colors?.[0] },
        quantity,
        product.price,
        product.name,
        product.images?.[0],
      );
      return {
        cart: response.data.cart,
        localProduct: product,
        size,
        color,
        quantity,
      };
    } catch (error: any) {
      // If backend fails, we still want to add locally
      console.error("Failed to sync add to cart with backend:", error);
      return rejectWithValue({
        error: error.message,
        localProduct: payload.product,
        size: payload.size,
        color: payload.color,
        quantity: payload.quantity,
      });
    }
  },
);

// Async thunk to update cart item quantity
export const updateQuantityAsync = createAsyncThunk(
  "cart/updateQuantityAsync",
  async (
    payload: {
      productId: string;
      size: string;
      quantity: number;
      backendItemId?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      if (payload.backendItemId) {
        const response = await ordersService.updateCartItem(
          payload.backendItemId,
          payload.quantity,
        );
        return { cart: response.data.cart, ...payload };
      }
      return payload;
    } catch (error: any) {
      console.error("Failed to sync update with backend:", error);
      return payload; // Still update locally
    }
  },
);

// Async thunk to remove item from cart
export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCartAsync",
  async (
    payload: { productId: string; size: string; backendItemId?: string },
    { rejectWithValue },
  ) => {
    try {
      if (payload.backendItemId) {
        await ordersService.removeFromCart(payload.backendItemId);
      }
      return payload;
    } catch (error: any) {
      console.error("Failed to sync remove with backend:", error);
      return payload; // Still remove locally
    }
  },
);

// Async thunk to clear cart
export const clearCartAsync = createAsyncThunk(
  "cart/clearCartAsync",
  async (_, { rejectWithValue }) => {
    try {
      await ordersService.clearCart();
      return true;
    } catch (error: any) {
      console.error("Failed to sync clear cart with backend:", error);
      return true; // Still clear locally
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Synchronous actions for local-only operations
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        size: string;
        color?: string;
        quantity: number;
      }>,
    ) => {
      const { product, size, color, quantity } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id && item.size === size,
      );

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({ product, size, color, quantity });
      }
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ productId: string; size: string }>,
    ) => {
      const { productId, size } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.product.id === productId && item.size === size),
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{
        productId: string;
        size: string;
        quantity: number;
      }>,
    ) => {
      const { productId, size, quantity } = action.payload;
      const item = state.items.find(
        (item) => item.product.id === productId && item.size === size,
      );
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (i) => !(i.product.id === productId && i.size === size),
          );
        } else {
          item.quantity = quantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Sync cart with backend
    builder
      .addCase(syncCartWithBackend.pending, (state) => {
        state.isSyncing = true;
        state.error = null;
      })
      .addCase(syncCartWithBackend.fulfilled, (state, action) => {
        state.isSyncing = false;
        state.lastSyncedAt = new Date().toISOString();
        // Note: We don't replace local items here because backend cart
        // might not have full product data. In a real app, you'd fetch
        // product details for each cart item.
      })
      .addCase(syncCartWithBackend.rejected, (state, action) => {
        state.isSyncing = false;
        state.error = action.payload as string;
      });

    // Add to cart async
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.isSyncing = true;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.isSyncing = false;
        const { localProduct, size, color, quantity, cart } = action.payload;

        const existingIndex = state.items.findIndex(
          (item) => item.product.id === localProduct.id && item.size === size,
        );

        // Find the backend item ID
        const backendItem = cart?.items?.find(
          (item: BackendCartItem) =>
            (item.product === localProduct.id ||
              (item.product as any)?._id === localProduct.id) &&
            item.variant?.size === size,
        );

        if (existingIndex >= 0) {
          state.items[existingIndex].quantity += quantity;
          if (backendItem) {
            state.items[existingIndex].backendItemId = backendItem._id;
          }
        } else {
          state.items.push({
            product: localProduct,
            size,
            color,
            quantity,
            backendItemId: backendItem?._id,
          });
        }
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.isSyncing = false;
        // Still add locally even if backend fails
        const payload = action.payload as any;
        if (payload?.localProduct) {
          const { localProduct, size, color, quantity } = payload;
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === localProduct.id && item.size === size,
          );
          if (existingIndex >= 0) {
            state.items[existingIndex].quantity += quantity;
          } else {
            state.items.push({ product: localProduct, size, color, quantity });
          }
        }
      });

    // Update quantity async
    builder
      .addCase(updateQuantityAsync.pending, (state) => {
        state.isSyncing = true;
      })
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        state.isSyncing = false;
        const { productId, size, quantity } = action.payload;
        const item = state.items.find(
          (item) => item.product.id === productId && item.size === size,
        );
        if (item) {
          if (quantity <= 0) {
            state.items = state.items.filter(
              (i) => !(i.product.id === productId && i.size === size),
            );
          } else {
            item.quantity = quantity;
          }
        }
      })
      .addCase(updateQuantityAsync.rejected, (state, action) => {
        state.isSyncing = false;
        // Still update locally
        const { productId, size, quantity } = action.meta.arg;
        const item = state.items.find(
          (item) => item.product.id === productId && item.size === size,
        );
        if (item) {
          if (quantity <= 0) {
            state.items = state.items.filter(
              (i) => !(i.product.id === productId && i.size === size),
            );
          } else {
            item.quantity = quantity;
          }
        }
      });

    // Remove from cart async
    builder
      .addCase(removeFromCartAsync.pending, (state) => {
        state.isSyncing = true;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.isSyncing = false;
        const { productId, size } = action.payload;
        state.items = state.items.filter(
          (item) => !(item.product.id === productId && item.size === size),
        );
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.isSyncing = false;
        // Still remove locally
        const { productId, size } = action.meta.arg;
        state.items = state.items.filter(
          (item) => !(item.product.id === productId && item.size === size),
        );
      });

    // Clear cart async
    builder
      .addCase(clearCartAsync.pending, (state) => {
        state.isSyncing = true;
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.isSyncing = false;
        state.items = [];
      })
      .addCase(clearCartAsync.rejected, (state) => {
        state.isSyncing = false;
        state.items = []; // Still clear locally
      });
  },
});

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
export const selectCartCarbonFootprint = (state: { cart: CartState }) =>
  state.cart.items.reduce(
    (total, item) =>
      total +
      (item.product.sustainability?.carbonFootprint || 0) * item.quantity,
    0,
  );
export const selectCartIsLoading = (state: { cart: CartState }) =>
  state.cart.isLoading;
export const selectCartIsSyncing = (state: { cart: CartState }) =>
  state.cart.isSyncing;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  setLoading,
  setError,
} = cartSlice.actions;

export default cartSlice.reducer;
