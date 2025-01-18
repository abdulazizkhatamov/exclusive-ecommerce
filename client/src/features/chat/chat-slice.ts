import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Interfaces for chat schema in React

// Message interface for a single message in the conversation
export interface IMessage {
  _id: string;
  sender: "user" | "admin"; // sender type
  message: string; // message content
  sentAt: string; // timestamp of when the message was sent
  isRead: boolean; // whether the message has been read
}

// Participant interface for the person involved in the chat
export interface IParticipant {
  name: string; // name of the participant
}

// Chat interface representing a conversation with a participant and messages
export interface IChat {
  participant: IParticipant; // the participant in the conversation
  messages: IMessage[]; // list of messages in the conversation
  isDeleted: boolean; // whether the chat is deleted
  createdAt: string; // timestamp when the chat was created
  updatedAt: string; // timestamp when the chat was last updated
}

interface ChatState {
  isOpen: boolean;
  input: string;
  session: string | null;
  sessionName: string;
  chat: IChat | null; // currently active chat
}

const initialState: ChatState = {
  isOpen: false,
  input: "",
  session: localStorage.getItem("chat_session"),
  sessionName: "",
  chat: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    toggleChat(state) {
      state.isOpen = !state.isOpen;
    },
    setChat(state, action) {
      state.chat = action.payload;
    },
    setSession(state, action: PayloadAction<string | null>) {
      state.session = action.payload;
      if (state.session) {
        localStorage.setItem("chat_session", state.session);
      } else {
        localStorage.removeItem("chat_session");
      }
    },
    setInput(state, action: PayloadAction<string>) {
      state.input = action.payload;
    },
    setSessionName(state, action: PayloadAction<string>) {
      state.sessionName = action.payload;
    },
  },
});

export const { toggleChat, setChat, setSession, setInput, setSessionName } =
  chatSlice.actions;

export default chatSlice.reducer;
