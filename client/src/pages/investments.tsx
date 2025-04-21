import React, { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PieChart, BarChart, LineChart } from "recharts";
import { Pie, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { Info, TrendingUp, Banknote, BookOpen, RefreshCw, Share, Plus } from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";

// Sample investment data
const investmentData = [
  {
    id: 1,
    name: "HDFC Bank Ltd.",
    type: "Equity",
    category: "Banking",
    investedAmount: 25000,
    currentValue: 30250,
    returns: 21,
    units: 25,
    purchasePrice: 1000,
    currentPrice: 1210,
    lastUpdated: "2023-04-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Tata Consultancy Services",
    type: "Equity",
    category: "IT",
    investedAmount: 40000,
    currentValue: 44000,
    returns: 10,
    units: 10,
    purchasePrice: 4000,
    currentPrice: 4400,
    lastUpdated: "2023-04-15T10:30:00Z",
  },
  {
    id: 3,
    name: "Reliance Industries Ltd.",
    type: "Equity",
    category: "Energy",
    investedAmount: 30000,
    currentValue: 36000,
    returns: 20,
    units: 15,
    purchasePrice: 2000,
    currentPrice: 2400,
    lastUpdated: "2023-04-15T10:30:00Z",
  },
  {
    id: 4,
    name: "Axis Bluechip Fund",
    type: "Mutual Fund",
    category: "Equity",
    investedAmount: 50000,
    currentValue: 55000,
    returns: 10,
    units: 2000,
    purchasePrice: 25,
    currentPrice: 27.5,
    lastUpdated: "2023-04-15T10:30:00Z",
    isSIP: true,
    sipAmount: 5000,
  },
  {
    id: 5,
    name: "ICICI Prudential Liquid Fund",
    type: "Mutual Fund",
    category: "Debt",
    investedAmount: 20000,
    currentValue: 21000,
    returns: 5,
    units: 800,
    purchasePrice: 25,
    currentPrice: 26.25,
    lastUpdated: "2023-04-15T10:30:00Z",
    isSIP: false,
  },
  {
    id: 6,
    name: "Gold ETF",
    type: "ETF",
    category: "Commodities",
    investedAmount: 15000,
    currentValue: 16500,
    returns: 10,
    units: 5,
    purchasePrice: 3000,
    currentPrice: 3300,
    lastUpdated: "2023-04-15T10:30:00Z",
  },
];

// Performance data for charts
const performanceData = [
  { month: "Jan", value: 100000 },
  { month: "Feb", value: 102000 },
  { month: "Mar", value: 104000 },
  { month: "Apr", value: 101000 },
  { month: "May", value: 106000 },
  { month: "Jun", value: 108000 },
  { month: "Jul", value: 112000 },
  { month: "Aug", value: 115000 },
  { month: "Sep", value: 118000 },
  { month: "Oct", value: 120000 },
  { month: "Nov", value: 125000 },
  { month: "Dec", value: 130000 },
];

// Asset allocation data for pie chart
const assetAllocationData = [
  { name: "Equity", value: 110250, color: "#0088FE" },
  { name: "Mutual Funds", value: 76000, color: "#00C49F" },
  { name: "ETFs", value: 16500, color: "#FFBB28" },
  { name: "Fixed Deposits", value: 50000, color: "#FF8042" },
];

// Category breakdown data
const categoryBreakdownData = [
  { name: "Banking", value: 30250, color: "#8884d8" },
  { name: "IT", value: 44000, color: "#82ca9d" },
  { name: "Energy", value: 36000, color: "#ffc658" },
  { name: "Commodities", value: 16500, color: "#ff8042" },
  { name: "Debt", value: 21000, color: "#8dd1e1" },
  { name: "Fixed Income", value: 50000, color: "#a4de6c" },
];

interface Investment {
  id: number;
  name: string;
  type: string;
  category: string;
  investedAmount: number;
  currentValue: number;
  returns: number;
  units?: number;
  purchasePrice?: number;
  currentPrice?: number;
  lastUpdated: string;
  isSIP?: boolean;
  sipAmount?: number;
}

export default function Investments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [isAddInvestmentOpen, setIsAddInvestmentOpen] = useState(false);

  // Format currency with rupee symbol
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate total investment metrics
  const totalInvestedAmount = investmentData.reduce((acc, curr) => acc + curr.investedAmount, 0);
  const totalCurrentValue = investmentData.reduce((acc, curr) => acc + curr.currentValue, 0);
  const totalReturns = totalCurrentValue - totalInvestedAmount;
  const totalReturnsPercentage = (totalReturns / totalInvestedAmount) * 100;

  const handleNewInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddInvestmentOpen(false);
    toast({
      title: "Investment Added",
      description: "Your new investment has been added successfully.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 container max-w-md mx-auto px-4 pb-20 pt-16">
        {/* Investment Summary Card */}
        <Card className="mb-4">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Investment</p>
                <p className="text-2xl font-bold">{formatCurrency(totalInvestedAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Value</p>
                <p className="text-2xl font-bold">{formatCurrency(totalCurrentValue)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Returns</p>
                <p className={`text-lg font-semibold ${totalReturns >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {totalReturns >= 0 ? "+" : ""}{formatCurrency(totalReturns)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Returns %</p>
                <p className={`text-lg font-semibold ${totalReturnsPercentage >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {totalReturnsPercentage >= 0 ? "+" : ""}{totalReturnsPercentage.toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="mt-4">
              <Dialog open={isAddInvestmentOpen} onOpenChange={setIsAddInvestmentOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Investment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Investment</DialogTitle>
                    <DialogDescription>Enter the details of your investment below.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleNewInvestment}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="investment-type">Investment Type</Label>
                        <Select defaultValue="equity">
                          <SelectTrigger id="investment-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equity">Equity</SelectItem>
                            <SelectItem value="mutual-fund">Mutual Fund</SelectItem>
                            <SelectItem value="etf">ETF</SelectItem>
                            <SelectItem value="fd">Fixed Deposit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="investment-name">Name/Symbol</Label>
                        <Input id="investment-name" placeholder="e.g. HDFC Bank Ltd." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="investment-amount">Amount</Label>
                          <Input id="investment-amount" type="number" placeholder="10000" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="investment-units">Units/Shares</Label>
                          <Input id="investment-units" type="number" placeholder="10" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="investment-date">Purchase Date</Label>
                        <Input id="investment-date" type="date" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add Investment</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-4">
            {investmentData.map((investment) => (
              <Card key={investment.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{investment.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{investment.type}</Badge>
                          <span className="text-xs text-muted-foreground">{investment.category}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${investment.returns >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {investment.returns >= 0 ? "+" : ""}{investment.returns}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(investment.currentValue)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Invested</span>
                        <p className="font-medium">{formatCurrency(investment.investedAmount)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Units</span>
                        <p className="font-medium">{investment.units}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Current Price</span>
                        <p className="font-medium">₹{investment.currentPrice}</p>
                      </div>
                    </div>

                    {investment.isSIP && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          SIP: {formatCurrency(investment.sipAmount || 0)}/month
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex border-t border-gray-100 dark:border-gray-800">
                    <Button variant="ghost" className="flex-1 rounded-none text-xs h-10">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button variant="ghost" className="flex-1 rounded-none text-xs h-10">
                      <Banknote className="h-4 w-4 mr-1" />
                      Buy/Sell
                    </Button>
                    <Button variant="ghost" className="flex-1 rounded-none text-xs h-10">
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Growth</CardTitle>
                <CardDescription>Last 12 months performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Portfolio Value"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-3">Asset Allocation</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={assetAllocationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {assetAllocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Investment Insights</CardTitle>
                <CardDescription>Analyze your portfolio performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Diversification Advice</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your portfolio is heavily concentrated in the Banking sector (40%). Consider
                        diversifying into other sectors for better risk management.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Top Performers</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your best performing investments are HDFC Bank Ltd. (+21%) and Reliance
                        Industries Ltd. (+20%). Consider increasing your position in these stocks.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <BookOpen className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Educational Resources</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Learn more about SIP investments with our new educational resources. Starting
                        a SIP can help you build wealth consistently over time.
                      </p>
                      <Button variant="link" className="p-0 h-auto text-sm mt-1">Learn More</Button>
                    </div>
                  </div>
                </div>

                <div className="h-[300px] w-full mt-4">
                  <h3 className="font-medium mb-3">Category Breakdown</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryBreakdownData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Bar dataKey="value" name="Investment Value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  );
}