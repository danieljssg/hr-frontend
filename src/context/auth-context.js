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

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL;

      const response = await fetch(`${baseUrl}/api/auth/signout`, {
        method: "GET",
        credentials: "include",
      });
      console.log(response);
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
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
