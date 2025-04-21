import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { NotificationProvider } from "@/contexts/notification-context";
import SendMoney from "@/pages/send-money";
import SimpleHome from "@/pages/simple-home";
import AiAdvisorSimple from "@/pages/ai-advisor-simple";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SimpleHome} />
      <Route path="/ai-advisor" component={AiAdvisorSimple} />
      <Route path="/send-money" component={SendMoney} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <NotificationProvider>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </NotificationProvider>
  );
}

export default App;
