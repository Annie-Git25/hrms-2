// src/components/Sidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/Sidebar.module.css";

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuth();
    const location = useLocation();

    console.log("Sidebar: Rendering. User object:", user); // ADD THIS
    console.log("Sidebar: User role:", user?.role); // ADD THIS

    if (!user) {
        console.log("Sidebar: User is null, returning null."); // ADD THIS
        return null;
    }

    // ... (rest of sidebar code)
};
export default Sidebar;