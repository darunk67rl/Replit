import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ArrowRight, 
  CreditCard, 
  LineChart, 
  Landmark, 
  Zap, 
  Shield, 
  BriefcaseBusiness,
  Receipt,
  Lightbulb
} from "lucide-react";

export default function SimpleHome() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-primary">MoneyFlow</h1>
          <Link href="/auth/login">
            <Button size="sm">Login / Register</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container max-w-md mx-auto px-4 pb-20 pt-16">
        {/* Hero section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-3">Your Complete Financial Ecosystem</h1>
          <p className="text-muted-foreground">
            Manage all your finances in one place with AI-powered insights and seamless UPI payments
          </p>
        </div>

        {/* Balance preview card */}
        <Card className="overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 text-white mb-6">
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="font-medium mb-2">Welcome to MoneyFlow</h3>
              <h2 className="text-3xl font-bold">
                Smart Banking Made Simple
              </h2>
            </div>

            <div className="flex space-x-2">
              <Link href="/auth/login">
                <Button className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick access section */}
        <section className="mb-6">
          <h2 className="font-semibold mb-3">Our Services</h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              {
                icon: <CreditCard size={22} />,
                label: "Cards",
                bgColor: "bg-blue-100 dark:bg-blue-900/30",
                iconColor: "text-blue-600 dark:text-blue-400"
              },
              {
                icon: <LineChart size={22} />,
                label: "Invest",
                bgColor: "bg-green-100 dark:bg-green-900/30",
                iconColor: "text-green-600 dark:text-green-400"
              },
              {
                icon: <Landmark size={22} />,
                label: "Loans",
                bgColor: "bg-purple-100 dark:bg-purple-900/30",
                iconColor: "text-purple-600 dark:text-purple-400"
              },
              {
                icon: <Zap size={22} />,
                label: "Pay Bills",
                bgColor: "bg-amber-100 dark:bg-amber-900/30",
                iconColor: "text-amber-600 dark:text-amber-400"
              },
              {
                icon: <Shield size={22} />,
                label: "Insurance",
                bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
                iconColor: "text-indigo-600 dark:text-indigo-400"
              },
              {
                icon: <BriefcaseBusiness size={22} />,
                label: "Business",
                bgColor: "bg-slate-100 dark:bg-slate-800",
                iconColor: "text-slate-600 dark:text-slate-400"
              },
              {
                icon: <Receipt size={22} />,
                label: "Rewards",
                bgColor: "bg-orange-100 dark:bg-orange-900/30",
                iconColor: "text-orange-600 dark:text-orange-400"
              },
              {
                icon: <Lightbulb size={22} />,
                label: "AI Advisor",
                bgColor: "bg-teal-100 dark:bg-teal-900/30",
                iconColor: "text-teal-600 dark:text-teal-400"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-3 rounded-xl transition-transform hover:scale-105"
              >
                <div
                  className={`w-10 h-10 ${item.bgColor} rounded-full flex items-center justify-center mb-2`}
                >
                  <span className={item.iconColor}>{item.icon}</span>
                </div>
                <span className="text-xs font-medium dark:text-gray-200">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Features section */}
        <section className="space-y-6">
          <h2 className="font-semibold">Key Features</h2>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-500" />
                Secure UPI Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Make instant, secure payments to anyone using UPI. Transfer money to friends, family, and businesses with a single tap.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
                AI-Powered Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Our AI analyzes your spending patterns and offers personalized financial advice to help you save more and manage money better.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-green-500" />
                Smart Investments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Invest in stocks, mutual funds, and more with expert recommendations tailored to your financial goals and risk appetite.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Landmark className="h-5 w-5 mr-2 text-purple-500" />
                Quick Loans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Apply for personal, home, or business loans with minimal documentation. Get instant approvals and competitive interest rates.
              </p>
            </CardContent>
          </Card>
          
          <div className="pt-4 text-center">
            <Link href="/auth/login">
              <Button size="lg">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="container max-w-md mx-auto px-4 text-center">
          <h2 className="text-lg font-bold text-primary mb-2">MoneyFlow</h2>
          <p className="text-sm text-muted-foreground mb-4">Your Complete Financial Ecosystem</p>
          <div className="text-xs text-muted-foreground">
            © 2023 MoneyFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}