import React from "react";
import styles from "./style.module.css";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Textarea({ 
  label, 
  error, 
  helperText,
  className,
  rows = 3,
  ...props 
}: TextareaProps) {
  const textareaClasses = `${styles.textarea} ${error ? styles.error : ''} ${className || ''}`;
  
  return (
    <div className={styles.inputGroup}>
      {label && (
        <label className={styles.label} htmlFor={props.id}>
          {label}
        </label>
      )}
      <textarea 
        className={textareaClasses}
        rows={rows}
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
      {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
    </div>
  );
}
