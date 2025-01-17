// src/features/product/productSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
  selectedAttributes: Record<string, string>;
  currentImageIndex: number;
  quantity: number;
}

const initialState: ProductState = {
  selectedAttributes: {},
  currentImageIndex: 0,
  quantity: 1,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSelectedAttributes: (
      state,
      action: PayloadAction<Record<string, string>>,
    ) => {
      state.selectedAttributes = action.payload;
    },
    setCurrentImageIndex: (state, action: PayloadAction<number>) => {
      state.currentImageIndex = action.payload;
    },
    setQuantity: (state, action: PayloadAction<number>) => {
      state.quantity = action.payload;
    },
  },
});

export const { setSelectedAttributes, setCurrentImageIndex, setQuantity } =
  productSlice.actions;
export default productSlice.reducer;
