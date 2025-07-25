import React from "react";
import styles from "./style.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({ 
  label, 
  error, 
  helperText,
  className,
  ...props 
}: InputProps) {
  const inputClasses = `${styles.input} ${error ? styles.error : ''} ${className || ''}`;
  
  return (
    <div className={styles.inputGroup}>
      {label && (
        <label className={styles.label} htmlFor={props.id}>
          {label}
        </label>
      )}
      <input 
        className={inputClasses}
        {...props}
      />
      {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
    </div>
  );
}
