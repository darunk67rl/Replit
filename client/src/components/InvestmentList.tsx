import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface Investment {
  id: number;
  type: string;
  name: string;
  investedAmount: number;
  currentValue: number;
  returns: number;
  units?: number;
  averagePrice?: number;
  isSIP: boolean;
  sipAmount?: number;
  lastUpdated: string;
}

export default function InvestmentList() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: investments, isLoading } = useQuery<Investment[]>({
    queryKey: [`/api/users/${user?.id}/investments`],
    enabled: !!user?.id,
  });

  const getInvestmentTypeLabel = (type: string) => {
    switch (type) {
      case "mutual_fund":
        return "Mutual Fund";
      case "stock":
        return "Stock";
      case "gold":
        return "Gold";
      case "fixed_deposit":
        return "Fixed Deposit";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getReturnsPercentage = (investment: Investment) => {
    if (investment.investedAmount <= 0) return 0;
    return ((investment.returns / investment.investedAmount) * 100).toFixed(1);
  };

  const handleViewAll = () => {
    // This would navigate to a detailed investments list page
    // For now, just show a console message
    console.log("View all investments");
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-slate-900 rounded-xl shadow-sm mb-6">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-semibold">Your Investments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex justify-between mb-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between text-sm">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          ))}
          <div className="p-3 text-center">
            <Skeleton className="h-8 w-40 mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-900 rounded-xl shadow-sm mb-6">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-semibold dark:text-gray-200">Your Investments</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {investments && investments.length > 0 ? (
          <>
            {investments.map((investment) => (
              <div
                key={investment.id}
                className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <div className="flex justify-between mb-1">
                  <h3 className="text-sm font-medium dark:text-gray-200">
                    {investment.name}
                  </h3>
                  <Badge
                    variant={investment.returns >= 0 ? "default" : "destructive"}
                    className={
                      investment.returns >= 0
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-400"
                    }
                  >
                    {investment.returns >= 0 ? "+" : ""}
                    {getReturnsPercentage(investment)}%
                  </Badge>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <span>
                    {getInvestmentTypeLabel(investment.type)}
                    {investment.isSIP ? " • SIP" : ""}
                    {investment.units ? ` • ${investment.units} ${investment.type === "stock" ? "shares" : "units"}` : ""}
                  </span>
                  <span>
                    {investment.averagePrice && `Avg. ₹${investment.averagePrice.toLocaleString("en-IN")}`}
                    {investment.sipAmount && `₹${investment.sipAmount.toLocaleString("en-IN")}/month`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="dark:text-gray-300">
                    Current Value: ₹{investment.currentValue.toLocaleString("en-IN")}
                  </span>
                  <span className="dark:text-gray-300">
                    Invested: ₹{investment.investedAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
            <div className="p-3 text-center">
              <Button
                variant="link"
                className="text-sm text-primary dark:text-primary font-medium"
                onClick={handleViewAll}
              >
                View All Investments
              </Button>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You don't have any investments yet.
            </p>
            <Button
              className="text-sm"
              onClick={() => setLocation("/advisor")}
            >
              Get Investment Advice
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
