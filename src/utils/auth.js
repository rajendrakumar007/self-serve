
// src/utils/auth.js

// -------- Keys & constants --------
const AUTH_TOKEN_KEY = "auth_token";
const AUTH_EVENT = "auth-change";
const PROFILE_KEY = "user_profile";

// API base from env or default to local mock server
const API_BASE = import.meta.env?.VITE_MOCK_API_URL || "http://localhost:4000";

// -------- Password encoding (demo only; not secure for production) --------
const encodePassword = (plain) => {
  if (typeof plain !== "string") return "";
  // Base64 is not secure; use bcrypt or argon2 on the server in real apps.
  return typeof window !== "undefined"
    ? window.btoa(plain)
    : Buffer.from(plain).toString("base64");
};

// -------- Auth state helpers --------
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

// -------- Local profile storage --------
export const setCurrentUser = (user) => {
  if (!user) return;
  const name = [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ");
  const profile = {
    id: user.id ?? null,           // supports string or number
    name,
    email: user.email ?? "",
    phone: user.contact ?? "",
    address: user.address ?? "",
    gender: user.gender ?? "",
    // Never store password locally
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearCurrentUser = () => {
  localStorage.removeItem(PROFILE_KEY);
};

// ---------- Server helpers ----------
export const getUsers = async () => {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return await res.json();
};

export const getUserById = async (id) => {
  if (id == null) return null;
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(id)}`);
  if (!res.ok) return null;
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

// ---------- Custom ID scheme helpers ----------
const ID_PREFIX = "26BH-";
const ID_PAD_LENGTH = 3;

const parseSeq = (id) => {
  if (typeof id !== "string" || !id.startsWith(ID_PREFIX)) return null;
  const numStr = id.slice(ID_PREFIX.length);
  return /^\d+$/.test(numStr) ? parseInt(numStr, 10) : null;
};

const computeNextId = async () => {
  const users = await getUsers();
  const maxSeq = users.reduce((max, u) => {
    const seq = parseSeq(u?.id);
    return seq !== null ? Math.max(max, seq) : max;
  }, -1);
  const nextSeq = maxSeq + 1;
  const padded = String(nextSeq).padStart(ID_PAD_LENGTH, "0");
  return `${ID_PREFIX}${padded}`;
};

const idExists = async (id) => {
  const res = await fetch(`${API_BASE}/users?id=${encodeURIComponent(id)}`);
  if (!res.ok) return false;
  const arr = await res.json();
  return Array.isArray(arr) && arr.length > 0;
};

// ---------- Register / Verify ----------
export const registerUser = async ({
  firstName,
  middleName,
  lastName,
  email,
  password,
  contact,
  address = "",
  gender = "",
}) => {
  // Enforce unique email
  const existing = await findUserByEmail(email);
  if (existing) return { ok: false, message: "Email already registered" };

  const encodedPassword = encodePassword(password);

  // Attempt to generate a unique ID (retry a couple of times on conflicts)
  let customId = await computeNextId();

  for (let attempt = 0; attempt < 3; attempt++) {
    if (!(await idExists(customId))) break; // looks safe to use
    // conflict found; recompute from latest users
    customId = await computeNextId();
  }

  const payload = {
    id: customId, // <-- include custom id
    firstName,
    middleName,
    lastName,
    email,
    password: encodedPassword,
    contact,
    address,
    gender,
  };

  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) return { ok: false, message: "Unable to register" };

  let created = null;
  try {
    created = await res.json();
  } catch {
    created = null;
  }

  const finalUser = created || payload;
  return { ok: true, user: finalUser };
};

export const verifyCredentials = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const encoded = encodePassword(password);
  return user.password === encoded ? user : null;
};

// ---------- Updates ----------
export const updateUserProfile = async (email, updates) => {
  const user = await findUserByEmail(email);
  if (!user) return { ok: false, message: "User not found" };

  const payload = {};
  if (updates.firstName !== undefined) payload.firstName = updates.firstName;
  if (updates.middleName !== undefined) payload.middleName = updates.middleName;
  if (updates.lastName !== undefined) payload.lastName = updates.lastName;
  if (updates.contact !== undefined) payload.contact = updates.contact;
  if (updates.email !== undefined) payload.email = updates.email;
  if (updates.address !== undefined) payload.address = updates.address;
  if (updates.gender !== undefined) payload.gender = updates.gender;
  if (updates.password !== undefined) {
    payload.password = encodePassword(updates.password);
  }

  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(user.id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) return { ok: false, message: "Unable to update user" };

  const current = getCurrentUser();
  if (current?.id === user.id) {
    const updatedServerUser = await getUserById(user.id);
    if (updatedServerUser) setCurrentUser(updatedServerUser);
  }

  return { ok: true };
};

export const updateUserById = async (id, updates) => {
  const payload = {};
  if (updates.firstName !== undefined) payload.firstName = updates.firstName;
  if (updates.middleName !== undefined) payload.middleName = updates.middleName;
  if (updates.lastName !== undefined) payload.lastName = updates.lastName;
  if (updates.contact !== undefined) payload.contact = updates.contact;
  if (updates.email !== undefined) payload.email = updates.email;
  if (updates.address !== undefined) payload.address = updates.address;
  if (updates.gender !== undefined) payload.gender = updates.gender;
  if (updates.password !== undefined) {
    payload.password = encodePassword(updates.password);
  }

  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) return { ok: false, message: "Unable to update user" };

  const current = getCurrentUser();
  if (current?.id === id) {
    const updatedServerUser = await getUserById(id);
    if (updatedServerUser) setCurrentUser(updatedServerUser);
  }

  return { ok: true };
};

// ---------- Password Reset (OTP) helpers ----------

const RESET_OTP_PREFIX = "reset_otp:"; // key: reset_otp:<userId>
const RESET_CTX_KEY = "reset_ctx";     // holds { userId, email, contact }
const RESET_TOKEN_KEY = "reset_token"; // holds { userId, expiresAt }

const genOtp = () => String(Math.floor(100000 + Math.random() * 900000));

export const startPasswordReset = async ({ method, value }) => {
  let user = null;
  if (method === "email") {
    user = await findUserByEmail(value);
    if (!user) return { ok: false, message: "No user found for this email." };
  } else {
    user = await findUserByContact(value);
    if (!user) return { ok: false, message: "No user found for this mobile." };
  }

  const otp = genOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  localStorage.setItem(`${RESET_OTP_PREFIX}${user.id}`, JSON.stringify({ otp, expiresAt }));

  localStorage.setItem(RESET_CTX_KEY, JSON.stringify({
    userId: user.id,
    email: user.email ?? "",
    contact: user.contact ?? "",
  }));

  // Return OTP (demo only)
  return { ok: true, user, otp };
};

export const verifyResetOtp = (code) => {
  try {
    const ctxRaw = localStorage.getItem(RESET_CTX_KEY);
    if (!ctxRaw) return { ok: false, message: "Reset session expired. Please request again." };
    const ctx = JSON.parse(ctxRaw);
    const key = `${RESET_OTP_PREFIX}${ctx.userId}`;
    const otpRaw = localStorage.getItem(key);
    if (!otpRaw) return { ok: false, message: "OTP not found or expired." };

    const { otp, expiresAt } = JSON.parse(otpRaw);
    if (Date.now() > expiresAt) {
      localStorage.removeItem(key);
      return { ok: false, message: "OTP expired. Please request a new one." };
    }
    if (String(code) !== String(otp)) return { ok: false, message: "Invalid OTP." };

    const token = { userId: ctx.userId, expiresAt: Date.now() + 10 * 60 * 1000 };
    localStorage.setItem(RESET_TOKEN_KEY, JSON.stringify(token));

    return { ok: true };
  } catch {
    return { ok: false, message: "Unable to verify OTP." };
  }
};

export const getResetToken = () => {
  try {
    const raw = localStorage.getItem(RESET_TOKEN_KEY);
    if (!raw) return null;
    const token = JSON.parse(raw);
    if (Date.now() > token.expiresAt) {
      localStorage.removeItem(RESET_TOKEN_KEY);
      return null;
    }
    return token;
  } catch {
    return null;
  }
};

export const clearResetFlow = () => {
  try {
    const ctxRaw = localStorage.getItem(RESET_CTX_KEY);
    if (ctxRaw) {
      const ctx = JSON.parse(ctxRaw);
      localStorage.removeItem(`${RESET_OTP_PREFIX}${ctx.userId}`);
    }
  } catch {}
  localStorage.removeItem(RESET_CTX_KEY);
  localStorage.removeItem(RESET_TOKEN_KEY);
};

export { AUTH_TOKEN_KEY, AUTH_EVENT, PROFILE_KEY };
