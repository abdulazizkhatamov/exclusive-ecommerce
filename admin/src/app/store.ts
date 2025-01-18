import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/auth-slice.ts";
import mailReducer from "@/features/mail/mail-slice.ts";
import chatReducer from "@/features/chat/chat-slice.ts";

const store = configureStore({
  reducer: {
    auth: authReducer,
    mail: mailReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
