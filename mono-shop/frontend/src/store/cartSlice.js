import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../services/api.js';

// Async thunks for cart operations
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const fetchCartCount = createAsyncThunk(
  'cart/fetchCartCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCartCount();
      return response.data.count;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart count');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { rejectWithValue, dispatch }) => {
    try {
      const response = await cartService.addItem(productId, quantity);
      // After adding item, fetch updated cart count
      dispatch(fetchCartCount());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue, dispatch }) => {
    try {
      const response = await cartService.updateItem(itemId, quantity);
      // After updating item, fetch updated cart and count
      dispatch(fetchCart());
      dispatch(fetchCartCount());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue, dispatch }) => {
    try {
      await cartService.removeItem(itemId);
      // After removing item, fetch updated cart and count
      dispatch(fetchCart());
      dispatch(fetchCartCount());
      return itemId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item from cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await cartService.clearCart();
      // After clearing cart, reset local state
      dispatch(fetchCartCount());
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const initialState = {
  items: [],
  count: 0,
  loading: false,
  error: null,
  addingToCart: {},
  updatingItem: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAddingToCart: (state, action) => {
      const { productId, loading } = action.payload;
      state.addingToCart[productId] = loading;
    },
    setUpdatingItem: (state, action) => {
      const { itemId, loading } = action.payload;
      state.updatingItem[itemId] = loading;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Cart Count
      .addCase(fetchCartCount.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchCartCount.fulfilled, (state, action) => {
        state.count = action.payload;
      })
      .addCase(fetchCartCount.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        // Cart count will be updated by fetchCartCount dispatch
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state) => {
        // Cart will be updated by fetchCart dispatch
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state) => {
        // Cart will be updated by fetchCart dispatch
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.count = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setAddingToCart, setUpdatingItem } = cartSlice.actions;
export default cartSlice.reducer;
