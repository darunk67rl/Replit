import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { formatCurrency, getInitials } from "@/lib/utils";
import { useLocation } from "wouter";

export function UserOverview() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const goToProfile = () => {
    setLocation("/profile");
  };

  const topUpWallet = () => {
    // This would open a modal or navigate to a top-up page
    // For now, we'll implement a basic alert
    alert("Add Money functionality would be implemented here");
  };

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm mb-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white">
            <span className="text-lg font-semibold">{getInitials(user.name)}</span>
          </div>
          <div className="ml-3">
            <h2 className="text-base font-semibold">{user.name}</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{user.phoneNumber}</p>
          </div>
        </div>
        <Button
          onClick={goToProfile}
          variant="link"
          className="text-primary dark:text-primary text-sm font-medium p-0"
        >
          View Profile
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Available Balance</p>
          <p className="text-xl font-semibold">{formatCurrency(user.balance)}</p>
        </div>
        <Button onClick={topUpWallet} className="bg-primary text-white">
          Add Money
        </Button>
      </div>
    </div>
  );
}
