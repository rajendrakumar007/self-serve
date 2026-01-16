import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Users
export const getUsers = () => api.get("/users");
export const getUserById = (id) => api.get(`/users/${id}`);

// Policies
export const getPolicies = () => api.get("/policies");
export const getPoliciesByUserId = (userId) =>
  getPolicies().then((res) => res.data.filter((p) => p.userId === userId));

// Claims
export const getClaims = () => api.get("/claims");
export const getClaimsByUserId = (userId) =>
  getClaims().then((res) => res.data.filter((c) => c.userId === userId));
export const createClaim = (claimData) => api.post("/claims", claimData);

// Notifications
export const getNotifications = () => api.get("/notifications");
export const getNotificationsByUserId = (userId) =>
  getNotifications().then((res) => res.data.filter((n) => n.userId === userId));

// Payments
export const getPayments = () => api.get("/payments");
export const getPaymentsByUserId = (userId) =>
  getPayments().then((res) => res.data.filter((p) => p.userId === userId));

export default api;
