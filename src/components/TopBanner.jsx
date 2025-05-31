import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx"; // Import AuthContext to access user data
import styles from "../styles/TopBanner.module.css";
import supabase from "../services/supabase.js";

const TopBanner = ({ pageTitle, onToggleSidebar }) => {
  const { user } = useAuth(); // Get the authenticated user from context
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Only fetch notifications if we have a logged-in user
    if (!user) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id); // Use the dynamic user id here

      if (error) {
        console.error("Error fetching notifications:", error.message);
        return;
      }
      setNotifications(data || []);
    };

    fetchNotifications();
  }, [user]); // Re-run when user changes

  return (
    <header className={styles.banner}>
      <button onClick={onToggleSidebar} className={styles.hamburger}>
        ☰
      </button>
      <h2 className={styles.pageTitle}>{pageTitle}</h2>
      <div className={styles.search}>
        <input type="text" placeholder="Search..." />
      </div>
      <button className={styles.notifications}>
        🔔{" "}
        {notifications.length > 0 && (
          <span className={styles.badge}>{notifications.length}</span>
        )}
      </button>
    </header>
  );
};

export default TopBanner;