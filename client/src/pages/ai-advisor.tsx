import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User as UserIcon, Lightbulb, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

interface AIInsight {
  id: number;
  title: string;
  description: string;
  category: "spending" | "saving" | "investment" | "budget";
  priority: "high" | "medium" | "low";
  createdAt: string;
}

export default function AiAdvisor() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get chat history
  const { data: chatHistory, isLoading: chatLoading } = useQuery<Message[]>({
    queryKey: ["/api/ai/chat/history"],
    enabled: !!user,
  });

  // Get AI insights
  const { data: aiInsights, isLoading: insightsLoading } = useQuery<AIInsight[]>({
    queryKey: ["/api/ai/insights"],
    enabled: !!user,
  });

  // Get investment recommendations
  const { data: investmentRecommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ["/api/ai/investments"],
    enabled: !!user,
  });

  // Get saving suggestions
  const { data: savingSuggestions, isLoading: suggestionsLoading } = useQuery({
    queryKey: ["/api/ai/savings"],
    enabled: !!user,
  });

  // Local state for messages while waiting for server
  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize messages from chat history when data is loaded
  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      setMessages(chatHistory);
    } else if (!chatLoading) {
      // If there are no chat history, add a welcome message
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "Hello! I'm your AI financial advisor. How can I help you today?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [chatHistory, chatLoading]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (newMessage: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", { message: newMessage });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      return await response.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, data]);
      queryClient.invalidateQueries({ queryKey: ["/api/ai/chat/history"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle send message
  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newUserMessage: Message = {
      id: `user_${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    sendMessageMutation.mutateAsync(message);
    setMessage("");

    // Focus back on textarea after sending
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Handle enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "spending":
        return <LineChart className="h-5 w-5" />;
      case "saving":
        return <Sparkles className="h-5 w-5" />;
      case "investment":
        return <LineChart className="h-5 w-5" />;
      case "budget":
        return <ShieldCheck className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-100 dark:bg-red-900/20";
      case "medium":
        return "text-amber-500 bg-amber-100 dark:bg-amber-900/20";
      case "low":
        return "text-green-500 bg-green-100 dark:bg-green-900/20";
      default:
        return "text-blue-500 bg-blue-100 dark:bg-blue-900/20";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 container max-w-md mx-auto px-4 pb-20 pt-16">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          {/* Chat tab */}
          <TabsContent value="chat" className="h-[calc(100vh-180px)]">
            <Card className="h-full flex flex-col">
              <CardHeader className="px-4 py-3 border-b">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-primary" />
                  AI Financial Advisor
                </CardTitle>
              </CardHeader>
              <ScrollArea ref={scrollRef} className="flex-1 p-4 overflow-y-auto">
                {chatLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-3/4" />
                    <Skeleton className="h-16 w-2/3 ml-auto" />
                    <Skeleton className="h-24 w-3/4" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.role === "assistant" ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.role === "assistant"
                              ? "bg-gray-100 dark:bg-gray-800"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <div className="flex items-center mb-1">
                            {msg.role === "assistant" ? (
                              <Bot className="h-4 w-4 mr-1" />
                            ) : (
                              <UserIcon className="h-4 w-4 mr-1" />
                            )}
                            <span className="text-xs font-medium">
                              {msg.role === "assistant" ? "AI Advisor" : "You"}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {sendMessageMutation.isPending && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 dark:bg-gray-800">
                          <div className="flex items-center mb-1">
                            <Bot className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">AI Advisor</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" />
                            <div
                              className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                            <div
                              className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.4s" }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
              <div className="p-3 border-t">
                <div className="flex items-center space-x-2">
                  <Textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask any financial question..."
                    className="min-h-[40px] resize-none"
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!message.trim() || sendMessageMutation.isPending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Insights tab */}
          <TabsContent value="insights" className="h-[calc(100vh-180px)]">
            <Card className="h-full flex flex-col">
              <CardHeader className="px-4 py-3 border-b">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                  Financial Insights
                </CardTitle>
              </CardHeader>
              <ScrollArea className="flex-1 p-4">
                {insightsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : aiInsights && aiInsights.length > 0 ? (
                  <div className="space-y-4">
                    {aiInsights.map((insight) => (
                      <Card key={insight.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div
                              className={`p-2 rounded-full ${
                                getPriorityColor(insight.priority)
                              }`}
                            >
                              {getCategoryIcon(insight.category)}
                            </div>
                            <div>
                              <h3 className="font-medium mb-1">{insight.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {insight.description}
                              </p>
                              <div className="flex items-center mt-2">
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(
                                    insight.priority
                                  )}`}
                                >
                                  {insight.priority.toUpperCase()}
                                </span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {new Date(insight.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Lightbulb className="h-12 w-12 text-muted-foreground mb-3" />
                    <h3 className="font-medium text-lg mb-1">No Insights Yet</h3>
                    <p className="text-sm text-center text-muted-foreground max-w-xs">
                      As you use the app more, our AI will generate personalized insights about
                      your finances.
                    </p>
                  </div>
                )}
              </ScrollArea>
            </Card>
          </TabsContent>

          {/* Recommendations tab */}
          <TabsContent value="recommendations" className="h-[calc(100vh-180px)]">
            <Card className="h-full flex flex-col">
              <CardHeader className="px-4 py-3 border-b">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-primary" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <ScrollArea className="flex-1">
                <div className="p-4">
                  <h3 className="font-medium mb-3">Investment Recommendations</h3>
                  {recommendationsLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {investmentRecommendations?.map((rec: any, index: number) => (
                        <Card key={index} className="overflow-hidden">
                          <CardContent className="p-4">
                            <h4 className="font-medium">{rec.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {rec.description}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-muted-foreground">Type:</span>{" "}
                                {rec.type}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Returns:</span>{" "}
                                {rec.expectedReturns}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Risk:</span>{" "}
                                {rec.riskLevel}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Suitability:</span>{" "}
                                {rec.suitability}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                <Separator className="my-3" />

                <div className="p-4">
                  <h3 className="font-medium mb-3">Saving Suggestions</h3>
                  {suggestionsLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savingSuggestions?.map((suggestion: any) => (
                        <Card key={suggestion.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <h4 className="font-medium">{suggestion.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {suggestion.description}
                            </p>
                            <div className="flex justify-between text-xs">
                              <div>
                                <span className="text-muted-foreground">
                                  Potential Saving:
                                </span>{" "}
                                ₹{suggestion.potentialSaving}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Difficulty:</span>{" "}
                                {suggestion.difficulty}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  );
}