import React from "react";
import styles from "@/app/auth/style.module.css";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function AuthInput({ label, ...props }: AuthInputProps) {
  return (
    <div className={styles.inputGroup}>
      {label && <label className={styles.label}>{label}</label>}
      <input className={styles.input} {...props} />
    </div>
  );
}
