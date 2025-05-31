// src/components/RoleBasedRedirect.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleBasedRedirect = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return; // ✅ Prevents unnecessary redirects while loading

        if (!user) {
            navigate("/login", { replace: true });
            return;
        }

        if (user.role === "hrAdmin") {
            navigate("/hr-dashboard", { replace: true });
        } else if (user.role === "employee") {
            navigate("/employee-dashboard", { replace: true });
        } else {
            console.warn("Unhandled user role:", user.role);
            navigate("/unauthorized", { replace: true }); // ✅ Redirect to an "Unauthorized" page instead of login loop
        }
    }, [user, loading, navigate]);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            Redirecting...
        </div>
    );
};

export default RoleBasedRedirect;