import React, { useState } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";

// Styled components
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Container = styled.div`
  font-family: "Poppins", sans-serif;
  background-color: #f9f9f9;
  padding: 30px;
  border-radius: 12px;
  max-width: 600px;
  margin: 50px auto;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const Header = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ResultsContainer = styled.div`
  margin-top: 25px;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0;
  padding: 10px;
  border-radius: 10px;
  background-color: ${(props) => (props.isUser ? "#007bff" : "#fff")};
  color: ${(props) => (props.isUser ? "#fff" : "#333")};
  align-self: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  max-width: 80%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const ResultCard = styled.div`
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ResultTitle = styled.h3`
  font-size: 20px;
  color: #333;
  margin: 0 0 10px;
`;

const ResultPrice = styled.p`
  font-size: 18px;
  color: #007bff;
  margin: 0 0 8px;
`;

const ResultInfo = styled.p`
  font-size: 16px;
  color: #555;
  margin: 5px 0;
`;

const NoResults = styled.p`
  font-size: 18px;
  color: #999;
  text-align: center;
  margin-top: 20px;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const ChatInput = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState([]);
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Add user message to chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: query, isUser: true },
    ]);

    try {
      const result = await axios.post("http://localhost:8000/query/", {
        query,
      });

      // Add chatbot response to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: result.data.response, isUser: false },
      ]);
      setResponse(result.data.response);
    } catch (error) {
      console.error("Error fetching from backend:", error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  return (
    <Container>
      <Header>Product Finder</Header>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a product..."
          onKeyDown={handleKeyPress}
        />
        <Button type="submit">Search</Button>
      </Form>

      <ResultsContainer>
        {messages.map((message, index) => (
          <Message key={index} isUser={message.isUser}>
            {message.isUser ? <strong>You:</strong> : <strong>Bot:</strong>}
            <p>{message.text}</p>
          </Message>
        ))}

        {response && response.length > 0 ? (
          response.map((item) => (
            <ResultCard key={item.product_id}>
              <ResultTitle>{item.name}</ResultTitle>
              <ResultPrice>Price: ${item.price}</ResultPrice>
              <ResultInfo>{item.description}</ResultInfo>
              <ResultInfo>Supplier: {item.supplier_name}</ResultInfo>
              <ResultInfo>Contact: {item.supplier_contact_name}</ResultInfo>
              <ResultInfo>Email: {item.supplier_contact_email}</ResultInfo>
              <ResultInfo>Phone: {item.supplier_contact_phone}</ResultInfo>
            </ResultCard>
          ))
        ) : query ? (
          <NoResults>No results found for "{query}".</NoResults>
        ) : (
          <NoResults>Start by entering a product name above!</NoResults>
        )}
      </ResultsContainer>
    </Container>
  );
};

export default ChatInput;
