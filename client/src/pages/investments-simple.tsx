import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  TrendingUp, 
  TrendingDown, 
  Landmark, 
  BarChart, 
  PieChart,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";

export default function InvestmentsSimple() {
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Mock investment data
  const investments = [
    {
      id: 1,
      name: "HDFC Bank Ltd.",
      type: "Stocks",
      investedAmount: 25000,
      currentValue: 30750,
      returns: 23,
      units: 10,
      averagePrice: 2500,
      lastUpdated: "2023-04-15",
    },
    {
      id: 2,
      name: "SBI Blue Chip Fund",
      type: "Mutual Fund",
      investedAmount: 50000,
      currentValue: 57500,
      returns: 15,
      units: 1250,
      averagePrice: 40,
      isSIP: true,
      sipAmount: 5000,
      lastUpdated: "2023-04-15",
    },
    {
      id: 3,
      name: "Axis Long Term Equity Fund",
      type: "Mutual Fund",
      investedAmount: 100000,
      currentValue: 114000,
      returns: 14,
      units: 2356,
      averagePrice: 42.44,
      isSIP: true,
      sipAmount: 10000,
      lastUpdated: "2023-04-15",
    },
    {
      id: 4,
      name: "Reliance Industries Ltd.",
      type: "Stocks",
      investedAmount: 30000,
      currentValue: 28500,
      returns: -5,
      units: 12,
      averagePrice: 2500,
      lastUpdated: "2023-04-15",
    },
    {
      id: 5,
      name: "5-Year Fixed Deposit",
      type: "Fixed Deposit",
      investedAmount: 100000,
      currentValue: 106500,
      returns: 6.5,
      maturityDate: "2025-04-15",
      lastUpdated: "2023-04-15",
    }
  ];

  // Calculate totals
  const totalInvested = investments.reduce((sum, item) => sum + item.investedAmount, 0);
  const totalValue = investments.reduce((sum, item) => sum + item.currentValue, 0);
  const totalReturns = totalValue - totalInvested;
  const totalReturnsPercentage = (totalReturns / totalInvested) * 100;
  
  // Calculate allocation percentages
  const stocksValue = investments
    .filter(item => item.type === "Stocks")
    .reduce((sum, item) => sum + item.currentValue, 0);
  
  const mutualFundsValue = investments
    .filter(item => item.type === "Mutual Fund")
    .reduce((sum, item) => sum + item.currentValue, 0);
  
  const fixedDepositsValue = investments
    .filter(item => item.type === "Fixed Deposit")
    .reduce((sum, item) => sum + item.currentValue, 0);
  
  const stocksPercentage = (stocksValue / totalValue) * 100;
  const mutualFundsPercentage = (mutualFundsValue / totalValue) * 100;
  const fixedDepositsPercentage = (fixedDepositsValue / totalValue) * 100;

  const handleInvestNow = () => {
    toast({
      title: "Coming Soon",
      description: "Our investment platform is under development. Try again later.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 container max-w-md mx-auto px-4 pb-20 pt-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Investments</h1>
          <Button size="sm" onClick={handleInvestNow}>
            <Plus className="h-4 w-4 mr-1" />
            Invest
          </Button>
        </div>

        {/* Investment Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-primary" />
              Portfolio Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground text-sm">Current Value</p>
                <div className="flex items-baseline">
                  <h2 className="text-2xl font-bold">{formatCurrency(totalValue)}</h2>
                  <Badge 
                    variant={totalReturns >= 0 ? "default" : "destructive"}
                    className="ml-2"
                  >
                    {totalReturns >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {totalReturnsPercentage.toFixed(2)}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Invested: {formatCurrency(totalInvested)}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Stocks</p>
                    <Badge 
                      variant="outline" 
                      className="h-5 text-xs bg-blue-200 dark:bg-blue-800 border-0"
                    >
                      {stocksPercentage.toFixed(0)}%
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(stocksValue)}</p>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-green-700 dark:text-green-300">Mutual Funds</p>
                    <Badge 
                      variant="outline" 
                      className="h-5 text-xs bg-green-200 dark:bg-green-800 border-0"
                    >
                      {mutualFundsPercentage.toFixed(0)}%
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(mutualFundsValue)}</p>
                </div>
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-300">FDs</p>
                    <Badge 
                      variant="outline" 
                      className="h-5 text-xs bg-amber-200 dark:bg-amber-800 border-0"
                    >
                      {fixedDepositsPercentage.toFixed(0)}%
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(fixedDepositsValue)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="mutual-funds">Mutual Funds</TabsTrigger>
            <TabsTrigger value="fds">FDs</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {investments.map((investment) => (
                <Card key={investment.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-sm mb-1">{investment.name}</h3>
                        <div className="flex items-center">
                          <Badge 
                            variant="outline" 
                            className="mr-2 text-xs px-2 py-0 h-5"
                          >
                            {investment.type}
                          </Badge>
                          {investment.isSIP && (
                            <Badge 
                              variant="outline" 
                              className="text-xs px-2 py-0 h-5 bg-primary/10 text-primary border-0"
                            >
                              SIP: {formatCurrency(investment.sipAmount || 0)}/mo
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end">
                          <p className="font-semibold text-sm">
                            {formatCurrency(investment.currentValue)}
                          </p>
                          <Badge 
                            variant={investment.returns >= 0 ? "default" : "destructive"}
                            className="ml-2 text-xs"
                          >
                            {investment.returns >= 0 ? "+" : ""}{investment.returns}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Invested: {formatCurrency(investment.investedAmount)}
                        </p>
                      </div>
                    </div>
                    {investment.units && (
                      <div className="mt-2 text-xs text-muted-foreground grid grid-cols-2 gap-2">
                        <div>
                          <span className="block">Units</span>
                          <span className="font-medium text-foreground">{investment.units}</span>
                        </div>
                        <div>
                          <span className="block">Avg. Price</span>
                          <span className="font-medium text-foreground">
                            {formatCurrency(investment.averagePrice || 0)}
                          </span>
                        </div>
                      </div>
                    )}
                    {investment.maturityDate && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span>Maturity Date: </span>
                        <span className="font-medium text-foreground">
                          {new Date(investment.maturityDate).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stocks">
            <div className="space-y-4">
              {investments
                .filter(inv => inv.type === "Stocks")
                .map((investment) => (
                  <Card key={investment.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-sm mb-1">{investment.name}</h3>
                          <Badge 
                            variant="outline" 
                            className="text-xs px-2 py-0 h-5"
                          >
                            {investment.type}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end">
                            <p className="font-semibold text-sm">
                              {formatCurrency(investment.currentValue)}
                            </p>
                            <Badge 
                              variant={investment.returns >= 0 ? "default" : "destructive"}
                              className="ml-2 text-xs"
                            >
                              {investment.returns >= 0 ? "+" : ""}{investment.returns}%
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Invested: {formatCurrency(investment.investedAmount)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground grid grid-cols-2 gap-2">
                        <div>
                          <span className="block">Units</span>
                          <span className="font-medium text-foreground">{investment.units}</span>
                        </div>
                        <div>
                          <span className="block">Avg. Price</span>
                          <span className="font-medium text-foreground">
                            {formatCurrency(investment.averagePrice || 0)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="mutual-funds">
            <div className="space-y-4">
              {investments
                .filter(inv => inv.type === "Mutual Fund")
                .map((investment) => (
                  <Card key={investment.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-sm mb-1">{investment.name}</h3>
                          <div className="flex items-center">
                            <Badge 
                              variant="outline" 
                              className="mr-2 text-xs px-2 py-0 h-5"
                            >
                              {investment.type}
                            </Badge>
                            {investment.isSIP && (
                              <Badge 
                                variant="outline" 
                                className="text-xs px-2 py-0 h-5 bg-primary/10 text-primary border-0"
                              >
                                SIP: {formatCurrency(investment.sipAmount || 0)}/mo
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end">
                            <p className="font-semibold text-sm">
                              {formatCurrency(investment.currentValue)}
                            </p>
                            <Badge 
                              variant={investment.returns >= 0 ? "default" : "destructive"}
                              className="ml-2 text-xs"
                            >
                              {investment.returns >= 0 ? "+" : ""}{investment.returns}%
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Invested: {formatCurrency(investment.investedAmount)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground grid grid-cols-2 gap-2">
                        <div>
                          <span className="block">Units</span>
                          <span className="font-medium text-foreground">{investment.units}</span>
                        </div>
                        <div>
                          <span className="block">Avg. NAV</span>
                          <span className="font-medium text-foreground">
                            {formatCurrency(investment.averagePrice || 0)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="fds">
            <div className="space-y-4">
              {investments
                .filter(inv => inv.type === "Fixed Deposit")
                .map((investment) => (
                  <Card key={investment.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-sm mb-1">{investment.name}</h3>
                          <Badge 
                            variant="outline" 
                            className="text-xs px-2 py-0 h-5"
                          >
                            {investment.type}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end">
                            <p className="font-semibold text-sm">
                              {formatCurrency(investment.currentValue)}
                            </p>
                            <Badge 
                              variant="default"
                              className="ml-2 text-xs"
                            >
                              +{investment.returns}%
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Invested: {formatCurrency(investment.investedAmount)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span>Maturity Date: </span>
                        <span className="font-medium text-foreground">
                          {new Date(investment.maturityDate || "").toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  );
}