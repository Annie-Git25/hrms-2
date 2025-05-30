//src/components.Button.jsx
import React from "react";
import styles from "../styles/Button.module.css";

const Button = ({ onClick, children, variant = "primary", ariaLabel, disabled = false, isLoading = false }) => {
  return (
    <button 
      className={`${styles.button} ${styles[variant]} ${disabled ? styles.disabled : ""}`} 
      onClick={!disabled && !isLoading ? onClick : undefined}
      disabled={disabled || isLoading}
      aria-label={ariaLabel || children}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

const handleClick = (event) => {
  event.preventDefault(); 
  onClick?.();
};

export default Button;
