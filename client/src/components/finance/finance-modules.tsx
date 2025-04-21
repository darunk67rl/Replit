import { TrendingUp, Shield, Building2, Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FinanceModule {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

export function FinanceModules() {
  const { toast } = useToast();

  const modules: FinanceModule[] = [
    {
      id: "investments",
      name: "Investments",
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      description: "Stocks, Mutual Funds",
    },
    {
      id: "insurance",
      name: "Insurance",
      icon: <Shield className="h-6 w-6 text-primary" />,
      description: "Health, Term, Motor",
    },
    {
      id: "loans",
      name: "Loans & Credit",
      icon: <Building2 className="h-6 w-6 text-primary" />,
      description: "Offers, Applications",
    },
    {
      id: "goals",
      name: "Financial Goals",
      icon: <Flag className="h-6 w-6 text-primary" />,
      description: "Plan & Track",
    },
  ];

  const handleOpenModule = (moduleId: string) => {
    const module = modules.find((m) => m.id === moduleId);
    if (module) {
      toast({
        title: `${module.name} Module`,
        description: `The ${module.name} module will be implemented in the full version.`,
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      {modules.map((module) => (
        <button
          key={module.id}
          onClick={() => handleOpenModule(module.id)}
          className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm flex flex-col items-center"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            {module.icon}
          </div>
          <h3 className="text-sm font-medium mb-1">{module.name}</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {module.description}
          </p>
        </button>
      ))}
    </div>
  );
}
