"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button, message } from "antd";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { StripeProvider } from "@/providers/StripeProvider";
import { useApiMutation } from "@/http-service";

interface AddPaymentMethodModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const CardForm: React.FC<{
  onCancel: () => void;
  onSuccess: () => void;
  clientSecret: string;
}> = ({ onCancel, onSuccess, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);

  // Check if Stripe is loaded
  useEffect(() => {
    if (!stripe) {
      console.warn(
        "Stripe is not loaded. Check NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable."
      );
      setStripeError("Payment form is initializing...");
    } else {
      setStripeError(null);
    }
  }, [stripe]);

  // Attach payment method after confirmation
  const { mutate: attachPaymentMethod, isPending: isAttaching } =
    useApiMutation({
      endpoint: "/api/payments/methods",
      method: "post",
      config: {
        onSuccess: () => {
          message.success("Payment method added successfully!");
          onSuccess();
        },
        onError: (err) => {
          message.error(
            err?.response?.data?.message ||
              "Failed to add payment method. Please try again."
          );
          setIsSubmitting(false);
        },
      },
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      message.error("Payment form is not ready. Please wait a moment.");
      return;
    }

    setIsSubmitting(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      message.error("Card element not found");
      setIsSubmitting(false);
      return;
    }

    try {
      // Confirm the setup intent with the card element
      const { error: confirmError, setupIntent } =
        await stripe.confirmCardSetup(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

      if (confirmError) {
        message.error(confirmError.message || "Failed to add payment method");
        setIsSubmitting(false);
        return;
      }

      if (setupIntent?.status === "succeeded" && setupIntent.payment_method) {
        // Attach the payment method to the customer
        attachPaymentMethod({
          payment_method_id: setupIntent.payment_method,
        });
      } else {
        message.error("Payment method setup failed");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || isAttaching;
  const isButtonDisabled = !stripe || !clientSecret || isLoading;

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="p-4 border border-gray-300 rounded-lg bg-white">
            {stripe ? (
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#32325d",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#fa755a",
                      iconColor: "#fa755a",
                    },
                  },
                }}
              />
            ) : (
              <div className="text-center py-4 text-gray-500 flex items-center justify-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                Loading payment form...
              </div>
            )}
          </div>
          {stripeError && (
            <p className="mt-2 text-xs text-yellow-600">{stripeError}</p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Your card information is securely processed by Stripe. We never
            store your full card details.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            disabled={isButtonDisabled}
            title={
              !stripe
                ? "Waiting for Stripe to load..."
                : !clientSecret
                ? "Waiting for payment form..."
                : ""
            }
          >
            Add Payment Method
          </Button>
        </div>
      </div>
    </form>
  );
};

const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  open,
  onCancel,
  onSuccess,
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Create setup intent when modal opens
  const { mutate: createSetupIntent } = useApiMutation({
    endpoint: "/api/payments/setup-intent",
    method: "post",
    config: {
      onSuccess: (response) => {
        // Handle different response formats from backend
        // Backend returns: { status: true, data: { client_secret: "seti_..." } }
        // useApiMutation returns response.data, so response is already the data object
        const secret =
          response?.data?.client_secret || // Nested format: { data: { client_secret: "..." } }
          response?.client_secret || // Direct format: { client_secret: "..." }
          response?.data?.setup_intent?.client_secret; // Stripe format: { data: { setup_intent: { client_secret: "..." } } }

        console.log("Setup Intent Response:", response);
        console.log("Extracted client_secret:", secret);

        if (secret) {
          setClientSecret(secret);
        } else {
          console.error(
            "Failed to extract client_secret. Full response:",
            response
          );
          message.error(
            "Failed to initialize payment form - invalid response format"
          );
        }
        setIsLoading(false);
      },
      onError: (err) => {
        console.error("Setup Intent Error:", err);
        message.error(
          err?.response?.data?.message || "Failed to initialize payment form"
        );
        setIsLoading(false);
      },
    },
  });

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      createSetupIntent({});
    } else {
      // Reset when modal closes
      setClientSecret(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl [&>button]:hidden">
        <DialogClose asChild>
          <button
            onClick={onCancel}
            className="absolute right-4 top-4 rounded-full bg-gray-100 hover:bg-gray-200 p-1.5 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#AF2322] focus:ring-offset-2"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Skeleton className="h-8 w-8 rounded-full mr-3" />
            <span className="text-gray-600">Loading payment form...</span>
          </div>
        ) : clientSecret ? (
          <StripeProvider clientSecret={clientSecret}>
            <CardForm
              onCancel={onCancel}
              onSuccess={onSuccess}
              clientSecret={clientSecret}
            />
          </StripeProvider>
        ) : (
          <div className="text-center py-8">
            <p className="text-red-600 font-semibold mb-2">
              Failed to load payment form
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Unable to retrieve payment form credentials from the server.
            </p>
            <Button onClick={onCancel} className="mt-4">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentMethodModal;
