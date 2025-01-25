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
  margin-bottom: 10px; /* Ensure there’s some space between messages */
  word-wrap: break-word; /* To handle long words properly */
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

    const lowerCaseQuery = query.toLowerCase().trim();

    // Predefined responses
    const responses = {
      "hi": "👋 Hi! I'm your assistant, here to help.",
      "help": "💡 Ask me about products, prices, and suppliers.",
      "hello": "👋 Hello! How can I assist you today?",
      "bye": "👋 Goodbye! Have a great day.",
      "thank you": "😊 You're welcome!",
      "who are you": "🤖 I'm your AI assistant, created to help you with your queries.",
      "tell me a joke": "😂 Why don't skeletons fight each other? They don't have the guts!",
      
      // Additional basic queries
      "good morning": "🌞 Good morning! How can I assist you today?",
      "good evening": "🌙 Good evening! How can I help?",
      "good night": "🌛 Good night! Sweet dreams.",
      "how are you": "I'm just a bot, but thanks for asking! How can I help?",
      "what's up": "Not much! What can I do for you?",
      "what's your name": "My name is Assistant, here to assist you with your queries.",
      "what can you do": "I can answer product queries, provide details about suppliers, and much more!",
      "are you there": "Yes, I'm here! How can I help?",
      "who created you": "I was created by developers using the latest AI technologies.",
      "how old are you": "I don't age, but I'm constantly learning and improving!",
      "tell me a riddle": "🧩 What has keys but can't open locks? A piano!",
      "how do I contact support": "You can reach our support team at support@company.com.",
      "what is your favorite color": "I don't have preferences, but I think blue is nice!",
      "can you play music": "I can't play music, but I can help you find it online!",
      "do you have a favorite movie": "I don't watch movies, but I can recommend some!",
      "can you help me with my homework": "Of course! What subject is it?",
      "what is the weather like": "I don't know the weather, but I can help you find it online.",
      "can you make me laugh": "Sure! Here's a joke: Why did the computer go to the doctor? It had a virus! 😂",
      "how do I reset my password": "You can reset your password by clicking 'Forgot Password' on the login screen.",
      "what time is it": "I don't have the current time, but you can check it on your device.",
      "where are you from": "I exist in the cloud, ready to assist you anywhere!",
      "can you send emails": "I cannot send emails, but I can help you with email-related tasks.",
      "what is your purpose": "My purpose is to assist you with any queries you have.",
      "tell me a fun fact": "Did you know? The Eiffel Tower can grow by up to 6 inches during the summer due to the expansion of the iron!",
      "can you translate for me": "I can help with translations. What would you like to translate?",
      "what is 2 + 2": "2 + 2 is 4.",
      "what is 3 x 5": "3 x 5 is 15.",
      "how do I get started": "Tell me what you're looking for, and I'll guide you from there.",
      "is it safe to shop online": "Yes, online shopping can be safe if you use trusted websites and payment methods.",
      "can I trust you": "I'm here to assist you to the best of my ability! My goal is to provide accurate and helpful responses.",
      "how do I get to the store": "I can help you find directions. Where are you located?",
      "can you recommend a book": "Sure! What genre do you prefer?",
      "do you have a favorite food": "I don't eat, but I think pizza is popular!",
      "what is the meaning of life": "Some say the meaning of life is to find happiness and make meaningful connections.",
      "can you solve math problems": "Yes! Let me know what problem you need help with.",
      "can I ask you anything": "Yes, feel free to ask anything! I'll do my best to assist.",
      "what is the capital of France": "The capital of France is Paris.",
      "how do I buy something": "You can browse products on our site, and when you're ready, click 'Add to Cart' and follow the checkout process.",
      "do you like shopping": "I can't shop, but I can help you with shopping-related questions!",
      "do you know any jokes": "I sure do! Why don't skeletons fight each other? They don't have the guts!",
      "what is AI": "AI (Artificial Intelligence) refers to machines that can perform tasks typically requiring human intelligence.",
      "is this the right product for me": "I can help you find the right product. Tell me more about what you're looking for!",
      "can you tell me about a product": "Of course! Let me know which product you'd like to know about.",
      "do you work 24/7": "Yes, I'm always here to help you, day or night!",
      "is this product available": "Let me check the availability for you.",
      "what are your hours of operation": "I'm available 24/7, ready to assist you whenever needed!",
      "how do I return an item": "You can initiate a return by contacting our customer service or visiting our returns page.",
      "can I change my order": "You may be able to modify your order depending on the status. Let me check for you.",
      "how do I track my order": "You can track your order by logging into your account and checking the 'Orders' section.",
      "can you find me the best deal": "Let me look for the best deals available for you!"
    };
    

    if (responses[lowerCaseQuery]) {
      setMessages((prev) => [...prev, { text: responses[lowerCaseQuery], isUser: false }]);
      setQuery("");
      return;
    }

    try {
      const result = await axios.post("http://localhost:8000/query/", { query });
      const fetchedResponse = result.data.response;

      let newMessages = [...messages, { text: "🔍 Searching for products...", isUser: false }];
setMessages(newMessages);

if (Array.isArray(fetchedResponse) && fetchedResponse.length > 0) {
  for (const item of fetchedResponse) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-sec delay
    newMessages = [
      ...newMessages,
      {
        text: `🛍️ ${item.name}\n💰 Price: $${item.price}\n📜 ${item.description}\n🏪 Supplier: ${item.supplier_name}\n👤 Contact: ${item.supplier_contact_name}\n📧 Email: ${item.supplier_contact_email}\n📞 Phone: ${item.supplier_contact_phone}`,
        isUser: false,
      },
    ];
    setMessages(newMessages); // This should happen outside the loop, after accumulating all messages
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
