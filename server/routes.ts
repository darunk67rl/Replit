import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import * as openai from "./openai";
import { setupAuth } from "./auth";
// Stripe mock import - will be replaced with real Stripe when keys are available
const stripeMock = {
  paymentIntents: {
    create: async ({ amount, currency, metadata }: any) => {
      // Create a mock payment intent
      return {
        id: `pi_${Date.now()}`,
        client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substring(2, 10)}`,
        amount,
        currency,
        metadata,
        status: 'requires_payment_method'
      };
    },
    capture: async (paymentIntentId: string) => {
      // Mock capturing a payment intent
      return {
        id: paymentIntentId,
        status: 'succeeded'
      };
    }
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // HTTP server
  const httpServer = createServer(app);

  // Set up authentication
  setupAuth(app);

  // Transaction routes
  app.get("/api/transactions/recent", async (req, res) => {
    try {
      const transactions = await storage.getRecentTransactions();
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent transactions" });
    }
  });

  app.get("/api/transactions", async (req, res) => {
    try {
      const { timeframe, category } = req.query;
      const transactions = await storage.getTransactions({ 
        timeframe: timeframe as string,
        category: category as string
      });
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // UPI routes
  app.get("/api/upi/contacts", async (req, res) => {
    try {
      const contacts = await storage.getUpiContacts();
      res.status(200).json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch UPI contacts" });
    }
  });

  app.post("/api/upi/transaction", async (req, res) => {
    try {
      const transactionSchema = z.object({
        amount: z.number().positive(),
        recipient: z.string(),
        recipientType: z.enum(["upi_id", "phone", "contact_id"]),
        note: z.string().optional(),
        type: z.enum(["payment", "request"])
      });

      const result = transactionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid transaction data", errors: result.error.format() });
      }

      // Process the transaction (mock implementation)
      const transactionId = `TXN${Date.now()}`;
      const transaction = await storage.createTransaction({
        amount: result.data.amount,
        type: result.data.type,
        date: new Date(),
        userId: null,
        merchant: result.data.recipient,
        category: "transfer",
        description: result.data.note || "UPI transaction"
      });

      res.status(200).json({
        message: "Transaction processed successfully",
        transactionId: transaction.id,
        transaction
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to process transaction" });
    }
  });

  // Finance routes - Investments
  app.get("/api/investments", async (req, res) => {
    try {
      const investments = await storage.getInvestments();
      res.status(200).json(investments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investments" });
    }
  });

  // Finance routes - Insurance
  app.get("/api/insurance", async (req, res) => {
    try {
      const policies = await storage.getInsurancePolicies();
      res.status(200).json(policies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch insurance policies" });
    }
  });

  // Finance routes - Financial Goals
  app.get("/api/financial-goals", async (req, res) => {
    try {
      const goals = await storage.getFinancialGoals();
      res.status(200).json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch financial goals" });
    }
  });

  // AI-powered features
  app.get("/api/ai/insights", async (req, res) => {
    try {
      const { timeframe = "month" } = req.query;
      const transactions = await storage.getTransactions({ 
        timeframe: timeframe as string
      });
      
      const insights = await openai.generateFinancialInsights(transactions, timeframe as string);
      res.status(200).json(insights);
    } catch (error) {
      console.error("AI insights error:", error);
      res.status(500).json({ 
        message: "Failed to generate AI insights",
        analysis: "We couldn't analyze your spending patterns at this time. Please try again later.",
        recommendations: ["Try again later when our AI services are back up."],
        spendingCategories: []
      });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Invalid message format" });
      }

      // Get transaction context for better answers
      const transactions = await storage.getRecentTransactions();
      const financialContext = {
        transactions,
        investments: await storage.getInvestments(),
        insurances: await storage.getInsurancePolicies(),
        goals: await storage.getFinancialGoals()
      };
      
      const response = await openai.getChatResponse(message, financialContext);
      
      const chatMessage = {
        id: `msg_${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(chatMessage);
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({
        id: `error_${Date.now()}`,
        role: "assistant",
        content: "I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date().toISOString()
      });
    }
  });

  app.get("/api/ai/investments", async (req, res) => {
    try {
      const userProfile = await storage.getUserProfile();
      const recommendations = await openai.getInvestmentRecommendations(userProfile);
      res.status(200).json(recommendations);
    } catch (error) {
      console.error("AI investment recommendations error:", error);
      res.status(500).json([{
        type: "Mutual Fund",
        name: "Index Fund",
        description: "Low-cost fund that tracks a market index",
        expectedReturns: "10-12% p.a.",
        riskLevel: "Moderate",
        suitability: "Recommended for most investors as a core holding"
      }]);
    }
  });

  app.get("/api/ai/savings", async (req, res) => {
    try {
      const transactions = await storage.getTransactions({ timeframe: "month" });
      const suggestions = await openai.getSavingSuggestions(transactions);
      res.status(200).json(suggestions);
    } catch (error) {
      console.error("AI saving suggestions error:", error);
      res.status(500).json([{
        id: "suggestion_1",
        title: "Reduce dining expenses",
        description: "You're spending more on restaurants than average. Consider cooking at home more often.",
        potentialSaving: 2000,
        difficulty: "Medium"
      }]);
    }
  });

  app.get("/api/ai/chat/history", async (req, res) => {
    try {
      const chatHistory = await storage.getChatHistory();
      res.status(200).json(chatHistory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  // Payment processing routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, recipient } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Create a payment intent with Stripe
      const paymentIntent = await stripeMock.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents/paise
        currency: "inr",
        metadata: {
          recipient,
          note: req.body.note || '',
        },
      });

      // Create a transaction record in pending state
      const transaction = await storage.createTransaction({
        amount: Math.round(parseFloat(amount)),
        type: "payment",
        date: new Date(),
        userId: null,
        category: "transfer",
        merchant: recipient || "Unknown recipient",
        description: req.body.note || 'Payment via Stripe'
      });

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        transaction
      });
    } catch (error) {
      console.error("Payment intent creation error:", error);
      res.status(500).json({ message: "Failed to create payment intent" });
    }
  });

  // Payment success webhook (simplified for demo)
  app.post("/api/payment-success", async (req, res) => {
    try {
      const { paymentIntentId } = req.body;

      if (!paymentIntentId) {
        return res.status(400).json({ message: "Missing payment intent ID" });
      }

      // Update transaction status
      // In a real implementation, we would verify with Stripe first
      const updatedPaymentIntent = await stripeMock.paymentIntents.capture(paymentIntentId);
      
      // Here we would update the transaction in the database
      // For now we'll just return success
      res.status(200).json({ 
        status: "success", 
        message: "Payment captured successfully"
      });
    } catch (error) {
      console.error("Payment capture error:", error);
      res.status(500).json({ message: "Failed to capture payment" });
    }
  });

  return httpServer;
}
