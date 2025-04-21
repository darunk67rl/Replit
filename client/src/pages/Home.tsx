import { useEffect } from "react";
import BalanceCard from "@/components/BalanceCard";
import QuickAccess from "@/components/QuickAccess";
import AiInsights from "@/components/AiInsights";
import RecentTransactions from "@/components/RecentTransactions";
import SpendingInsights from "@/components/SpendingInsights";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="px-4 py-5">
      <BalanceCard />
      <QuickAccess />
      <AiInsights />
      <RecentTransactions />
      <SpendingInsights />
    </div>
  );
}
