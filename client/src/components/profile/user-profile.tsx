import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import { Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export function UserProfile() {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleEditProfile = () => {
    toast({
      title: "Edit Profile",
      description: "Profile editing will be implemented in the full version.",
    });
  };

  const handleShareProfile = () => {
    toast({
      title: "Share Profile",
      description: "Profile sharing will be implemented in the full version.",
    });
  };

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm mb-5">
      <div className="flex items-center mb-5">
        <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white mr-4">
          <span className="text-xl font-semibold">{getInitials(user.name)}</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {user.phoneNumber}
          </p>
          <div className="flex items-center mt-1">
            <Badge variant="outline" className="bg-secondary/10 text-secondary text-xs px-2 py-0.5 rounded flex items-center space-x-1 border-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 mr-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>KYC Verified</span>
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex space-x-3">
        <Button onClick={handleEditProfile} className="flex-1 bg-primary text-white">
          Edit Profile
        </Button>
        <Button onClick={handleShareProfile} variant="outline" size="icon" className="w-10 h-10">
          <Share2 className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
        </Button>
      </div>
    </div>
  );
}
