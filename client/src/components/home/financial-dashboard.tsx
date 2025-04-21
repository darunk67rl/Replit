import { ArrowUpIcon, TrendingUp, Shield, Gauge, Flag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function FinancialDashboard() {
  return (
    <div className="mb-5">
      <h3 className="text-md font-semibold mb-3">Financial Overview</h3>
      <div className="grid grid-cols-2 gap-3">
        {/* Investments Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <TrendingUp className="h-5 w-5 text-primary mr-1" />
            <h4 className="text-sm font-medium">Investments</h4>
          </div>
          <p className="text-lg font-semibold mb-1">{formatCurrency(34800)}</p>
          <div className="flex items-center">
            <ArrowUpIcon className="h-4 w-4 text-secondary" />
            <span className="text-xs text-secondary">+4.2%</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">
              this month
            </span>
          </div>
        </div>

        {/* Insurance Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <Shield className="h-5 w-5 text-primary mr-1" />
            <h4 className="text-sm font-medium">Insurance</h4>
          </div>
          <p className="text-sm mb-1">2 Active Policies</p>
          <div className="flex items-center">
            <span className="text-xs text-warning">
              1 renewal in 14 days
            </span>
          </div>
        </div>

        {/* Credit Score Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <Gauge className="h-5 w-5 text-primary mr-1" />
            <h4 className="text-sm font-medium">Credit Score</h4>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">756</p>
            <div className="text-xs py-1 px-2 bg-secondary/10 text-secondary rounded-full">
              Good
            </div>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5 mt-2">
            <div
              className="bg-secondary h-1.5 rounded-full"
              style={{ width: "75%" }}
            ></div>
          </div>
        </div>

        {/* Goals Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <Flag className="h-5 w-5 text-primary mr-1" />
            <h4 className="text-sm font-medium">Savings Goals</h4>
          </div>
          <p className="text-sm mb-1">Emergency Fund</p>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mb-1">
            <div
              className="bg-accent h-2 rounded-full"
              style={{ width: "65%" }}
            ></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {formatCurrency(65000)} / {formatCurrency(100000)}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              65%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
