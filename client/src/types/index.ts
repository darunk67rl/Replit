// User-related types
export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  balance: number;
  upiId: string;
  isKycVerified: boolean;
}

// Transaction-related types
export interface Transaction {
  id: string;
  merchant: string;
  date: Date;
  amount: number;
  type: string;
  category: string;
}

// UPI-related types
export interface UpiAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  upiId: string;
  isDefault: boolean;
}

export interface Contact {
  id: string;
  name: string;
  upiId: string;
  phoneNumber: string;
  isFrequent: boolean;
}

// Finance-related types
export interface Investment {
  id: string;
  name: string;
  type: "mutual_fund" | "stock" | "gold" | "fd" | "other";
  value: number;
  changePercentage: number;
  investedAmount: number;
  investmentDate: Date;
}

export interface InsurancePolicy {
  id: string;
  name: string;
  type: "health" | "term" | "vehicle" | "other";
  premium: number;
  coverage: number;
  expiryDate: Date;
  policyNumber: string;
  provider: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  type: "emergency" | "education" | "home" | "car" | "vacation" | "retirement" | "other";
}

export interface CreditScore {
  score: number;
  lastUpdated: Date;
  status: "poor" | "fair" | "good" | "excellent";
  factors: {
    id: string;
    factor: string;
    impact: "positive" | "negative" | "neutral";
  }[];
}

// Spending analysis types
export interface SpendingCategory {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  transactions: number;
  color: string;
}

export interface SpendingReport {
  totalSpending: number;
  period: "week" | "month" | "year";
  categories: SpendingCategory[];
  comparison: {
    previousPeriod: number;
    percentageChange: number;
  };
}

// AI assistant types
export interface AIRecommendation {
  id: string;
  type: "spending" | "investment" | "insurance" | "loan" | "saving";
  title: string;
  description: string;
  actionable: boolean;
  action?: {
    text: string;
    url: string;
  };
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
