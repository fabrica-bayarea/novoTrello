import React, { useEffect, useState } from "react";
import styles from "./style.module.css";

interface NotificationProps {
  message: string;
  type: "success" | "failed" | "info";
  onClose?: () => void;
}

const icons = {
  success: "✔️",
  failed: "❌",
  info: "ℹ️"
};

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose && onClose(), 500);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={[
        styles.notification,
        styles[`notification--${type}`],
        !visible && styles["notification--hidden"]
      ].filter(Boolean).join(" ")}
    >
      <span className={styles.notification__icon}>{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
};

export default Notification;
