// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading authentication...</div>; // ✅ Prevents rendering too early
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // ✅ Ensure user role is properly checked before navigation
    if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
        return <Navigate to={user.role === "employee" ? "/employee-dashboard" : "/hr-dashboard"} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;