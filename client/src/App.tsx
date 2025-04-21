import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/auth/login-page";
import OtpVerification from "@/pages/auth/otp-verification";
import Home from "@/pages/home";
import { useAuth, AuthProvider } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";

function ProtectedRoute({ component: Component }: { component: React.FC }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [isCurrentRoute] = useRoute("/auth/login");

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isCurrentRoute) {
      setLocation("/auth/login");
    }
  }, [isAuthenticated, isLoading, isCurrentRoute, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return isAuthenticated ? <Component /> : null;
}

// Import all our pages
import Loans from "@/pages/loans";
import AiAdvisor from "@/pages/ai-advisor";
import Investments from "@/pages/investments";
import SendMoney from "@/pages/send-money";

function Router() {
  return (
    <Switch>
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/otp-verification" component={OtpVerification} />
      <Route path="/" component={Home} />
      <Route path="/investments" component={Investments} />
      <Route path="/payments" component={Home} />
      <Route path="/finance" component={Home} />
      <Route path="/profile" component={Home} />
      <Route path="/ai-advisor" component={AiAdvisor} />
      <Route path="/loans" component={Loans} />
      <Route path="/send-money" component={SendMoney} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
