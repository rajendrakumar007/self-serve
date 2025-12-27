import usersSeed from "../data/users.json";

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_EVENT = "auth-change";
const USERS_KEY = "users";
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

// --- helpers: try API first, fallback to localStorage + seed ---
export const getUsers = async () => {
  try {
    const res = await fetch(`${API_BASE}/users`);
    if (res.ok) return await res.json();
  } catch (e) {
    // ignore, fallback
  }
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }
  return usersSeed?.users ?? [];
};

export const findUserByEmail = async (email) => {
  try {
    const res = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email)}`);
    if (res.ok) {
      const arr = await res.json();
      return arr[0] || null;
    }
  } catch (e) {
    // fallback to local
  }
  const users = await getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
};

export const findUserByContact = async (contact) => {
  try {
    const res = await fetch(`${API_BASE}/users?contact=${encodeURIComponent(contact)}`);
    if (res.ok) {
      const arr = await res.json();
      return arr[0] || null;
    }
  } catch (e) {
    // fallback to local
  }
  const users = await getUsers();
  return users.find((u) => u.contact === contact) || null;
};

// Save on server (POST) or fallback to localStorage
export const registerUser = async ({ firstName, middleName, lastName, email, password, contact }) => {
  // check existing
  const existing = await findUserByEmail(email);
  if (existing) return { ok: false, message: "Email already registered" };

  const encoded = typeof window !== "undefined" ? window.btoa(password) : Buffer.from(password).toString("base64");
  const payload = { firstName, middleName, lastName, email, password: encoded, contact };

  // Try server
  try {
    const res = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) return { ok: true };
  } catch (e) {
    // fallback
  }

  // fallback: persist in localStorage
  const users = (await getUsers()) || [];
  users.push(payload);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { ok: true };
};

export const verifyCredentials = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const encoded = typeof window !== "undefined" ? window.btoa(password) : Buffer.from(password).toString("base64");
  if (user.password === encoded) return user;
  return null;
};

// Update a user's profile (try server, fallback to localStorage)
export const updateUserProfile = async (email, updates) => {
  // find existing user (server or local)
  const user = await findUserByEmail(email);
  if (!user) return { ok: false, message: "User not found" };

  // prepare payload (only allow certain fields)
  const payload = {};
  if (updates.firstName !== undefined) payload.firstName = updates.firstName;
  if (updates.middleName !== undefined) payload.middleName = updates.middleName;
  if (updates.lastName !== undefined) payload.lastName = updates.lastName;
  if (updates.contact !== undefined) payload.contact = updates.contact;
  if (updates.email !== undefined) payload.email = updates.email;

  // Try server patch
  try {
    if (user.id) {
      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return { ok: true };
    }
  } catch (e) {
    // ignore and fallback
  }

  // fallback: update localStorage users list
  try {
    const users = (await getUsers()) || [];
    const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) return { ok: false, message: "User not found" };
    users[idx] = { ...users[idx], ...payload };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { ok: true };
  } catch (e) {
    return { ok: false, message: "Unable to update user" };
  }
};

export { AUTH_TOKEN_KEY, AUTH_EVENT };
