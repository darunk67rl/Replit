import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Home, 
  Car, 
  GraduationCap, 
  Briefcase, 
  Landmark,
  ArrowRight,
  IndianRupee,
  Calendar
} from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";

export default function LoansSimple() {
  const { toast } = useToast();
  const [loanAmount, setLoanAmount] = useState(500000);
  const [tenure, setTenure] = useState(36);
  const [income, setIncome] = useState(50000);
  const [step, setStep] = useState(1);
  
  // Calculate EMI: P × r × (1 + r)^n / ((1 + r)^n - 1)
  const calculateEMI = (principal: number, interestRate: number, tenureMonths: number) => {
    const r = interestRate / 12 / 100;
    const n = tenureMonths;
    const emi = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  const handleApplyNow = () => {
    toast({
      title: "Loan Application Submitted",
      description: "Your loan application has been received. We'll contact you shortly.",
    });
    setStep(1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const loanOptions = [
    { 
      type: "home", 
      title: "Home Loan", 
      description: "Buy your dream home with affordable EMIs",
      interestRate: 8.5,
      maxAmount: 10000000,
      icon: <Home className="h-5 w-5" />
    },
    { 
      type: "car", 
      title: "Car Loan", 
      description: "Drive home your dream car today",
      interestRate: 9.5,
      maxAmount: 2000000,
      icon: <Car className="h-5 w-5" />
    },
    { 
      type: "education", 
      title: "Education Loan", 
      description: "Invest in your future with our education loans",
      interestRate: 7.5,
      maxAmount: 5000000,
      icon: <GraduationCap className="h-5 w-5" />
    },
    { 
      type: "personal", 
      title: "Personal Loan", 
      description: "Instant personal loans for all your needs",
      interestRate: 10.5,
      maxAmount: 1500000,
      icon: <Briefcase className="h-5 w-5" />
    },
    { 
      type: "business", 
      title: "Business Loan", 
      description: "Grow your business with our financial solutions",
      interestRate: 11.0,
      maxAmount: 5000000,
      icon: <Landmark className="h-5 w-5" />
    }
  ];

  const [selectedLoanType, setSelectedLoanType] = useState(loanOptions[0]);

  const monthlyEMI = calculateEMI(loanAmount, selectedLoanType.interestRate, tenure);
  const totalInterest = (monthlyEMI * tenure) - loanAmount;
  const totalPayable = monthlyEMI * tenure;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 container max-w-md mx-auto px-4 pb-20 pt-16">
        <h1 className="text-2xl font-bold mb-4">Loans</h1>

        {step === 1 && (
          <>
            <Tabs defaultValue="apply" className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="apply">Apply for Loan</TabsTrigger>
                <TabsTrigger value="existing">My Loans</TabsTrigger>
              </TabsList>

              <TabsContent value="apply" className="mt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Choose a loan type to continue with your application
                </p>

                <div className="space-y-3">
                  {loanOptions.map((loan) => (
                    <Card 
                      key={loan.type}
                      className={`cursor-pointer transition-all ${selectedLoanType.type === loan.type ? 'border-primary' : ''}`}
                      onClick={() => setSelectedLoanType(loan)}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-3 p-2 rounded-full bg-primary/10 text-primary">
                            {loan.icon}
                          </div>
                          <div>
                            <h3 className="font-medium">{loan.title}</h3>
                            <p className="text-xs text-muted-foreground">{loan.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{loan.interestRate}%</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="mt-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <IndianRupee className="h-4 w-4 mr-2" />
                      Loan Calculator
                    </CardTitle>
                    <CardDescription>
                      Adjust the sliders to calculate your EMI
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="loan-amount">Loan Amount</Label>
                          <span className="text-sm font-medium">{formatCurrency(loanAmount)}</span>
                        </div>
                        <Slider
                          id="loan-amount"
                          value={[loanAmount]}
                          min={100000}
                          max={selectedLoanType.maxAmount}
                          step={10000}
                          onValueChange={(value) => setLoanAmount(value[0])}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>₹1L</span>
                          <span>₹{selectedLoanType.maxAmount / 100000}L</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="tenure">Tenure (Months)</Label>
                          <span className="text-sm font-medium">{tenure} months</span>
                        </div>
                        <Slider
                          id="tenure"
                          value={[tenure]}
                          min={12}
                          max={84}
                          step={6}
                          onValueChange={(value) => setTenure(value[0])}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>12 months</span>
                          <span>84 months</span>
                        </div>
                      </div>

                      <div className="pt-4 space-y-3">
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <p className="text-xs text-muted-foreground">Monthly EMI</p>
                            <p className="font-semibold">{formatCurrency(monthlyEMI)}</p>
                          </div>
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <p className="text-xs text-muted-foreground">Interest</p>
                            <p className="font-semibold">{formatCurrency(totalInterest)}</p>
                          </div>
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <p className="text-xs text-muted-foreground">Total Amount</p>
                            <p className="font-semibold">{formatCurrency(totalPayable)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button className="w-full mt-6" onClick={() => setStep(2)}>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </TabsContent>

              <TabsContent value="existing" className="mt-4">
                <div className="text-center py-10">
                  <Landmark className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="font-medium mb-1">No Active Loans</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You don't have any active loans at the moment
                  </p>
                  <Button variant="outline" onClick={() => {
                    const tabsList = document.querySelector('[value="apply"]') as HTMLElement;
                    if (tabsList) tabsList.click();
                  }}>
                    Apply for a Loan
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <h2 className="text-xl font-semibold">{selectedLoanType.title}</h2>
              <div className="w-10"></div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" placeholder="Enter your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter your phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN Number</Label>
                  <Input id="pan" placeholder="Enter your PAN number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthly-income">Monthly Income</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                      ₹
                    </span>
                    <Input 
                      id="monthly-income" 
                      className="pl-7" 
                      type="number" 
                      value={income}
                      onChange={(e) => setIncome(Number(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Loan Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Loan Type</span>
                  <span className="font-medium">{selectedLoanType.title}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Loan Amount</span>
                  <span className="font-medium">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Tenure</span>
                  <span className="font-medium">{tenure} months</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Interest Rate</span>
                  <span className="font-medium">{selectedLoanType.interestRate}% p.a.</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Monthly EMI</span>
                  <span className="font-medium">{formatCurrency(monthlyEMI)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Total Interest</span>
                  <span className="font-medium">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="flex justify-between py-2 border-t">
                  <span className="font-medium">Total Payable</span>
                  <span className="font-medium">{formatCurrency(totalPayable)}</span>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" onClick={handleApplyNow}>
              Apply Now
            </Button>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}