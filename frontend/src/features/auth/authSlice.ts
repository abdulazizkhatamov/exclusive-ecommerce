import { createSlice } from "@reduxjs/toolkit";

// Define initial state
interface AuthState {
  user: null;
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
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setUser, setAccessToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
