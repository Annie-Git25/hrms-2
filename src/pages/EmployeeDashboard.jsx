// src/pages/EmployeeDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import styles from "../styles/EmployeeDashboard.module.css"; // Ensure this CSS module is updated as well

const EmployeeDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    // You might fetch employee-specific dashboard data here, e.g., upcoming leaves, recent tasks, etc.
    const [employeeData, setEmployeeData] = useState(null);


    useEffect(() => {
        if (!user) {
            navigate("/login"); // Redirect to login if user isn't authenticated
            return; // Exit early
        }
        if (user.role !== "employee") {
            navigate("/hr-dashboard"); // Redirect non-employees to their respective dashboard (e.g., HR admin)
            return; // Exit early
        }

        // Fetch employee-specific dashboard data here if needed
        // const fetchEmployeeDashboardData = async () => {
        //     // Example: fetch user's upcoming leaves or tasks
        //     const { data, error } = await supabase.from('employee_dashboard_data').select('*').eq('user_id', user.id);
        //     if (data) setEmployeeData(data[0]);
        // };
        // fetchEmployeeDashboardData();

    }, [user, navigate]);

    // Optional: Add a loading state
    if (!user) {
        return <div className="loading-state">Loading user data...</div>; // Or a spinner
    }

    return (
        // This content will be rendered inside the 'page-content' div of Layout
        <div className="dashboard-content"> {/* Apply the general dashboard content class */}
            <h1 className="page-title-heading">Welcome, {user?.name}!</h1> {/* Apply the heading class */}

            {/* Example sections for an employee dashboard */}
            <div className={styles.infoCardsContainer}> {/* A container for info cards */}
                <div className={styles.card}>
                    <h3>Your Upcoming Leave</h3>
                    <p>No upcoming leave.</p> {/* Replace with actual data */}
                    <button className="primary-button" onClick={() => navigate("/leave")}>Apply for Leave</button>
                </div>
                <div className={styles.card}>
                    <h3>Recent Notifications</h3>
                    <p>No new notifications.</p> {/* Replace with actual data */}
                    <button className="primary-button" onClick={() => navigate("/notifications")}>View All</button>
                </div>
                {/* Add more cards like "My Tasks", "Performance Reviews", "Training Progress" */}
            </div>

            {/* The LeaveManagement component is now a separate route, so it's not rendered directly here */}
        </div>
    );
};

export default EmployeeDashboard;