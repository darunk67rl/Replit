import { useLocation, Link } from "wouter";
import { Home, DollarSign, TrendingUp, Bot, User } from "lucide-react";

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
      icon: <Home className="text-xl" />,
    },
    {
      label: "Payments",
      path: "/send-money",
      icon: <DollarSign className="text-xl" />,
    },
    {
      label: "Invest",
      path: "/investments",
      icon: <TrendingUp className="text-xl" />,
    },
    {
      label: "Advisor",
      path: "/advisor",
      icon: <Bot className="text-xl" />,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: <User className="text-xl" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700 shadow-lg py-2 z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <a
                className={`flex flex-col items-center w-1/5 ${
                  isActive
                    ? "text-primary dark:text-primary"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {item.icon}
                <span
                  className={`text-xs mt-1 ${
                    isActive ? "font-medium" : ""
                  }`}
                >
                  {item.label}
                </span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
