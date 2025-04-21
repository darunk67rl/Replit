import { 
  User, 
  Transaction, 
  UpiContact, 
  Investment, 
  InsurancePolicy, 
  FinancialGoal,
  ChatMessage,
  UserProfile,
  users,
  transactions,
  upiContacts,
  investments,
  insurancePolicies,
  financialGoals,
  chatMessages,
  InsertUser,
  InsertTransaction,
  InsertUpiContact,
  InsertInvestment,
  InsertInsurancePolicy,
  InsertFinancialGoal,
  InsertChatMessage 
} from "@shared/schema";
import { generateUniqueId } from "../client/src/lib/utils";
import { db } from "./db";
import { eq, desc, and, gte } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

// Interface for storage operations
export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByPhoneNumber(phoneNumber: string): Promise<User | undefined>;
  createUser(user: Omit<User, "id">): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUserProfile(): Promise<UserProfile>;

  // Transaction management
  getRecentTransactions(limit?: number): Promise<Transaction[]>;
  getTransactions(options: { timeframe?: string, category?: string }): Promise<Transaction[]>;
  createTransaction(transaction: Omit<Transaction, "id">): Promise<Transaction>;

  // UPI contacts
  getUpiContacts(): Promise<UpiContact[]>;
  getUpiContactById(id: string): Promise<UpiContact | undefined>;
  
  // Investments
  getInvestments(): Promise<Investment[]>;
  
  // Insurance
  getInsurancePolicies(): Promise<InsurancePolicy[]>;
  
  // Financial Goals
  getFinancialGoals(): Promise<FinancialGoal[]>;
  
  // AI Chat History
  getChatHistory(): Promise<ChatMessage[]>;
  saveChatMessage(message: Omit<ChatMessage, "id">): Promise<ChatMessage>;
  
  // Session store
  sessionStore: any;
}

// In-memory implementation
export class MemStorage implements IStorage {
  private users: User[] = [];
  private transactions: Transaction[] = [];
  private upiContacts: UpiContact[] = [];
  private investments: Investment[] = [];
  private insurancePolicies: InsurancePolicy[] = [];
  private financialGoals: FinancialGoal[] = [];
  private chatMessages: ChatMessage[] = [];
  private nextId = 1;
  
  public sessionStore: session.SessionStore;

