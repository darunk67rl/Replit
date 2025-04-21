import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { generateUniqueId } from "@/lib/utils";
import { Wallet, LightbulbIcon, Bell } from "lucide-react";

// Notification interface
export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: "payment" | "insight" | "reminder" | "system";
  icon: React.ReactNode;
}

// Notification context interface
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider component
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from storage on mount
  useEffect(() => {
    const storedNotifications = localStorage.getItem("finall-notifications");
    if (storedNotifications) {
      try {
        const parsedNotifications = JSON.parse(storedNotifications).map((notification: any) => ({
          ...notification,
          timestamp: new Date(notification.timestamp),
        }));
        setNotifications(parsedNotifications);
        updateUnreadCount(parsedNotifications);
      } catch (error) {
        console.error("Failed to parse stored notifications:", error);
      }
    } else {
      // If no stored notifications, add some sample ones
      const sampleNotifications: Notification[] = [
        {
          id: generateUniqueId(),
          title: "Payment Successful",
          message: "Your payment of ₹2,450 to Amazon was successful.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: false,
          type: "payment",
          icon: <Wallet className="h-5 w-5 text-primary" />,
        },
        {
          id: generateUniqueId(),
          title: "Investment Tip",
          message: "Based on your profile, consider investing in these 3 mutual funds for better returns.",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
          read: false,
          type: "insight",
          icon: <LightbulbIcon className="h-5 w-5 text-accent" />,
        },
        {
          id: generateUniqueId(),
          title: "Insurance Renewal Reminder",
          message: "Your health insurance policy is due for renewal in 43 days. Review and renew to stay covered.",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          read: false,
          type: "reminder",
          icon: <Bell className="h-5 w-5 text-warning" />,
        },
      ];
      setNotifications(sampleNotifications);
      updateUnreadCount(sampleNotifications);
      localStorage.setItem("finall-notifications", JSON.stringify(sampleNotifications));
    }
  }, []);

  // Save notifications to storage when they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("finall-notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  // Helper to update unread count
  const updateUnreadCount = (notificationList: Notification[]) => {
    const count = notificationList.filter(n => !n.read).length;
    setUnreadCount(count);
  };

  // Add a new notification
  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: generateUniqueId(),
      timestamp: new Date(),
      read: false,
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true,
    }));
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem("finall-notifications");
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook for using the notification context
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
