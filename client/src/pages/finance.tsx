import { StatusBar } from "@/components/layout/status-bar";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { FinanceModules } from "@/components/finance/finance-modules";
import { InvestmentRecommendations } from "@/components/finance/investment-recommendations";
import { InsuranceDashboard } from "@/components/finance/insurance-dashboard";

export default function Finance() {
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <StatusBar />
      <main className="pt-14 pb-20 h-screen overflow-y-auto no-scrollbar">
        <div className="px-4 py-3">
          <FinanceModules />
          <InvestmentRecommendations />
          <InsuranceDashboard />
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
