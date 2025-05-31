import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBanner from "./TopBanner";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Layout.module.css";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading authentication...</div>; // ✅ Prevents premature rendering
    }

    if (!user) {
        return <Navigate to="/login" replace />; // ✅ Redirects unauthenticated users
    }

    const isHrAdmin = user.role === "hrAdmin";
    const mainContentClass = isHrAdmin ? styles.mainContentWithSidebar : styles.mainContentFullWidth;

    return (
        <div className={styles.appLayout}>
            {isHrAdmin && <Sidebar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isCollapsed={!isSidebarOpen} />}

            <div className={`${styles.mainContent} ${mainContentClass}`}>
                <TopBanner pageTitle="Dashboard" onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <div className={styles.pageContent}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;