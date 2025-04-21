import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { NotificationProvider } from "@/contexts/notification-context";
import SendMoney from "@/pages/send-money";
import SimpleHome from "@/pages/simple-home";
import AiAdvisorSimple from "@/pages/ai-advisor-simple";
import LoansSimple from "@/pages/loans-simple";
import InvestmentsSimple from "@/pages/investments-simple";
import InsuranceSimple from "@/pages/insurance-simple";
import PayBillsSimple from "@/pages/pay-bills-simple";
import CardsSimple from "@/pages/cards-simple";
import BusinessSimple from "@/pages/business-simple";
import RewardsSimple from "@/pages/rewards-simple";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SimpleHome} />
      <Route path="/ai-advisor" component={AiAdvisorSimple} />
      <Route path="/send-money" component={SendMoney} />
      <Route path="/loans" component={LoansSimple} />
      <Route path="/investments" component={InvestmentsSimple} />
      <Route path="/insurance" component={InsuranceSimple} />
      <Route path="/pay-bills" component={PayBillsSimple} />
      <Route path="/cards" component={CardsSimple} />
      <Route path="/business" component={BusinessSimple} />
      <Route path="/rewards" component={RewardsSimple} />
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
