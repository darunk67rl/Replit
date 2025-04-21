import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";

// User interface from our schema
export interface User {
  id: number;
  username: string;
  name: string;
  phoneNumber: string;
  email?: string | null;
  balance: number | null;
  upiId: string | null;
  isKycVerified: boolean | null;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneNumber: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  requestOtp: (phoneNumber: string) => Promise<void>;
  verifyOtp: (phoneNumber: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Registration data
interface RegisterData {
  username: string;
  phoneNumber: string;
  password: string;
  name: string;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check if user is already authenticated
  const { 
    data: userData, 
    isLoading,
    error 
  } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Ensure we never have undefined as a value
  const user = userData || null;

  // Update authentication state when user data changes
  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { phoneNumber: string, password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/");
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const response = await apiRequest("POST", "/api/auth/register", userData);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/");
      toast({
        title: "Registration successful",
        description: "Your account has been created!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Request OTP mutation
  const requestOtpMutation = useMutation({
    mutationFn: async (phoneNumber: string) => {
      const response = await apiRequest("POST", "/api/auth/request-otp", { phoneNumber });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to send OTP");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
      });
      setLocation("/auth/otp-verification");
    },
    onError: (error: Error) => {
      toast({
        title: "OTP Request Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Verify OTP mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async ({ phoneNumber, otp }: { phoneNumber: string, otp: string }) => {
      const response = await apiRequest("POST", "/api/auth/verify-otp", { phoneNumber, otp });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "OTP verification failed");
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/");
      toast({
        title: "Verification Successful",
        description: "You have been logged in successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Logout failed");
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.setQueryData(["/api/auth/me"], null);
      setLocation("/auth/login");
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // API functions
  const login = async (phoneNumber: string, password: string) => {
    await loginMutation.mutateAsync({ phoneNumber, password });
  };

  const register = async (userData: RegisterData) => {
    await registerMutation.mutateAsync(userData);
  };

  const requestOtp = async (phoneNumber: string) => {
    await requestOtpMutation.mutateAsync(phoneNumber);
  };

  const verifyOtp = async (phoneNumber: string, otp: string) => {
    await verifyOtpMutation.mutateAsync({ phoneNumber, otp });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading: isLoading || loginMutation.isPending || registerMutation.isPending || requestOtpMutation.isPending || verifyOtpMutation.isPending || logoutMutation.isPending,
        login,
        register,
        requestOtp,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
