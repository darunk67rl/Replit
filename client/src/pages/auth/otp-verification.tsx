import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2, ArrowLeft } from "lucide-react";

export default function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(30);
  const { verifyOtp, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if phone number is stored
    const phoneNumber = localStorage.getItem("finall-phone");
    if (!phoneNumber) {
      setLocation("/auth/login");
    }
  }, [setLocation]);

  useEffect(() => {
    // Countdown timer for resend OTP
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    
    setError("");
    try {
      // Get the phone number from localStorage
      const phoneNumber = localStorage.getItem("finall-phone") || "";
      if (!phoneNumber) {
        setError("Phone number not found. Please go back to login.");
        return;
      }
      
      await verifyOtp(phoneNumber, otp);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP. Please try again.");
    }
  };

  const handleResendOtp = () => {
    setCountdown(30);
    setError("");
    // In a real app, this would make an API call to resend OTP
  };

  const goBack = () => {
    setLocation("/auth/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex items-center">
            <Button
              onClick={goBack}
              variant="ghost"
              size="icon"
              className="mr-2 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl font-bold">Verify OTP</CardTitle>
          </div>
          <CardDescription>
            We've sent a verification code to {localStorage.getItem("finall-phone") || "your phone"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, i) => (
                    <InputOTPSlot key={i} {...slot} index={i} />
                  ))}
                </InputOTPGroup>
              )}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Resend OTP in {countdown} seconds
              </p>
            ) : (
              <Button
                variant="link"
                onClick={handleResendOtp}
                className="p-0 h-auto text-primary"
              >
                Resend OTP
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleVerify}
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying
              </>
            ) : (
              "Verify & Continue"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
