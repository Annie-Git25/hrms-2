// src/components/LoadingSpinner.jsx
import React from 'react';
import styles from '../styles/DashboardComponents.module.css'; // Reusing styles

const LoadingSpinner = () => {
    return (
        <div className={styles.loadingSpinner}>
            <div className="spinner"></div> {/* Add CSS for a spinner in your global or DashboardComponents.module.css */}
            <p>Loading data...</p>
        </div>
    );
};

export default LoadingSpinner;