/**
 * This is a mock implementation of Stripe for development without API keys.
 * Replace with real Stripe integration when API keys are available.
 */

// Mock Stripe instance
export const loadMockStripe = async () => {
  return {
    elements: ({ clientSecret, appearance }: { clientSecret?: string; appearance?: any }) => {
      return {
        create: (type: string, options?: any) => {
          // Return a mock element that simulates Stripe Elements behavior
          return {
            mount: (domElement: string | HTMLElement) => {
              // Simulate mounting to DOM
              if (typeof domElement === 'string') {
                const element = document.querySelector(domElement);
                if (element && element instanceof HTMLElement) {
                  mockElementUI(element);
                }
              } else if (domElement instanceof HTMLElement) {
                mockElementUI(domElement);
              }
            },
            unmount: () => {
              // Mock unmounting
            },
            on: (event: string, handler: Function) => {
              // Mock event handling
              return {
                element: {}
              };
            },
            update: (options: any) => {
              // Mock update
            }
          };
        },
        getElement: (type: string) => {
          return {
            // Mock element methods
            focus: () => {},
            blur: () => {},
            clear: () => {},
            update: (options: any) => {},
            on: (event: string, handler: Function) => {}
          };
        },
        update: (options: any) => {
          // Mock update
        }
      };
    },
    confirmPayment: async ({ elements, confirmParams, redirect }: any) => {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful payment 80% of the time
      const isSuccess = Math.random() > 0.2;
      
      if (isSuccess) {
        return {
          error: null,
          paymentIntent: {
            id: `pi_mock_${Date.now()}`,
            status: 'succeeded',
            amount: 1000,
            client_secret: 'mock_secret'
          }
        };
      } else {
        return {
          error: {
            type: 'card_error',
            code: 'card_declined',
            message: 'Your card was declined. Please try another payment method.'
          }
        };
      }
    }
  };
};

// Helper to create a mock UI for Stripe Elements
function mockElementUI(container: HTMLElement) {
  // Create a mock card element UI
  container.innerHTML = `
    <div class="mock-stripe-element p-4 border rounded-md bg-white dark:bg-gray-900 shadow-sm">
      <div class="mb-2">
        <label class="text-sm font-medium">Card Number</label>
        <div class="h-10 p-2 mt-1 border rounded-md bg-gray-50 dark:bg-gray-800">4242 4242 4242 4242</div>
      </div>
      <div class="flex gap-2">
        <div class="flex-1">
          <label class="text-sm font-medium">Expiry</label>
          <div class="h-10 p-2 mt-1 border rounded-md bg-gray-50 dark:bg-gray-800">12/30</div>
        </div>
        <div class="w-24">
          <label class="text-sm font-medium">CVC</label>
          <div class="h-10 p-2 mt-1 border rounded-md bg-gray-50 dark:bg-gray-800">123</div>
        </div>
      </div>
      <div class="mt-2 text-xs text-muted-foreground">
        Test Mode: This is a mock Stripe implementation
      </div>
    </div>
  `;

  // Make it look like a real Stripe Element
  const style = document.createElement('style');
  style.textContent = `
    .mock-stripe-element {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      box-sizing: border-box;
      transition: all 0.15s ease;
    }
    .mock-stripe-element:hover {
      border-color: #a1a1aa;
    }
  `;
  document.head.appendChild(style);
}

// Mock PaymentElement component for React
export const MockPaymentElement = ({ className }: { className?: string }) => {
  // This is just a template that will be replaced with actual implementation
  return `
    <div class="${className || ''} mock-payment-element p-4 border rounded-md bg-white dark:bg-gray-900 shadow-sm">
      <div class="mb-2">
        <label class="text-sm font-medium">Card information</label>
        <div class="h-10 p-2 mt-1 border rounded-md bg-gray-50 dark:bg-gray-800 flex items-center">
          <span class="text-gray-500">4242 4242 4242 4242</span>
        </div>
      </div>
      <div class="flex gap-2">
        <div class="flex-1">
          <label class="text-sm font-medium">Expiry</label>
          <div class="h-10 p-2 mt-1 border rounded-md bg-gray-50 dark:bg-gray-800 flex items-center">
            <span class="text-gray-500">12/30</span>
          </div>
        </div>
        <div class="w-24">
          <label class="text-sm font-medium">CVC</label>
          <div class="h-10 p-2 mt-1 border rounded-md bg-gray-50 dark:bg-gray-800 flex items-center">
            <span class="text-gray-500">123</span>
          </div>
        </div>
      </div>
      <div class="mt-2 text-xs text-gray-500">
        <div class="flex items-center space-x-1">
          <span>🔒</span>
          <span>Your payment information is secure</span>
        </div>
      </div>
    </div>
  `;
};