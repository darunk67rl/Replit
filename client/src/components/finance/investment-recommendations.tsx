import { useQuery } from "@tanstack/react-query";
import { LightbulbIcon } from "lucide-react";
import { getInvestmentRecommendations } from "@/lib/openai";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

export function InvestmentRecommendations() {
  const { toast } = useToast();

  // Fetch investment recommendations
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["/api/ai/investments"],
    queryFn: getInvestmentRecommendations,
    retry: false,
  });

  const handleViewAllRecommendations = () => {
    toast({
      title: "View All Recommendations",
      description: "This feature will be implemented in the full version.",
    });
  };

  const handleExploreRecommendation = () => {
    toast({
      title: "Explore Recommendation",
      description: "This feature will be implemented in the full version.",
    });
  };

  if (isLoading) {
    return (
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-md font-semibold">AI Recommendations</h3>
        </div>
        <Skeleton className="h-36 w-full mb-3" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  // Portfolio data
  const portfolioData = {
    totalValue: 34800,
    distribution: [
      { name: "Mutual Funds", percentage: 45, value: 15660 },
      { name: "Stocks", percentage: 30, value: 10440 },
      { name: "Gold", percentage: 15, value: 5220 },
      { name: "FDs", percentage: 10, value: 3480 },
    ],
    topInvestments: [
      {
        name: "HDFC Mid Cap Opportunities",
        type: "Mutual Fund",
        value: 15650,
        change: 12.4,
      },
      {
        name: "Reliance Industries",
        type: "Stock",
        value: 8920,
        change: 5.2,
      },
      {
        name: "Digital Gold",
        type: "Commodity",
        value: 5200,
        change: -1.8,
      },
    ],
  };

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-semibold">AI Recommendations</h3>
        <Button
          onClick={handleViewAllRecommendations}
          variant="link"
          className="text-primary dark:text-primary text-sm font-medium p-0"
        >
          View All
        </Button>
      </div>
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-xl p-4 shadow-sm mb-3">
        <div className="flex items-start">
          <LightbulbIcon className="text-primary h-5 w-5 mr-2 mt-0.5" />
          <div>
            <h5 className="text-sm font-medium mb-1">Based on your profile</h5>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 mb-2">
              Your profile suggests a moderate risk tolerance. Consider these
              balanced funds for long-term growth.
            </p>
            <div className="bg-white dark:bg-neutral-700 rounded p-2 mb-2">
              <p className="text-xs font-medium mb-1">Multi-cap Mutual Funds</p>
              <div className="flex justify-between">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Expected returns: 12-15% p.a.
                </p>
                <p className="text-xs text-secondary">Moderate Risk</p>
              </div>
            </div>
            <Button
              onClick={handleExploreRecommendation}
              variant="link"
              className="text-primary text-xs font-medium p-0"
            >
              Explore Options
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm">
        <h4 className="text-sm font-medium mb-3">Your Investment Portfolio</h4>
        
        {/* Portfolio Breakdown Chart */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Total Value
            </p>
            <p className="text-base font-medium">
              {formatCurrency(portfolioData.totalValue)}
            </p>
          </div>
          <div className="flex items-center mb-4">
            {portfolioData.distribution.map((segment, index) => (
              <div
                key={index}
                className={`h-2 ${
                  index === 0
                    ? "rounded-l-full"
                    : index === portfolioData.distribution.length - 1
                    ? "rounded-r-full"
                    : ""
                } ${
                  index === 0
                    ? "bg-primary"
                    : index === 1
                    ? "bg-secondary"
                    : index === 2
                    ? "bg-accent"
                    : "bg-neutral-400 dark:bg-neutral-500"
                }`}
                style={{ width: `${segment.percentage}%` }}
              ></div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {portfolioData.distribution.map((segment, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-sm mr-1 ${
                    index === 0
                      ? "bg-primary"
                      : index === 1
                      ? "bg-secondary"
                      : index === 2
                      ? "bg-accent"
                      : "bg-neutral-400 dark:bg-neutral-500"
                  }`}
                ></div>
                <span className="text-xs">{segment.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Investments */}
        <h5 className="text-xs font-medium mb-2">Top Investments</h5>
        {portfolioData.topInvestments.map((investment, index) => (
          <div
            key={index}
            className="flex items-center justify-between mb-2.5 last:mb-0"
          >
            <div>
              <p className="text-sm font-medium mb-0.5">{investment.name}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {investment.type}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                {formatCurrency(investment.value)}
              </p>
              <p
                className={`text-xs ${
                  investment.change >= 0 ? "text-secondary" : "text-error"
                }`}
              >
                {investment.change >= 0 ? "+" : ""}
                {investment.change}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
