import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MailAccountState {
  selectedAccountId: string;
}

const initialState: MailAccountState = {
  selectedAccountId: "", // Default to an empty string or a specific account ID
};

const mailSlice = createSlice({
  name: "mail",
  initialState,
  reducers: {
    setSelectedMailAccount(state, action: PayloadAction<string>) {
      state.selectedAccountId = action.payload;
    },
  },
});

export const { setSelectedMailAccount } = mailSlice.actions;

export default mailSlice.reducer;
