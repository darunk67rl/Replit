import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import AiAdvisorChat from "@/components/AiAdvisorChat";

export default function AiAdvisor() {
  const [, setLocation] = useLocation();

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
        <h1 className="text-xl font-bold dark:text-white">AI Financial Advisor</h1>
      </div>

      <AiAdvisorChat />

      <div className="mt-6 space-y-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl">
          <h3 className="text-sm font-medium mb-2 dark:text-gray-200">How can the AI advisor help?</h3>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-2 list-disc pl-4">
            <li>Analyze your spending patterns and provide personalized insights</li>
            <li>Suggest saving goals based on your income and expenses</li>
            <li>Provide investment recommendations based on your risk profile</li>
            <li>Help with planning for major financial goals</li>
            <li>Answer questions about banking, loans, and insurance products</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
