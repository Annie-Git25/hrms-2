// src/components/Layout.jsx
import React, { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom"; // Import Outlet and useOutletContext
import Sidebar from "./Sidebar";
import TopBanner from "./TopBanner";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        // You might need to add/remove a class from the body or main-content
        // to handle the actual sidebar collapsing/expanding via CSS
    };

    // Get pageTitle from Outlet context
    const context = useOutletContext();
    const pageTitle = context?.pageTitle || "Default Dashboard Title"; // Fallback title

    return (
        <div className="app-container">
            <Sidebar onToggleSidebar={toggleSidebar} isCollapsed={!isSidebarOpen} />
            <div className="main-content">
                <TopBanner pageTitle={pageTitle} onToggleSidebar={toggleSidebar} />
                <div className="page-content">
                    {/* Render the nested route component, passing context */}
                    <Outlet context={{ setIsSidebarOpen }} /> {/* Pass down relevant functions if needed */}
                </div>
            </div>
        </div>
    );
};

export default Layout;