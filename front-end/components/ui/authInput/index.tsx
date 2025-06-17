import React from "react";
import styles from "./style.module.css";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function AuthInput({ label, ...props }: AuthInputProps) {
  return (
    <div className={styles.inputGroup}>
      <input className={styles.input} {...props} />
      {label && <label className={styles.label}>{label}</label>}
    </div>
  );
}
