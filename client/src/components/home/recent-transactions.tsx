import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, User, Utensils } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export function RecentTransactions() {
  const { toast } = useToast();

  // Fetch recent transactions
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["/api/transactions/recent"],
    retry: false,
  });

  const viewAllTransactions = () => {
    toast({
      title: "Coming soon",
      description: "View all transactions feature will be available in the full version.",
    });
  };

  // Sample transactions data
  const sampleTransactions = [
    {
      id: "1",
      merchant: "Amazon Shopping",
      icon: <ShoppingBag className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />,
      date: new Date("2023-10-12T16:30:00"),
      amount: -2450,
      type: "UPI",
    },
    {
      id: "2",
      merchant: "Anil Sharma",
      icon: <User className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />,
      date: new Date("2023-10-10T12:15:00"),
      amount: 1200,
      type: "UPI",
    },
    {
      id: "3",
      merchant: "Swiggy Food",
      icon: <Utensils className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />,
      date: new Date("2023-10-09T20:45:00"),
      amount: -450,
      type: "UPI",
    },
  ];

  if (isLoading) {
    return (
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-md font-semibold">Recent Transactions</h3>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
          <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Use actual transactions if available, otherwise use sample data
  const displayTransactions = transactions || sampleTransactions;

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-semibold">Recent Transactions</h3>
        <Button
          onClick={viewAllTransactions}
          variant="link"
          className="text-primary dark:text-primary text-sm font-medium p-0"
        >
          View All
        </Button>
      </div>
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm divide-y divide-neutral-200 dark:divide-neutral-700">
        {displayTransactions.map((transaction) => (
          <div key={transaction.id} className="p-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center mr-3">
                {transaction.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{transaction.merchant}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {formatDate(transaction.date)} • {new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${transaction.amount < 0 ? 'text-error' : 'text-secondary'}`}>
                {transaction.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {transaction.type}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
