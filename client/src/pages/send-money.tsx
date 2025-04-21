import React, { useState, useEffect } from "react";
// Auth import removed temporarily
import { useLocation } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, ArrowRight, Search, Users, Phone, QrCode, CreditCard, Check } from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
// Import mock Stripe implementation instead of real Stripe
// Replace with real Stripe when API keys are available
import { loadMockStripe, MockPaymentElement } from "@/lib/stripe-mock";

// Initialize mock Stripe
const stripePromise = loadMockStripe();

// Contact interfaces
interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  upiId?: string;
  avatar?: string;
  recentTransfer?: boolean;
}

// Recent contacts data
const recentContacts: Contact[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    phoneNumber: "+91 9876543210",
    upiId: "rahul@okbank",
    avatar: "",
    recentTransfer: true,
  },
  {
    id: "2",
    name: "Priya Patel",
    phoneNumber: "+91 9876543211",
    upiId: "priya@yesbank",
    avatar: "",
    recentTransfer: true,
  },
  {
    id: "3",
    name: "Amit Kumar",
    phoneNumber: "+91 9876543212",
    upiId: "amit@idfcbank",
    avatar: "",
    recentTransfer: true,
  },
  {
    id: "4",
    name: "Neha Singh",
    phoneNumber: "+91 9876543213",
    upiId: "neha@okbank",
    avatar: "",
    recentTransfer: true,
  },
  {
    id: "5",
    name: "Vikram Joshi",
    phoneNumber: "+91 9876543214",
    upiId: "vikram@yesbank",
    avatar: "",
    recentTransfer: false,
  },
];

// All contacts data
const allContacts: Contact[] = [
  ...recentContacts,
  {
    id: "6",
    name: "Anjali Desai",
    phoneNumber: "+91 9876543215",
    upiId: "anjali@okbank",
    avatar: "",
    recentTransfer: false,
  },
  {
    id: "7",
    name: "Raj Malhotra",
    phoneNumber: "+91 9876543216",
    upiId: "raj@hdfc",
    avatar: "",
    recentTransfer: false,
  },
  {
    id: "8",
    name: "Meera Kapoor",
    phoneNumber: "+91 9876543217",
    upiId: "meera@sbi",
    avatar: "",
    recentTransfer: false,
  },
];

