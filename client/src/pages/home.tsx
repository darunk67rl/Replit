import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, Send, Briefcase, CreditCard, LogOut, Settings, User } from "lucide-react";

export default function Home() {
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">MoneyFlow</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        {/* User Welcome Card */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle>Welcome, {user?.name || "User"}!</CardTitle>
            <CardDescription>
              Your account is set up and ready to use.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Username:</span>
                <span className="font-medium">{user?.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{user?.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">UPI ID:</span>
                <span className="font-medium">{user?.upiId || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">KYC Status:</span>
                <span className={`font-medium ${user?.isKycVerified ? "text-green-500" : "text-amber-500"}`}>
                  {user?.isKycVerified ? "Verified" : "Pending"}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleLogout} variant="outline" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </CardFooter>
        </Card>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="hover:bg-accent hover:cursor-pointer transition-colors">
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium flex items-center">
                <Send className="mr-2 h-4 w-4 text-primary" />
                Send Money
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="hover:bg-accent hover:cursor-pointer transition-colors">
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium flex items-center">
                <CreditCard className="mr-2 h-4 w-4 text-primary" />
                Pay Bills
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="hover:bg-accent hover:cursor-pointer transition-colors">
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium flex items-center">
                <Briefcase className="mr-2 h-4 w-4 text-primary" />
                Investments
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="hover:bg-accent hover:cursor-pointer transition-colors">
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium flex items-center">
                <User className="mr-2 h-4 w-4 text-primary" />
                My Profile
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-3 flex justify-around">
        <Button variant="ghost" size="icon" className="flex flex-col items-center">
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Button>
        <Button variant="ghost" size="icon" className="flex flex-col items-center">
          <Send className="h-5 w-5" />
          <span className="text-xs mt-1">Send</span>
        </Button>
        <Button variant="ghost" size="icon" className="flex flex-col items-center">
          <Briefcase className="h-5 w-5" />
          <span className="text-xs mt-1">Invest</span>
        </Button>
        <Button variant="ghost" size="icon" className="flex flex-col items-center">
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Button>
      </div>
    </div>
  );
}