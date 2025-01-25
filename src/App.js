import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import theme from "./styles/theme";
import store from "./store/store";
import ChatInput from "./components/Chatinput";
import ChatHistory from "./components/ChatHistory";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
            <h1 style={{ textAlign: "center" }}>AI Chatbot</h1>
            <Routes>
              <Route path="/" element={<ChatInput />} />
              {/* Update path to /chat-history to match your navigation */}
              <Route path="/chat-history" element={<ChatHistory />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
