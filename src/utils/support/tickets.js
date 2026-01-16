// service.js
const API_URL = "http://localhost:4000/tickets";

export const getTickets = async (userId) => {
  const response = await fetch(`${API_URL}/?userId=${userId}`);
  if (!response.ok) throw new Error("Failed to fetch tickets");
  return response.json();
};

export const createTicket = async (ticketData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticketData),
  });
  if (!response.ok) throw new Error("Failed to create ticket");
  return response.json();
};

// UPDATED: Accepts data object to save rating
export const resolveTicket = async (id, data = {}) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    // Merges status: "RESOLVED" with the rating data passed in
    body: JSON.stringify({ status: "RESOLVED", ...data }), 
  });
  if (!response.ok) throw new Error("Failed to resolve ticket");
  return response.json();
};

// UPDATED: Resets rating to null on reopen
export const reopenTicket = async (id, description) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "OPEN",
      issueDescription: description,
      updatedDate: new Date().toISOString().split("T")[0],
      rating: null // Reset rating so it doesn't show on reopened tickets
    }),
  });
  if (!response.ok) throw new Error("Failed to reopen ticket");
  return response.json();
};