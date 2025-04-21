import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SendHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { sendChatMessage, ChatMessage } from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";

export function FinancialChatbot() {
  const [query, setQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Sample suggested queries
  const suggestedQueries = [
    "How much did I spend on dining last month?",
    "How can I save more money?",
    "What's my investment recommendation?",
  ];

  // Query to fetch chat history if needed
  const { data: chatHistory, isLoading } = useQuery({
    queryKey: ["/api/ai/chat/history"],
    enabled: false,
  });

  // Mutation for sending a new message
  const sendMessageMutation = useMutation({
    mutationFn: (message: string) => sendChatMessage(message),
    onSuccess: () => {
      // Invalidate and refetch chat history
      queryClient.invalidateQueries({ queryKey: ["/api/ai/chat/history"] });
      setQuery("");
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (query.trim() === "") return;
    sendMessageMutation.mutate(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSuggestedQuery = (suggestedQuery: string) => {
    setQuery(suggestedQuery);
    sendMessageMutation.mutate(suggestedQuery);
  };

  if (isLoading) {
    return (
      <div className="mb-5">
        <h3 className="text-md font-semibold mb-3">AI Financial Assistant</h3>
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm">
          <Skeleton className="h-4 w-3/4 mb-4" />
          <div className="flex flex-wrap gap-2 mb-4">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-7 w-48" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5">
      <h3 className="text-md font-semibold mb-3">AI Financial Assistant</h3>
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm">
        <p className="text-sm mb-3">
          Ask me anything about your finances or get personalized recommendations
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestedQueries.map((query, index) => (
            <button
              key={index}
              onClick={() => handleSuggestedQuery(query)}
              className="bg-primary/5 dark:bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full"
            >
              {query}
            </button>
          ))}
        </div>
        <div className="relative">
          <Input
            type="text"
            placeholder="Ask about your finances..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-neutral-100 dark:bg-neutral-700 border-0 rounded-full py-2.5 pl-4 pr-10 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={sendMessageMutation.isPending}
            className="absolute right-1 top-1 h-8 w-8 flex items-center justify-center rounded-full bg-primary text-white disabled:opacity-50"
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
