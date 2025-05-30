// src/pages/HrAdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchEmployeesCount } from "../services/employeeService";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, useOutletContext } from "react-router-dom"; // Import useOutletContext

const HrAdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ active: 0, inactive: 0 });

    const { setIsSidebarOpen } = useOutletContext(); // Get context from Layout

    useEffect(() => {
        if (!user || user.role !== "hrAdmin") {
            navigate("/dashboard"); // Redirect unauthorized users
        }

        const loadEmployeeStats = async () => {
            const response = await fetchEmployeesCount();
            if (response.success) setStats(response.data);
        };

        loadEmployeeStats();
    }, [user, navigate]);

    return (
        <div className="dashboard-content">
            <h2 className="page-title-heading">HR Admin Dashboard</h2> {/* Explicit title here */}
            {/* ... rest of your dashboard content */}
            <p>Active Employees: {stats.active}</p>
            <p>Inactive Employees: {stats.inactive}</p>

            <button className="primary-button" onClick={() => navigate("/employees")}>
                Manage Employees
            </button>
        </div>
    );
};

export default HrAdminDashboard;