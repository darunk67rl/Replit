import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import RecipientSearch from "@/components/RecipientSearch";
import AmountInput from "@/components/AmountInput";
import PaymentOptions from "@/components/PaymentOptions";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";

interface Recipient {
  id: string;
  name: string;
  avatar?: string;
  upiId?: string;
  phone?: string;
}

interface PaymentOption {
  id: number;
  name: string;
  accountNumber?: string;
  balance?: number;
  type: "bank" | "wallet";
}

export default function SendMoney() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(500);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<PaymentOption | null>(null);
  const [loading, setLoading] = useState(false);

  const sendMoneyMutation = useMutation({
    mutationFn: async () => {
      if (!user || !selectedRecipient || !selectedPaymentOption) {
        throw new Error("Missing required information");
      }

      // Create transaction
      return await apiRequest("POST", "/api/transactions", {
        userId: user.id,
        amount: paymentAmount,
        type: "debit",
        category: "transfer",
        description: `Payment to ${selectedRecipient.name}`,
        recipient: selectedRecipient.name,
        sender: user.name,
        accountId: selectedPaymentOption.id,
        status: "completed",
        paymentMethod: "upi"
      });
    },
    onSuccess: () => {
      toast({
        title: "Payment Successful",
        description: `₹${paymentAmount} sent to ${selectedRecipient?.name}`,
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
      setLoading(false);
    },
  });

  const handleRecipientSelect = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
  };

  const handleAmountChange = (amount: number) => {
    setPaymentAmount(amount);
  };

  const handlePaymentOptionSelect = (option: PaymentOption) => {
    setSelectedPaymentOption(option);
  };

  const handlePayNow = () => {
    if (!selectedRecipient) {
      toast({
        title: "Select Recipient",
        description: "Please select a recipient to send money to",
        variant: "destructive",
      });
      return;
    }

    if (!paymentAmount || paymentAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPaymentOption) {
      toast({
        title: "Select Payment Method",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    sendMoneyMutation.mutate();
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
        <h1 className="text-xl font-bold dark:text-white">Send Money</h1>
      </div>

      <RecipientSearch onSelect={handleRecipientSelect} />
      <AmountInput onChange={handleAmountChange} initialAmount={500} />
      <PaymentOptions onSelect={handlePaymentOptionSelect} />

      <Button
        className="w-full"
        onClick={handlePayNow}
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </Button>
    </div>
  );
}
