import React from "react";
import { useLocation } from "wouter";
import {
  CreditCard,
  Landmark,
  LineChart,
  Zap,
  Shield,
  BriefcaseBusiness,
  Receipt,
  Lightbulb,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickAccessItem {
  icon: JSX.Element;
  label: string;
  bgColor: string;
  iconColor: string;
  onClick: () => void;
}

export default function QuickAccess() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const quickAccessItems: QuickAccessItem[] = [
    {
      icon: <CreditCard size={22} />,
      label: "Cards",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      onClick: () => navigate("/cards"),
    },
    {
      icon: <LineChart size={22} />,
      label: "Invest",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      onClick: () => navigate("/investments"),
    },
    {
      icon: <Landmark size={22} />,
      label: "Loans",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      onClick: () => navigate("/loans"),
    },
    {
      icon: <Zap size={22} />,
      label: "Pay Bills",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      onClick: () => navigate("/bill-payments"),
    },
    {
      icon: <Shield size={22} />,
      label: "Insurance",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      onClick: () => navigate("/insurance"),
    },
    {
      icon: <BriefcaseBusiness size={22} />,
      label: "Business",
      bgColor: "bg-slate-100 dark:bg-slate-800",
      iconColor: "text-slate-600 dark:text-slate-400",
      onClick: () => navigate("/business"),
    },
    {
      icon: <Receipt size={22} />,
      label: "Rewards",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
      onClick: () => navigate("/rewards"),
    },
    {
      icon: <Lightbulb size={22} />,
      label: "AI Advisor",
      bgColor: "bg-teal-100 dark:bg-teal-900/30",
      iconColor: "text-teal-600 dark:text-teal-400",
      onClick: () => navigate("/ai-advisor"),
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {quickAccessItems.map((item, index) => (
        <button
          key={index}
          className="flex flex-col items-center justify-center p-3 rounded-xl transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          onClick={item.onClick}
        >
          <div
            className={`w-10 h-10 ${item.bgColor} rounded-full flex items-center justify-center mb-2`}
          >
            <span className={item.iconColor}>{item.icon}</span>
          </div>
          <span className="text-xs font-medium dark:text-gray-200">{item.label}</span>
        </button>
      ))}
    </div>
  );
}