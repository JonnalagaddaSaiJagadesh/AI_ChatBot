import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice"; // ✅ Ensure this path is correct


// Define the initial state
const initialState = {
  messages: [],
};

// Define the reducer function
const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "CLEAR_HISTORY":
      return { ...state, messages: [] };
    default:
      return state;
  }
};

// Define action creators
export const addMessage = (message) => ({
  type: "ADD_MESSAGE",
  payload: message,
});

export const clearHistory = () => ({
  type: "CLEAR_HISTORY",
});

// ✅ Create the store
const store = configureStore({
  reducer: {
    chat: messageReducer, // You can change "chat" to any meaningful key
  },
});

export default store;
