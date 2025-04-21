import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/auth/login";
import OtpVerification from "@/pages/auth/otp-verification";
import Home from "@/pages/home";
import Payments from "@/pages/payments";
import Finance from "@/pages/finance";
import Profile from "@/pages/profile";
import { useAuth } from "@/contexts/auth-context";
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

function Router() {
  return (
    <Switch>
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/otp-verification" component={OtpVerification} />
      <Route path="/" component={() => <ProtectedRoute component={Home} />} />
      <Route path="/payments" component={() => <ProtectedRoute component={Payments} />} />
      <Route path="/finance" component={() => <ProtectedRoute component={Finance} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
