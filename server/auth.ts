import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User, InsertUser } from "@shared/schema";

declare global {
  namespace Express {
    // Use the User type from our schema
    interface User {
      id: number;
      username: string;
      name: string;
      phoneNumber: string;
      email?: string | null;
      password?: string | null;
      balance?: number | null;
      upiId?: string | null;
      isKycVerified?: boolean | null;
    }
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "moneyflow-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport to use local strategy
  passport.use(
    new LocalStrategy(
      { usernameField: "phoneNumber" },
      async (phoneNumber, password, done) => {
        try {
          const user = await storage.getUserByPhoneNumber(phoneNumber);
          if (!user) {
            return done(null, false, { message: "User not found" });
          }

          if (!user.password) {
            return done(null, false, { message: "Password not set" });
          }

          const isValid = await comparePasswords(password, user.password);
          if (!isValid) {
            return done(null, false, { message: "Invalid password" });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Session serialization
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || undefined);
    } catch (err) {
      done(err, undefined);
    }
  });

  // Authentication routes
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const { username, phoneNumber, password, name } = req.body;

      if (!username || !phoneNumber || !password || !name) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByPhoneNumber(phoneNumber);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        username,
        phoneNumber,
        password: hashedPassword,
        name,
        email: null,
        balance: 10000, // Default balance for new users
        upiId: `${username}@moneyflow`,
        isKycVerified: false,
      });

      // Log the user in
      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(201).json({ user: { ...user, password: undefined } });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        return res.json({ user: { ...user, password: undefined } });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = req.user as User;
    res.json({ ...user, password: undefined });
  });

  // Allow login with OTP for users without password
  app.post("/api/auth/request-otp", async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      
      if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
      }

      // In a real app, we'd generate and send an OTP
      // For now, let's just acknowledge the request
      
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      console.error("OTP request error:", error);
      res.status(500).json({ message: "Failed to send OTP" });
    }
  });

  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { phoneNumber, otp } = req.body;
      
      if (!phoneNumber || !otp) {
        return res.status(400).json({ message: "Phone number and OTP are required" });
      }

      // In a real app, we'd verify the OTP
      // For this demo, we'll accept any 6-digit OTP
      if (otp.length !== 6 || !/^\d+$/.test(otp)) {
        return res.status(400).json({ message: "Invalid OTP format" });
      }

      // Check if user exists, create if not
      let user = await storage.getUserByPhoneNumber(phoneNumber);
      if (!user) {
        user = await storage.createUser({
          username: `user${phoneNumber.slice(-4)}`,
          phoneNumber,
          name: `User ${phoneNumber.slice(-4)}`,
          email: null,
          password: null, // OTP users don't have a password initially
          balance: 10000,
          upiId: `user${phoneNumber.slice(-4)}@moneyflow`,
          isKycVerified: false,
        });
      }

      // Log the user in
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed" });
        }
        return res.status(200).json({ user: { ...user, password: undefined } });
      });
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(500).json({ message: "Failed to verify OTP" });
    }
  });
}