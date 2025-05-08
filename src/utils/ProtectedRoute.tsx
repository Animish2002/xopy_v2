import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Define the allowed roles for each route
interface ProtectedRouteProps {
  allowedRoles?: ("ADMIN" | "SHOP_OWNER" )[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = [],
}) => {
  const { isAuthenticated, user } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />;
  }

  // If roles are specified and user's role is not in allowed roles
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect to unauthorized page or home page
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and role is allowed, render the child routes
  return <Outlet />;
};

// Specific role-based route components for easier usage
export const AdminRoute: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute allowedRoles={["ADMIN"]}>
    {children ? children : <Outlet />}
  </ProtectedRoute>
);

export const ShopownerRoute: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute allowedRoles={["SHOP_OWNER"]}>
    {children ? children : <Outlet />}
  </ProtectedRoute>
);
