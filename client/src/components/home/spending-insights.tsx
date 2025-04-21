import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { Utensils, ShoppingBag, Car } from "lucide-react";
import { getFinanceInsights } from "@/lib/openai";
import { formatCurrency, formatShortCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function SpendingInsights() {
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );

  // Fetch spending insights
  const { data: insights, isLoading } = useQuery({
    queryKey: ["/api/ai/insights"],
    retry: false,
  });

  const viewAllInsights = () => {
    alert("View All Insights functionality would be implemented here");
  };

  // Mock data for chart visualization
  const chartData = [
    { name: "Food", value: 4250, color: "hsl(var(--primary))" },
    { name: "Shopping", value: 3120, color: "hsl(var(--secondary))" },
    { name: "Transport", value: 2860, color: "hsl(var(--accent))" },
    { name: "Bills", value: 5400, color: "hsl(var(--chart-4))" },
    { name: "Entertainment", value: 1500, color: "hsl(var(--chart-5))" },
    { name: "Others", value: 2100, color: "hsl(var(--muted-foreground))" },
  ];

  // Top spending categories with their icons
  const topCategories = [
    {
      name: "Food & Dining",
      icon: <Utensils className="h-4 w-4 text-primary" />,
      amount: 4250,
      transactions: 32,
      color: "primary",
    },
    {
      name: "Shopping",
      icon: <ShoppingBag className="h-4 w-4 text-secondary" />,
      amount: 3120,
      transactions: 8,
      color: "secondary",
    },
    {
      name: "Transportation",
      icon: <Car className="h-4 w-4 text-accent" />,
      amount: 2860,
      transactions: 28,
      color: "accent",
    },
  ];

  if (isLoading) {
    return (
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-md font-semibold">Spending Insights</h3>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm">
          <Skeleton className="h-4 w-1/3 mb-4" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-4 w-1/4 mb-3" />
          <Skeleton className="h-16 w-full mb-2" />
          <Skeleton className="h-16 w-full mb-2" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-semibold">Spending Insights</h3>
        <Button
          onClick={viewAllInsights}
          variant="link"
          className="text-primary dark:text-primary text-sm font-medium p-0"
        >
          View All
        </Button>
      </div>
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium">Monthly Analysis</h4>
          <div className="bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded text-xs font-medium">
            <span>{currentMonth}</span>
          </div>
        </div>

        {/* AI Spending Analysis Card */}
        <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-3 mb-4 border border-primary/20">
          <div className="flex items-start">
            <span className="material-icons text-primary mr-2">insights</span>
            <div>
              <h5 className="text-sm font-medium mb-1">AI Analysis</h5>
              <p className="text-xs text-neutral-700 dark:text-neutral-300">
                {insights?.analysis || 
                  "You're spending 15% more on dining this month compared to last month. Consider setting a budget for eating out."}
              </p>
            </div>
          </div>
        </div>

        {/* Spending Breakdown Chart */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {chartData.map((category, index) => (
              <div className="flex items-center" key={index}>
                <div
                  className="w-3 h-3 rounded-sm mr-1"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-xs">{category.name}</span>
              </div>
            ))}
          </div>

          <div className="h-28 bg-neutral-50 dark:bg-neutral-700/30 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10 }} 
                  axisLine={false}
                  tickLine={false}
                  hide
                />
                <YAxis 
                  tick={{ fontSize: 10 }} 
                  tickFormatter={(value) => formatShortCurrency(value)}
                  axisLine={false}
                  tickLine={false}
                  hide
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value as number)}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Spending Categories */}
        <div>
          <h5 className="text-xs font-medium mb-2">Top Categories</h5>
          {topCategories.map((category, index) => (
            <div
              key={index}
              className="flex items-center justify-between mb-2 last:mb-0"
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full bg-${category.color}/10 flex items-center justify-center mr-2`}>
                  {category.icon}
                </div>
                <span className="text-sm">{category.name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{formatCurrency(category.amount)}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {category.transactions} transactions
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
