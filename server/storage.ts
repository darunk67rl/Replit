import { 
  users, type User, type InsertUser,
  bankAccounts, type BankAccount, type InsertBankAccount,
  transactions, type Transaction, type InsertTransaction,
  investments, type Investment, type InsertInvestment,
  insurances, type Insurance, type InsertInsurance,
  aiInsights, type AiInsight, type InsertAiInsight
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyUser(id: number): Promise<User>;
  completeKyc(id: number): Promise<User>;

  // Bank Account methods
  getBankAccounts(userId: number): Promise<BankAccount[]>;
  getBankAccount(id: number): Promise<BankAccount | undefined>;
  getDefaultBankAccount(userId: number): Promise<BankAccount | undefined>;
  createBankAccount(account: InsertBankAccount): Promise<BankAccount>;
  updateBankAccountBalance(id: number, amount: number): Promise<BankAccount>;
  setDefaultBankAccount(id: number, userId: number): Promise<BankAccount>;

  // Transaction methods
  getTransactions(userId: number, limit?: number): Promise<Transaction[]>;
  getTransactionsByCategory(userId: number, category: string): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getMonthlySpending(userId: number): Promise<{category: string, amount: number}[]>;

  // Investment methods
  getInvestments(userId: number): Promise<Investment[]>;
  getInvestment(id: number): Promise<Investment | undefined>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  updateInvestmentValue(id: number, currentValue: number): Promise<Investment>;
  getPortfolioSummary(userId: number): Promise<{
    totalValue: number,
    totalInvested: number,
    totalReturns: number,
    returnsPercentage: number
  }>;

  // Insurance methods
  getInsurances(userId: number): Promise<Insurance[]>;
  getInsurance(id: number): Promise<Insurance | undefined>;
  createInsurance(insurance: InsertInsurance): Promise<Insurance>;
  getExpiringInsurances(userId: number, daysThreshold: number): Promise<Insurance[]>;

  // AI Insights methods
  getAiInsights(userId: number, limit?: number): Promise<AiInsight[]>;
  createAiInsight(insight: InsertAiInsight): Promise<AiInsight>;
  markInsightAsRead(id: number): Promise<AiInsight>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private bankAccounts: Map<number, BankAccount>;
  private transactions: Map<number, Transaction>;
  private investments: Map<number, Investment>;
  private insurances: Map<number, Insurance>;
  private aiInsights: Map<number, AiInsight>;
  
  private userId: number;
  private bankAccountId: number;
  private transactionId: number;
  private investmentId: number;
  private insuranceId: number;
  private aiInsightId: number;

  constructor() {
    this.users = new Map();
    this.bankAccounts = new Map();
    this.transactions = new Map();
    this.investments = new Map();
    this.insurances = new Map();
    this.aiInsights = new Map();
    
    this.userId = 1;
    this.bankAccountId = 1;
    this.transactionId = 1;
    this.investmentId = 1;
    this.insuranceId = 1;
    this.aiInsightId = 1;

    // Initialize with a demo user
    const demoUser: User = {
      id: this.userId++,
      username: "aditya",
      password: "password",
      name: "Aditya Sharma",
      phone: "9876543210",
      email: "aditya@example.com",
      isVerified: true,
      kycComplete: true
    };
    this.users.set(demoUser.id, demoUser);

    // Initialize with some bank accounts
    const hdfcAccount: BankAccount = {
      id: this.bankAccountId++,
      userId: demoUser.id,
      bankName: "HDFC Bank",
      accountNumber: "****6789",
      ifscCode: "HDFC0001234",
      accountType: "Savings",
      upiId: "aditya@hdfcbank",
      balance: 25000,
      isDefault: true
    };
    this.bankAccounts.set(hdfcAccount.id, hdfcAccount);

    const sbiAccount: BankAccount = {
      id: this.bankAccountId++,
      userId: demoUser.id,
      bankName: "SBI Bank",
      accountNumber: "****4321",
      ifscCode: "SBIN0005678",
      accountType: "Savings",
      upiId: "aditya@sbi",
      balance: 15000,
      isDefault: false
    };
    this.bankAccounts.set(sbiAccount.id, sbiAccount);

    // Initialize with some transactions
    const transactions: InsertTransaction[] = [
      {
        userId: demoUser.id,
        amount: 1299,
        type: "debit",
        category: "shopping",
        description: "Amazon",
        recipient: "Amazon",
        sender: "Aditya Sharma",
        accountId: hdfcAccount.id,
        status: "completed",
        paymentMethod: "upi"
      },
      {
        userId: demoUser.id,
        amount: 5000,
        type: "credit",
        category: "transfer",
        description: "Transfer from Rahul",
        recipient: "Aditya Sharma",
        sender: "Rahul Mehta",
        accountId: hdfcAccount.id,
        status: "completed",
        paymentMethod: "upi"
      },
      {
        userId: demoUser.id,
        amount: 450,
        type: "debit",
        category: "food",
        description: "Swiggy",
        recipient: "Swiggy",
        sender: "Aditya Sharma",
        accountId: hdfcAccount.id,
        status: "completed",
        paymentMethod: "upi"
      },
      {
        userId: demoUser.id,
        amount: 3500,
        type: "debit",
        category: "entertainment",
        description: "Movie tickets",
        recipient: "PVR Cinemas",
        sender: "Aditya Sharma",
        accountId: sbiAccount.id,
        status: "completed",
        paymentMethod: "card"
      },
      {
        userId: demoUser.id,
        amount: 6500,
        type: "debit",
        category: "shopping",
        description: "Flipkart",
        recipient: "Flipkart",
        sender: "Aditya Sharma",
        accountId: hdfcAccount.id,
        status: "completed",
        paymentMethod: "upi"
      }
    ];

    // Add transactions
    transactions.forEach((txn) => {
      const now = new Date();
      const date = new Date(now.setDate(now.getDate() - Math.floor(Math.random() * 15)));
      
      const transaction: Transaction = {
        ...txn,
        id: this.transactionId++,
        date
      };
      
      this.transactions.set(transaction.id, transaction);
    });

    // Initialize with some investments
    const investments: InsertInvestment[] = [
      {
        userId: demoUser.id,
        type: "mutual_fund",
        name: "HDFC Mid-Cap Opportunities Fund",
        investedAmount: 105000,
        currentValue: 125450,
        returns: 20450,
        units: 1250.75,
        averagePrice: 84.75,
        isSIP: true,
        sipAmount: 5000
      },
      {
        userId: demoUser.id,
        type: "stock",
        name: "Reliance Industries Ltd.",
        investedAmount: 94500,
        currentValue: 102600,
        returns: 8100,
        units: 45,
        averagePrice: 2100,
        isSIP: false,
        sipAmount: null
      },
      {
        userId: demoUser.id,
        type: "gold",
        name: "Digital Gold",
        investedAmount: 78000,
        currentValue: 76500,
        returns: -1500,
        units: 15,
        averagePrice: 5200,
        isSIP: false,
        sipAmount: null
      }
    ];

    // Add investments
    investments.forEach((inv) => {
      const investment: Investment = {
        ...inv,
        id: this.investmentId++,
        lastUpdated: new Date()
      };
      
      this.investments.set(investment.id, investment);
    });

    // Initialize with some insurances
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);
    const oneYearLater = new Date();
    oneYearLater.setFullYear(today.getFullYear() + 1);
    
    const insurances: InsertInsurance[] = [
      {
        userId: demoUser.id,
        type: "health",
        provider: "HDFC ERGO",
        policyNumber: "H12345678",
        coverAmount: 500000,
        premium: 15000,
        frequency: "yearly",
        startDate: today,
        endDate: thirtyDaysLater,
        status: "active",
        details: { familyCovered: true, maternity: false }
      },
      {
        userId: demoUser.id,
        type: "term",
        provider: "LIC",
        policyNumber: "T12345678",
        coverAmount: 10000000,
        premium: 25000,
        frequency: "yearly",
        startDate: today,
        endDate: oneYearLater,
        status: "active",
        details: { riders: ["accidental", "critical illness"] }
      }
    ];

    // Add insurances
    insurances.forEach((ins) => {
      const insurance: Insurance = {
        ...ins,
        id: this.insuranceId++
      };
      
      this.insurances.set(insurance.id, insurance);
    });

    // Initialize with some AI insights
    const insights: InsertAiInsight[] = [
      {
        userId: demoUser.id,
        type: "savings",
        title: "Save ₹2,000 this week",
        description: "You're close to your emergency fund goal. A little push can help you reach it faster.",
        priority: "high",
        isRead: false
      },
      {
        userId: demoUser.id,
        type: "insurance",
        title: "Your HDFC policy expires soon",
        description: "Health insurance renewal due in 15 days. Tap to review your options.",
        priority: "medium",
        isRead: false
      }
    ];

    // Add AI insights
    insights.forEach((insight) => {
      const aiInsight: AiInsight = {
        ...insight,
        id: this.aiInsightId++,
        date: new Date()
      };
      
      this.aiInsights.set(aiInsight.id, aiInsight);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.phone === phone,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, isVerified: false, kycComplete: false };
    this.users.set(id, user);
    return user;
  }

  async verifyUser(id: number): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");
    
    user.isVerified = true;
    this.users.set(id, user);
    return user;
  }

  async completeKyc(id: number): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");
    
    user.kycComplete = true;
    this.users.set(id, user);
    return user;
  }

  // Bank Account methods
  async getBankAccounts(userId: number): Promise<BankAccount[]> {
    return Array.from(this.bankAccounts.values()).filter(
      (account) => account.userId === userId
    );
  }

  async getBankAccount(id: number): Promise<BankAccount | undefined> {
    return this.bankAccounts.get(id);
  }

  async getDefaultBankAccount(userId: number): Promise<BankAccount | undefined> {
    return Array.from(this.bankAccounts.values()).find(
      (account) => account.userId === userId && account.isDefault
    );
  }

  async createBankAccount(account: InsertBankAccount): Promise<BankAccount> {
    const id = this.bankAccountId++;
    const bankAccount: BankAccount = { ...account, id };
    
    // If this is the first account or is marked as default
    if (bankAccount.isDefault) {
      // Make sure other accounts for this user are not default
      for (const [existingId, existingAccount] of this.bankAccounts.entries()) {
        if (existingAccount.userId === bankAccount.userId && existingAccount.isDefault) {
          existingAccount.isDefault = false;
          this.bankAccounts.set(existingId, existingAccount);
        }
      }
    }
    
    this.bankAccounts.set(id, bankAccount);
    return bankAccount;
  }

  async updateBankAccountBalance(id: number, amount: number): Promise<BankAccount> {
    const account = await this.getBankAccount(id);
    if (!account) throw new Error("Bank account not found");
    
    account.balance += amount;
    this.bankAccounts.set(id, account);
    return account;
  }

  async setDefaultBankAccount(id: number, userId: number): Promise<BankAccount> {
    // First, unset default for all user accounts
    for (const [existingId, existingAccount] of this.bankAccounts.entries()) {
      if (existingAccount.userId === userId && existingAccount.isDefault) {
        existingAccount.isDefault = false;
        this.bankAccounts.set(existingId, existingAccount);
      }
    }
    
    // Then set the new default
    const account = await this.getBankAccount(id);
    if (!account) throw new Error("Bank account not found");
    
    account.isDefault = true;
    this.bankAccounts.set(id, account);
    return account;
  }

  // Transaction methods
  async getTransactions(userId: number, limit?: number): Promise<Transaction[]> {
    const userTransactions = Array.from(this.transactions.values())
      .filter((transaction) => transaction.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    
    return limit ? userTransactions.slice(0, limit) : userTransactions;
  }

  async getTransactionsByCategory(userId: number, category: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter((transaction) => transaction.userId === userId && transaction.category === category)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionId++;
    const newTransaction: Transaction = { 
      ...transaction, 
      id,
      date: new Date()
    };
    
    this.transactions.set(id, newTransaction);
    
    // Update bank account balance
    if (transaction.accountId) {
      const amount = transaction.type === "credit" ? transaction.amount : -transaction.amount;
      await this.updateBankAccountBalance(transaction.accountId, amount);
    }
    
    return newTransaction;
  }

  async getMonthlySpending(userId: number): Promise<{category: string, amount: number}[]> {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const userTransactions = Array.from(this.transactions.values())
      .filter((transaction) => 
        transaction.userId === userId && 
        transaction.type === "debit" &&
        transaction.date >= monthStart
      );
    
    const categorySpending = new Map<string, number>();
    
    for (const transaction of userTransactions) {
      const currentAmount = categorySpending.get(transaction.category) || 0;
      categorySpending.set(transaction.category, currentAmount + transaction.amount);
    }
    
    return Array.from(categorySpending.entries()).map(([category, amount]) => ({
      category,
      amount
    }));
  }

  // Investment methods
  async getInvestments(userId: number): Promise<Investment[]> {
    return Array.from(this.investments.values())
      .filter((investment) => investment.userId === userId);
  }

  async getInvestment(id: number): Promise<Investment | undefined> {
    return this.investments.get(id);
  }

  async createInvestment(investment: InsertInvestment): Promise<Investment> {
    const id = this.investmentId++;
    const newInvestment: Investment = { 
      ...investment, 
      id,
      lastUpdated: new Date()
    };
    
    this.investments.set(id, newInvestment);
    return newInvestment;
  }

  async updateInvestmentValue(id: number, currentValue: number): Promise<Investment> {
    const investment = await this.getInvestment(id);
    if (!investment) throw new Error("Investment not found");
    
    investment.currentValue = currentValue;
    investment.returns = currentValue - investment.investedAmount;
    investment.lastUpdated = new Date();
    
    this.investments.set(id, investment);
    return investment;
  }

  async getPortfolioSummary(userId: number): Promise<{
    totalValue: number,
    totalInvested: number,
    totalReturns: number,
    returnsPercentage: number
  }> {
    const userInvestments = await this.getInvestments(userId);
    
    const totalValue = userInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalInvested = userInvestments.reduce((sum, inv) => sum + inv.investedAmount, 0);
    const totalReturns = totalValue - totalInvested;
    const returnsPercentage = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;
    
    return {
      totalValue,
      totalInvested,
      totalReturns,
      returnsPercentage
    };
  }

  // Insurance methods
  async getInsurances(userId: number): Promise<Insurance[]> {
    return Array.from(this.insurances.values())
      .filter((insurance) => insurance.userId === userId);
  }

  async getInsurance(id: number): Promise<Insurance | undefined> {
    return this.insurances.get(id);
  }

  async createInsurance(insurance: InsertInsurance): Promise<Insurance> {
    const id = this.insuranceId++;
    const newInsurance: Insurance = { ...insurance, id };
    
    this.insurances.set(id, newInsurance);
    return newInsurance;
  }

  async getExpiringInsurances(userId: number, daysThreshold: number): Promise<Insurance[]> {
    const now = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(now.getDate() + daysThreshold);
    
    return Array.from(this.insurances.values())
      .filter((insurance) => 
        insurance.userId === userId && 
        insurance.status === "active" &&
        insurance.endDate <= thresholdDate
      );
  }

  // AI Insights methods
  async getAiInsights(userId: number, limit?: number): Promise<AiInsight[]> {
    const userInsights = Array.from(this.aiInsights.values())
      .filter((insight) => insight.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    
    return limit ? userInsights.slice(0, limit) : userInsights;
  }

  async createAiInsight(insight: InsertAiInsight): Promise<AiInsight> {
    const id = this.aiInsightId++;
    const newInsight: AiInsight = { 
      ...insight, 
      id,
      date: new Date()
    };
    
    this.aiInsights.set(id, newInsight);
    return newInsight;
  }

  async markInsightAsRead(id: number): Promise<AiInsight> {
    const insight = this.aiInsights.get(id);
    if (!insight) throw new Error("Insight not found");
    
    insight.isRead = true;
    this.aiInsights.set(id, insight);
    return insight;
  }
}

export const storage = new MemStorage();
