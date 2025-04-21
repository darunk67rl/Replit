import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ShoppingBag, User, Coffee } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Transaction {
  id: number;
  amount: number;
  type: string;
  category: string;
  description: string;
  recipient: string;
  sender: string;
  date: string;
  status: string;
  paymentMethod: string;
}

export default function RecentTransactions() {
  const { user } = useAuth();

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: [`/api/users/${user?.id}/transactions?limit=3`],
    enabled: !!user?.id,
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "shopping":
        return <ShoppingBag className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
      case "food":
        return <Coffee className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
      case "transfer":
        return <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
      default:
        return <ShoppingBag className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-slate-900 rounded-xl shadow-sm mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
            <Skeleton className="h-4 w-16" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-16 mb-1 ml-auto" />
                  <Skeleton className="h-3 w-12 ml-auto" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-900 rounded-xl shadow-sm mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
          <Link href="/transactions" className="text-sm text-primary dark:text-primary font-medium">
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {transactions?.map((transaction) => (
          <div
            key={transaction.id}
            className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-0 flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                {getCategoryIcon(transaction.category)}
              </div>
              <div>
                <h3 className="text-sm font-medium dark:text-gray-200">
                  {transaction.description}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(transaction.date)} · {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-medium ${
                  transaction.type === "credit"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {transaction.paymentMethod.toUpperCase()}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
