"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ReactNode, useEffect, useState } from "react";

// Get Stripe publishable key from environment
const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

// Initialize Stripe only if key is available
const stripePromise = STRIPE_PUBLISHABLE_KEY
  ? loadStripe(STRIPE_PUBLISHABLE_KEY)
  : null;

interface StripeProviderProps {
  children: ReactNode;
  clientSecret?: string;
}

export function StripeProvider({
  children,
  clientSecret,
}: StripeProviderProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!STRIPE_PUBLISHABLE_KEY) {
      setError(
        "Stripe publishable key is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment variables."
      );
      console.error(
        "❌ Stripe Error: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set"
      );
    } else if (!stripePromise) {
      setError("Failed to initialize Stripe");
    } else {
      setError(null);
    }
  }, []);

  if (!STRIPE_PUBLISHABLE_KEY || !stripePromise) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 font-semibold mb-2">
          Stripe Configuration Error
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {error ||
            "Stripe publishable key is missing. Please configure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your .env.local file."}
        </p>
        <p className="text-xs text-gray-500">
          Example: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
        </p>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#AF2322", // Your brand color
        colorBackground: "#ffffff",
        colorText: "#32325d",
        colorDanger: "#df1b41",
        fontFamily: "system-ui, -apple-system, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  };

  return (
    <Elements
      stripe={stripePromise}
      options={clientSecret ? options : undefined}
    >
      {children}
    </Elements>
  );
}
