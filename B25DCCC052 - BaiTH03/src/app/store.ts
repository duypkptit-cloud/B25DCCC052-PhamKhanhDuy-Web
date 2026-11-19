import { configureStore } from '@reduxjs/toolkit'
import productsReducer from '../features/products/productsSlice'
import cartReducer, { CART_STORAGE_KEY } from '../features/cart/cartSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
})

// Lưu giỏ hàng để không mất khi tải lại trang
store.subscribe(() => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(store.getState().cart.items))
  } catch {
    /* bỏ qua nếu localStorage không khả dụng */
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
