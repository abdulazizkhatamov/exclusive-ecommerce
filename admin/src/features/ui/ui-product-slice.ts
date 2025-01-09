import { createSlice } from "@reduxjs/toolkit";

// Define initial state
interface UIState {
  deleteProductDialog: {
    dialog: boolean;
    product: {
      _id: string;
      name: string;
    } | null;
  };
}

const initialState: UIState = {
  deleteProductDialog: {
    dialog: false,
    product: {
      _id: "",
      name: "",
    },
  },
};

const uiProductSlice = createSlice({
  name: "ui-product",
  initialState,
  reducers: {
    toggleDeleteProductDialog: (state, action) => {
      state.deleteProductDialog.dialog = !state.deleteProductDialog.dialog;
      state.deleteProductDialog.product = action.payload.product;
    },
  },
});

export const { toggleDeleteProductDialog } = uiProductSlice.actions;
export default uiProductSlice.reducer;
