import { Building, Receipt, BarChart3, Shield } from "lucide-react";

interface QuickAccessItem {
  icon: JSX.Element;
  label: string;
  bgColor: string;
  iconColor: string;
  onClick: () => void;
}

export default function QuickAccess() {
  const quickAccessItems: QuickAccessItem[] = [
    {
      icon: <Building className="h-5 w-5" />,
      label: "Bank Transfer",
      bgColor: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-400",
      onClick: () => console.log("Bank Transfer clicked"),
    },
    {
      icon: <Receipt className="h-5 w-5" />,
      label: "Pay Bills",
      bgColor: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-400",
      onClick: () => console.log("Pay Bills clicked"),
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: "Investments",
      bgColor: "bg-amber-100 dark:bg-amber-900",
      iconColor: "text-amber-600 dark:text-amber-400",
      onClick: () => console.log("Investments clicked"),
    },
    {
      icon: <Shield className="h-5 w-5" />,
      label: "Insurance",
      bgColor: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-400",
      onClick: () => console.log("Insurance clicked"),
    },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 dark:text-gray-200">Quick Access</h2>
      <div className="grid grid-cols-4 gap-3">
        {quickAccessItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer"
            onClick={item.onClick}
          >
            <div
              className={`w-12 h-12 rounded-full ${item.bgColor} flex items-center justify-center mb-1`}
            >
              <div className={item.iconColor}>{item.icon}</div>
            </div>
            <span className="text-xs text-center dark:text-gray-300">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
