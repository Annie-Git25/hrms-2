// src/pages/HrAdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, useOutletContext } from "react-router-dom";
import { fetchEmployeesCount } from "../services/employeeService";
import EmployeeTurnoverVisualization from '../components/HrAdmin/EmployeeTurnoverVisualization';
import EmployeeAbsenteeismDashboard from '../components/HrAdmin/EmployeeAbsenteeismDashboard';
import EmployeesOnLeaveTracker from '../components/HrAdmin/EmployeesOnLeaveTracker';
import styles from '../styles/HrAdminDashboard.module.css';

const HrAdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ active: 0, inactive: 0 });

    const { setIsSidebarOpen } = useOutletContext(); 

    useEffect(() => {
        // Role-based access control check. 
        // Redirect to the root path, which then uses RoleBasedRedirect.jsx
        if (!user || user.role !== "hrAdmin") {
            navigate("/"); 
            return; // Important: Stop execution if unauthorized
        }

        // Load basic employee stats from service
        const loadEmployeeStats = async () => {
            const response = await fetchEmployeesCount();
            if (response.success) {
                setStats(response.data);
            } else {
                console.error("Failed to fetch employee stats:", response.error);
            }
        };

        loadEmployeeStats();
    }, [user, navigate]); // Dependencies for the useEffect hook

    return (
        <div className={styles.hrAdminDashboard}>
            {/* Main Page Title */}
            <h2 className={styles.pageTitle}>HR Admin Dashboard</h2> 

            {/* --- Overall Employee Stats Card --- */}
            {/* Use the dedicated section and card styles */}
            <section className={styles.statsSection}>
                <h3>Current Employee Snapshot</h3>
                <div className={styles.statCardsContainer}>
                    <div className={styles.statCard}>
                        <h4>Active Employees</h4>
                        <p>{stats.active}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h4>Inactive Employees</h4>
                        <p>{stats.inactive}</p>
                    </div>
                </div>
                <button className={styles.manageButton} onClick={() => navigate("/employees")}>
                    Manage Employees
                </button>
            </section>

            {/* --- Employee Turnover Rate Visualization Section --- */}
            <section className={styles.dashboardSection}>
                <h3 className={styles.sectionTitle}>Employee Turnover Analysis</h3>
                <EmployeeTurnoverVisualization />
            </section>

            {/* --- Employee Absenteeism and Tardiness Dashboard Section --- */}
            <section className={styles.dashboardSection}>
                <h3 className={styles.sectionTitle}>Absenteeism & Tardiness Metrics</h3>
                <EmployeeAbsenteeismDashboard />
            </section>

            {/* --- Employees on Leave Tracker Section --- */}
            <section className={styles.dashboardSection}>
                <h3 className={styles.sectionTitle}>Employees On Leave</h3>
                <EmployeesOnLeaveTracker />
            </section>

            
        </div>
    );
};

export default HrAdminDashboard;