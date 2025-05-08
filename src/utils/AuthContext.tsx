import React, { createContext, useState, useContext, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

// Define the user interface based on actual token structure
interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SHOP_OWNER";
}

// Define the token payload interface to match your actual token
interface TokenPayload {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "SHOP_OWNER";
  shopOwnerId: string;
  iat: number;
  exp: number;
}

// Define the AuthContext type
interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user from localStorage on first load
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          // Token is expired, clear localStorage
          localStorage.clear();
          return null;
        }
        return {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          name: decoded.name,
          shopOwnerId: decoded.shopOwnerId,
        };
      } catch (error) {
        localStorage.clear();
        return null;
      }
    }
    return null;
  });

  const login = (newToken: string) => {
    try {
      const decoded = jwtDecode<TokenPayload>(newToken);

      // Store token in localStorage
      localStorage.setItem("authToken", newToken);
      localStorage.setItem("sessionId", decoded.id.toString());
      localStorage.setItem("userName", decoded.name);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("shopOwnerId", decoded.shopOwnerId.toString());

      // Set user state
      setUser({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
      });
    } catch (error) {
      console.error("Invalid token", error);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.clear();

    // Clear state
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