  constructor() {
    this.initializeData();
    const MemoryStore = require('memorystore')(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  private initializeData() {
    // Sample user
    this.users.push({
      id: this.nextId++,
      username: "rahul_kumar",
      name: "Rahul Kumar",
      phoneNumber: "+91 98765 43210",
      email: "rahul.k@example.com",
      balance: 24500,
      upiId: "rahul@okaxis",
      isKycVerified: true,
    });

    // Sample transactions
    const sampleTransactions: Omit<Transaction, "id">[] = [
      {
        merchant: "Amazon Shopping",
        date: new Date("2023-10-12T16:30:00"),
        amount: -2450,
        type: "UPI",
        category: "Shopping",
        description: "Electronics purchase"
      },
      {
        merchant: "Anil Sharma",
        date: new Date("2023-10-10T12:15:00"),
        amount: 1200,
        type: "UPI",
        category: "Transfer",
        description: "Payment received"
      },
      {
        merchant: "Swiggy Food",
        date: new Date("2023-10-09T20:45:00"),
        amount: -450,
        type: "UPI",
        category: "Food",
        description: "Dinner order"
      },
      {
        merchant: "HDFC Credit Card",
        date: new Date("2023-10-05T10:30:00"),
        amount: -5000,
        type: "Bank Transfer",
        category: "Bills",
        description: "Credit card payment"
      },
      {
        merchant: "Reliance Jio",
        date: new Date("2023-10-03T14:20:00"),
        amount: -599,
        type: "Auto Pay",
        category: "Bills",
        description: "Mobile recharge"
      },
      {
        merchant: "Movie Tickets",
        date: new Date("2023-09-28T18:45:00"),
        amount: -800,
        type: "UPI",
        category: "Entertainment",
        description: "Weekend movie"
      }
    ];

    sampleTransactions.forEach(tx => {
      this.transactions.push({
        ...tx,
        id: this.nextId++
      });
    });

    // Sample UPI contacts
    const sampleContacts: Omit<UpiContact, "id">[] = [
      {
        name: "Amit Kumar",
        upiId: "amit@okbank",
        phoneNumber: "+91 98765 12345",
        isFrequent: true
      },
      {
        name: "Sneha Patel",
        upiId: "sneha@yesbank",
        phoneNumber: "+91 91265 78901",
        isFrequent: true
      },
      {
        name: "Raj Gupta",
        upiId: "raj@okaxis",
        phoneNumber: "+91 88765 45678",
        isFrequent: true
      },
      {
        name: "Priya Singh",
        upiId: "priya@sbi",
        phoneNumber: "+91 77865 23456",
        isFrequent: true
      }
    ];

    sampleContacts.forEach(contact => {
      this.upiContacts.push({
        ...contact,
        id: this.nextId++
      });
    });

    // Sample investments
    const sampleInvestments: Omit<Investment, "id">[] = [
      {
        name: "HDFC Mid Cap Opportunities",
        type: "mutual_fund",
        value: 15650,
        changePercentage: 12.4,
        investedAmount: 12000,
        investmentDate: new Date("2022-06-15")
      },
      {
        name: "Reliance Industries",
        type: "stock",
        value: 8920,
        changePercentage: 5.2,
        investedAmount: 8500,
        investmentDate: new Date("2023-01-10")
      },
      {
        name: "Digital Gold",
        type: "gold",
        value: 5200,
        changePercentage: -1.8,
        investedAmount: 5300,
        investmentDate: new Date("2023-03-22")
      },
      {
        name: "ICICI Bank FD",
        type: "fd",
        value: 5030,
        changePercentage: 3.2,
        investedAmount: 5000,
        investmentDate: new Date("2023-02-05")
      }
    ];

    sampleInvestments.forEach(investment => {
      this.investments.push({
        ...investment,
        id: this.nextId++
      });
    });

    // Sample insurance policies
    const sampleInsurances: Omit<InsurancePolicy, "id">[] = [
      {
        name: "Family Floater",
        type: "health",
        premium: 15000,
        coverage: 500000,
        expiryDate: new Date(new Date().setDate(new Date().getDate() + 43)), // 43 days from now
        policyNumber: "HLT123456789",
        provider: "HDFC ERGO"
      },
      {
        name: "Comprehensive Car Insurance",
        type: "vehicle",
        premium: 8000,
        coverage: 150000,
        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 6)), // 6 months from now
        policyNumber: "CAR987654321",
        provider: "ICICI Lombard"
      }
    ];

    sampleInsurances.forEach(insurance => {
      this.insurancePolicies.push({
        ...insurance,
        id: this.nextId++
      });
    });

    // Sample financial goals
    const sampleGoals: Omit<FinancialGoal, "id">[] = [
      {
        name: "Emergency Fund",
        targetAmount: 100000,
        currentAmount: 65000,
        targetDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        type: "emergency"
      },
      {
        name: "New Car",
        targetAmount: 800000,
        currentAmount: 250000,
        targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
        type: "car"
      }
    ];

    sampleGoals.forEach(goal => {
      this.financialGoals.push({
        ...goal,
        id: this.nextId++
      });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    return this.users.find(user => user.phoneNumber === phoneNumber);
  }

  async createUser(userData: Omit<User, "id">): Promise<User> {
    const user: User = {
      ...userData,
      id: this.nextId++
    };
    this.users.push(user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }

  async getUserProfile(): Promise<UserProfile> {
    // Return a profile based on the first user for demo
    const user = this.users[0];
    return {
      userId: user.id,
      name: user.name,
      age: 32, // Mocked age
      income: 85000, // Mocked monthly income
      riskProfile: "moderate",
      goals: this.financialGoals.map(goal => ({
        type: goal.type,
        targetAmount: goal.targetAmount,
        timeframe: Math.ceil((goal.targetDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24 * 30)) // months
      }))
    };
  }

  // Transaction methods
  async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    return [...this.transactions]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  }

  async getTransactions(options: { timeframe?: string, category?: string } = {}): Promise<Transaction[]> {
    let filteredTransactions = [...this.transactions];
    
    if (options.timeframe) {
      const now = new Date();
      let startDate: Date;
      
      switch (options.timeframe) {
        case 'week':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        case 'year':
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      }
      
      filteredTransactions = filteredTransactions.filter(tx => tx.date >= startDate);
    }
    
    if (options.category) {
      filteredTransactions = filteredTransactions.filter(tx => 
        tx.category.toLowerCase() === options.category?.toLowerCase()
      );
    }
    
    return filteredTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async createTransaction(transactionData: Omit<Transaction, "id">): Promise<Transaction> {
    const transaction: Transaction = {
      ...transactionData,
      id: this.nextId++
    };
    this.transactions.push(transaction);
    return transaction;
  }

  // UPI contacts methods
  async getUpiContacts(): Promise<UpiContact[]> {
    return [...this.upiContacts];
  }

  async getUpiContactById(id: string): Promise<UpiContact | undefined> {
    return this.upiContacts.find(contact => contact.id.toString() === id);
  }

  // Investment methods
  async getInvestments(): Promise<Investment[]> {
    return [...this.investments];
  }

  // Insurance methods
  async getInsurancePolicies(): Promise<InsurancePolicy[]> {
    return [...this.insurancePolicies];
  }

  // Financial goals methods
  async getFinancialGoals(): Promise<FinancialGoal[]> {
    return [...this.financialGoals];
  }

  // Chat history methods
  async getChatHistory(): Promise<ChatMessage[]> {
    return [...this.chatMessages].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  async saveChatMessage(messageData: Omit<ChatMessage, "id">): Promise<ChatMessage> {
    const message: ChatMessage = {
      ...messageData,
      id: generateUniqueId()
    };
    this.chatMessages.push(message);
    return message;
  }
}

// Database implementation with Drizzle
export class DatabaseStorage implements IStorage {
  public sessionStore: any;

  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
      tableName: 'session'
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phoneNumber, phoneNumber));
    return user;
  }

  async createUser(userData: Omit<User, "id">): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUserProfile(): Promise<UserProfile> {
    // For simplicity, return a profile for the first user
    const [user] = await db.select().from(users).limit(1);
    const goals = await db.select().from(financialGoals).where(eq(financialGoals.userId, user.id));
    
    return {
      userId: user.id,
      name: user.name,
      age: 32, // Default age
      income: 85000, // Default income
      riskProfile: "moderate",
      goals: goals.map(goal => ({
        type: goal.type,
        targetAmount: goal.targetAmount,
        timeframe: Math.ceil(
          (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24 * 30)
        )
      }))
    };
  }

  // Transaction methods
  async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    return await db.select()
      .from(transactions)
      .orderBy(desc(transactions.date))
      .limit(limit);
  }

