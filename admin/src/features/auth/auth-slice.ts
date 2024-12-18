import { createSlice } from "@reduxjs/toolkit";

// Define initial state
interface AuthState {
  admin: null;
  accessToken: string | null;
}

const initialState: AuthState = {
  admin: null,
  accessToken: null,
};

// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    clearAuth: (state) => {
      state.admin = null;
      state.accessToken = null;
    },
  },
});

export const { setAdmin, setAccessToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
