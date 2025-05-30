//src/components/Header.jsx
import React from "react";
import { useAuth } from "../context/AuthContext.jsx"; // Import authentication context
import styles from "../styles/Header.module.css";

const Header = ({ onLogout }) => {
  const { user } = useAuth(); // Fetch logged-in user from Supabase

  return (
    <header className={styles.header}>
      <h1>HRMS System</h1>
      {user ? (
        <div className={styles.userInfo}>
          <span>{user.name} ({user.role})</span>
          <button className={styles.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading user...</p>
      )}
    </header>
  );
};

export default Header;