import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import BalanceCard from "@/components/BalanceCard";
import QuickAccess from "@/components/QuickAccess";
import RecentTransactions from "@/components/RecentTransactions";
import { Loader2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Fetch transactions with react-query
  const { 
    data: transactions,
    isLoading: transactionsLoading,
  } = useQuery({
    queryKey: ["/api/transactions/recent"],
    enabled: !!user,
  });

  // Fetch AI insights
  const { 
    data: insights,
    isLoading: insightsLoading
  } = useQuery({
    queryKey: ["/api/ai/insights"],
    enabled: !!user,
  });

  const isLoading = authLoading || transactionsLoading || insightsLoading;

  // Show greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Check KYC status and show appropriate message
  const showKycBanner = user && !user.isKycVerified;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-1 container max-w-md mx-auto px-4 pb-20 pt-4">
        {/* Welcome section */}
        <section className="mb-6">
          {authLoading ? (
            <Skeleton className="h-8 w-3/4 mb-2" />
          ) : (
            <h1 className="text-2xl font-bold">
              {getGreeting()}, {user?.name?.split(" ")[0] || "User"}!
            </h1>
          )}
          <p className="text-muted-foreground">Welcome to your financial hub</p>
        </section>

        {/* KYC banner if needed */}
        {showKycBanner && (
          <Card className="mb-6 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">Complete your KYC verification</p>
                <p className="text-sm text-muted-foreground">Unlock all features and higher limits</p>
              </div>
              <Button size="sm" variant="outline" className="shrink-0">
                Verify Now
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Balance card */}
        <section className="mb-6">
          <BalanceCard />
        </section>

        {/* Quick access */}
        <section className="mb-6">
          <h2 className="font-semibold mb-3">Quick Actions</h2>
          <QuickAccess />
        </section>

        {/* Recent transactions */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Recent Transactions</h2>
            <Link href="/transactions">
              <Button variant="link" className="p-0 h-auto">
                See All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <RecentTransactions />
          )}
        </section>

        {/* AI insights preview */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Financial Insights</h2>
            <Link href="/ai-advisor">
              <Button variant="link" className="p-0 h-auto">
                See All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {insightsLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">AI-Powered Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {insights?.analysis || "Get personalized financial insights powered by AI."}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "AI Advisor",
                      description: "Opening your personalized financial advisor",
                    });
                  }}
                >
                  Ask AI Advisor
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
}