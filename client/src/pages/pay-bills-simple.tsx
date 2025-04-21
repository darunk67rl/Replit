import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Zap, 
  Phone, 
  Wifi, 
  Home, 
  Tv, 
  Receipt, 
  CreditCard,
  CalendarDays,
  ChevronRight,
  Clock,
  Search,
  CheckCircle2
} from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function PayBillsSimple() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  // Mock bills data
  const bills = [
    {
      id: 1,
      type: "electricity",
      provider: "Tata Power",
      accountNumber: "TP1234567890",
      billNumber: "ELEC987654321",
      amount: 1250,
      dueDate: "2023-05-10",
      status: "pending"
    },
    {
      id: 2,
      type: "mobile",
      provider: "Jio",
      accountNumber: "9876543210",
      billNumber: "JIO456789123",
      amount: 499,
      dueDate: "2023-05-15",
      status: "pending"
    },
    {
      id: 3,
      type: "broadband",
      provider: "Airtel",
      accountNumber: "AIR7654321098",
      billNumber: "BB123456789",
      amount: 999,
      dueDate: "2023-05-20",
      status: "pending"
    },
    {
      id: 4,
      type: "dth",
      provider: "Tata Sky",
      accountNumber: "TS0987654321",
      billNumber: "DTH345678912",
      amount: 350,
      dueDate: "2023-05-12",
      status: "paid",
      paidOn: "2023-05-05"
    }
  ];

  // Filter bills based on search query
  const filteredBills = bills.filter(bill => 
    bill.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bill.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingBills = filteredBills.filter(bill => bill.status === "pending");
  const paidBills = filteredBills.filter(bill => bill.status === "paid");

  // Bill type categories
  const billCategories = [
    {
      type: "electricity",
      title: "Electricity",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
    },
    {
      type: "mobile",
      title: "Mobile",
      icon: <Phone className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    },
    {
      type: "broadband",
      title: "Broadband",
      icon: <Wifi className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
    },
    {
      type: "dth",
      title: "DTH",
      icon: <Tv className="h-5 w-5" />,
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    },
    {
      type: "gas",
      title: "Gas",
      icon: <Home className="h-5 w-5" />,
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    },
    {
      type: "water",
      title: "Water",
      icon: <Home className="h-5 w-5" />,
      color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400"
    },
    {
      type: "credit card",
      title: "Credit Card",
      icon: <CreditCard className="h-5 w-5" />,
      color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
    },
    {
      type: "insurance",
      title: "Insurance",
      icon: <Receipt className="h-5 w-5" />,
      color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
    }
  ];

  const handleViewBill = (bill: any) => {
    setSelectedBill(bill);
    setCurrentStep(1);
    setPaymentComplete(false);
  };

  const handlePayNow = () => {
    setCurrentStep(2);
  };

  const handleConfirmPayment = () => {
    setShowPaymentConfirmation(true);
  };

  const handleCompletePay = () => {
    setShowPaymentConfirmation(false);
    setPaymentComplete(true);
    // Set a timeout to simulate payment processing
    setTimeout(() => {
      setCurrentStep(3);
      toast({
        title: "Payment Successful",
        description: `Your ${selectedBill?.provider} bill has been paid successfully.`,
      });
    }, 2000);
  };

  const handleAddBiller = (type: string) => {
    toast({
      title: "Coming Soon",
      description: `Adding ${billCategories.find(c => c.type === type)?.title || 'biller'} will be available soon.`,
    });
  };

  const getIconForBillType = (type: string) => {
    const category = billCategories.find(c => c.type === type);
    return category ? category.icon : <Receipt className="h-5 w-5" />;
  };
  
  const getColorForBillType = (type: string) => {
    const category = billCategories.find(c => c.type === type);
    return category ? 
      `${category.color.split(' ').slice(0, 2).join(' ')}` : 
      "bg-slate-100 dark:bg-slate-800";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 container max-w-md mx-auto px-4 pb-20 pt-16">
        <h1 className="text-2xl font-bold mb-4">Pay Bills</h1>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bills by provider or type..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="pending" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            <div className="space-y-4">
              {pendingBills.length > 0 ? (
                pendingBills.map((bill) => (
                  <Card 
                    key={bill.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleViewBill(bill)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${getColorForBillType(bill.type)}`}>
                          {getIconForBillType(bill.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{bill.provider}</h3>
                              <p className="text-xs text-muted-foreground">{bill.accountNumber}</p>
                            </div>
                            <Badge variant="destructive">Due</Badge>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm font-medium">{formatCurrency(bill.amount)}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <CalendarDays className="h-3 w-3 mr-1" />
                              <span>Due: {formatDate(bill.dueDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="font-medium mb-1">No Pending Bills</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You're all caught up with your bill payments
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="paid" className="mt-4">
            <div className="space-y-4">
              {paidBills.length > 0 ? (
                paidBills.map((bill) => (
                  <Card key={bill.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${getColorForBillType(bill.type)}`}>
                          {getIconForBillType(bill.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{bill.provider}</h3>
                              <p className="text-xs text-muted-foreground">{bill.accountNumber}</p>
                            </div>
                            <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                              Paid
                            </Badge>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm font-medium">{formatCurrency(bill.amount)}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Paid on: {formatDate(bill.paidOn || "")}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <Receipt className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="font-medium mb-1">No Payment History</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your paid bills will appear here
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Bill Categories</CardTitle>
            <CardDescription>Select a category to add a new biller</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {billCategories.map((category) => (
                <div
                  key={category.type}
                  className="flex flex-col items-center space-y-1 cursor-pointer"
                  onClick={() => handleAddBiller(category.type)}
                >
                  <div className={`p-3 rounded-full ${category.color.split(' ').slice(0, 2).join(' ')}`}>
                    {category.icon}
                  </div>
                  <span className="text-xs font-medium text-center">{category.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedBill && (
          <Dialog open={!!selectedBill} onOpenChange={(open) => !open && setSelectedBill(null)}>
            <DialogContent className="max-w-md">
              {currentStep === 1 && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <div className={`p-2 mr-2 rounded-full ${getColorForBillType(selectedBill.type)}`}>
                        {getIconForBillType(selectedBill.type)}
                      </div>
                      {selectedBill.provider}
                    </DialogTitle>
                    <DialogDescription>
                      Bill details for {selectedBill.accountNumber}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Bill Number</span>
                      <span className="font-medium">{selectedBill.billNumber}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Account Number</span>
                      <span className="font-medium">{selectedBill.accountNumber}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Due Date</span>
                      <span className="font-medium">{formatDate(selectedBill.dueDate)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Bill Amount</span>
                      <span className="font-medium">{formatCurrency(selectedBill.amount)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Status</span>
                      <Badge 
                        variant={selectedBill.status === "pending" ? "destructive" : "outline"}
                        className={selectedBill.status === "paid" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0" : ""}
                      >
                        {selectedBill.status === "pending" ? "Due" : "Paid"}
                      </Badge>
                    </div>
                  </div>

                  <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setSelectedBill(null)}
                    >
                      Close
                    </Button>
                    {selectedBill.status === "pending" && (
                      <Button 
                        className="flex-1"
                        onClick={handlePayNow}
                      >
                        Pay Now
                      </Button>
                    )}
                  </DialogFooter>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <DialogHeader>
                    <DialogTitle>Payment Details</DialogTitle>
                    <DialogDescription>
                      Complete your payment for {selectedBill.provider}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="flex justify-between py-2 bg-muted p-3 rounded-md">
                      <span className="text-muted-foreground">Amount to Pay</span>
                      <span className="font-medium">{formatCurrency(selectedBill.amount)}</span>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="payment-method">Payment Method</Label>
                        <Select defaultValue="upi">
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="upi">UPI</SelectItem>
                            <SelectItem value="card">Credit / Debit Card</SelectItem>
                            <SelectItem value="netbanking">Net Banking</SelectItem>
                            <SelectItem value="wallet">Wallet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="upi-id">UPI ID</Label>
                        <Input id="upi-id" placeholder="example@upi" />
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setCurrentStep(1)}
                    >
                      Back
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={handleConfirmPayment}
                    >
                      Proceed to Pay
                    </Button>
                  </DialogFooter>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-center">Payment Successful</DialogTitle>
                  </DialogHeader>

                  <div className="py-6 flex flex-col items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                      <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    
                    <p className="text-center mb-2">
                      Your payment of <span className="font-bold">{formatCurrency(selectedBill.amount)}</span> to <span className="font-bold">{selectedBill.provider}</span> has been completed successfully.
                    </p>
                    
                    <p className="text-sm text-muted-foreground text-center">
                      Transaction ID: MFPB{Math.floor(Math.random() * 10000000000)}
                    </p>
                  </div>

                  <DialogFooter>
                    <Button 
                      className="w-full"
                      onClick={() => setSelectedBill(null)}
                    >
                      Done
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={showPaymentConfirmation} onOpenChange={setShowPaymentConfirmation}>
          <DialogContent className="max-w-xs">
            <DialogHeader>
              <DialogTitle>Confirm Payment</DialogTitle>
              <DialogDescription>
                You are about to pay {formatCurrency(selectedBill?.amount || 0)} to {selectedBill?.provider}
              </DialogDescription>
            </DialogHeader>

            <div className="py-2">
              <p className="text-center text-sm text-muted-foreground mb-2">
                This will debit {formatCurrency(selectedBill?.amount || 0)} from your selected payment method.
              </p>
            </div>

            <DialogFooter className="flex flex-col gap-2">
              <Button 
                onClick={handleCompletePay}
              >
                Confirm & Pay
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowPaymentConfirmation(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <BottomNavigation />
    </div>
  );
}