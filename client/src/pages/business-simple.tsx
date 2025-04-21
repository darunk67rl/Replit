import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  CreditCard, 
  DollarSign, 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight,
  Receipt,
  Building2,
  BarChart,
  Users,
  Plus,
  BriefcaseBusiness
} from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BusinessSimple() {
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleRegisterBusiness = () => {
    toast({
      title: "Coming Soon",
      description: "Business registration will be available soon.",
    });
  };

  const handleApplyForLoan = () => {
    toast({
      title: "Coming Soon",
      description: "Business loan application will be available soon.",
    });
  };

  // Business features
  const businessFeatures = [
    {
      icon: <Building2 className="h-5 w-5" />,
      title: "Business Account",
      description: "Open a business account with zero balance requirements",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      title: "Business Loans",
      description: "Get loans up to ₹50 lakh with minimal documentation",
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "Business Credit Card",
      description: "Exclusive corporate cards with higher limits",
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
    },
    {
      icon: <Receipt className="h-5 w-5" />,
      title: "Invoice Management",
      description: "Create and manage invoices directly from the app",
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
    },
    {
      icon: <BarChart className="h-5 w-5" />,
      title: "Financial Insights",
      description: "Get AI-powered insights about your business finances",
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Payroll Management",
      description: "Manage employee salaries and payroll taxes",
      color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 container max-w-md mx-auto px-4 pb-20 pt-16">
        <h1 className="text-2xl font-bold mb-6">Business Solutions</h1>

        <Card className="mb-6 overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-1">Grow Your Business</h2>
                  <p className="text-white/80 text-sm mb-4">
                    Access a full suite of financial tools designed for SMEs
                  </p>
                </div>
                <div className="p-2 bg-white/20 rounded-full">
                  <BriefcaseBusiness className="h-6 w-6" />
                </div>
              </div>
              <Button className="w-full bg-white text-blue-600 hover:bg-white/90" onClick={handleRegisterBusiness}>
                Register Your Business
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Business Features */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Our Business Services</CardTitle>
            <CardDescription>
              Comprehensive solutions for your business needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {businessFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${feature.color.split(' ').slice(0, 2).join(' ')}`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Business Loan Section */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-primary" />
              Business Loans
            </CardTitle>
            <CardDescription>
              Quick and flexible financing options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Loan Eligibility</h3>
                <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                  <li>Business age: Minimum 1 year</li>
                  <li>Monthly turnover: At least ₹50,000</li>
                  <li>Minimal documentation required</li>
                  <li>Quick approval within 48 hours</li>
                </ul>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">Loan Amount</p>
                  <p className="font-semibold">₹1L - ₹50L</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">Interest Rate</p>
                  <p className="font-semibold">12% - 18% p.a.</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">Tenure</p>
                  <p className="font-semibold">1 - 5 years</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">Processing Fee</p>
                  <p className="font-semibold">1% - 2.5%</p>
                </div>
              </div>
              
              <Button className="w-full" onClick={handleApplyForLoan}>
                Apply for a Business Loan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Why Choose Us */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Why Choose Our Business Solutions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  1
                </div>
                <div>
                  <h3 className="font-medium">Tailored for SMEs</h3>
                  <p className="text-sm text-muted-foreground">Solutions designed specifically for small and medium businesses</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  2
                </div>
                <div>
                  <h3 className="font-medium">Digital-First</h3>
                  <p className="text-sm text-muted-foreground">Manage your business finances entirely from your smartphone</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  3
                </div>
                <div>
                  <h3 className="font-medium">Competitive Rates</h3>
                  <p className="text-sm text-muted-foreground">Better interest rates and lower fees compared to traditional banks</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  4
                </div>
                <div>
                  <h3 className="font-medium">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">Dedicated business relationship managers available round the clock</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
}