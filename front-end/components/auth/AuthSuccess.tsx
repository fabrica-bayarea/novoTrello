import React from "react";
import styles from "@/app/auth/style.module.css";

export default function AuthSuccess({ message }: { message?: string }) {
  if (!message) return null;
  return <div className={styles.success}>{message}</div>;
}
