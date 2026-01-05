const defaultTickets = [];

export const getTickets = () => {
  const stored = localStorage.getItem("tickets");
  return stored ? JSON.parse(stored) : defaultTickets; };

export const saveTickets = (tickets) => {
  localStorage.setItem("tickets", JSON.stringify(tickets)); };
