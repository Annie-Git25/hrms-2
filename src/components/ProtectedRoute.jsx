// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming this provides `user` and `loading`

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth(); // Assuming useAuth provides loading state

  if (loading) {
    // You can render a loading spinner here while authentication state is being determined
    return <div>Loading authentication...</div>;
  }

  if (!user) {
    // If no user is logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user is logged in but their role is not allowed,
    // redirect to a general dashboard or an unauthorized page
    // For simplicity, let's redirect to a default dashboard.
    // You might want a more specific "Unauthorized" page.
    if (user.role === "employee") {
      return <Navigate to="/employee-dashboard" replace />;
    } else if (user.role === "hrAdmin") {
      return <Navigate to="/hr-dashboard" replace />;
    }
    return <Navigate to="/login" replace />; // Fallback
  }

  // If authenticated and authorized, render the child routes/component
  return <Outlet />;
};

export default ProtectedRoute;