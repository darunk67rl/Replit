import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/components/theme-provider";
import { Bell, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function Header() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Query for AI insights to use as notifications
  const { data: insights } = useQuery({
    queryKey: [`/api/users/${user?.id}/ai-insights`],
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (insights) {
      const unreadCount = insights.filter((insight: any) => !insight.isRead).length;
      setUnreadNotificationsCount(unreadCount);
    }
  }, [insights]);

  // Get user initials for avatar fallback
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 z-50 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="" />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium dark:text-gray-200">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Active now</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative text-gray-500 dark:text-gray-400">
            <Bell className="h-5 w-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-gray-500 dark:text-gray-400"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
