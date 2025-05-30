//src/pages/AuthPage.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AuthPage.module.css"; // Changed 'Style' to 'styles' (common convention)

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  const response = await login(email, password); // ✅ Now correctly calls login()

  if (response.success) {
    navigate(response.role === "employee" ? "/employee-dashboard" : "/hr-dashboard");
  } else {
    alert(`Login failed: ${response.error}`);
  }
};


  return (
    <div className={styles.authContainer}>
      <h2 className={styles.title}>Login HRMS</h2>
      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Login</button> {/* Use styles.button */}
      </form>
    </div>
  );
};

export default AuthPage;