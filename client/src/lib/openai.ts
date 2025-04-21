import { apiRequest } from "./queryClient";

// Interface for financial insights
export interface FinancialInsight {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  type: "savings" | "spending" | "investment" | "insurance";
}

// Interface for spending analysis
export interface SpendingAnalysis {
  summary: string;
  topSpendingCategories: { category: string; percentage: number }[];
  savingsRecommendation: {
    amount: number;
    description: string;
  };
  anomalies: {
    category: string;
    description: string;
    severity: "high" | "medium" | "low";
  }[];
}

// Interface for investment recommendations
export interface InvestmentRecommendation {
  riskProfile: "conservative" | "moderate" | "aggressive";
  recommendations: {
    type: string;
    allocation: number;
    reason: string;
  }[];
  suggestedMonthlyInvestment: number;
}

/**
 * Generate financial insights for a user
 */
export async function generateFinancialInsights(userId: number): Promise<FinancialInsight[]> {
  try {
    const response = await apiRequest(
      "POST",
      `/api/users/${userId}/ai-insights/generate`,
      {}
    );
    return await response.json();
  } catch (error) {
    console.error("Error generating financial insights:", error);
    return [];
  }
}

/**
 * Analyze monthly spending for a user
 */
export async function analyzeMonthlySpending(userId: number): Promise<SpendingAnalysis> {
  try {
    const response = await apiRequest(
      "POST",
      `/api/ai-advisor/analyze-spending`,
      { userId }
    );
    return await response.json();
  } catch (error) {
    console.error("Error analyzing monthly spending:", error);
    throw error;
  }
}

/**
 * Get investment recommendations based on user profile
 */
export async function getInvestmentRecommendations(
  userId: number,
  age: number,
  monthlyIncome: number,
  goals: string[]
): Promise<InvestmentRecommendation> {
  try {
    const response = await apiRequest(
      "POST",
      `/api/ai-advisor/investment-recommendations`,
      { userId, age, monthlyIncome, goals }
    );
    return await response.json();
  } catch (error) {
    console.error("Error getting investment recommendations:", error);
    throw error;
  }
}

/**
 * Get an answer from the AI financial advisor
 */
export async function askFinancialAdvisor(
  userId: number,
  question: string
): Promise<string> {
  try {
    const response = await apiRequest(
      "POST",
      `/api/ai-advisor/query`,
      { userId, question }
    );
    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error("Error asking financial advisor:", error);
    throw error;
  }
}
