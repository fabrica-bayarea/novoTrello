"use client";

import { useNotificationStore } from '@/lib/stores/notification';
import Notification from ".";

export default function NotificationWrapper() {
  const { message, type, show, hideNotification } = useNotificationStore();

  if (!show) {
    return null;
  }

  return (
    <Notification
      message={message}
      type={type}
      onClose={hideNotification}
    />
  );
}
