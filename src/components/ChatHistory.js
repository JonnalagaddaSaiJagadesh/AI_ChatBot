import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components"; 
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

// Keyframe for fading in
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled components for the chat history page
const Container = styled.div`
  font-family: "Poppins", sans-serif;
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 12px;
  max-width: 1000px;
  height: 75vh;
  margin: 0px auto;
  box-shadow: 0 10px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const Header = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const ResultsContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-bottom: 20px;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0;
  padding: 12px 20px;
  border-radius: 10px;
  background-color: ${(props) => (props.isUser ? "#007bff" : "#fff")};
  color: ${(props) => (props.isUser ? "#fff" : "#333")};
  align-self: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  max-width: 80%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.5s ease-in-out;
  will-change: opacity; /* Performance optimization */
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  width: 100%; /* Ensure buttons take full width of the container */
  padding: 10 5px; /* Add some padding for better spacing */
`;

const Button = styled.button`
  background-color: ${(props) => (props.clear ? "#f44336" : "#007bff")};
  color: white;
  border: none;
  padding: 12px 12px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 45%; /* Updated to 45% */
  
  &:hover {
    background-color: ${(props) => (props.clear ? "#e53935" : "#0056b3")};
  }
`;


const ChatHistory = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Function to clear chat history
  const clearChatHistory = () => {
    localStorage.removeItem("chatHistory");
    setMessages([]); // Clear state
  };

  // Function to navigate back
  const goBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <Container>
      <Header>Chat History</Header>
      <ResultsContainer>
{messages.length === 0 ? (
  <Message>No chat history available.</Message>
) : (
  messages.map((msg, index) => (
    <Message key={index} isUser={msg.isUser}>
      {msg.text.split("\n").map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </Message>
  ))
)}
      </ResultsContainer>
      <ButtonContainer>
        <Button onClick={clearChatHistory} clear>
          Clear Chat History
        </Button>
        <Button onClick={goBack}>Go Back</Button>
      </ButtonContainer>
    </Container>
  );
};

export default ChatHistory;
