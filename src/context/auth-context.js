// AuthContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const userDataString = localStorage.getItem("user");

      try {
        return userDataString ? JSON.parse(userDataString) : null;
      } catch (e) {
        console.error("Error al parsear userData de localStorage:", e);
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL;

      if (token) {
        await fetch(`${baseUrl}/api/auth/signout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
