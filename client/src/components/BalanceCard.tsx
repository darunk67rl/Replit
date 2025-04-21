import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Eye, EyeOff, RefreshCw, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function BalanceCard() {
  const { user, isLoading } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // In a real app, we would fetch the latest balance
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Format balance with rupee symbol and thousands separator
  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "₹ 0.00";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-medium">Total Balance</h3>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/90 hover:text-white hover:bg-white/10"
              onClick={toggleBalanceVisibility}
            >
              {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/90 hover:text-white hover:bg-white/10"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        <div className="mb-6">
          {isLoading ? (
            <Skeleton className="h-9 w-40 bg-white/20" />
          ) : (
            <h2 className="text-3xl font-bold">
              {showBalance ? formatCurrency(user?.balance) : "₹ •••••••"}
            </h2>
          )}
        </div>

        <div className="flex space-x-2">
          <Link href="/send-money">
            <Button className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Send
            </Button>
          </Link>
          <Link href="/receive-money">
            <Button className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0">
              <ArrowDownLeft className="mr-2 h-4 w-4" />
              Receive
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}