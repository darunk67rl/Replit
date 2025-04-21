import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SpendingCategory {
  category: string;
  amount: number;
}

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#6b7280", "#ec4899"];

export default function SpendingInsights() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState("this-month");

  const { data: spending, isLoading } = useQuery<SpendingCategory[]>({
    queryKey: [`/api/users/${user?.id}/spending`],
    enabled: !!user?.id,
  });

  // Calculate total spending
  const totalSpending = spending?.reduce((sum, item) => sum + item.amount, 0) || 0;

  // Format the data for the chart
  const chartData = spending?.map((item, index) => {
    const percentage = totalSpending > 0 ? (item.amount / totalSpending) * 100 : 0;
    return {
      name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
      value: item.amount,
      percentage: Math.round(percentage),
      color: COLORS[index % COLORS.length],
    };
  });

  // Handle timeframe change
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
    // In a real app, this would trigger a new query with different parameters
  };

  // Format category names
  const formatCategoryName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
        <CardHeader className="p-0 mb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">Spending Analysis</CardTitle>
            <Skeleton className="h-8 w-28" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-40 mb-4">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
      <CardHeader className="p-0 mb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold dark:text-gray-200">
            Spending Analysis
          </CardTitle>
          <Select value={timeframe} onValueChange={handleTimeframeChange}>
            <SelectTrigger className="w-[140px] h-8 text-sm border-none">
              <SelectValue placeholder="This Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-40 mb-4 relative">
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
                {chartData?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="dark:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`₹${value}`, "Amount"]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Monthly Spent
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{totalSpending.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {chartData?.map((item, index) => (
            <div key={index} className="flex items-center p-2">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {formatCategoryName(item.name)} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
