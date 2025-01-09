import { createSlice } from "@reduxjs/toolkit";

// Define initial state
interface UIState {
  createCategorySheet: boolean;
  updateCategorySheet: {
    sheet: boolean;
    category: {
      _id: string;
      name: string;
      description: string;
      status: boolean;
      parent: string | null;
    } | null;
  };
  deleteCategoryDialog: {
    dialog: boolean;
    category: {
      _id: string;
      name: string;
    } | null;
  };
}

const initialState: UIState = {
  createCategorySheet: false,
  updateCategorySheet: {
    sheet: false,
    category: {
      _id: "",
      name: "",
      description: "",
      status: false,
      parent: null,
    },
  },
  deleteCategoryDialog: {
    dialog: false,
    category: {
      _id: "",
      name: "",
    },
  },
};

// Create the slice
const uiCategorySlice = createSlice({
  name: "ui-category",
  initialState,
  reducers: {
    toggleCreateCategorySheet: (state) => {
      state.createCategorySheet = !state.createCategorySheet;
    },
    toggleUpdateCategorySheet: (state, action) => {
      // Set to the category ID if provided, otherwise reset to null
      state.updateCategorySheet.sheet = !state.updateCategorySheet.sheet;
      state.updateCategorySheet.category = action.payload.category;
    },
    toggleDeleteCategoryDialog: (state, action) => {
      state.deleteCategoryDialog.dialog = !state.deleteCategoryDialog.dialog;
      state.deleteCategoryDialog.category = action.payload.category;
    },
  },
});

export const {
  toggleCreateCategorySheet,
  toggleUpdateCategorySheet,
  toggleDeleteCategoryDialog,
} = uiCategorySlice.actions;
export default uiCategorySlice.reducer;
