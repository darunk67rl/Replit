import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertBankAccountSchema, 
  insertTransactionSchema,
  insertInvestmentSchema,
  insertInsuranceSchema,
  insertAiInsightSchema
} from "@shared/schema";
import {
  generateFinancialInsights,
  categorizeTransaction,
  analyzeMonthlySpending,
  generateInvestmentRecommendations,
  answerFinancialQuery
} from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create API router
  const apiRouter = express.Router();
  app.use("/api", apiRouter);

  // Health check endpoint
  apiRouter.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // User endpoints
  apiRouter.post("/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user with phone already exists
      const existingUser = await storage.getUserByPhone(userData.phone);
      if (existingUser) {
        return res.status(409).json({ message: "User with this phone number already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json({
        id: user.id,
        username: user.username,
        name: user.name,
        phone: user.phone,
        email: user.email,
        isVerified: user.isVerified,
        kycComplete: user.kycComplete
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid user data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  apiRouter.post("/login", async (req: Request, res: Response) => {
    try {
      const { phone, password } = req.body;
      if (!phone || !password) {
        return res.status(400).json({ message: "Phone and password are required" });
      }
      
      const user = await storage.getUserByPhone(phone);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        phone: user.phone,
        email: user.email,
        isVerified: user.isVerified,
        kycComplete: user.kycComplete
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  apiRouter.post("/verify-otp", async (req: Request, res: Response) => {
    try {
      const { userId, otp } = req.body;
      if (!userId || !otp) {
        return res.status(400).json({ message: "User ID and OTP are required" });
      }
      
      // For demo purposes, accept any OTP
      const user = await storage.verifyUser(userId);
      res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        phone: user.phone,
        email: user.email,
        isVerified: user.isVerified,
        kycComplete: user.kycComplete
      });
    } catch (error) {
      res.status(500).json({ message: "OTP verification failed" });
    }
  });

  // Bank Account endpoints
  apiRouter.get("/users/:userId/bank-accounts", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const accounts = await storage.getBankAccounts(userId);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bank accounts" });
    }
  });

  apiRouter.post("/bank-accounts", async (req: Request, res: Response) => {
    try {
      const accountData = insertBankAccountSchema.parse(req.body);
      const account = await storage.createBankAccount(accountData);
      res.status(201).json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid bank account data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create bank account" });
      }
    }
  });

  apiRouter.put("/bank-accounts/:id/default", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const account = await storage.setDefaultBankAccount(id, userId);
      res.json(account);
    } catch (error) {
      res.status(500).json({ message: "Failed to set default bank account" });
    }
  });

  // Transaction endpoints
  apiRouter.get("/users/:userId/transactions", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const transactions = await storage.getTransactions(userId, limit);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get transactions" });
    }
  });

  apiRouter.post("/transactions", async (req: Request, res: Response) => {
    try {
      let transactionData = req.body;
      
      // If category is not provided, use AI to categorize
      if (!transactionData.category && transactionData.description) {
        const categorization = await categorizeTransaction(
          transactionData.description,
          transactionData.amount
        );
        transactionData.category = categorization.category;
      }
      
      const validatedData = insertTransactionSchema.parse(transactionData);
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create transaction" });
      }
    }
  });

  apiRouter.get("/users/:userId/spending", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const spending = await storage.getMonthlySpending(userId);
      res.json(spending);
    } catch (error) {
      res.status(500).json({ message: "Failed to get spending data" });
    }
  });

  // Investment endpoints
  apiRouter.get("/users/:userId/investments", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const investments = await storage.getInvestments(userId);
      res.json(investments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get investments" });
    }
  });

  apiRouter.post("/investments", async (req: Request, res: Response) => {
    try {
      const investmentData = insertInvestmentSchema.parse(req.body);
      const investment = await storage.createInvestment(investmentData);
      res.status(201).json(investment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid investment data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create investment" });
      }
    }
  });

  apiRouter.get("/users/:userId/portfolio-summary", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const summary = await storage.getPortfolioSummary(userId);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to get portfolio summary" });
    }
  });

  // Insurance endpoints
  apiRouter.get("/users/:userId/insurances", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const insurances = await storage.getInsurances(userId);
      res.json(insurances);
    } catch (error) {
      res.status(500).json({ message: "Failed to get insurances" });
    }
  });

  apiRouter.post("/insurances", async (req: Request, res: Response) => {
    try {
      const insuranceData = insertInsuranceSchema.parse(req.body);
      const insurance = await storage.createInsurance(insuranceData);
      res.status(201).json(insurance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid insurance data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create insurance" });
      }
    }
  });

  apiRouter.get("/users/:userId/expiring-insurances", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const insurances = await storage.getExpiringInsurances(userId, days);
      res.json(insurances);
    } catch (error) {
      res.status(500).json({ message: "Failed to get expiring insurances" });
    }
  });

  // AI Insights endpoints
  apiRouter.get("/users/:userId/ai-insights", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const insights = await storage.getAiInsights(userId, limit);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to get AI insights" });
    }
  });

  apiRouter.post("/users/:userId/ai-insights/generate", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get user transactions
      const transactions = await storage.getTransactions(userId, 20);
      
      // Get default bank account balance
      const defaultAccount = await storage.getDefaultBankAccount(userId);
      const balance = defaultAccount ? defaultAccount.balance : 0;
      
      // Generate insights using OpenAI
      const generatedInsights = await generateFinancialInsights(transactions, balance);
      
      // Save insights to database
      const savedInsights = [];
      for (const insight of generatedInsights) {
        const insightData = {
          userId,
          type: insight.type,
          title: insight.title,
          description: insight.description,
          priority: insight.priority,
          isRead: false
        };
        
        const savedInsight = await storage.createAiInsight(insightData);
        savedInsights.push(savedInsight);
      }
      
      res.json(savedInsights);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate AI insights" });
    }
  });

  apiRouter.put("/ai-insights/:id/read", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const insight = await storage.markInsightAsRead(id);
      res.json(insight);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark insight as read" });
    }
  });

  // AI Financial Advisor endpoints
  apiRouter.post("/ai-advisor/analyze-spending", async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      // Get current month transactions
      const currentMonthTransactions = await storage.getTransactions(userId);
      
      // For demo purposes, use the same transactions for previous month
      const previousMonthTransactions = [...currentMonthTransactions];
      
      const analysis = await analyzeMonthlySpending(
        currentMonthTransactions,
        previousMonthTransactions
      );
      
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze spending" });
    }
  });

  apiRouter.post("/ai-advisor/investment-recommendations", async (req: Request, res: Response) => {
    try {
      const { userId, age, monthlyIncome, goals } = req.body;
      if (!userId || !age || !monthlyIncome) {
        return res.status(400).json({ message: "User ID, age, and monthly income are required" });
      }
      
      // Get existing investments
      const investments = await storage.getInvestments(userId);
      
      const recommendations = await generateInvestmentRecommendations(
        age,
        monthlyIncome,
        investments,
        goals || []
      );
      
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate investment recommendations" });
    }
  });

  apiRouter.post("/ai-advisor/query", async (req: Request, res: Response) => {
    try {
      const { userId, question } = req.body;
      if (!userId || !question) {
        return res.status(400).json({ message: "User ID and question are required" });
      }
      
      // Get user context
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const defaultAccount = await storage.getDefaultBankAccount(userId);
      const balance = defaultAccount ? defaultAccount.balance : 0;
      const recentTransactions = await storage.getTransactions(userId, 10);
      const investments = await storage.getInvestments(userId);
      const insights = await storage.getAiInsights(userId, 5);
      
      const answer = await answerFinancialQuery(
        question,
        {
          name: user.name,
          balance,
          recentTransactions,
          investments,
          insights
        }
      );
      
      res.json({ answer });
    } catch (error) {
      res.status(500).json({ message: "Failed to answer query" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
