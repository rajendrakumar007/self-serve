import { useState, useRef, useEffect } from "react";

const ChatBox = () => {
  // Static initial state
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "support",
      message: "Hello - How can we help you?",
    },
  ]);
  const [input, setInput] = useState("");
  
  // Auto-scroll to bottom ref
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotReply = (userMessage) => {
    const msg = userMessage.toLowerCase();
    if (msg.includes("policy") || msg.includes("insurance")) {
      return "I'd be happy to help with your policy details. Could you please provide your policy number or describe the issue?";
    } else if (msg.includes("claim")) {
      return "For claims assistance, please provide your claim number or details about the incident.";
    } else if (msg.includes("payment") || msg.includes("pay")) {
      return "Regarding payments, you can check your due dates in your account dashboard.";
    } else if (msg.includes("hello") || msg.includes("hi")) {
      return "Hello! How can I help you with your insurance needs today?";
    } else {
      return "Thanks for your message. Our support team will review it and get back to you shortly.";
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "customer",
      message: input,
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate bot delay
    setTimeout(() => {
      const botReply = {
        id: Date.now() + 1,
        sender: "support",
        message: generateBotReply(input),
      };
      setMessages((prev) => [...prev, botReply]);
    }, 600);
  };

  const startNewChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: "support",
        message: "Hello - How can we help you?",
      },
    ]);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 font-sans">
      
      {/* Header Actions */}
      <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700">Support Chat</h3>
        <button
          onClick={startNewChat}
          className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        >
          Start new chat
        </button>
      </div>

      {/* Chat Window */}
      <div className="h-80 overflow-y-auto p-4 bg-gray-100 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.sender === "customer" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-lg shadow-sm text-sm ${
                m.sender === "customer"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
              }`}
            >
              {m.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;