// Payment form component using mock Stripe
function PaymentForm({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      // 80% chance of success
      const isSuccess = Math.random() > 0.2;
      
      if (isSuccess) {
        toast({
          title: "Payment Success",
          description: "Your payment was processed successfully.",
        });
        onSuccess();
      } else {
        toast({
          title: "Payment Failed",
          description: "Your card was declined. Please try another payment method.",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mock-stripe-element p-4 border rounded-md bg-white dark:bg-gray-900 shadow-sm">
        <div className="mb-2">
          <label className="text-sm font-medium">Card Number</label>
          <div className="h-10 p-2 mt-1 border rounded-md bg-gray-50 dark:bg-gray-800 flex items-center">
            <span className="text-gray-500">4242 4242 4242 4242</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-sm font-medium">Expiry</label>
            <div className="h-10 p-2 mt-1 border rounded-md bg-gray-50 dark:bg-gray-800 flex items-center">
              <span className="text-gray-500">12/30</span>
            </div>
          </div>
          <div className="w-24">
            <label className="text-sm font-medium">CVC</label>
            <div className="h-10 p-2 mt-1 border rounded-md bg-gray-50 dark:bg-gray-800 flex items-center">
              <span className="text-gray-500">123</span>
            </div>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <span>🔒</span>
            <span>Your payment information is secure</span>
          </div>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Processing..." : `Pay ₹${amount.toFixed(2)}`}
      </Button>
    </form>
  );
}

// Main send money component
export default function SendMoney() {
  // Temporarily removed auth dependency
  const user = null; // Mock user until auth is fixed
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [clientSecret, setClientSecret] = useState("");

  // Filter contacts based on search term
  const filteredContacts = allContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phoneNumber.includes(searchTerm) ||
      (contact.upiId && contact.upiId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Initialize payment intent when amount and contact are selected
  useEffect(() => {
    if (currentStep === 3 && selectedContact && parseFloat(amount) > 0) {
      const createPaymentIntent = async () => {
        try {
          const response = await apiRequest("POST", "/api/create-payment-intent", {
            amount: parseFloat(amount),
            recipient: selectedContact.id,
          });
          
          const data = await response.json();
          setClientSecret(data.clientSecret);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to initialize payment. Please try again.",
            variant: "destructive",
          });
        }
      };

      createPaymentIntent();
    }
  }, [currentStep, selectedContact, amount, toast]);

  // Handle contact selection
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setCurrentStep(2);
  };

  // Handle amount submission
  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(3);
  };

  // Handle transaction completion
  const handleTransactionComplete = () => {
    toast({
      title: "Money Sent Successfully",
      description: `₹${amount} has been sent to ${selectedContact?.name}.`,
    });
    setCurrentStep(4);
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Render step 1 - Contact selection
  const renderContactSelection = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Send Money</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, phone or UPI ID"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="recent">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="banks">Bank/UPI</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="p-4 space-y-4">
              {filteredContacts
                .filter((contact) => contact.recentTransfer)
                .map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => handleSelectContact(contact)}
                  >
                    <div className="flex items-center">
                      <Avatar>
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.phoneNumber}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="contacts" className="p-4 space-y-4">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => handleSelectContact(contact)}
                >
                  <div className="flex items-center">
                    <Avatar>
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.phoneNumber}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="banks" className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center justify-center"
                  onClick={() => {
                    toast({
                      description: "UPI payment feature coming soon",
                    });
                  }}
                >
                  <QrCode className="h-6 w-6 mb-2" />
                  <span>Scan QR Code</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center justify-center"
                  onClick={() => {
                    toast({
                      description: "UPI payment feature coming soon",
                    });
                  }}
                >
                  <Phone className="h-6 w-6 mb-2" />
                  <span>UPI ID / Number</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center justify-center"
                  onClick={() => {
                    toast({
                      description: "Bank account feature coming soon",
                    });
                  }}
                >
                  <CreditCard className="h-6 w-6 mb-2" />
                  <span>Bank Account</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center justify-center"
                  onClick={() => {
                    toast({
                      description: "Self transfer feature coming soon",
                    });
                  }}
                >
                  <Users className="h-6 w-6 mb-2" />
                  <span>Self Account</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };

  // Render step 2 - Amount entry
  const renderAmountEntry = () => {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentStep(1)}
              className="mr-2 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Enter Amount</CardTitle>
          </div>
          <div className="flex items-center mt-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={selectedContact?.avatar} />
              <AvatarFallback>{getInitials(selectedContact?.name || "")}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="font-medium">{selectedContact?.name}</p>
              <p className="text-sm text-muted-foreground">{selectedContact?.upiId}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAmountSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-500">₹</div>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-7 text-xl"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Add a note (optional)</Label>
              <Input
                id="note"
                placeholder="What's this for?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              Continue to Pay
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  // Render step 3 - Payment
  const renderPayment = () => {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentStep(2)}
              className="mr-2 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Complete Payment</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Recipient</span>
              <span>{selectedContact?.name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Amount</span>
              <span>₹{parseFloat(amount).toFixed(2)}</span>
            </div>
            {note && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Note</span>
                <span>{note}</span>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          <PaymentForm
            amount={parseFloat(amount)}
            onSuccess={handleTransactionComplete}
          />
        </CardContent>
      </Card>
    );
  };

  // Render step 4 - Success
  const renderSuccess = () => {
    return (
      <Card className="text-center">
        <CardContent className="p-6 pt-8">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-6">
            You have successfully sent ₹{parseFloat(amount).toFixed(2)} to {selectedContact?.name}
          </p>

          <div className="bg-muted p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Transaction ID</span>
              <span>TXN{Math.random().toString().substring(2, 10)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Date & Time</span>
              <span>{new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span>Card payment</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full" onClick={() => navigate("/")}>
              Back to Home
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setCurrentStep(1)}>
              Send Money Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 container max-w-md mx-auto px-4 pb-20 pt-16">
        {currentStep === 1 && renderContactSelection()}
        {currentStep === 2 && renderAmountEntry()}
        {currentStep === 3 && renderPayment()}
        {currentStep === 4 && renderSuccess()}
      </main>

      <BottomNavigation />
    </div>
  );
}