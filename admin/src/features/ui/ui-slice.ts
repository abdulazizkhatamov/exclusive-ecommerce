import { createSlice } from "@reduxjs/toolkit";

// Define initial state
interface UIState {
  createCategorySheet: boolean;
  updateCategorySheet: boolean; // Stores the ID of the category being edited or null
}

const initialState: UIState = {
  createCategorySheet: false,
  updateCategorySheet: false, // Initially, no category is being edited
};

// Create the slice
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleCreateCategorySheet: (state) => {
      state.createCategorySheet = !state.createCategorySheet;
    },
    toggleUpdateCategorySheet: (state) => {
      // Set to the category ID if provided, otherwise reset to null
      state.updateCategorySheet = !state.updateCategorySheet;
    },
  },
});

export const { toggleCreateCategorySheet, toggleUpdateCategorySheet } =
  uiSlice.actions;
export default uiSlice.reducer;
