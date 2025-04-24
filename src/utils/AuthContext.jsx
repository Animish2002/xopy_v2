// utils/AuthContext.js (modifications)
import React, { createContext, useState, useContext, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.clear();
          return null;
        }
        return {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          name: decoded.name,

        };
      } catch (error) {
        localStorage.clear();
        return null;
      }
    }
    return null;
  });

  const login = useCallback((newToken) => {
    try {
      const decoded = jwtDecode(newToken);
      localStorage.setItem("authToken", newToken);
      localStorage.setItem("sessionId", decoded.id.toString());
      localStorage.setItem("userName", decoded.name);
      localStorage.setItem("role", decoded.role);

      setUser({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
      });
    } catch (error) {
      console.error("Invalid token", error);
      throw new Error("Invalid authentication token");
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};