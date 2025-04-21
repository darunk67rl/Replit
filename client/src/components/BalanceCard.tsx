import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, SendIcon, ArrowDown, QrCode } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BalanceCard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Get default bank account
  const { data: bankAccounts, isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/bank-accounts`],
    enabled: !!user?.id,
  });

  // Find default account or use first account
  const defaultAccount = bankAccounts?.find(
    (account: any) => account.isDefault
  ) || bankAccounts?.[0];

  // Calculate total balance across all accounts
  const totalBalance = bankAccounts?.reduce(
    (total: number, account: any) => total + account.balance,
    0
  ) || 0;

  const handleAddMoney = () => {
    setLoading(true);
    // This would normally open a modal or navigate to add money page
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <Card className="bg-primary text-white rounded-xl p-5 mb-6">
        <CardContent className="p-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-sm font-medium text-primary-200">Total Balance</h2>
              <div className="flex items-baseline">
                <Skeleton className="h-8 w-24 bg-white/20" />
              </div>
            </div>
            <Skeleton className="h-8 w-8 rounded-full bg-white/20" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-16 rounded-lg bg-white/10" />
            <Skeleton className="h-16 rounded-lg bg-white/10" />
            <Skeleton className="h-16 rounded-lg bg-white/10" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-primary text-white rounded-xl p-5 mb-6">
      <CardContent className="p-0">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-sm font-medium text-primary-200">Total Balance</h2>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">₹{totalBalance.toLocaleString("en-IN")}</span>
              <span className="ml-2 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">+2.4%</span>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleAddMoney}
            disabled={loading}
            className="bg-white/20 text-white rounded-full p-1.5 hover:bg-white/30"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="ghost" className="bg-white/10 rounded-lg p-3 flex flex-col items-center hover:bg-white/20">
            <SendIcon className="h-5 w-5 mb-1" />
            <span className="text-xs">Send</span>
          </Button>
          <Button variant="ghost" className="bg-white/10 rounded-lg p-3 flex flex-col items-center hover:bg-white/20">
            <ArrowDown className="h-5 w-5 mb-1" />
            <span className="text-xs">Request</span>
          </Button>
          <Button variant="ghost" className="bg-white/10 rounded-lg p-3 flex flex-col items-center hover:bg-white/20">
            <QrCode className="h-5 w-5 mb-1" />
            <span className="text-xs">Scan</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
