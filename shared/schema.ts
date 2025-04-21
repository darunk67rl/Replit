import { pgTable, text, serial, integer, boolean, date, timestamp, real, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User table schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  phoneNumber: text("phone_number").notNull().unique(),
  email: text("email"),
  password: text("password"),
  balance: integer("balance").default(0),
  upiId: text("upi_id"),
  isKycVerified: boolean("is_kyc_verified").default(false),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true
});

// Transactions table schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  merchant: text("merchant").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  amount: integer("amount").notNull(),
  type: text("type").notNull(),
  category: text("category").notNull(),
  description: text("description")
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true
});

// UPI Contacts table schema
export const upiContacts = pgTable("upi_contacts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  upiId: text("upi_id").notNull(),
  phoneNumber: text("phone_number"),
  isFrequent: boolean("is_frequent").default(false)
});

export const insertUpiContactSchema = createInsertSchema(upiContacts).omit({
  id: true
});

// Investments table schema
export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // mutual_fund, stock, gold, fd, other
  value: integer("value").notNull(),
  changePercentage: real("change_percentage").notNull(),
  investedAmount: integer("invested_amount").notNull(),
  investmentDate: date("investment_date").notNull()
});

export const insertInvestmentSchema = createInsertSchema(investments).omit({
  id: true
});

// Insurance Policies table schema
export const insurancePolicies = pgTable("insurance_policies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // health, term, vehicle, other
  premium: integer("premium").notNull(),
  coverage: integer("coverage").notNull(),
  expiryDate: date("expiry_date").notNull(),
  policyNumber: text("policy_number").notNull(),
  provider: text("provider").notNull()
});

export const insertInsurancePolicySchema = createInsertSchema(insurancePolicies).omit({
  id: true
});

// Financial Goals table schema
export const financialGoals = pgTable("financial_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  targetAmount: integer("target_amount").notNull(),
  currentAmount: integer("current_amount").notNull().default(0),
  targetDate: date("target_date").notNull(),
  type: text("type").notNull() // emergency, education, home, car, vacation, retirement, other
});

export const insertFinancialGoalSchema = createInsertSchema(financialGoals).omit({
  id: true
});

// Chat Messages table schema
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  role: text("role").notNull(), // user or assistant
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow()
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true
});

// Type definitions for our models
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type UpiContact = typeof upiContacts.$inferSelect;
export type InsertUpiContact = z.infer<typeof insertUpiContactSchema>;

export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;

export type InsurancePolicy = typeof insurancePolicies.$inferSelect;
export type InsertInsurancePolicy = z.infer<typeof insertInsurancePolicySchema>;

export type FinancialGoal = typeof financialGoals.$inferSelect;
export type InsertFinancialGoal = z.infer<typeof insertFinancialGoalSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
  upiContacts: many(upiContacts),
  investments: many(investments),
  insurancePolicies: many(insurancePolicies),
  financialGoals: many(financialGoals),
  chatMessages: many(chatMessages)
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id]
  })
}));

export const upiContactsRelations = relations(upiContacts, ({ one }) => ({
  user: one(users, {
    fields: [upiContacts.userId],
    references: [users.id]
  })
}));

export const investmentsRelations = relations(investments, ({ one }) => ({
  user: one(users, {
    fields: [investments.userId],
    references: [users.id]
  })
}));

export const insurancePoliciesRelations = relations(insurancePolicies, ({ one }) => ({
  user: one(users, {
    fields: [insurancePolicies.userId],
    references: [users.id]
  })
}));

export const financialGoalsRelations = relations(financialGoals, ({ one }) => ({
  user: one(users, {
    fields: [financialGoals.userId],
    references: [users.id]
  })
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id]
  })
}));

// Additional types needed for the application

// User profile for AI recommendations
export interface UserProfile {
  userId: number;
  name: string;
  age: number;
  income: number;
  riskProfile: 'low' | 'moderate' | 'high';
  goals: {
    type: string;
    targetAmount: number;
    timeframe: number; // in months
  }[];
}

// Financial Goal for an upcoming time period
export interface FinancialPlanGoal {
  type: string;
  targetAmount: number;
  timeframe: number; // in months
  currentContribution: number;
  suggestedContribution: number;
}

// AI-generated spending report
export interface SpendingReport {
  totalSpent: number;
  periodStart: Date;
  periodEnd: Date;
  categories: {
    name: string;
    amount: number;
    percentage: number;
    trend: number; // percentage change from previous period
  }[];
  insights: string[];
}
