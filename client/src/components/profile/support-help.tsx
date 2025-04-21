import { HelpCircle, HeadphonesIcon, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

interface HelpItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export function SupportHelp() {
  const { toast } = useToast();
  const { logout } = useAuth();

  const helpItems: HelpItem[] = [
    {
      id: "faq",
      name: "FAQs",
      icon: <HelpCircle className="h-5 w-5 text-primary" />,
    },
    {
      id: "contact",
      name: "Contact Support",
      icon: <HeadphonesIcon className="h-5 w-5 text-primary" />,
    },
    {
      id: "feedback",
      name: "Give Feedback",
      icon: <MessageSquare className="h-5 w-5 text-primary" />,
    },
  ];

  const handleOpenHelp = (helpId: string) => {
    const item = helpItems.find((h) => h.id === helpId);
    if (item) {
      toast({
        title: item.name,
        description: `${item.name} will be implemented in the full version.`,
      });
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className="mb-5">
        <h3 className="text-md font-semibold mb-3">Help & Support</h3>
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm divide-y divide-neutral-200 dark:divide-neutral-700">
          {helpItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleOpenHelp(item.id)}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  {item.icon}
                </div>
                <span className="text-sm">{item.name}</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-neutral-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full p-4 bg-error/10 text-error rounded-xl flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="font-medium">Log Out</span>
        </Button>
      </div>

      <div className="text-center text-xs text-neutral-500 dark:text-neutral-400 mb-10">
        <p>App Version 1.0.23</p>
        <p className="mt-1">© 2023 FinAll. All rights reserved.</p>
      </div>
    </>
  );
}
