import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNotifications } from "@/contexts/notification-context";
import { formatDate } from "@/lib/utils";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { notifications, markAllAsRead } = useNotifications();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      markAllAsRead();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, markAllAsRead]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div
        ref={panelRef}
        className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-neutral-900 shadow-xl"
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-neutral-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <p className="text-base font-medium mb-1">No notifications yet</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                When you get notifications, they'll appear here
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 border-b border-neutral-200 dark:border-neutral-700"
              >
                <div className="flex">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                    {notification.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">{notification.title}</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500">
                      {formatDate(notification.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
