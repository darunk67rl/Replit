import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  // OTP login states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  
  // Password login states
  const [loginPhoneNumber, setLoginPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  // Registration states
  const [username, setUsername] = useState("");
  const [regPhoneNumber, setRegPhoneNumber] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [name, setName] = useState("");
  const [regError, setRegError] = useState("");
  
  const { requestOtp, login, register, isLoading, user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setLocation("/");
    }
  }, [isAuthenticated, user, setLocation]);

  // Handle OTP request
  const handleRequestOtp = async () => {
    // Basic Indian phone number validation (10 digits, optionally with +91 prefix)
    const phoneRegex = /^(\+91[ -]?)?[0]?(91)?[6789]\d{9}$/;
    
    if (!phoneRegex.test(phoneNumber)) {
      setError("Please enter a valid Indian phone number");
      return;
    }
    
    setError("");
    try {
      // Store phone number for OTP verification
      localStorage.setItem("finall-phone", phoneNumber);
      await requestOtp(phoneNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    }
  };
  
  // Handle password login
  const handlePasswordLogin = async () => {
    if (!loginPhoneNumber) {
      setLoginError("Phone number is required");
      return;
    }
    
    if (!password) {
      setLoginError("Password is required");
      return;
    }
    
    setLoginError("");
    try {
      await login(loginPhoneNumber, password);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    }
  };
  
  // Handle registration
  const handleRegister = async () => {
    if (!username || !regPhoneNumber || !regPassword || !name) {
      setRegError("All fields are required");
      return;
    }
    
    setRegError("");
    try {
      await register({
        username,
        phoneNumber: regPhoneNumber,
        password: regPassword,
        name
      });
    } catch (err) {
      setRegError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-primary">MoneyFlow</CardTitle>
          <CardDescription>
            Your complete financial ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="otp" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="otp">OTP Login</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            {/* OTP Login Tab */}
            <TabsContent value="otp" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-white dark:bg-neutral-800"
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                We'll send a one-time password to verify your phone number
              </div>
              <Button
                className="w-full"
                onClick={handleRequestOtp}
                disabled={isLoading || !phoneNumber}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Request OTP"
                )}
              </Button>
            </TabsContent>
            
            {/* Password Login Tab */}
            <TabsContent value="password" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loginPhoneNumber">Phone Number</Label>
                <Input
                  id="loginPhoneNumber"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={loginPhoneNumber}
                  onChange={(e) => setLoginPhoneNumber(e.target.value)}
                  className="bg-white dark:bg-neutral-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white dark:bg-neutral-800"
                />
                {loginError && <p className="text-sm text-red-500">{loginError}</p>}
              </div>
              <Button
                className="w-full"
                onClick={handlePasswordLogin}
                disabled={isLoading || !loginPhoneNumber || !password}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </TabsContent>
            
            {/* Register Tab */}
            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Rahul Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white dark:bg-neutral-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="rahul123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white dark:bg-neutral-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regPhoneNumber">Phone Number</Label>
                <Input
                  id="regPhoneNumber"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={regPhoneNumber}
                  onChange={(e) => setRegPhoneNumber(e.target.value)}
                  className="bg-white dark:bg-neutral-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regPassword">Password</Label>
                <Input
                  id="regPassword"
                  type="password"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="bg-white dark:bg-neutral-800"
                />
                {regError && <p className="text-sm text-red-500">{regError}</p>}
              </div>
              <Button
                className="w-full"
                onClick={handleRegister}
                disabled={isLoading || !username || !regPhoneNumber || !regPassword || !name}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Protected by industry-standard security
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
