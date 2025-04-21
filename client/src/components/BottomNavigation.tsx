import React from "react";
import { Link, useLocation } from "wouter";
import { Home, PieChart, Wallet, Settings, BarChart3 } from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: JSX.Element;
}

export default function BottomNavigation() {
  const [location] = useLocation();

  const navItems: NavItem[] = [
    {
      label: "Home",
      path: "/",
      icon: <Home size={20} />,
    },
    {
      label: "Finance",
      path: "/finance",
      icon: <BarChart3 size={20} />,
    },
    {
      label: "Payments",
      path: "/payments",
      icon: <Wallet size={20} />,
    },
    {
      label: "Investments",
      path: "/investments",
      icon: <PieChart size={20} />,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: <Settings size={20} />,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 px-2 py-2 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <Link 
            href={item.path} 
            key={item.path}
            className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors ${
              isActive(item.path)
                ? "text-primary bg-primary/10 dark:bg-primary/20"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}