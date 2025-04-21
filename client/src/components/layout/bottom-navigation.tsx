import { useLocation } from "wouter";
import { Home, Wallet, Briefcase, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: Home,
    },
    {
      name: "Payments",
      path: "/payments",
      icon: Wallet,
    },
    {
      name: "Finance",
      path: "/finance",
      icon: Briefcase,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  const handleNavigation = (path: string) => {
    setLocation(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-800 shadow-lg border-t border-neutral-200 dark:border-neutral-700 safe-bottom z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="flex flex-col items-center justify-center py-2 px-4 flex-1"
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  isActive
                    ? "text-primary dark:text-primary"
                    : "text-neutral-600 dark:text-neutral-400"
                )}
              />
              <span
                className={cn(
                  "text-xs mt-1",
                  isActive
                    ? "font-medium text-primary dark:text-primary"
                    : "text-neutral-600 dark:text-neutral-400"
                )}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
