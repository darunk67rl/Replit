import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Bell, Moon, Sun } from "lucide-react";
import { NotificationPanel } from "@/components/ui/notification-panel";
import { useNotifications } from "@/contexts/notification-context";

export function StatusBar() {
  const { theme, setTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <h1 className="text-lg font-bold text-primary dark:text-primary">
              FinAll
            </h1>
            <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
              Beta
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleNotifications}
              className="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Bell className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-accent rounded-full text-white text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={toggleDarkMode}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-neutral-300" />
              ) : (
                <Moon className="h-5 w-5 text-neutral-600" />
              )}
            </button>
          </div>
        </div>
      </div>
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
}
