
// src/utils/auth.js (adapt path if different)
// NOTE: token/profile remain in localStorage; USERS are stored only on server (json-server).

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_EVENT = "auth-change";
const PROFILE_KEY = "user_profile";

// API base for mock server
const API_BASE = import.meta.env.VITE_MOCK_API_URL || "http://localhost:4000";

export const isLoggedIn = () => !!localStorage.getItem(AUTH_TOKEN_KEY);

export const login = (token, user) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  if (user) setCurrentUser(user);
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  clearCurrentUser();
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const setCurrentUser = (user) => {
  if (!user) return;
  const name = [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ");
  const profile = { name, email: user.email, phone: user.contact };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY));
  } catch {
    return null;
  }
};

export const clearCurrentUser = () => {
  localStorage.removeItem(PROFILE_KEY);
};

// ---------- USERS ON SERVER ONLY ----------

export const getUsers = async () => {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return await res.json();
};

export const findUserByEmail = async (email) => {
  const res = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error("Failed to search users by email");
  const arr = await res.json();
  return arr[0] || null;
};

export const findUserByContact = async (contact) => {
  const res = await fetch(`${API_BASE}/users?contact=${encodeURIComponent(contact)}`);
  if (!res.ok) throw new Error("Failed to search users by contact");
  const arr = await res.json();
  return arr[0] || null;
};

export const registerUser = async ({ firstName, middleName, lastName, email, password, contact }) => {
  // Check if email already exists (server)
  const existing = await findUserByEmail(email);
  if (existing) return { ok: false, message: "Email already registered" };

  const encoded = typeof window !== "undefined"
    ? window.btoa(password)
    : Buffer.from(password).toString("base64");

  const payload = { firstName, middleName, lastName, email, password: encoded, contact };

  // Persist to server -> json-server writes into src/data/db.json
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.ok) return { ok: true };
  return { ok: false, message: "Unable to register" };
};

export const verifyCredentials = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const encoded = typeof window !== "undefined"
    ? window.btoa(password)
    : Buffer.from(password).toString("base64");

  return user.password === encoded ? user : null;
};

export const updateUserProfile = async (email, updates) => {
  const user = await findUserByEmail(email);
  if (!user) return { ok: false, message: "User not found" };

  const payload = {};
  if (updates.firstName !== undefined) payload.firstName = updates.firstName;
  if (updates.middleName !== undefined) payload.middleName = updates.middleName;
  if (updates.lastName !== undefined) payload.lastName = updates.lastName;
  if (updates.contact !== undefined) payload.contact = updates.contact;
  if (updates.email !== undefined) payload.email = updates.email;

  const res = await fetch(`${API_BASE}/users/${user.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.ok) return { ok: true };
  return { ok: false, message: "Unable to update user" };
};

export { AUTH_TOKEN_KEY, AUTH_EVENT };
