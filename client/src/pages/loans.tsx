import React, { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CircleDollarSign, Landmark, Calculator, Clock, ArrowRight, ShieldCheck, BriefcaseBusiness } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";

// Interface for loan types
interface LoanType {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  minTenure: number;
  maxTenure: number;
  interestRate: number;
  processingFee: number;
  description: string;
  icon: JSX.Element;
  color: string;
}

// Interface for active loans
interface ActiveLoan {
  id: string;
  type: string;
  amount: number;
  remainingAmount: number;
  interestRate: number;
  emiAmount: number;
  startDate: string;
  nextPaymentDate: string;
  tenure: number;
  completedTenure: number;
  status: "active" | "overdue" | "completed";
}

export default function Loans() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Loan application state
  const [loanAmount, setLoanAmount] = useState(50000);
  const [loanTenure, setLoanTenure] = useState(12);
  const [selectedLoanType, setSelectedLoanType] = useState("personal");

  // Mock loan types
  const loanTypes: LoanType[] = [
    {
      id: "personal",
      name: "Personal Loan",
      minAmount: 25000,
      maxAmount: 500000,
      minTenure: 3,
      maxTenure: 60,
      interestRate: 10.5,
      processingFee: 1.5,
      description: "Quick personal loans with minimal documentation for your immediate needs.",
      icon: <CircleDollarSign className="h-5 w-5" />,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "home",
      name: "Home Loan",
      minAmount: 500000,
      maxAmount: 10000000,
      minTenure: 12,
      maxTenure: 360,
      interestRate: 8.0,
      processingFee: 0.5,
      description: "Affordable home loans with attractive interest rates to help you own your dream home.",
      icon: <Landmark className="h-5 w-5" />,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      id: "business",
      name: "Business Loan",
      minAmount: 100000,
      maxAmount: 2000000,
      minTenure: 6,
      maxTenure: 84,
      interestRate: 12.0,
      processingFee: 2.0,
      description: "Business loans to fuel your growth and expansion plans with flexible repayment options.",
      icon: <BriefcaseBusiness className="h-5 w-5" />,
      color: "text-green-600 dark:text-green-400",
    },
  ];

  // Get the selected loan type details
  const selectedLoan = loanTypes.find((loan) => loan.id === selectedLoanType) || loanTypes[0];

  // Calculate EMI
  const calculateEMI = (amount: number, tenure: number, interestRate: number) => {
    const r = interestRate / 12 / 100;
    const n = tenure;
    const emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  const emi = calculateEMI(loanAmount, loanTenure, selectedLoan.interestRate);
  const totalAmount = emi * loanTenure;
  const totalInterest = totalAmount - loanAmount;
  const processingFeeAmount = (loanAmount * selectedLoan.processingFee) / 100;

  // Mock active loans
  const activeLoans: ActiveLoan[] = [
    {
      id: "loan1",
      type: "Personal Loan",
      amount: 100000,
      remainingAmount: 60000,
      interestRate: 10.5,
      emiAmount: 8884,
      startDate: "2023-01-15",
      nextPaymentDate: "2023-07-15",
      tenure: 12,
      completedTenure: 5,
      status: "active",
    },
    {
      id: "loan2",
      type: "Home Loan",
      amount: 2000000,
      remainingAmount: 1800000,
      interestRate: 8.0,
      emiAmount: 16650,
      startDate: "2022-10-10",
      nextPaymentDate: "2023-07-10",
      tenure: 240,
      completedTenure: 9,
      status: "active",
    },
  ];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle loan application
  const handleApplyLoan = () => {
    toast({
      title: "Loan Application Submitted",
      description: `Your ${selectedLoan.name} application for ${formatCurrency(loanAmount)} has been submitted successfully.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 container max-w-md mx-auto px-4 pb-20 pt-16">
        <Tabs defaultValue="apply" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="apply">Apply for Loan</TabsTrigger>
            <TabsTrigger value="active">Active Loans</TabsTrigger>
          </TabsList>

          {/* Apply for loan tab */}
          <TabsContent value="apply">
            <Card>
              <CardHeader>
                <CardTitle>Apply for a Loan</CardTitle>
                <CardDescription>
                  Choose a loan type and customize the amount and tenure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Loan Type Selection */}
                <div className="space-y-3">
                  <Label>Loan Type</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {loanTypes.map((loan) => (
                      <Button
                        key={loan.id}
                        variant={selectedLoanType === loan.id ? "default" : "outline"}
                        className="flex flex-col h-auto py-3"
                        onClick={() => setSelectedLoanType(loan.id)}
                      >
                        <div className={`mb-1 ${loan.color}`}>{loan.icon}</div>
                        <span className="text-xs">{loan.name}</span>
                      </Button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedLoan.description}</p>
                </div>

                {/* Loan Amount Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Loan Amount</Label>
                    <span className="text-sm font-medium">{formatCurrency(loanAmount)}</span>
                  </div>
                  <Slider
                    value={[loanAmount]}
                    min={selectedLoan.minAmount}
                    max={selectedLoan.maxAmount}
                    step={1000}
                    onValueChange={(value) => setLoanAmount(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatCurrency(selectedLoan.minAmount)}</span>
                    <span>{formatCurrency(selectedLoan.maxAmount)}</span>
                  </div>
                </div>

                {/* Loan Tenure Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Loan Tenure</Label>
                    <span className="text-sm font-medium">
                      {loanTenure} {loanTenure === 1 ? "month" : "months"}
                    </span>
                  </div>
                  <Slider
                    value={[loanTenure]}
                    min={selectedLoan.minTenure}
                    max={selectedLoan.maxTenure}
                    step={1}
                    onValueChange={(value) => setLoanTenure(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {selectedLoan.minTenure} {selectedLoan.minTenure === 1 ? "month" : "months"}
                    </span>
                    <span>
                      {selectedLoan.maxTenure} {selectedLoan.maxTenure === 1 ? "month" : "months"}
                    </span>
                  </div>
                </div>

                {/* Loan Details */}
                <Card className="bg-muted">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Monthly EMI</span>
                      <span className="text-sm font-medium">{formatCurrency(emi)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Interest Rate</span>
                      <span className="text-sm font-medium">{selectedLoan.interestRate}% p.a.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Processing Fee</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(processingFeeAmount)} ({selectedLoan.processingFee}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Interest</span>
                      <span className="text-sm font-medium">{formatCurrency(totalInterest)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Amount</span>
                      <span className="text-sm font-medium">{formatCurrency(totalAmount)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Button className="w-full" onClick={handleApplyLoan}>
                  Apply for Loan
                </Button>

                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Your data is secure and encrypted</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active loans tab */}
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Your Loans</CardTitle>
                <CardDescription>Manage your active loans and repayments</CardDescription>
              </CardHeader>
              <CardContent>
                {activeLoans.length > 0 ? (
                  <div className="space-y-4">
                    {activeLoans.map((loan) => (
                      <Card key={loan.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-medium text-sm">{loan.type}</h3>
                              <p className="text-2xl font-bold">{formatCurrency(loan.amount)}</p>
                            </div>
                            <Badge
                              variant={
                                loan.status === "active"
                                  ? "outline"
                                  : loan.status === "overdue"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {loan.status === "active"
                                ? "Active"
                                : loan.status === "overdue"
                                ? "Overdue"
                                : "Completed"}
                            </Badge>
                          </div>

                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Loan Progress</span>
                              <span>
                                {loan.completedTenure}/{loan.tenure} months
                              </span>
                            </div>
                            <Progress
                              value={(loan.completedTenure / loan.tenure) * 100}
                              className="h-2"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div>
                              <span className="text-muted-foreground">EMI Amount</span>
                              <p className="font-medium">{formatCurrency(loan.emiAmount)}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Interest Rate</span>
                              <p className="font-medium">{loan.interestRate}% p.a.</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Next Payment</span>
                              <p className="font-medium">
                                {new Date(loan.nextPaymentDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Remaining</span>
                              <p className="font-medium">{formatCurrency(loan.remainingAmount)}</p>
                            </div>
                          </div>

                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Landmark className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                    <h3 className="font-medium text-lg mb-1">No Active Loans</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You don't have any active loans at the moment.
                    </p>
                    <Button onClick={() => document.querySelector('[value="apply"]')?.click()}>
                      Apply for a Loan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  );
}