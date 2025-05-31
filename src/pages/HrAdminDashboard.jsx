import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import styles from "../styles/EmployeeDashboard.module.css";

const EmployeeDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role !== "employee") {
            navigate("/dashboard"); // ✅ Redirect non-employees safely
            return;
        }
    }, [user, navigate]);

    if (!user) {
        return <div className="loading-state">Loading user data...</div>;
    }

    return (
        <div className="dashboard-content">
            <h1 className="page-title-heading">Welcome, {user?.email}!</h1>

            <div className={styles.infoCardsContainer}>
                <div className={styles.card}>
                    <h3>Your Upcoming Leave</h3>
                    <p>No upcoming leave.</p>
                    <button className="primary-button" onClick={() => navigate("/leave")}>
                        Apply for Leave
                    </button>
                </div>
                <div className={styles.card}>
                    <h3>Recent Notifications</h3>
                    <p>No new notifications.</p>
                    <button className="primary-button" onClick={() => navigate("/notifications")}>
                        View All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;