// src/components/Layout.jsx
import React, { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import Sidebar from "./Sidebar"; // Your HR Admin specific sidebar
import TopBanner from "./TopBanner";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Layout.module.css"; // Adjust path as needed

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user } = useAuth();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const context = useOutletContext();
    const pageTitle = context?.pageTitle || "Default Dashboard Title";

    const isHrAdmin = user && user.role === "hrAdmin";

    // Apply classes using the imported styles object
    const mainContentClass = isHrAdmin
        ? styles.mainContentWithSidebar
        : styles.mainContentFullWidth;

    return (
        <div className={styles.appLayout}> {/* Use the CSS Module class */}
            {isHrAdmin && (
                <Sidebar onToggleSidebar={toggleSidebar} isCollapsed={!isSidebarOpen} />
            )}

            {/* Combine base mainContent class with conditional class */}
            <div className={`${styles.mainContent} ${mainContentClass}`}>
                <TopBanner pageTitle={pageTitle} onToggleSidebar={toggleSidebar} />
                <div className={styles.pageContent}> {/* Use the CSS Module class */}
                    <Outlet context={{ setIsSidebarOpen }} />
                </div>
            </div>
        </div>
    );
};

export default Layout;