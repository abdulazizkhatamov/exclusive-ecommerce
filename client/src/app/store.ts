import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/auth-slice.ts";
import cartReducer from "@/features/cart/cart-slice.ts";
import productReducer from "@/features/product/product-slice.ts";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
