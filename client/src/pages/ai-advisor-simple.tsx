import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User as UserIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

export default function AiAdvisorSimple() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI financial advisor. How can I help you with your finances today?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Simple AI response function
  const getAIResponse = (userMessage: string) => {
    const messageLower = userMessage.toLowerCase();
    
    if (messageLower.includes("invest") || messageLower.includes("stock") || messageLower.includes("mutual fund")) {
      return "Based on your risk profile, I recommend considering index funds for long-term investment. They offer good returns with moderate risk. Would you like me to explain more about index funds?";
    } else if (messageLower.includes("save") || messageLower.includes("saving")) {
      return "To improve your savings, consider implementing the 50-30-20 rule: 50% of income for needs, 30% for wants, and 20% for savings and debt repayment. This balanced approach can help you build your savings consistently.";
    } else if (messageLower.includes("loan") || messageLower.includes("borrow") || messageLower.includes("debt")) {
      return "Before taking any loan, compare interest rates from multiple lenders. For home loans, currently SBI offers rates starting at 8.40%, while HDFC Bank offers 8.50%. Always check your eligibility and repayment capacity before applying.";
    } else if (messageLower.includes("budget") || messageLower.includes("spending")) {
      return "Based on your spending patterns, you could optimize your budget by reducing dining out expenses, which are 30% higher than average. Consider cooking at home more often, which could save you approximately ₹5,000 per month.";
    } else {
      return "Thank you for your question. As your AI financial advisor, I'm here to help with investment decisions, saving strategies, loan options, and budgeting advice. Could you provide more details about your financial goals?";
    }
  };

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
    setMessage("");
    setIsTyping(true);
    
    // Simulate AI response with a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai_${Date.now()}`,
        role: "assistant",
        content: getAIResponse(newUserMessage.content),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
      
      toast({
        title: "New AI insight",
        description: "Your AI advisor has new financial advice for you",
      });
    }, 1500);

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 container max-w-md mx-auto px-4 pb-20 pt-16">
        <Card className="h-[calc(100vh-140px)] flex flex-col">
          <CardHeader className="px-4 py-3 border-b">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Bot className="h-5 w-5 mr-2 text-primary" />
              AI Financial Advisor
            </CardTitle>
          </CardHeader>
          
          <ScrollArea ref={scrollRef} className="flex-1 p-4 overflow-y-auto">
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
              
              {isTyping && (
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
                disabled={!message.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </main>
      
      <BottomNavigation />
    </div>
  );
}