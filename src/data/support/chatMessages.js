const defaultMessages = [
  {
    id: 1,
    sender: "support",
    message: "Hello - how can we help you?",
  },
];

export const getMessages = () => {
  const stored = localStorage.getItem("chatMessages");
  return stored ? JSON.parse(stored) : defaultMessages; };

export const saveMessages = (messages) => {
  localStorage.setItem("chatMessages", JSON.stringify(messages)); };