  async getTransactions(options: { timeframe?: string, category?: string } = {}): Promise<Transaction[]> {
    let query = db.select().from(transactions);
    
    if (options.timeframe) {
      const now = new Date();
      let startDate: Date;
      
      switch (options.timeframe) {
        case 'week':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        case 'year':
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      }
      
      query = query.where(gte(transactions.date, startDate));
    }
    
    if (options.category) {
      query = query.where(eq(transactions.category, options.category));
    }
    
    return await query.orderBy(desc(transactions.date));
  }

  async createTransaction(transactionData: Omit<Transaction, "id">): Promise<Transaction> {
    const [transaction] = await db.insert(transactions).values(transactionData).returning();
    return transaction;
  }

  // UPI Contacts methods
  async getUpiContacts(): Promise<UpiContact[]> {
    return await db.select().from(upiContacts);
  }

  async getUpiContactById(id: string): Promise<UpiContact | undefined> {
    const contactId = parseInt(id);
    if (isNaN(contactId)) return undefined;
    
    const [contact] = await db.select().from(upiContacts).where(eq(upiContacts.id, contactId));
    return contact;
  }

  // Investment methods
  async getInvestments(): Promise<Investment[]> {
    return await db.select().from(investments);
  }

  // Insurance methods
  async getInsurancePolicies(): Promise<InsurancePolicy[]> {
    return await db.select().from(insurancePolicies);
  }

  // Financial Goals methods
  async getFinancialGoals(): Promise<FinancialGoal[]> {
    return await db.select().from(financialGoals);
  }

  // Chat messages methods
  async getChatHistory(): Promise<ChatMessage[]> {
    return await db.select()
      .from(chatMessages)
      .orderBy(chatMessages.timestamp);
  }

  async saveChatMessage(message: Omit<ChatMessage, "id">): Promise<ChatMessage> {
    const chatMessage = {
      ...message,
      id: generateUniqueId()
    };
    
    const [savedMessage] = await db.insert(chatMessages)
      .values(chatMessage)
      .returning();
      
    return savedMessage;
  }
}

// Export a singleton instance
export const storage = process.env.DATABASE_URL 
  ? new DatabaseStorage() 
  : new MemStorage();
