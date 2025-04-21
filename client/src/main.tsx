import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./contexts/auth-context";
import { NotificationProvider } from "./contexts/notification-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import React from "react";

// Explicitly use React to avoid any potential issues
const root = createRoot(document.getElementById("root")!);

// Wrap everything in a React.StrictMode to catch potential issues
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="finall-theme">
        <AuthProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
