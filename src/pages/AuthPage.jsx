//src/pages/AuthPage.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AuthPage.module.css";

const AuthPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { user, login, loading } = useAuth(); // ✅ Removed duplicate `useAuth()` call
    const navigate = useNavigate();

    console.log("🔍 User Data from AuthContext:", user); // ✅ Track user state
    console.log("🔍 Loading State:", loading); // ✅ Track loading state

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await login(email, password);

            if (response?.success) {
                console.log("✅ Login successful!", response);
                navigate(response.role === "employee" ? "/employee-dashboard" : "/hr-dashboard");
            } else {
                console.error("❌ Login failed:", response.error);
                alert(`Login failed: ${response.error}`);
            }
        } catch (error) {
            console.error("🔥 Unexpected login error:", error);
            alert("An error occurred while logging in. Please try again.");
        }
    };

    return (
        <div className={styles.authContainer}>
            <h2 className={styles.title}>Login HRMS</h2>

            {loading && <p className={styles.loadingText}>Authenticating...</p>} {/* ✅ Displays while loading */}

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
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? "Logging in..." : "Login"} {/* ✅ Prevents multiple requests */}
                </button>
            </form>
        </div>
    );
};

export default AuthPage;