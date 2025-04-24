// utils/ProtectedRoute.js
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const ProtectedRoute = ({ 
  allowedRoles = [], 
  redirectPath = "/sign-in" 
}) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the attempted URL for redirecting post-login
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // If user's role is not in the allowed roles, redirect to unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};