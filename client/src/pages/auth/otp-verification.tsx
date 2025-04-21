import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OtpVerification() {
  const { verifyOtp, isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countdown, setCountdown] = useState(30);

  // If user is already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Get phone number from local storage or session storage
  useEffect(() => {
    // In a real app, we'd store this securely or pass via state management
    const savedPhone = sessionStorage.getItem("verificationPhoneNumber");
    if (savedPhone) {
      setPhoneNumber(savedPhone);
    } else {
      // If no phone number is found, redirect back to login
      toast({
        title: "Missing Information",
        description: "Please start the login process again",
        variant: "destructive",
      });
      navigate("/auth/login");
    }
  }, [navigate, toast]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown]);

  // Handle OTP verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    try {
      await verifyOtp(phoneNumber, otp);
      // Success handling is done in the auth context
    } catch (error) {
      // Error handling is done in the auth context
    }
  };

  // Handle resend OTP
  const handleResendOtp = () => {
    // In a real app, we'd call the requestOtp function again
    toast({
      title: "OTP Resent",
      description: "A new OTP has been sent to your phone",
    });
    setCountdown(30);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Verify Phone Number</CardTitle>
          <CardDescription>
            Enter the 6-digit OTP sent to {phoneNumber ? phoneNumber : "your phone"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                className="text-center text-lg tracking-widest"
                maxLength={6}
                inputMode="numeric"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Verify OTP
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            Didn't receive the OTP?
          </div>
          <Button
            variant="outline"
            type="button"
            className="w-full"
            disabled={countdown > 0}
            onClick={handleResendOtp}
          >
            {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
          </Button>
          <Button
            variant="link"
            type="button"
            className="w-full"
            onClick={() => navigate("/auth/login")}
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}