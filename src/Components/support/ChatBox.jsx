import { useState, useEffect } from "react"; 
import { getMessages , saveMessages } from "../../data/support/chatMessages";

const ChatBox = ({ initialMessage }) => {
  const [messages, setMessages] = useState(getMessages());
  const [input, setInput] = useState("");

  useEffect(() => {
    if (initialMessage && initialMessage.trim()) {
      // Automatically send the initial message as a user message
      const userMsg = {
        id: Date.now(),
        sender: "customer",
        message: initialMessage,
      };

      const botReply = {
        id: Date.now() + 1,
        sender: "support",
        message: generateBotReply(initialMessage),
      };

      const updated = [...messages, userMsg, botReply];
      setMessages(updated);
      saveMessages(updated);
    }
  }, [initialMessage]);

  const generateBotReply = (userMessage) => {
    const msg = userMessage.toLowerCase();
    if (msg.includes("policy") || msg.includes("insurance")) {
      return "I'd be happy to help with your policy details. Could you please provide your policy number or describe the issue?";
    } else if (msg.includes("claim")) {
      return "For claims assistance, please provide your claim number or details about the incident. Our team will guide you through the process.";
    } else if (msg.includes("payment") || msg.includes("pay")) {
      return "Regarding payments, you can check your due dates in your account dashboard. If you need help with a payment, let me know!";
    } else if (msg.includes("renewal") || msg.includes("renew")) {
      return "For policy renewals, you can view upcoming renewals in your dashboard. Would you like help with renewing a specific policy?";
    } else if (msg.includes("cancel") || msg.includes("terminate")) {
      return "If you're looking to cancel a policy, please provide the policy details. Note that cancellation terms may apply.";
    } else if (msg.includes("contact") || msg.includes("phone") || msg.includes("email")) {
      return "You can reach our support team at support@selfserve.com or call 1-800-INSURANCE. How else can I assist you?";
    } else if (msg.includes("hello") || msg.includes("hi")) {
      return "Hello! How can I help you with your insurance needs today?";
    } else {
      return "Thanks for your message. Our support team will review it and get back to you shortly. For immediate assistance, try our FAQ section.";
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "customer",
      message: input,
    };

    const botReply = {
      id: Date.now() + 1,
      sender: "support",
      message: generateBotReply(input),
    };

    const updated = [...messages, userMsg, botReply];

    setMessages(updated);
    saveMessages(updated);
    setInput("");
  };

  const startNewChat = () => {
    const fresh = [
      {
        id: 1,
        sender: "support",
        message: "Hello - How can we help you?",
      },
    ];

    setMessages(fresh);
    saveMessages(fresh);
  };

  return (
    <div>
      <div className="flex justify-end mb-2">
        <button
          onClick={startNewChat}
          className="text-sm text-primary underline hover:text-primaryDark"
        >
          Start new chat
        </button>
      </div>

      <div className="bg-bgMuted dark:bg-secondary border border-borderDefault rounded-xl p-4 h-72 overflow-y-auto mb-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`mb-2 ${
              m.sender === "customer" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                m.sender === "customer"
                  ? "bg-primary text-textInverted"
                  : "bg-bgCard dark:bg-secondary text-textPrimary dark:text-textInverted"
              }`}
            >
              {m.message}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border border-borderDefault rounded-lg px-3 py-2 bg-bgCard dark:bg-secondary text-white dark:text-white placeholder-textMuted dark:placeholder-textSecondary"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="bg-primary text-textInverted px-4 py-2 rounded-lg hover:bg-primaryDark transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
