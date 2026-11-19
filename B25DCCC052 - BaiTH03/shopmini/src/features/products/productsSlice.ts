import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { LoadStatus, Product } from '../../types'

const API_URL = 'https://fakestoreapi.com/products'

interface ProductsState {
  items: Product[]
  status: LoadStatus
  error: string | null
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
}

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(API_URL)
      if (!res.ok) return rejectWithValue(`Máy chủ trả về lỗi ${res.status}.`)
      return (await res.json()) as Product[]
    } catch {
      return rejectWithValue('Không thể kết nối tới máy chủ. Kiểm tra mạng và thử lại.')
    }
  },
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message ?? 'Đã có lỗi xảy ra.'
      })
  },
})

export const selectProducts = (state: RootState) => state.products.items
export const selectProductsStatus = (state: RootState) => state.products.status
export const selectProductsError = (state: RootState) => state.products.error
export const selectProductById = (id: number) => (state: RootState) =>
  state.products.items.find((p) => p.id === id)

export default productsSlice.reducer
