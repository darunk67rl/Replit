import { ArrowLeft, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();
  const showBackButton = location !== "/" && location !== "/home";

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 z-50 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          {showBackButton ? (
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          ) : null}
          <h1 className="text-lg font-bold text-primary">MoneyFlow</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400">
            <Sun className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
