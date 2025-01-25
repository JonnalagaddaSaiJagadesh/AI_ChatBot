import { useState, useRef, useEffect } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom"; 

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

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
  padding: 8px 16px;
  border-radius: 10px;
  background-color: ${(props) => (props.isUser ? "#007bff" : "#fff")};
  color: ${(props) => (props.isUser ? "#fff" : "#333")};
  align-self: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  max-width: 75%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.5s ease-in-out;
  font-size: 14px;
  margin-bottom: 10px;
  word-wrap: break-word;
`;

const Form = styled.form`
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 8px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ddd;
  outline: none;
  &:focus { border-color: #007bff; }
`;

const Button = styled.button`
  padding: 8px 20px;
  background-color: #007bff;
  color: white;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover { background-color: #0056b3; }
`;

const OptionButton = styled(Button)`
  background-color: #dc3545;
  &:hover { background-color: #c82333; }
`;

const ChatInput = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const chatRef = useRef();
  const navigate = useNavigate(); 

  const handleClearChat = () => {
    setMessages([]);
    setQuery("");
    localStorage.removeItem("chatHistory");
  };

  const handleHistoryClick = () => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
    navigate("/chat-history"); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;

    setMessages((prev) => [...prev, { text: query, isUser: true }]);

    try {
      const result = await axios.post("https://ai-chatbot-backend-2-h9m7.onrender.com/query/", { query });
      console.log("Backend response:", result.data);
      const fetchedResponse = result.data.response;
    let newMessages = [...messages, { text: "🔍 Searching for products...", isUser: false }];
    setMessages(newMessages);

      if (Array.isArray(fetchedResponse) && fetchedResponse.length > 0) {
        for (const item of fetchedResponse) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          newMessages = [
            ...newMessages,
            {
              text: `🛍️ ${item.name}\n💰 Price: $${item.price}\n📜 ${item.description}\n🏪 Supplier: ${item.supplier_name}\n👤 Contact: ${item.supplier_contact_name}\n📧 Email: ${item.supplier_contact_email}\n📞 Phone: ${item.supplier_contact_phone}`,
              isUser: false,
            },
          ];
          setMessages(newMessages);
        }
      } else {
        setMessages([...newMessages, { text: "❌ No products found for this query.", isUser: false }]);
      }
    } catch (error) {
      console.error("Error fetching from backend:", error);
      setMessages((prev) => [...prev, { text: "⚠ Error fetching product details. Try again later.", isUser: false }]);
    }

    setQuery("");
  };

  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      setMessages(JSON.parse(savedHistory)); 
    }
  }, []);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <Header>Product Finder Chat</Header>
      <ResultsContainer>
        {messages.map((msg, index) => (
          <Message key={index} isUser={msg.isUser}>
            {msg.text.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </Message>
        ))}
        <div ref={chatRef} />
      </ResultsContainer>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about a product..."
        />
        <Button type="submit" aria-label="Send Message">Send</Button>
        <OptionButton type="button" onClick={handleClearChat} aria-label="Clear Chat History">Clear Chat</OptionButton>
        <OptionButton type="button" onClick={handleHistoryClick} aria-label="View Chat History">Chat History</OptionButton>
      </Form>
    </Container>
  );
};

export default ChatInput;
