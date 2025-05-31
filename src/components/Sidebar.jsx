import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/Sidebar.module.css";

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return null; // ✅ Prevent rendering sidebar if user is not authenticated
    }

    return (
        <nav className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
            <button onClick={() => setCollapsed(!collapsed)} className={styles.toggleButton}>
                {collapsed ? "▶" : "◀"}
            </button>

            <ul className={styles.navLinks}>
                <li className={location.pathname === "/dashboard" ? styles.active : ""}>
                    <Link to="/dashboard">Dashboard</Link>
                </li>
                {user.role === "hrAdmin" && (
                    <>
                        <li className={location.pathname === "/employees" ? styles.active : ""}>
                            <Link to="/employees">Manage Employees</Link>
                        </li>
                        <li className={location.pathname === "/leave-requests" ? styles.active : ""}>
                            <Link to="/leave-requests">Leave Requests</Link>
                        </li>
                    </>
                )}
                {user.role === "employee" && (
                    <>
                        <li className={location.pathname === "/profile" ? styles.active : ""}>
                            <Link to="/profile">My Profile</Link>
                        </li>
                        <li className={location.pathname === "/leave" ? styles.active : ""}>
                            <Link to="/leave">Apply for Leave</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Sidebar;