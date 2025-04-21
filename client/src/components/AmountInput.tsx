import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { useQuery } from "@tanstack/react-query";

interface AmountInputProps {
  onChange: (amount: number) => void;
  initialAmount?: number;
}

export default function AmountInput({
  onChange,
  initialAmount = 500,
}: AmountInputProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState(initialAmount.toString());

  const { data: bankAccounts } = useQuery({
    queryKey: [`/api/users/${user?.id}/bank-accounts`],
    enabled: !!user?.id,
  });

  // Calculate available balance from the default account
  const defaultAccount = bankAccounts?.find(
    (account: any) => account.isDefault
  ) || bankAccounts?.[0];
  const availableBalance = defaultAccount?.balance || 0;

  useEffect(() => {
    const numericAmount = parseFloat(amount) || 0;
    onChange(numericAmount);
  }, [amount, onChange]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (/^[0-9]*\.?[0-9]*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm mb-6">
      <CardContent className="p-0">
        <h3 className="text-sm font-medium mb-2 dark:text-gray-300">
          Enter Amount
        </h3>
        <div className="flex items-center mb-4">
          <span className="text-2xl font-bold mr-2 dark:text-white">₹</span>
          <Input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            className="text-3xl font-bold border-none p-0 bg-transparent focus:outline-none text-gray-900 dark:text-white"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Available Balance: ₹{availableBalance.toLocaleString("en-IN")}
        </p>
      </CardContent>
    </Card>
  );
}
