import { pgTable, text, serial, integer, boolean, timestamp, real, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  isVerified: boolean("is_verified").default(false),
  kycComplete: boolean("kyc_complete").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  phone: true,
  email: true,
});

// Bank Account Schema
export const bankAccounts = pgTable("bank_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bankName: text("bank_name").notNull(),
  accountNumber: text("account_number").notNull(),
  ifscCode: text("ifsc_code").notNull(), 
  accountType: text("account_type").notNull(),
  upiId: text("upi_id"),
  balance: real("balance").notNull().default(0),
  isDefault: boolean("is_default").default(false),
});

export const insertBankAccountSchema = createInsertSchema(bankAccounts).pick({
  userId: true,
  bankName: true,
  accountNumber: true,
  ifscCode: true,
  accountType: true,
  upiId: true,
  balance: true,
  isDefault: true,
});

// Transaction Schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: real("amount").notNull(),
  type: text("type").notNull(), // credit, debit
  category: text("category").notNull(), // shopping, food, entertainment, etc.
  description: text("description"),
  recipient: text("recipient"),
  sender: text("sender"),
  accountId: integer("account_id"),
  date: timestamp("date").notNull().defaultNow(),
  status: text("status").notNull(), // pending, completed, failed
  paymentMethod: text("payment_method").notNull(), // upi, card, etc.
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  amount: true,
  type: true,
  category: true,
  description: true,
  recipient: true,
  sender: true,
  accountId: true,
  status: true,
  paymentMethod: true,
});

// Investment Schema
export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // mutual_fund, stock, gold, fixed_deposit
  name: text("name").notNull(),
  investedAmount: real("invested_amount").notNull(),
  currentValue: real("current_value").notNull(),
  returns: real("returns"),
  units: real("units"),
  averagePrice: real("average_price"),
  isSIP: boolean("is_sip").default(false),
  sipAmount: real("sip_amount"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertInvestmentSchema = createInsertSchema(investments).pick({
  userId: true,
  type: true,
  name: true,
  investedAmount: true,
  currentValue: true,
  returns: true,
  units: true,
  averagePrice: true,
  isSIP: true,
  sipAmount: true,
});

// Insurance Schema
export const insurances = pgTable("insurances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // health, term, car, etc.
  provider: text("provider").notNull(),
  policyNumber: text("policy_number").notNull(),
  coverAmount: real("cover_amount").notNull(),
  premium: real("premium").notNull(),
  frequency: text("frequency").notNull(), // monthly, quarterly, yearly
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull(), // active, expired, pending
  details: json("details"),
});

export const insertInsuranceSchema = createInsertSchema(insurances).pick({
  userId: true,
  type: true,
  provider: true,
  policyNumber: true,
  coverAmount: true,
  premium: true,
  frequency: true,
  startDate: true,
  endDate: true,
  status: true,
  details: true,
});

// AI Insights Schema
export const aiInsights = pgTable("ai_insights", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // savings, spending, investment, etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull(), // high, medium, low
  date: timestamp("date").notNull().defaultNow(),
  isRead: boolean("is_read").default(false),
});

export const insertAiInsightSchema = createInsertSchema(aiInsights).pick({
  userId: true,
  type: true,
  title: true,
  description: true,
  priority: true,
  isRead: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BankAccount = typeof bankAccounts.$inferSelect;
export type InsertBankAccount = z.infer<typeof insertBankAccountSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;

export type Insurance = typeof insurances.$inferSelect;
export type InsertInsurance = z.infer<typeof insertInsuranceSchema>;

export type AiInsight = typeof aiInsights.$inferSelect;
export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;
