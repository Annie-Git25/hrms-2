// src/components/ErrorMessage.jsx
import React from 'react';
import styles from '../styles/DashboardComponents.module.css'; // Reusing styles

const ErrorMessage = ({ message }) => {
    return (
        <div className={styles.errorMessage}>
            <p>Error: {message}</p>
        </div>
    );
};

export default ErrorMessage;