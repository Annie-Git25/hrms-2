import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/Sidebar.module.css";

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuth();
    const location = useLocation(); // Get current location

    if (!user) return null;

    return (
        <nav className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
            <button onClick={() => setCollapsed(!collapsed)}>☰</button>
            <div className={styles.profile}>
                <img src={user.profilePic || "/default-avatar.png"} alt="Avatar" className={styles.avatar} />
                <h3>{user.name}</h3>
                <p>{user.role}</p>
            </div>

            <ul>
                <li>
                    <Link
                        to="/dashboard"
                        className={location.pathname === "/dashboard" ? styles.active : ""}
                    >
                        {/* You can add an icon here if you want */}
                        <span>Dashboard</span>
                    </Link>
                </li>

                {user.role === "hrAdmin" && (
                    <>
                        <li>
                            <Link
                                to="/employees"
                                className={location.pathname === "/employees" ? styles.active : ""}
                            >
                                <span>Employee Management</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/leave"
                                className={location.pathname === "/leave" ? styles.active : ""}
                            >
                                <span>Leave Management</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/scheduling"
                                className={location.pathname === "/scheduling" ? styles.active : ""}
                            >
                                <span>Scheduling</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/training"
                                className={location.pathname === "/training" ? styles.active : ""}
                            >
                                <span>Training</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/performance"
                                className={location.pathname === "/performance" ? styles.active : ""}
                            >
                                <span>Performance</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/ranking"
                                className={location.pathname === "/ranking" ? styles.active : ""}
                            >
                                <span>Ranking & Recognition</span>
                            </Link>
                        </li>
                    </>
                )}

                <li>
                    <Link
                        to="/profile"
                        className={location.pathname === "/profile" ? styles.active : ""}
                    >
                        <span>Profile</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/settings"
                        className={location.pathname === "/settings" ? styles.active : ""}
                    >
                        <span>Settings</span>
                    </Link>
                </li>
            </ul>

            <button className={styles.logout}>Logout</button>
        </nav>
    );
};

export default Sidebar;