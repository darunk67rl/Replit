import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Payee {
  id: string;
  name: string;
  initials: string;
  upiId: string;
}

export function RecentPayees() {
  const { toast } = useToast();

  // Sample recent payees
  const recentPayees: Payee[] = [
    { id: "1", name: "Amit Kumar", initials: "AK", upiId: "amit@okbank" },
    { id: "2", name: "Swiggy", initials: "SP", upiId: "swiggy@razorpay" },
    { id: "3", name: "Metro Transport", initials: "MT", upiId: "metro@paytm" },
  ];

  const handlePayAgain = (payeeId: string) => {
    const payee = recentPayees.find((p) => p.id === payeeId);
    if (payee) {
      toast({
        title: "Payment Initiated",
        description: `Payment to ${payee.name} (${payee.upiId}) will be implemented in the full version.`,
      });
    }
  };

  return (
    <div className="mb-5">
      <h3 className="text-md font-semibold mb-3">Payment History</h3>
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm divide-y divide-neutral-200 dark:divide-neutral-700">
        {recentPayees.map((payee) => (
          <div key={payee.id} className="p-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center mr-3">
                <span className="text-sm font-medium">{payee.initials}</span>
              </div>
              <div>
                <p className="text-sm font-medium">{payee.name}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {payee.upiId}
                </p>
              </div>
            </div>
            <Button
              onClick={() => handlePayAgain(payee.id)}
              size="sm"
              className="bg-primary text-white text-xs px-3 py-1.5 rounded-lg font-medium"
            >
              Pay Again
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
