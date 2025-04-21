import { Building2, Shield, Bell, Palette } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";

interface Setting {
  id: string;
  name: string;
  icon: React.ReactNode;
  info?: string;
}

export function AccountSettings() {
  const { theme } = useTheme();
  const { toast } = useToast();

  const settings: Setting[] = [
    {
      id: "linked-accounts",
      name: "Linked Accounts & UPI",
      icon: <Building2 className="h-5 w-5 text-primary" />,
    },
    {
      id: "security",
      name: "Security & Privacy",
      icon: <Shield className="h-5 w-5 text-primary" />,
    },
    {
      id: "notifications",
      name: "Notification Settings",
      icon: <Bell className="h-5 w-5 text-primary" />,
    },
    {
      id: "appearance",
      name: "Appearance",
      icon: <Palette className="h-5 w-5 text-primary" />,
      info: "Dark Mode",
    },
  ];

  const handleOpenSetting = (settingId: string) => {
    const setting = settings.find((s) => s.id === settingId);
    if (setting) {
      toast({
        title: setting.name,
        description: `${setting.name} will be implemented in the full version.`,
      });
    }
  };

  return (
    <div className="mb-5">
      <h3 className="text-md font-semibold mb-3">Account Settings</h3>
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm divide-y divide-neutral-200 dark:divide-neutral-700">
        {settings.map((setting) => (
          <button
            key={setting.id}
            onClick={() => handleOpenSetting(setting.id)}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                {setting.icon}
              </div>
              <span className="text-sm">{setting.name}</span>
            </div>
            <div className="flex items-center">
              {setting.info && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400 mr-1">
                  {setting.id === "appearance" ? (theme === "dark" ? "Dark Mode" : "Light Mode") : setting.info}
                </span>
              )}
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
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
