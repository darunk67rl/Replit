import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import InvestmentSummary from "@/components/InvestmentSummary";
import AssetAllocation from "@/components/AssetAllocation";
import InvestmentList from "@/components/InvestmentList";
import { useToast } from "@/hooks/use-toast";

export default function Investments() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isInvestButtonLoading, setIsInvestButtonLoading] = useState(false);
  const [isAdviceButtonLoading, setIsAdviceButtonLoading] = useState(false);

  const handleInvestNow = () => {
    setIsInvestButtonLoading(true);
    setTimeout(() => {
      setIsInvestButtonLoading(false);
      toast({
        title: "Investment feature coming soon",
        description: "This feature will be available in a future update."
      });
    }, 1000);
  };

  const handleGetAdvice = () => {
    setIsAdviceButtonLoading(true);
    setTimeout(() => {
      setIsAdviceButtonLoading(false);
      setLocation("/advisor");
    }, 1000);
  };

  return (
    <div className="px-4 py-5">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="mr-3 text-gray-500 dark:text-gray-400"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold dark:text-white">Investments</h1>
      </div>

      <InvestmentSummary />
      <AssetAllocation />
      <InvestmentList />

      <Button
        className="w-full mb-4"
        onClick={handleInvestNow}
        disabled={isInvestButtonLoading}
      >
        {isInvestButtonLoading ? "Processing..." : "Invest Now"}
      </Button>

      <Button
        variant="outline"
        className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
        onClick={handleGetAdvice}
        disabled={isAdviceButtonLoading}
      >
        {isAdviceButtonLoading ? "Loading..." : "Get Investment Advice"}
      </Button>
    </div>
  );
}
