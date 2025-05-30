// src/components/TopBanner.jsx
import React, { useState, useEffect } from "react";
import styles from "../styles/TopBanner.module.css";
import supabase from "../services/supabase.js";

const TopBanner = ({ pageTitle, onToggleSidebar }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            // Ensure "currentUserId" is dynamic, e.g., from your AuthContext or props
            const { data, error } = await supabase.from("notifications").select("*").eq("user_id", "currentUserId");
            if (!error) setNotifications(data);
        };
        fetchNotifications();
    }, []);

    return (
        <header className={styles.banner}>
            <button onClick={onToggleSidebar} className={styles.hamburger}>☰</button>
            <h2 className={styles.pageTitle}>{pageTitle}</h2> {/* Apply the new class here */}
            <div className={styles.search}> {/* Wrap input in a div for better styling control */}
                <input type="text" placeholder="Search..." />
            </div>
            <button className={styles.notifications}>
                🔔 {notifications.length > 0 && <span className={styles.badge}>{notifications.length}</span>}
            </button>
        </header>
    );
};

export default TopBanner;