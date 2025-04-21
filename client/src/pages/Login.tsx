import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

const loginFormSchema = z.object({
  phone: z
    .string()
    .min(10, {
      message: "Phone number must be at least 10 digits.",
    })
    .max(10, {
      message: "Phone number must be exactly 10 digits.",
    })
    .regex(/^\d+$/, {
      message: "Phone number must contain only digits.",
    }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const otpFormSchema = z.object({
  otp: z.string().length(6, {
    message: "OTP must be 6 digits.",
  }),
});

export default function Login() {
  const { login, verifyOtp } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const { toast } = useToast();

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  // For demonstration, using the demo account credentials
  const demoCredentials = {
    phone: "9876543210",
    password: "password",
  };

  async function onLoginSubmit(values: z.infer<typeof loginFormSchema>) {
    setIsLoginLoading(true);
    try {
      await login(values.phone, values.password);
      setLocation("/");
    } catch (error) {
      // Show OTP verification form if necessary
      // For the demo, always show OTP form for any credentials
      if (values.phone === demoCredentials.phone && values.password === demoCredentials.password) {
        toast({
          title: "OTP Verification Required",
          description: "We've sent a 6-digit OTP to your registered phone number",
        });
        setUserId(1); // Demo user ID
        setShowOtpForm(true);
      }
    } finally {
      setIsLoginLoading(false);
    }
  }

  async function onOtpSubmit(values: z.infer<typeof otpFormSchema>) {
    if (!userId) return;
    
    setIsLoginLoading(true);
    try {
      await verifyOtp(userId, values.otp);
      setLocation("/");
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "The OTP you entered is incorrect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoginLoading(false);
    }
  }

  const handleUseDemoAccount = () => {
    loginForm.setValue("phone", demoCredentials.phone);
    loginForm.setValue("password", demoCredentials.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">FinOne</CardTitle>
          <CardDescription>
            Your all-in-one financial platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showOtpForm ? (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="10-digit mobile number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoginLoading}>
                  {isLoginLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="text-center">
                      <FormLabel>Enter OTP</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <p className="text-xs text-gray-500 mt-2">
                        We've sent a verification code to your registered phone number
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoginLoading}>
                  {isLoginLoading ? "Verifying..." : "Verify OTP"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowOtpForm(false)}
                >
                  Back to Login
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center w-full">
            <p className="text-sm text-gray-500 mb-2">For demo purposes, use:</p>
            <Button
              variant="outline"
              className="w-full text-sm"
              onClick={handleUseDemoAccount}
            >
              Use Demo Account
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Phone: {demoCredentials.phone} | Password: {demoCredentials.password}
            </p>
            <p className="text-xs text-gray-500 mt-4">
              (For OTP verification, enter any 6 digits)
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
