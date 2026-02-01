import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Product } from '@/components/product'

interface CartItem {
  product: Product
  size: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  isLoading: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; size: string; quantity: number }>) => {
      const { product, size, quantity } = action.payload
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id && item.size === size
      )

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += quantity
      } else {
        state.items.push({ product, size, quantity })
      }
    },
    removeFromCart: (state, action: PayloadAction<{ productId: string; size: string }>) => {
      const { productId, size } = action.payload
      state.items = state.items.filter(
        (item) => !(item.product.id === productId && item.size === size)
      )
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; size: string; quantity: number }>) => {
      const { productId, size, quantity } = action.payload
      const item = state.items.find(
        (item) => item.product.id === productId && item.size === size
      )
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (i) => !(i.product.id === productId && i.size === size)
          )
        } else {
          item.quantity = quantity
        }
      }
    },
    clearCart: (state) => {
      state.items = []
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },
    openCart: (state) => {
      state.isOpen = true
    },
    closeCart: (state) => {
      state.isOpen = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0)
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0)
export const selectCartCarbonFootprint = (state: { cart: CartState }) =>
  state.cart.items.reduce(
    (total, item) => total + item.product.sustainability.carbonFootprint * item.quantity,
    0
  )

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  setLoading,
} = cartSlice.actions
export default cartSlice.reducer
