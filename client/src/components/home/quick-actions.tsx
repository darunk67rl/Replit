import { QrCode, Send, FileText, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type QuickAction = {
  id: string;
  icon: React.ReactNode;
  label: string;
  action: string;
};

export function QuickActions() {
  const { toast } = useToast();

  const quickActions: QuickAction[] = [
    {
      id: "scan-pay",
      icon: <QrCode className="h-5 w-5 text-primary" />,
      label: "Scan & Pay",
      action: "scan-pay",
    },
    {
      id: "send-money",
      icon: <Send className="h-5 w-5 text-primary" />,
      label: "Send Money",
      action: "send-money",
    },
    {
      id: "request-money",
      icon: <FileText className="h-5 w-5 text-primary" />,
      label: "Request",
      action: "request-money",
    },
    {
      id: "to-bank",
      icon: <Building2 className="h-5 w-5 text-primary" />,
      label: "To Bank",
      action: "self-transfer",
    },
  ];

  const handleAction = (action: string) => {
    // In a real app, this would navigate to the appropriate screen
    toast({
      title: "Action initiated",
      description: `You clicked on ${action}. This feature will be implemented in the full version.`,
    });
  };

  return (
    <div className="mb-5">
      <h3 className="text-md font-semibold mb-3">Quick Actions</h3>
      <div className="grid grid-cols-4 gap-2">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action.action)}
            className="flex flex-col items-center justify-center bg-white dark:bg-neutral-800 rounded-lg p-2 shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
              {action.icon}
            </div>
            <span className="text-xs font-medium text-center">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
