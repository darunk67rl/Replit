import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export interface FinancialInsight {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  type: "savings" | "spending" | "investment" | "insurance";
}

export interface SpendingCategorization {
  category: string;
  subcategory?: string;
  confidence: number;
}

export interface MonthlyAnalysis {
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
 * Generate insights from transaction data
 */
export async function generateFinancialInsights(
  transactions: any[],
  totalBalance: number
): Promise<FinancialInsight[]> {
  try {
    const prompt = `
      Analyze these financial transactions and provide 2-3 actionable insights:
      
      Current Balance: ₹${totalBalance}
      Transactions: ${JSON.stringify(transactions)}
      
      Generate insights in the following JSON format:
      [
        {
          "title": "Short, clear title",
          "description": "2-3 sentence description with specific advice",
          "priority": "high|medium|low",
          "type": "savings|spending|investment|insurance"
        }
      ]
      
      Focus on:
      - Unusual spending patterns
      - Savings opportunities
      - Investment suggestions
      - Insurance or bill payment reminders
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.insights || [];
  } catch (error) {
    console.error("Error generating financial insights:", error);
    return [];
  }
}

/**
 * Categorize a transaction based on its description
 */
export async function categorizeTransaction(
  description: string,
  amount: number
): Promise<SpendingCategorization> {
  try {
    const prompt = `
      Categorize this transaction into one of these categories:
      - shopping
      - food
      - entertainment
      - transportation
      - bills
      - health
      - education
      - housing
      - travel
      - investment
      - other
      
      Transaction: "${description}" for ₹${amount}
      
      Respond in the following JSON format:
      {
        "category": "category_name",
        "subcategory": "optional_subcategory",
        "confidence": 0.95 // between 0 and 1
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error categorizing transaction:", error);
    return {
      category: "other",
      confidence: 0.5,
    };
  }
}

/**
 * Analyze monthly spending patterns
 */
export async function analyzeMonthlySpending(
  transactions: any[],
  previousMonthTransactions: any[]
): Promise<MonthlyAnalysis> {
  try {
    const prompt = `
      Analyze these financial transactions and compare with previous month:
      
      Current Month: ${JSON.stringify(transactions)}
      Previous Month: ${JSON.stringify(previousMonthTransactions)}
      
      Provide an analysis in the following JSON format:
      {
        "summary": "2-3 sentence overall analysis",
        "topSpendingCategories": [
          {"category": "food", "percentage": 30},
          {"category": "shopping", "percentage": 25},
          {"category": "entertainment", "percentage": 15},
          {"category": "other", "percentage": 30}
        ],
        "savingsRecommendation": {
          "amount": 2000,
          "description": "Why and how to save this amount"
        },
        "anomalies": [
          {
            "category": "food",
            "description": "Unusual increase in food spending",
            "severity": "high|medium|low"
          }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error analyzing monthly spending:", error);
    return {
      summary: "Unable to analyze spending patterns at this time.",
      topSpendingCategories: [],
      savingsRecommendation: {
        amount: 0,
        description: "",
      },
      anomalies: [],
    };
  }
}

/**
 * Generate investment recommendations based on risk profile and goals
 */
export async function generateInvestmentRecommendations(
  age: number,
  monthlyIncome: number,
  existingInvestments: any[],
  goals: string[]
): Promise<InvestmentRecommendation> {
  try {
    const prompt = `
      Generate investment recommendations based on:
      
      Age: ${age}
      Monthly Income: ₹${monthlyIncome}
      Existing Investments: ${JSON.stringify(existingInvestments)}
      Financial Goals: ${JSON.stringify(goals)}
      
      Provide recommendations in the following JSON format:
      {
        "riskProfile": "conservative|moderate|aggressive",
        "recommendations": [
          {
            "type": "Mutual Funds",
            "allocation": 40,
            "reason": "Explanation for this allocation"
          }
        ],
        "suggestedMonthlyInvestment": 15000
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error generating investment recommendations:", error);
    return {
      riskProfile: "moderate",
      recommendations: [],
      suggestedMonthlyInvestment: 0,
    };
  }
}

/**
 * Handle user queries about their finances
 */
export async function answerFinancialQuery(
  question: string,
  userContext: {
    name: string;
    balance: number;
    recentTransactions: any[];
    investments?: any[];
    insights?: any[];
  }
): Promise<string> {
  try {
    const prompt = `
      Answer this financial question from user ${userContext.name}:
      
      "${question}"
      
      User context:
      - Current balance: ₹${userContext.balance}
      - Recent transactions: ${JSON.stringify(userContext.recentTransactions)}
      ${userContext.investments ? `- Investments: ${JSON.stringify(userContext.investments)}` : ''}
      ${userContext.insights ? `- AI Insights: ${JSON.stringify(userContext.insights)}` : ''}
      
      Provide a conversational, helpful response focused on their question.
      If you don't have enough information, suggest what additional details would help.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error answering financial query:", error);
    return "I'm sorry, I couldn't process your question at this time. Please try again later.";
  }
}
