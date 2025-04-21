// Define Razorpay options interface
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: Record<string, string>;
  theme: {
    color: string;
  };
}

// Interface for payment data
export interface PaymentData {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
  userId: number;
  description: string;
}

// Load Razorpay script
export function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Create a new payment
export async function createPayment(paymentData: PaymentData): Promise<string> {
  try {
    // In a real app, this would call your backend to create an order
    // For demo, we'll simulate the order creation
    const orderId = `order_${Date.now()}`;
    return orderId;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
}

// Process payment with Razorpay
export async function processPayment(
  orderId: string,
  paymentData: PaymentData,
  onSuccess: (response: any) => void,
  onError: (error: any) => void
): Promise<void> {
  try {
    // Load Razorpay script if not loaded
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      throw new Error("Failed to load Razorpay SDK");
    }

    // Check if Razorpay is available
    // @ts-ignore - Razorpay is loaded from CDN
    if (typeof window.Razorpay === "undefined") {
      throw new Error("Razorpay not available");
    }

    const options: RazorpayOptions = {
      key: process.env.RAZORPAY_KEY_ID || "rzp_test_key", // Use environment variable
      amount: paymentData.amount * 100, // Razorpay expects amount in paise
      currency: paymentData.currency || "INR",
      name: "FinOne",
      description: paymentData.description || "Payment",
      order_id: orderId,
      prefill: {
        name: paymentData.notes?.name || "",
        email: paymentData.notes?.email || "",
        contact: paymentData.notes?.contact || "",
      },
      notes: paymentData.notes || {},
      theme: {
        color: "#4f46e5", // Primary color
      },
    };

    // @ts-ignore - Razorpay is loaded from CDN
    const razorpayInstance = new window.Razorpay(options);
    
    // Set event handlers
    razorpayInstance.on("payment.success", onSuccess);
    razorpayInstance.on("payment.error", onError);
    
    // Open Razorpay checkout
    razorpayInstance.open();

  } catch (error) {
    console.error("Error processing payment:", error);
    onError(error);
  }
}

// Verify payment with backend
export async function verifyPayment(
  paymentId: string,
  orderId: string,
  signature: string
): Promise<boolean> {
  try {
    // In a real app, this would call your backend to verify the payment
    // For demo, we'll simulate successful verification
    return true;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
}

// Add money to wallet
export async function addMoneyToWallet(
  userId: number,
  amount: number,
  onSuccess: (response: any) => void,
  onError: (error: any) => void
): Promise<void> {
  try {
    const paymentData: PaymentData = {
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: userId.toString(),
        transactionType: "wallet_topup",
      },
      userId,
      description: "Add money to FinOne wallet",
    };

    const orderId = await createPayment(paymentData);
    await processPayment(orderId, paymentData, onSuccess, onError);
  } catch (error) {
    console.error("Error adding money to wallet:", error);
    onError(error);
  }
}
