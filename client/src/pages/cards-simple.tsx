import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Wallet, 
  Eye, 
  EyeOff, 
  Lock, 
  Settings, 
  FileText,
  Clock,
  ShoppingCart,
  Coffee,
  Plane,
  Smartphone,
  PlusCircle
} from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function CardsSimple() {
  const { toast } = useToast();
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showCardSettingsDialog, setShowCardSettingsDialog] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (month: number, year: number) => {
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  };

  // Mock cards data
  const cards = [
    {
      id: 1,
      type: "Credit Card",
      bank: "HDFC Bank",
      name: "Regalia Credit Card",
      number: "5412 7534 2541 7852",
      network: "Mastercard",
      holder: "Rahul Sharma",
      expiryMonth: 12,
      expiryYear: 2025,
      cvv: "123",
      color: "bg-gradient-to-r from-blue-500 to-blue-700",
      limit: 200000,
      availableLimit: 150000,
      dueDate: "2023-05-15",
      dueAmount: 15000,
      lockStatus: false,
      contactlessPayment: true,
      onlineTransactions: true,
      internationalTransactions: false
    },
    {
      id: 2,
      type: "Debit Card",
      bank: "SBI",
      name: "Classic Debit Card",
      number: "4532 1458 2369 7851",
      network: "Visa",
      holder: "Rahul Sharma",
      expiryMonth: 4,
      expiryYear: 2024,
      cvv: "456",
      color: "bg-gradient-to-r from-green-500 to-green-700",
      balance: 45000,
      lockStatus: false,
      contactlessPayment: true,
      onlineTransactions: true,
      internationalTransactions: false
    }
  ];

  // Mock transactions data
  const transactions = [
    {
      id: 1,
      cardId: 1,
      merchant: "Amazon",
      amount: 3499,
      date: "2023-04-15T14:30:00",
      category: "Shopping",
      icon: <ShoppingCart className="h-4 w-4" />,
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    },
    {
      id: 2,
      cardId: 1,
      merchant: "Starbucks",
      amount: 450,
      date: "2023-04-14T10:15:00",
      category: "Food & Drinks",
      icon: <Coffee className="h-4 w-4" />,
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
    },
    {
      id: 3,
      cardId: 1,
      merchant: "MakeMyTrip",
      amount: 12500,
      date: "2023-04-12T16:45:00",
      category: "Travel",
      icon: <Plane className="h-4 w-4" />,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    },
    {
      id: 4,
      cardId: 2,
      merchant: "Jio Recharge",
      amount: 999,
      date: "2023-04-13T09:20:00",
      category: "Utilities",
      icon: <Smartphone className="h-4 w-4" />,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
    },
    {
      id: 5,
      cardId: 2,
      merchant: "Flipkart",
      amount: 2999,
      date: "2023-04-10T12:30:00",
      category: "Shopping",
      icon: <ShoppingCart className="h-4 w-4" />,
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    }
  ];

  const handleCardClick = (card: any) => {
    setSelectedCard(card);
  };

  const handleApplyNewCard = () => {
    toast({
      title: "Coming Soon",
      description: "Card application feature will be available soon.",
    });
  };

  const handleLockCard = (card: any, locked: boolean) => {
    toast({
      title: locked ? "Card Locked" : "Card Unlocked",
      description: `Your ${card.name} has been ${locked ? 'locked' : 'unlocked'} successfully.`,
    });
  };

  const handleToggleFeature = (feature: string, enabled: boolean) => {
    toast({
      title: `${feature} ${enabled ? 'Enabled' : 'Disabled'}`,
      description: `${feature} has been ${enabled ? 'enabled' : 'disabled'} for this card.`,
    });
  };

  const getCardTransactions = (cardId: number) => {
    return transactions.filter(transaction => transaction.cardId === cardId);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 container max-w-md mx-auto px-4 pb-20 pt-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Cards</h1>
          <Button variant="outline" size="sm" onClick={handleApplyNewCard}>
            <PlusCircle className="h-4 w-4 mr-1" />
            New Card
          </Button>
        </div>

        {/* Cards Carousel */}
        <div className="space-y-4 mb-6">
          {cards.map((card) => (
            <div 
              key={card.id}
              className="relative"
              onClick={() => handleCardClick(card)}
            >
              <Card 
                className={`overflow-hidden cursor-pointer ${card.color} text-white`}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <p className="text-sm font-medium opacity-80">{card.bank}</p>
                      <h3 className="font-bold">{card.name}</h3>
                    </div>
                    <div className="text-white/80">
                      <CreditCard className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-medium opacity-80 mb-1">Card Number</p>
                    <p className="text-lg font-mono tracking-wider">
                      {showCardDetails ? card.number : `${card.number.substring(0, 4)} •••• •••• ${card.number.substring(15)}`}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm opacity-80">Card Holder</p>
                      <p className="font-medium">{card.holder}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Expires</p>
                      <p className="font-medium">{formatDate(card.expiryMonth, card.expiryYear)}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-base font-bold uppercase">{card.network}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card Quick Actions */}
              <div className="flex bg-white dark:bg-gray-800 rounded-b-lg shadow-sm p-2 text-sm border border-t-0">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCardDetails(!showCardDetails);
                  }}
                >
                  {showCardDetails ? (
                    <EyeOff className="h-4 w-4 mr-1" />
                  ) : (
                    <Eye className="h-4 w-4 mr-1" />
                  )}
                  {showCardDetails ? "Hide" : "Show"}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLockCard(card, !card.lockStatus);
                  }}
                >
                  <Lock className="h-4 w-4 mr-1" />
                  {card.lockStatus ? "Unlock" : "Lock"}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCard(card);
                    setShowCardSettingsDialog(true);
                  }}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Card Details */}
        {selectedCard && (
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Wallet className="h-5 w-5 mr-2 text-primary" />
                Card Details
              </CardTitle>
              <CardDescription>
                {selectedCard.type} - {selectedCard.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedCard.type === "Credit Card" && (
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Credit Limit</span>
                      <span className="font-medium">{formatCurrency(selectedCard.limit)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Available Limit</span>
                      <span className="font-medium">{formatCurrency(selectedCard.availableLimit)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Due Amount</span>
                      <span className="font-medium">{formatCurrency(selectedCard.dueAmount)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Due Date</span>
                      <span className="font-medium">{new Date(selectedCard.dueDate).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                )}

                {selectedCard.type === "Debit Card" && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Available Balance</span>
                    <span className="font-medium">{formatCurrency(selectedCard.balance)}</span>
                  </div>
                )}

                <div className="pt-2">
                  <Button variant="outline" className="w-full" onClick={() => setShowCardSettingsDialog(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Card Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions */}
        {selectedCard && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Recent Transactions
              </CardTitle>
              <CardDescription>
                Latest transactions made with this card
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getCardTransactions(selectedCard.id).length > 0 ? (
                  getCardTransactions(selectedCard.id).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-3 ${transaction.color.split(' ').slice(0, 2).join(' ')}`}>
                          {transaction.icon}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.merchant}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <div className="font-medium">
                        -{formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No recent transactions</p>
                  </div>
                )}

                {getCardTransactions(selectedCard.id).length > 0 && (
                  <div className="pt-2">
                    <Button variant="outline" className="w-full">
                      View All Transactions
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Card Settings Dialog */}
        <Dialog open={showCardSettingsDialog} onOpenChange={setShowCardSettingsDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Card Settings</DialogTitle>
              <DialogDescription>
                Manage security and transaction settings for your card
              </DialogDescription>
            </DialogHeader>

            {selectedCard && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Card Status</h3>
                    <Badge 
                      variant={selectedCard.lockStatus ? "destructive" : "default"} 
                      className={selectedCard.lockStatus ? "" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0"}
                    >
                      {selectedCard.lockStatus ? "Locked" : "Active"}
                    </Badge>
                  </div>
                  <Button 
                    variant={selectedCard.lockStatus ? "default" : "destructive"} 
                    className="w-full"
                    onClick={() => handleLockCard(selectedCard, !selectedCard.lockStatus)}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    {selectedCard.lockStatus ? "Unlock Card" : "Lock Card"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedCard.lockStatus 
                      ? "Unlocking will enable all transactions on this card." 
                      : "Temporarily lock your card to prevent unauthorized transactions."}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Transaction Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="contactless">Contactless Payments</Label>
                        <p className="text-xs text-muted-foreground">
                          Enable or disable tap-to-pay functionality
                        </p>
                      </div>
                      <Switch
                        id="contactless"
                        checked={selectedCard.contactlessPayment}
                        onCheckedChange={(checked) => 
                          handleToggleFeature("Contactless payments", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="online">Online Transactions</Label>
                        <p className="text-xs text-muted-foreground">
                          Allow card to be used for online purchases
                        </p>
                      </div>
                      <Switch
                        id="online"
                        checked={selectedCard.onlineTransactions}
                        onCheckedChange={(checked) => 
                          handleToggleFeature("Online transactions", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="international">International Transactions</Label>
                        <p className="text-xs text-muted-foreground">
                          Allow card to be used internationally
                        </p>
                      </div>
                      <Switch
                        id="international"
                        checked={selectedCard.internationalTransactions}
                        onCheckedChange={(checked) => 
                          handleToggleFeature("International transactions", checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button 
                onClick={() => setShowCardSettingsDialog(false)}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <BottomNavigation />
    </div>
  );
}