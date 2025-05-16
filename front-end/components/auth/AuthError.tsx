import React from "react";
import styles from "@/app/auth/style.module.css";

export default function AuthError({ message }: { message?: string }) {
  if (!message) return null;
  return <div className={styles.error}>{message}</div>;
}
