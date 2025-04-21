import { apiRequest } from "./queryClient";

// Interface for finance insights response
export interface FinanceInsights {
  analysis: string;
  recommendations: string[];
  spendingCategories: {
    category: string;
    amount: number;
    percentChange: number;
    transactions: number;
  }[];
}

// Get AI-generated finance insights
export async function getFinanceInsights(timeframe: "week" | "month" = "month"): Promise<FinanceInsights> {
  const response = await apiRequest("GET", `/api/ai/insights?timeframe=${timeframe}`, undefined);
  return response.json();
}

// Interface for AI chatbot response
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// Send message to AI finance advisor
export async function sendChatMessage(message: string): Promise<ChatMessage> {
  const response = await apiRequest("POST", "/api/ai/chat", { message });
  return response.json();
}

// Interface for investment recommendations
export interface InvestmentRecommendation {
  type: string;
  name: string;
  description: string;
  expectedReturns: string;
  riskLevel: "Low" | "Moderate" | "High";
  suitability: string;
}

// Get personalized investment recommendations
export async function getInvestmentRecommendations(): Promise<InvestmentRecommendation[]> {
  const response = await apiRequest("GET", "/api/ai/investments", undefined);
  return response.json();
}

// Interface for saving suggestions
export interface SavingSuggestion {
  id: string;
  title: string;
  description: string;
  potentialSaving: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

// Get personalized saving suggestions
export async function getSavingSuggestions(): Promise<SavingSuggestion[]> {
  const response = await apiRequest("GET", "/api/ai/savings", undefined);
  return response.json();
}
