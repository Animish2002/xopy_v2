// SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../utils/AuthContext"; // Assuming you have AuthContext for user info

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return [context.socket, context.connected, context.joinPrintJobRoom];
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth(); // Get authenticated user details

  useEffect(() => {
    // Only create socket if we have a valid backend URL
    const SOCKET_URL = "http://localhost:8517";

    if (!SOCKET_URL || !user || user.role !== "SHOP_OWNER") return; // Don't connect if no user or URL or user is not shopowner

    console.log(`Attempting to connect to socket as user: ${user.id}`);

    // Create socket connection when component mounts
    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: {
        token: localStorage.getItem("token"),
        userId: user.id,
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    // Add after socketInstance creation
    socketInstance.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
      // Optional: Attempt reconnection
      setTimeout(() => socketInstance.connect(), 1000);
    });

    // Add authentication error handling
    socketInstance.on("unauthorized", (err) => {
      console.error("Auth error:", err.message);
      localStorage.removeItem("token"); // Clear invalid token
      window.location.reload(); // Force re-auth
    });

    // Add ping/pong for connection health
    setInterval(() => {
      if (socketInstance && connected) {
        socketInstance.emit("ping", Date.now());
      }
    }, 30000);

    socketInstance.on("pong", (latency) => {
      console.log(`Latency: ${Date.now() - latency}ms`);
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected! ID:", socketInstance.id);
      setConnected(true);

      // Join shop room if user is a shop owner
      if (user && user.role === "SHOP_OWNER") {
        const shopId =
          user.shopOwnerId ||
          localStorage.getItem("shopId") ||
          localStorage.getItem("sessionId");
        if (shopId) {
          console.log(`Joining shop room: ${shopId}`);
          socketInstance.emit("joinShopRoom", { shopId });
        } else {
          console.warn("No shop ID found for shop owner");
        }
      }
    });

    socketInstance.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${reason}`);
      setConnected(false);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      setConnected(false);
    });

    socketInstance.on("error", (err) => {
      console.error("Socket error:", err);
    });

    // Listen for reconnection attempts
    socketInstance.io.on("reconnect_attempt", (attempt) => {
      console.log(`Socket reconnection attempt ${attempt}`);
    });

    socketInstance.io.on("reconnect", (attempt) => {
      console.log(`Socket reconnected after ${attempt} attempts`);
      setConnected(true);
    });

    socketInstance.io.on("reconnect_error", (error) => {
      console.error("Socket reconnection error:", error);
    });

    setSocket(socketInstance);

    // In the useEffect cleanup:
    return () => {
      console.log("Cleaning up socket connection");
      if (socketInstance && socketInstance.connected) {
        socketInstance.disconnect();
      }
    };
  }, [user]); // Dependency on user ensures socket reconnects when user changes

  // Join a specific job tracking room (for customers)
  const joinPrintJobRoom = (printJobId) => {
    if (socket && connected) {
      console.log(`Joining print job room: ${printJobId}`);
      socket.emit("joinPrintJobRoom", { printJobId });
      return true;
    } else {
      console.warn("Cannot join print job room - socket not connected");
      return false;
    }
  };

  return (
    <SocketContext.Provider value={{ socket, connected, joinPrintJobRoom }}>
      {children}
    </SocketContext.Provider>
  );
};
