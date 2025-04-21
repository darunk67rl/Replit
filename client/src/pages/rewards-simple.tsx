import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gift, 
  ShoppingBag, 
  Utensils, 
  Plane, 
  CreditCard, 
  Clock,
  ChevronRight,
  Star,
  Copy,
  CheckCircle2,
  Search
} from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function RewardsSimple() {
  const { toast } = useToast();
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [showRewardDetails, setShowRewardDetails] = useState(false);
  const [couponCopied, setCouponCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for rewards points
  const userPoints = 3250;
  const pointsHistory = [
    {
      id: 1,
      description: "Shopping at Amazon",
      points: 150,
      date: "2023-04-15",
      isCredit: true
    },
    {
      id: 2,
      description: "Bill payment - Electricity",
      points: 50,
      date: "2023-04-10",
      isCredit: true
    },
    {
      id: 3,
      description: "Redeemed for Amazon voucher",
      points: 500,
      date: "2023-04-02",
      isCredit: false
    },
    {
      id: 4,
      description: "Shopping at Flipkart",
      points: 120,
      date: "2023-03-28",
      isCredit: true
    }
  ];

  // Mock data for available rewards
  const rewards = [
    {
      id: 1,
      title: "₹500 Amazon Gift Card",
      description: "Redeem your points for Amazon shopping",
      pointsRequired: 1000,
      category: "shopping",
      expiry: "2023-06-30",
      image: <ShoppingBag className="h-10 w-10" />,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      couponCode: "AMAZON500",
      terms: [
        "Valid for 3 months from date of issue",
        "Applicable on all products on Amazon",
        "Cannot be clubbed with other offers",
        "Non-transferable and non-refundable"
      ]
    },
    {
      id: 2,
      title: "₹300 off on Zomato",
      description: "Discount on your food delivery orders",
      pointsRequired: 600,
      category: "food",
      expiry: "2023-06-15",
      image: <Utensils className="h-10 w-10" />,
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      couponCode: "ZOMATO300",
      terms: [
        "Valid on minimum order of ₹500",
        "Valid for 1 month from date of issue",
        "Applicable once per user",
        "Not valid on Zomato Gourmet"
      ]
    },
    {
      id: 3,
      title: "10% off on Domestic Flights",
      description: "Discount on MakeMyTrip flight bookings",
      pointsRequired: 1500,
      category: "travel",
      expiry: "2023-07-31",
      image: <Plane className="h-10 w-10" />,
      color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
      couponCode: "MMTFLY10",
      terms: [
        "Valid on domestic flight bookings only",
        "Maximum discount up to ₹1000",
        "Valid for 3 months from date of issue",
        "Not valid on international flights"
      ]
    },
    {
      id: 4,
      title: "Cashback on Credit Card Bill Payment",
      description: "5% cashback on your credit card payments",
      pointsRequired: 2000,
      category: "cashback",
      expiry: "2023-06-30",
      image: <CreditCard className="h-10 w-10" />,
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      couponCode: "CASHBACK5",
      terms: [
        "Valid on credit card payments above ₹5000",
        "Maximum cashback of ₹500",
        "Cashback will be credited within 7 working days",
        "Valid for one-time use only"
      ]
    }
  ];

  // Filter rewards based on search query
  const filteredRewards = rewards.filter(reward => 
    reward.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reward.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reward.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewReward = (reward: any) => {
    setSelectedReward(reward);
    setShowRewardDetails(true);
    setCouponCopied(false);
  };

  const handleRedeemReward = () => {
    if (userPoints >= selectedReward.pointsRequired) {
      toast({
        title: "Reward Redeemed",
        description: `You have successfully redeemed ${selectedReward.title}. Check your email for details.`,
      });
      setShowRewardDetails(false);
    } else {
      toast({
        title: "Insufficient Points",
        description: `You need ${selectedReward.pointsRequired - userPoints} more points to redeem this reward.`,
        variant: "destructive"
      });
    }
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(selectedReward.couponCode);
    setCouponCopied(true);
    toast({
      title: "Coupon Copied",
      description: "Coupon code has been copied to clipboard.",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "shopping":
        return <ShoppingBag className="h-4 w-4" />;
      case "food":
        return <Utensils className="h-4 w-4" />;
      case "travel":
        return <Plane className="h-4 w-4" />;
      case "cashback":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <Gift className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 container max-w-md mx-auto px-4 pb-20 pt-16">
        <h1 className="text-2xl font-bold mb-6">Rewards & Offers</h1>

        {/* Points Summary */}
        <Card className="mb-6 overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold mb-1">Your Reward Points</h2>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{userPoints}</span>
                    <span className="text-white/80 ml-2 text-sm">points</span>
                  </div>
                </div>
                <div className="p-2 bg-white/20 rounded-full">
                  <Star className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Next Tier: Gold</span>
                  <span>5,000 points</span>
                </div>
                <Progress value={userPoints / 50} className="h-2 bg-white/30" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and filter */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rewards by title or category..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Rewards Tabs */}
        <Tabs defaultValue="all" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="shopping">Shopping</TabsTrigger>
            <TabsTrigger value="food">Food</TabsTrigger>
            <TabsTrigger value="travel">Travel</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="space-y-4">
              {filteredRewards.length > 0 ? (
                filteredRewards.map((reward) => (
                  <Card 
                    key={reward.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleViewReward(reward)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-3 rounded-full ${reward.color.split(' ').slice(0, 2).join(' ')}`}>
                          {reward.image}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{reward.title}</h3>
                              <p className="text-xs text-muted-foreground">{reward.description}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <Badge variant="outline" className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-current" />
                              <span>{reward.pointsRequired} points</span>
                            </Badge>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Expires: {new Date(reward.expiry).toLocaleDateString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <Gift className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="font-medium mb-1">No Rewards Found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    No rewards match your search criteria
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="shopping" className="mt-4">
            <div className="space-y-4">
              {filteredRewards
                .filter(reward => reward.category === "shopping")
                .map((reward) => (
                  <Card 
                    key={reward.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleViewReward(reward)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-3 rounded-full ${reward.color.split(' ').slice(0, 2).join(' ')}`}>
                          {reward.image}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{reward.title}</h3>
                              <p className="text-xs text-muted-foreground">{reward.description}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <Badge variant="outline" className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-current" />
                              <span>{reward.pointsRequired} points</span>
                            </Badge>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Expires: {new Date(reward.expiry).toLocaleDateString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="food" className="mt-4">
            <div className="space-y-4">
              {filteredRewards
                .filter(reward => reward.category === "food")
                .map((reward) => (
                  <Card 
                    key={reward.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleViewReward(reward)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-3 rounded-full ${reward.color.split(' ').slice(0, 2).join(' ')}`}>
                          {reward.image}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{reward.title}</h3>
                              <p className="text-xs text-muted-foreground">{reward.description}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <Badge variant="outline" className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-current" />
                              <span>{reward.pointsRequired} points</span>
                            </Badge>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Expires: {new Date(reward.expiry).toLocaleDateString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="travel" className="mt-4">
            <div className="space-y-4">
              {filteredRewards
                .filter(reward => reward.category === "travel")
                .map((reward) => (
                  <Card 
                    key={reward.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleViewReward(reward)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-3 rounded-full ${reward.color.split(' ').slice(0, 2).join(' ')}`}>
                          {reward.image}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{reward.title}</h3>
                              <p className="text-xs text-muted-foreground">{reward.description}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <Badge variant="outline" className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-current" />
                              <span>{reward.pointsRequired} points</span>
                            </Badge>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Expires: {new Date(reward.expiry).toLocaleDateString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Points History */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Points History
            </CardTitle>
            <CardDescription>
              Your recent points activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pointsHistory.map((history) => (
                <div key={history.id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium text-sm">{history.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(history.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className={`font-medium ${history.isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {history.isCredit ? '+' : '-'}{history.points}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" className="w-full">
              View All History
            </Button>
          </CardFooter>
        </Card>

        {/* Reward Details Dialog */}
        <Dialog open={showRewardDetails} onOpenChange={setShowRewardDetails}>
          <DialogContent className="max-w-md">
            {selectedReward && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <div className={`p-2 mr-2 rounded-full ${selectedReward.color.split(' ').slice(0, 2).join(' ')}`}>
                      {getCategoryIcon(selectedReward.category)}
                    </div>
                    {selectedReward.title}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedReward.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="p-3 rounded-md bg-muted flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2 text-primary" />
                      <span>Required Points:</span>
                    </div>
                    <span className="font-bold">{selectedReward.pointsRequired}</span>
                  </div>

                  <div className="p-3 rounded-md bg-muted flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <span>Expiry Date:</span>
                    </div>
                    <span className="font-medium">{new Date(selectedReward.expiry).toLocaleDateString('en-IN')}</span>
                  </div>

                  {selectedReward.couponCode && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Coupon Code:</p>
                      <div className="flex">
                        <code className="flex-1 p-2 bg-muted rounded-l-md font-mono border-r-0 border">
                          {selectedReward.couponCode}
                        </code>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-l-none"
                          onClick={handleCopyCoupon}
                        >
                          {couponCopied ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Terms & Conditions:</p>
                    <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                      {selectedReward.terms.map((term, index) => (
                        <li key={index}>{term}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowRewardDetails(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={handleRedeemReward}
                    disabled={userPoints < selectedReward.pointsRequired}
                  >
                    Redeem Now
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>

      <BottomNavigation />
    </div>
  );
}