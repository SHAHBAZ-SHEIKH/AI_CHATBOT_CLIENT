import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatId: null,
  chatHistory: [],
  error: "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatId: (state, action) => {
      state.chatId = action.payload;
    },
    setChatHistory: (state, action) => {
      state.chatHistory = [...action.payload];
      console.log(state.chatHistory);
    },

    updateChatHistory: (state, action) => {
      console.log(action.payload);
      state.chatHistory.push(action.payload);
      console.log(state.chatHistory);
    },
    updateChatHistoryMessages: (state, action) => {
      console.log(action.payload);
      console.log(state.chatHistory);
      const chat = state.chatHistory.find((chat) => chat._id === action.payload.chatId);
      if (chat) {
        console.log(chat);
        chat.messages = [...action.payload.messages];
        console.log('Updated chat history:', state.chatHistory);
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

const actions = chatSlice.actions;

export const {
  setChatId,
  setChatHistory,
  updateChatHistory,
  updateChatHistoryMessages,
  setError,
} = actions;

export default chatSlice.reducer;