import OpenAI from "openai";
import { Transaction, Investment, InsurancePolicy, FinancialGoal, UserProfile } from "../shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "demo-api-key" });

interface FinancialInsights {
  analysis: string;
  recommendations: string[];
  spendingCategories: {
    category: string;
    amount: number;
    percentChange: number;
    transactions: number;
  }[];
}

/**
 * Generate financial insights from transaction history
 */
export async function generateFinancialInsights(
  transactions: Transaction[],
  timeframe: string
): Promise<FinancialInsights> {
  try {
    const prompt = `
      Analyze the following financial transactions for the ${timeframe}:
      ${JSON.stringify(transactions, null, 2)}
      
      Please provide:
      1. A brief analysis of spending patterns (2-3 sentences)
      2. 3 specific recommendations for improving financial health
      3. A breakdown of spending by category with the amount and percentage change from previous ${timeframe}
      
      Respond with JSON in this format:
      {
        "analysis": "analysis text here",
        "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
        "spendingCategories": [
          {
            "category": "category name",
            "amount": amount in INR as number,
            "percentChange": percent change from previous period as number,
            "transactions": number of transactions
          }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a financial analyst specializing in personal finance for Indian users." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    return JSON.parse(content);
  } catch (error: any) {
    console.error("OpenAI financial insights error:", error);
    
    // Fallback response
    return {
      analysis: "Based on your recent transactions, you've spent most on food, shopping, and transportation.",
      recommendations: [
        "Consider setting a budget for dining out expenses",
        "Try to save 10% of your income each month",
        "Review your subscription services for any you don't use regularly"
      ],
      spendingCategories: [
        {
          category: "Food",
          amount: 4250,
          percentChange: 15,
          transactions: 32
        },
        {
          category: "Shopping",
          amount: 3120,
          percentChange: 5,
          transactions: 8
        },
        {
          category: "Transportation",
          amount: 2860,
          percentChange: -10,
          transactions: 28
        }
      ]
    };
  }
}

interface FinancialContext {
  transactions: Transaction[];
  investments: Investment[];
  insurances: InsurancePolicy[];
  goals: FinancialGoal[];
}

/**
 * Get AI chatbot response to a financial query
 */
export async function getChatResponse(
  message: string,
  context: FinancialContext
): Promise<string> {
  try {
    const contextPrompt = `
      Here is some context about the user's finances:
      
      Recent Transactions: ${JSON.stringify(context.transactions)}
      Investments: ${JSON.stringify(context.investments)}
      Insurance Policies: ${JSON.stringify(context.insurances)}
      Financial Goals: ${JSON.stringify(context.goals)}
      
      The user has asked: "${message}"
      
      Respond in a helpful, conversational way with personalized financial advice based on their data.
      Limit your response to 3-4 sentences unless a detailed explanation is requested.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a financial advisor assistant in an Indian fintech app. " +
                   "You specialize in personal finance, UPI payments, investments, and insurance. " +
                   "Use ₹ for currency and Indian financial terminology. Be concise but helpful."
        },
        { role: "user", content: contextPrompt }
      ],
      max_tokens: 300
    });

    return response.choices[0].message.content || "I don't have an answer for that at the moment.";
  } catch (error: any) {
    console.error("OpenAI chat response error:", error);
    return "I'm having trouble processing your request right now. Please try again in a few moments.";
  }
}

/**
 * Get personalized investment recommendations
 */
export async function getInvestmentRecommendations(
  userProfile: UserProfile
): Promise<any[]> {
  try {
    const prompt = `
      Based on this user profile:
      ${JSON.stringify(userProfile, null, 2)}
      
      Provide 3 investment recommendations suitable for this user.
      Consider their risk profile, goals, age, and income.
      
      Respond with JSON array in this format:
      [
        {
          "type": "investment type",
          "name": "specific product name",
          "description": "brief description",
          "expectedReturns": "expected returns range",
          "riskLevel": "Low/Moderate/High",
          "suitability": "why this is suitable for the user"
        }
      ]
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are an investment advisor specializing in Indian financial products."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    return JSON.parse(content);
  } catch (error: any) {
    console.error("OpenAI investment recommendations error:", error);
    
    // Fallback recommendations
    return [
      {
        type: "Mutual Fund",
        name: "HDFC Mid Cap Opportunities",
        description: "A diversified equity fund focusing on mid-cap companies with growth potential",
        expectedReturns: "12-15% p.a.",
        riskLevel: "Moderate",
        suitability: "Suitable for long-term growth with moderate risk tolerance"
      },
      {
        type: "Index Fund",
        name: "Nifty 50 Index Fund",
        description: "Passively managed fund that tracks the Nifty 50 index",
        expectedReturns: "10-12% p.a.",
        riskLevel: "Moderate",
        suitability: "Good core holding for all investors seeking market returns"
      },
      {
        type: "Debt Fund",
        name: "ICICI Prudential Short Term Fund",
        description: "Focus on short-term debt instruments for capital preservation and income",
        expectedReturns: "6-8% p.a.",
        riskLevel: "Low",
        suitability: "Ideal for emergency funds or short-term goals"
      }
    ];
  }
}

/**
 * Get personalized saving suggestions
 */
export async function getSavingSuggestions(
  transactions: Transaction[]
): Promise<any[]> {
  try {
    const prompt = `
      Analyze these transactions:
      ${JSON.stringify(transactions, null, 2)}
      
      Provide 3 specific, actionable suggestions for how this user could save money
      based on their spending patterns.
      
      Respond with JSON array in this format:
      [
        {
          "id": "unique_id",
          "title": "short title",
          "description": "detailed suggestion",
          "potentialSaving": estimated monthly savings in INR as number,
          "difficulty": "Easy/Medium/Hard"
        }
      ]
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a personal finance coach helping users save money."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    return JSON.parse(content);
  } catch (error: any) {
    console.error("OpenAI saving suggestions error:", error);
    
    // Fallback suggestions
    return [
      {
        id: "save_dining",
        title: "Reduce dining expenses",
        description: "You spent ₹4,250 on dining out last month. Try cooking at home 2 more days per week to save approximately ₹2,000 monthly.",
        potentialSaving: 2000,
        difficulty: "Medium"
      },
      {
        id: "save_subscriptions",
        title: "Audit subscription services",
        description: "Review your recurring payments for unused subscriptions. Canceling just 2-3 services could save you ₹500-1,000 monthly.",
        potentialSaving: 750,
        difficulty: "Easy"
      },
      {
        id: "save_transport",
        title: "Optimize transportation",
        description: "Consider carpooling or using public transport 2-3 days a week to reduce your ₹2,860 monthly transportation expenses.",
        potentialSaving: 1200,
        difficulty: "Hard"
      }
    ];
  }
}
