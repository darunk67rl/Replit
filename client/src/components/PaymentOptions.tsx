import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Building, CreditCard, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PaymentOption {
  id: number;
  name: string;
  accountNumber?: string;
  balance?: number;
  type: "bank" | "wallet";
  icon: JSX.Element;
  color: string;
}

interface PaymentOptionsProps {
  onSelect: (option: PaymentOption) => void;
}

export default function PaymentOptions({ onSelect }: PaymentOptionsProps) {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const { data: bankAccounts, isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/bank-accounts`],
    enabled: !!user?.id,
  });

  // Convert bank accounts to payment options
  const getBankIcon = (bankName: string) => {
    // These colors should be consistent with your design system
    const bankColors: Record<string, { bg: string; icon: string }> = {
      HDFC: { bg: "bg-blue-100 dark:bg-blue-900", icon: "text-blue-600 dark:text-blue-400" },
      SBI: { bg: "bg-purple-100 dark:bg-purple-900", icon: "text-purple-600 dark:text-purple-400" },
      default: { bg: "bg-gray-100 dark:bg-gray-800", icon: "text-gray-600 dark:text-gray-400" },
    };

    for (const [key, value] of Object.entries(bankColors)) {
      if (bankName.includes(key)) {
        return {
          icon: <CreditCard className="h-5 w-5" />,
          color: value,
        };
      }
    }

    return {
      icon: <Building className="h-5 w-5" />,
      color: bankColors.default,
    };
  };

  // Prepare payment options from the bank accounts data
  const paymentOptions: PaymentOption[] = bankAccounts
    ? [
        ...bankAccounts.map((account: any) => {
          const { icon, color } = getBankIcon(account.bankName);
          return {
            id: account.id,
            name: account.bankName,
            accountNumber: account.accountNumber,
            type: "bank",
            icon,
            color: color.bg,
            iconColor: color.icon,
          };
        }),
        {
          id: 999, // Special ID for wallet
          name: "FinOne Wallet",
          balance: 4280, // Mock balance for the wallet
          type: "wallet",
          icon: <Wallet className="h-5 w-5" />,
          color: "bg-green-100 dark:bg-green-900",
          iconColor: "text-green-600 dark:text-green-400",
        },
      ]
    : [];

  const handleSelect = (id: string) => {
    setSelectedOption(id);
    const selected = paymentOptions.find(
      (option) => option.id === parseInt(id)
    );
    if (selected) {
      onSelect(selected);
    }
  };

  useEffect(() => {
    // Set the first option as selected by default when data is loaded
    if (paymentOptions.length > 0 && !selectedOption) {
      const firstOption = paymentOptions[0];
      setSelectedOption(firstOption.id.toString());
      onSelect(firstOption);
    }
  }, [paymentOptions, selectedOption, onSelect]);

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm mb-6">
        <CardContent className="p-0">
          <h3 className="text-sm font-medium mb-3 dark:text-gray-300">Pay From</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm mb-6">
      <CardContent className="p-0">
        <h3 className="text-sm font-medium mb-3 dark:text-gray-300">Pay From</h3>
        <RadioGroup value={selectedOption || ""} onValueChange={handleSelect}>
          <div className="space-y-3">
            {paymentOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded ${option.color} flex items-center justify-center mr-3`}
                  >
                    <div className={option.iconColor}>{option.icon}</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium dark:text-gray-200">
                      {option.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {option.type === "bank"
                        ? option.accountNumber
                        : `Balance: ₹${option.balance?.toLocaleString("en-IN")}`}
                    </p>
                  </div>
                </div>
                <RadioGroupItem
                  value={option.id.toString()}
                  id={`option-${option.id}`}
                  className="h-4 w-4"
                />
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
