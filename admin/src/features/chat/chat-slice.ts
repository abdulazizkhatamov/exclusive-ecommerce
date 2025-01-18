import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatAccountState {
  selectedAccountId: string;
}

const initialState: ChatAccountState = {
  selectedAccountId: "", // Default to an empty string or a specific account ID
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChatAccount(state, action: PayloadAction<string>) {
      state.selectedAccountId = action.payload;
    },
  },
});

export const { setSelectedChatAccount } = chatSlice.actions;

export default chatSlice.reducer;
