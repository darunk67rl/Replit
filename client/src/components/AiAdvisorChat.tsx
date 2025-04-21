import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  "How much did I save last month?",
  "Create a savings plan",
  "Investment recommendations",
];

export default function AiAdvisorChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your FinOne AI assistant. I can help you with financial insights, spending analysis, and investment advice. What would you like to know today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const aiQueryMutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await apiRequest("POST", "/api/ai-advisor/query", {
        userId: user?.id,
        question,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: data.answer,
          timestamp: new Date(),
        },
      ]);
    },
    onError: () => {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "I'm sorry, I couldn't process your request at this time. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Send to AI
    aiQueryMutation.mutate(inputMessage);
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm mb-5">
      <CardHeader className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
            <Bot className="h-5 w-5 text-primary dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium dark:text-gray-200">FinOne Assistant</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your personal finance advisor
            </p>
          </div>
        </div>
      </CardHeader>

      <ScrollArea className="max-h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start ${
              message.role === "user" ? "justify-end" : ""
            } max-w-[85%] ${message.role === "user" ? "ml-auto" : ""} mb-4`}
          >
            {message.role === "assistant" && (
              <Avatar className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-2 flex-shrink-0">
                <AvatarFallback>
                  <Bot className="h-4 w-4 text-primary dark:text-primary-400" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`${
                message.role === "assistant"
                  ? "bg-gray-100 dark:bg-gray-700 rounded-tl-none rounded-tr-lg rounded-br-lg rounded-bl-lg text-gray-800 dark:text-gray-200"
                  : "bg-primary text-white rounded-tl-lg rounded-tr-none rounded-br-lg rounded-bl-lg"
              } p-3`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start max-w-[85%] mb-4">
            <Avatar className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-2 flex-shrink-0">
              <AvatarFallback>
                <Bot className="h-4 w-4 text-primary dark:text-primary-400" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-tl-none rounded-tr-lg rounded-br-lg rounded-bl-lg p-3 text-gray-800 dark:text-gray-200">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="p-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <div className="flex-1 mr-2">
            <Input
              type="text"
              placeholder="Ask anything about your finances..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm dark:bg-slate-800 dark:text-white"
              disabled={isLoading}
            />
          </div>
          <Button
            className="bg-primary text-white rounded-full p-2"
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {quickQuestions.map((question, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-full"
              onClick={() => handleQuickQuestion(question)}
            >
              {question}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
