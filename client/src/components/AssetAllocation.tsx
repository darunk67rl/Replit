import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface Investment {
  id: number;
  type: string;
  name: string;
  investedAmount: number;
  currentValue: number;
}

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];
const INVESTMENT_TYPES = {
  mutual_fund: "Equity Mutual Funds",
  stock: "Stocks",
  gold: "Gold",
  fixed_deposit: "Fixed Deposits",
};

export default function AssetAllocation() {
  const { user } = useAuth();

  const { data: investments, isLoading } = useQuery<Investment[]>({
    queryKey: [`/api/users/${user?.id}/investments`],
    enabled: !!user?.id,
  });

  // Calculate total investment value
  const totalValue = investments?.reduce(
    (sum, investment) => sum + investment.currentValue,
    0
  ) || 0;

  // Calculate allocation by type
  const calculateAllocationByType = () => {
    if (!investments) return [];

    const allocationByType = new Map<string, number>();
    
    investments.forEach((investment) => {
      const currentAmount = allocationByType.get(investment.type) || 0;
      allocationByType.set(investment.type, currentAmount + investment.currentValue);
    });

    return Array.from(allocationByType.entries()).map(([type, value], index) => {
      const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
      return {
        name: INVESTMENT_TYPES[type as keyof typeof INVESTMENT_TYPES] || type,
        value,
        percentage: Math.round(percentage),
        color: COLORS[index % COLORS.length],
      };
    });
  };

  const chartData = calculateAllocationByType();

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm mb-6">
        <CardHeader className="p-0 mb-3">
          <CardTitle className="text-lg font-semibold">Asset Allocation</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-40 mb-4">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm mb-6">
      <CardHeader className="p-0 mb-3">
        <CardTitle className="text-lg font-semibold dark:text-gray-200">
          Asset Allocation
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-40 mb-4 relative">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="dark:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `₹${value.toLocaleString("en-IN")}`,
                    "Value",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No investment data available
              </p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center p-2">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {item.name} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
