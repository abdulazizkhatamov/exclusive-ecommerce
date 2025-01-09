import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "@/types/user.ts";

// Define initial state
interface AuthState {
  user: IUser | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    updateCart: (state, action) => {
      if (state.user) {
        state.user.cart = action.payload;
      }
    },
    // Add these reducers to authSlice
    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      if (state.user && state.user.cart) {
        const item = state.user.cart.find((item) => item._id === id);
        if (item) {
          item.quantity = quantity;
        }
      }
    },
    removeCartItem: (state, action) => {
      const id = action.payload;
      if (state.user && state.user.cart) {
        state.user.cart = state.user.cart.filter((item) => item._id !== id);
      }
    },
    updateAddress: (state, action) => {
      if (state.user) {
        state.user.addresses = action.payload;
      }
    },
    updateOrderHistory: (state, action) => {
      if (state.user) {
        state.user.orderHistory = action.payload;
      }
    },
    syncCart: (state, action) => {
      if (state.user) {
        state.user.cart = action.payload;
      }
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const {
  setUser,
  setAccessToken,
  clearAuth,
  updateCart,
  syncCart,
  updateCartQuantity,
  removeCartItem,
  updateAddress,
  updateOrderHistory,
} = authSlice.actions;
export default authSlice.reducer;
