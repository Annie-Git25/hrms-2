import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AuthPage.module.css";

const AuthPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // ✅ Added error state
    const { user, login, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(""); // ✅ Reset error before login attempt

        try {
            await login(email, password);
            console.log("✅ Login successful!");
            navigate("/dashboard"); // ✅ Redirects to dashboard after login
        } catch (error) {
            console.error("❌ Login failed:", error.message);
            setErrorMessage(error.message); // ✅ Display error message on UI
        }
    };

    return (
        <div className={styles.authContainer}>
            <h2 className={styles.title}>Login HRMS</h2>

            {loading && <p className={styles.loadingText}>Authenticating...</p>}
            {errorMessage && <p className={styles.errorText}>{errorMessage}</p>} {/* ✅ Shows login errors */}

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
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default AuthPage;