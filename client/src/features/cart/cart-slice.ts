import { createSlice } from "@reduxjs/toolkit";

// Define initial state
interface CartState {
  isCartSheetOpen: boolean;
}

const initialState: CartState = {
  isCartSheetOpen: false,
};

// Create the slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggleCartSheet: (state) => {
      state.isCartSheetOpen = !state.isCartSheetOpen;
    },
  },
});

export const { toggleCartSheet } = cartSlice.actions;
export default cartSlice.reducer;
