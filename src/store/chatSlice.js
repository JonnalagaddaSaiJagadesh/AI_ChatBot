// src/store/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";
// Remove this import if you're not using chatReducer
import chatReducer from "./chatSlice"; 


const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearHistory: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, clearHistory } = chatSlice.actions;
export default chatSlice.reducer;
