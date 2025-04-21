import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function InvestmentSummary() {
  const { user } = useAuth();

  const { data: portfolioSummary, isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/portfolio-summary`],
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm mb-6">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold dark:text-gray-200">Portfolio Value</h2>
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-8 w-2/3 mb-2" />
          <div className="flex space-x-2 text-sm">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm mb-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold dark:text-gray-200">Portfolio Value</h2>
          <span
            className={`text-xs ${
              portfolioSummary?.returnsPercentage >= 0
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-400"
                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-400"
            } px-2 py-1 rounded-full`}
          >
            {portfolioSummary?.returnsPercentage >= 0 ? "+" : ""}
            {portfolioSummary?.returnsPercentage.toFixed(1)}% YTD
          </span>
        </div>
        <div className="text-3xl font-bold mb-2 dark:text-white">
          ₹{portfolioSummary?.totalValue.toLocaleString("en-IN")}
        </div>
        <div className="flex space-x-2 text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Invested: ₹{portfolioSummary?.totalInvested.toLocaleString("en-IN")}
          </span>
          <span className="text-gray-500 dark:text-gray-400">|</span>
          <span
            className={
              portfolioSummary?.totalReturns >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }
          >
            {portfolioSummary?.totalReturns >= 0 ? "Gains" : "Loss"}: ₹
            {Math.abs(portfolioSummary?.totalReturns).toLocaleString("en-IN")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
