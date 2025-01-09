import { createSlice } from "@reduxjs/toolkit";

// Define initial state
interface UIState {
  createVariantSheet: boolean;
  updateVariantSheet: {
    sheet: boolean;
    variant: {
      _id: string;
      sku: string;
      attributes: [
        {
          name: string;
          value: string;
        },
      ];
      price: number;
      stock: number;
      images: string[];
    } | null;
  };
  deleteVariantDialog: {
    dialog: boolean;
    variant: {
      _id: string;
      sku: string;
    } | null;
  };
}

const initialState: UIState = {
  createVariantSheet: false,
  updateVariantSheet: {
    sheet: false,
    variant: {
      _id: "",
      sku: "",
      attributes: [{ name: "", value: "" }],
      price: 0,
      stock: 0,
      images: [""],
    },
  },
  deleteVariantDialog: {
    dialog: false,
    variant: {
      _id: "",
      sku: "",
    },
  },
};

// Create the slice
const uiVariantSlice = createSlice({
  name: "ui-variant",
  initialState,
  reducers: {
    toggleCreateVariantSheet: (state) => {
      state.createVariantSheet = !state.createVariantSheet;
    },
    toggleUpdateVariantSheet: (state, action) => {
      // Set to the category ID if provided, otherwise reset to null
      state.updateVariantSheet.sheet = !state.updateVariantSheet.sheet;
      state.updateVariantSheet.variant = action.payload.variant;
    },
    toggleDeleteVariantDialog: (state, action) => {
      state.deleteVariantDialog.dialog = !state.deleteVariantDialog.dialog;
      state.deleteVariantDialog.variant = action.payload.variant;
    },
  },
});

export const {
  toggleCreateVariantSheet,
  toggleUpdateVariantSheet,
  toggleDeleteVariantDialog,
} = uiVariantSlice.actions;
export default uiVariantSlice.reducer;
