import React from "react";
import styles from "./style.module.css";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function AuthButton({ children, ...props }: AuthButtonProps) {
  return (
    <button className={styles.button} {...props}>
      {children}
    </button>
  );
}
