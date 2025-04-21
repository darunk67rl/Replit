import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Heart, 
  Car, 
  Home, 
  Plane, 
  Plus,
  Calendar,
  User,
  Users
} from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function InsuranceSimple() {
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);

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

  // Mock insurance policies data
  const policies = [
    {
      id: 1,
      type: "health",
      name: "Family Health Guard",
      provider: "Max Bupa",
      coverAmount: 500000,
      premium: 12000,
      policyNumber: "HLT123456789",
      status: "active",
      startDate: "2023-01-15",
      endDate: "2024-01-14",
      members: [
        { name: "Rahul Sharma", relation: "Self", age: 32 },
        { name: "Priya Sharma", relation: "Spouse", age: 30 },
        { name: "Aarav Sharma", relation: "Son", age: 5 }
      ]
    },
    {
      id: 2,
      type: "car",
      name: "Comprehensive Car Insurance",
      provider: "ICICI Lombard",
      coverAmount: 350000,
      premium: 8500,
      policyNumber: "CAR987654321",
      status: "active",
      startDate: "2023-02-20",
      endDate: "2024-02-19",
      vehicleDetails: {
        make: "Maruti Suzuki",
        model: "Swift",
        year: 2020,
        registrationNumber: "MH02AB1234"
      }
    },
    {
      id: 3,
      type: "home",
      name: "Home Shield",
      provider: "HDFC ERGO",
      coverAmount: 2000000,
      premium: 5000,
      policyNumber: "HOM567891234",
      status: "active",
      startDate: "2023-03-10",
      endDate: "2024-03-09",
      propertyDetails: {
        type: "Apartment",
        address: "123, Harmony Heights, Powai, Mumbai",
        builtUpArea: "1200 sq ft"
      }
    }
  ];

  const insuranceTypes = [
    {
      type: "health",
      title: "Health Insurance",
      description: "Cover medical expenses for you and your family",
      icon: <Heart className="h-5 w-5" />,
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    },
    {
      type: "car",
      title: "Car Insurance",
      description: "Protect your vehicle against damage and theft",
      icon: <Car className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    },
    {
      type: "home",
      title: "Home Insurance",
      description: "Safeguard your home and belongings",
      icon: <Home className="h-5 w-5" />,
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
    },
    {
      type: "travel",
      title: "Travel Insurance",
      description: "Stay protected during your travels",
      icon: <Plane className="h-5 w-5" />,
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    }
  ];

  const handleViewPolicy = (policy: any) => {
    setSelectedPolicy(policy);
    setShowDetails(true);
  };

  const handleGetInsurance = (type: string) => {
    toast({
      title: "Coming Soon",
      description: `${insuranceTypes.find(t => t.type === type)?.title || 'Insurance'} application will be available soon.`,
    });
  };

  const handleClaimInsurance = () => {
    toast({
      title: "Claim Process Initiated",
      description: "Our team will contact you shortly to assist with your claim.",
    });
  };

  const getIconForPolicyType = (type: string) => {
    switch (type) {
      case "health":
        return <Heart className="h-5 w-5" />;
      case "car":
        return <Car className="h-5 w-5" />;
      case "home":
        return <Home className="h-5 w-5" />;
      case "travel":
        return <Plane className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };
  
  const getPolicyStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "expired":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 container max-w-md mx-auto px-4 pb-20 pt-16">
        <h1 className="text-2xl font-bold mb-6">Insurance</h1>

        <Tabs defaultValue="myPolicies" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="myPolicies">My Policies</TabsTrigger>
            <TabsTrigger value="getInsurance">Get Insurance</TabsTrigger>
          </TabsList>

          <TabsContent value="myPolicies" className="mt-4">
            <div className="space-y-4">
              {policies.length > 0 ? (
                policies.map((policy) => (
                  <Card 
                    key={policy.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleViewPolicy(policy)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          policy.type === "health" ? "bg-red-100 dark:bg-red-900/30" :
                          policy.type === "car" ? "bg-blue-100 dark:bg-blue-900/30" :
                          policy.type === "home" ? "bg-amber-100 dark:bg-amber-900/30" :
                          "bg-green-100 dark:bg-green-900/30"
                        }`}>
                          {getIconForPolicyType(policy.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{policy.name}</h3>
                              <p className="text-xs text-muted-foreground">{policy.provider}</p>
                            </div>
                            <Badge className={getPolicyStatusColor(policy.status)}>
                              {policy.status === "active" ? "Active" : 
                               policy.status === "expired" ? "Expired" : 
                               policy.status === "pending" ? "Pending" : policy.status}
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm">
                              <span className="text-muted-foreground">Cover: </span>
                              <span className="font-medium">{formatCurrency(policy.coverAmount)}</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Valid till: {formatDate(policy.endDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <Shield className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="font-medium mb-1">No Active Policies</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You don't have any insurance policies yet
                  </p>
                </div>
              )}
            </div>

            {policies.length > 0 && (
              <Dialog open={showDetails} onOpenChange={setShowDetails}>
                {selectedPolicy && (
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <div className={`p-2 mr-2 rounded-full ${
                          selectedPolicy.type === "health" ? "bg-red-100 dark:bg-red-900/30" :
                          selectedPolicy.type === "car" ? "bg-blue-100 dark:bg-blue-900/30" :
                          selectedPolicy.type === "home" ? "bg-amber-100 dark:bg-amber-900/30" :
                          "bg-green-100 dark:bg-green-900/30"
                        }`}>
                          {getIconForPolicyType(selectedPolicy.type)}
                        </div>
                        {selectedPolicy.name}
                      </DialogTitle>
                      <DialogDescription>
                        {insuranceTypes.find(t => t.type === selectedPolicy.type)?.description}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Provider</span>
                        <span className="font-medium">{selectedPolicy.provider}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Policy Number</span>
                        <span className="font-medium">{selectedPolicy.policyNumber}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Cover Amount</span>
                        <span className="font-medium">{formatCurrency(selectedPolicy.coverAmount)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Annual Premium</span>
                        <span className="font-medium">{formatCurrency(selectedPolicy.premium)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Valid From</span>
                        <span className="font-medium">{formatDate(selectedPolicy.startDate)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Valid Till</span>
                        <span className="font-medium">{formatDate(selectedPolicy.endDate)}</span>
                      </div>

                      {/* Health Insurance specific fields */}
                      {selectedPolicy.type === "health" && selectedPolicy.members && (
                        <div className="py-2">
                          <h4 className="font-medium mb-2">Insured Members</h4>
                          <div className="space-y-2">
                            {selectedPolicy.members.map((member: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm font-medium">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">{member.relation}</p>
                                  </div>
                                </div>
                                <Badge variant="outline">{member.age} yrs</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Car Insurance specific fields */}
                      {selectedPolicy.type === "car" && selectedPolicy.vehicleDetails && (
                        <div className="py-2">
                          <h4 className="font-medium mb-2">Vehicle Details</h4>
                          <div className="p-2 bg-muted rounded-md">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-muted-foreground">Make & Model</p>
                                <p className="font-medium">{selectedPolicy.vehicleDetails.make} {selectedPolicy.vehicleDetails.model}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Year</p>
                                <p className="font-medium">{selectedPolicy.vehicleDetails.year}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-muted-foreground">Registration Number</p>
                                <p className="font-medium">{selectedPolicy.vehicleDetails.registrationNumber}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Home Insurance specific fields */}
                      {selectedPolicy.type === "home" && selectedPolicy.propertyDetails && (
                        <div className="py-2">
                          <h4 className="font-medium mb-2">Property Details</h4>
                          <div className="p-2 bg-muted rounded-md">
                            <div className="space-y-2 text-sm">
                              <div>
                                <p className="text-muted-foreground">Type</p>
                                <p className="font-medium">{selectedPolicy.propertyDetails.type}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Address</p>
                                <p className="font-medium">{selectedPolicy.propertyDetails.address}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Built-up Area</p>
                                <p className="font-medium">{selectedPolicy.propertyDetails.builtUpArea}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setShowDetails(false)}
                      >
                        Close
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={handleClaimInsurance}
                      >
                        File a Claim
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>
            )}
          </TabsContent>

          <TabsContent value="getInsurance" className="mt-4">
            <div className="space-y-4">
              {insuranceTypes.map((insurance) => (
                <Card 
                  key={insurance.type} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleGetInsurance(insurance.type)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-full ${insurance.color.split(' ').slice(0, 2).join(' ')}`}>
                        {insurance.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{insurance.title}</h3>
                        <p className="text-xs text-muted-foreground">{insurance.description}</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Plus className="h-5 w-5" />
                      </Button>
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