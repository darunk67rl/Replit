import { StatusBar } from "@/components/layout/status-bar";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { PaymentOptions } from "@/components/payments/payment-options";
import { RecentPayees } from "@/components/payments/recent-payees";
import { PaymentQRCode } from "@/components/payments/qr-code";

export default function Payments() {
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <StatusBar />
      <main className="pt-14 pb-20 h-screen overflow-y-auto no-scrollbar">
        <div className="px-4 py-3">
          <PaymentOptions />
          <RecentPayees />
          <PaymentQRCode />
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
