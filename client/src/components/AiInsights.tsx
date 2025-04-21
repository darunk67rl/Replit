import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface AiInsight {
  id: number;
  type: "savings" | "spending" | "investment" | "insurance";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  date: string;
  isRead: boolean;
}

export default function AiInsights() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: insights, isLoading } = useQuery<AiInsight[]>({
    queryKey: [`/api/users/${user?.id}/ai-insights`],
    enabled: !!user?.id,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (insightId: number) => {
      await apiRequest("PUT", `/api/ai-insights/${insightId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/ai-insights`] });
    },
  });

  const generateInsightsMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(
        "POST",
        `/api/users/${user?.id}/ai-insights/generate`,
        {}
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/ai-insights`] });
      setIsGenerating(false);
    },
    onError: () => {
      setIsGenerating(false);
    },
  });

  const handleInsightClick = (insight: AiInsight) => {
    if (!insight.isRead) {
      markAsReadMutation.mutate(insight.id);
    }
  };

  const generateNewInsights = () => {
    setIsGenerating(true);
    generateInsightsMutation.mutate();
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case "savings":
        return "border-blue-600";
      case "spending":
        return "border-red-500";
      case "investment":
        return "border-green-500";
      case "insurance":
        return "border-amber-500";
      default:
        return "border-gray-500";
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "savings":
        return "bg-blue-50 dark:bg-blue-900/30";
      case "spending":
        return "bg-red-50 dark:bg-red-900/30";
      case "investment":
        return "bg-green-50 dark:bg-green-900/30";
      case "insurance":
        return "bg-amber-50 dark:bg-amber-900/30";
      default:
        return "bg-gray-50 dark:bg-gray-800/30";
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-slate-900 rounded-xl p-4 mb-6 shadow-sm">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold dark:text-gray-200">AI Insights</h2>
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-20 w-full mb-3" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-900 rounded-xl p-4 mb-6 shadow-sm">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold dark:text-gray-200">AI Insights</h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {isGenerating ? (
              "Generating..."
            ) : (
              <button onClick={generateNewInsights} className="text-primary hover:underline">
                Refresh
              </button>
            )}
          </span>
        </div>
        {insights && insights.length > 0 ? (
          insights.slice(0, 2).map((insight) => (
            <div
              key={insight.id}
              className={`p-3 ${getBackgroundColor(insight.type)} rounded-lg mb-3 border-l-4 ${getBorderColor(
                insight.type
              )} cursor-pointer`}
              onClick={() => handleInsightClick(insight)}
            >
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                {insight.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">{insight.description}</p>
            </div>
          ))
        ) : (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No insights available. Click refresh to generate new insights.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
