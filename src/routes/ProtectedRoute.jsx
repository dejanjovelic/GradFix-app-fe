import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (roles.length > 0) {
    const hasRequiredRole = user?.roles?.some((role) =>
      roles.includes(role)
    );

    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;