import React, { createContext, useContext, useEffect, useState } from "react";

import {
  AUTH_TOKEN_KEY,
  AUTH_EVENT,
  PROFILE_KEY,
  isLoggedIn,
  login as authLogin,      // writes token + profile + dispatches AUTH_EVENT
  logout as authLogout,    // clears token + profile + dispatches AUTH_EVENT
  getCurrentUser,          // reads PROFILE_KEY
  getCurrentUserId,
  getUserById,             // server fetch (json-server)
  verifyCredentials,       // server-side email+password verification
} from "../utils/auth/auth.js"; 

// Shape: { isAuthenticated, user, token, login, logout, loading }
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user,  setUser]  = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate session from localStorage on first load
  useEffect(() => {
    (async () => {
      try {
        if (isLoggedIn()) {
          const existingToken = localStorage.getItem(AUTH_TOKEN_KEY);
          setToken(existingToken || null);

          // Try profile first (PROFILE_KEY); if missing, fetch from server by id
          const profile = getCurrentUser();
          if (profile) {
            setUser(profile);
          } else {
            const id = getCurrentUserId();
            if (id) {
              try {
                const serverUser = await getUserById(id);
                if (serverUser) setUser(serverUser);
              } catch {/* ignore */}
            }
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Keep state in sync across tabs/windows and any external auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      if (!isLoggedIn()) {
        setToken(null);
        setUser(null);
        return;
      }
      setToken(localStorage.getItem(AUTH_TOKEN_KEY));
      setUser(getCurrentUser());
    };

    window.addEventListener(AUTH_EVENT, handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener(AUTH_EVENT, handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  // Login via server verification, then persist using your utils.login()
  const login = async ({ email, password }) => {
    const serverUser = await verifyCredentials(email, password);
    if (!serverUser) {
      throw new Error("Invalid credentials");
    }

    // Demo token (replace with real JWT from backend in production)
    const demoToken = `token-${serverUser.userId}-${Date.now()}`;

    // Persist token + profile; dispatches AUTH_EVENT internally
    authLogin(demoToken, serverUser);

    // Update local state from storage keys
    setToken(demoToken);
    setUser(getCurrentUser()); // profile shape: { name, email, phone, userId }
    return serverUser;
  };

  // Logout via utils, clear local state
  const logout = () => {
    authLogout();
    setToken(null);
    setUser(null);
  };

  const value = {
    isAuthenticated: Boolean(user),
    token,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext); 