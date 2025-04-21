import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "@/pages/Home";
import SendMoney from "@/pages/SendMoney";
import AiAdvisor from "@/pages/AiAdvisor";
import Investments from "@/pages/Investments";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const storedUser = localStorage.getItem("user");
  const isAuthenticated = !!storedUser;

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  return isAuthenticated ? <>{children}</> : null;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const showHeaderAndNav = location !== "/login";

  return (
    <>
      {showHeaderAndNav && <Header />}
      <main className="pt-16 pb-20">{children}</main>
      {showHeaderAndNav && <BottomNavigation />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <AppLayout>
              <Switch>
                <Route path="/login" component={Login} />
                <Route path="/">
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                </Route>
                <Route path="/send-money">
                  <ProtectedRoute>
                    <SendMoney />
                  </ProtectedRoute>
                </Route>
                <Route path="/advisor">
                  <ProtectedRoute>
                    <AiAdvisor />
                  </ProtectedRoute>
                </Route>
                <Route path="/investments">
                  <ProtectedRoute>
                    <Investments />
                  </ProtectedRoute>
                </Route>
                <Route component={NotFound} />
              </Switch>
            </AppLayout>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
