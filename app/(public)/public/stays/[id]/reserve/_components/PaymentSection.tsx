"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Plus, Lock, Check, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useApiMutation } from "@/http-service";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { StripeProvider } from "@/providers/StripeProvider";
import { Skeleton } from "@/components/ui/skeleton";

interface BookingParams {
  arrival_date: string;
  departure_date: string;
  guests: number;
  children: number;
  infants: number;
  pets: number;
}

interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  is_default?: boolean;
}

interface PaymentSectionProps {
  stayData: any;
  bookingParams: BookingParams;
  paymentMethods: PaymentMethod[];
  isLoadingPayments: boolean;
  onPaymentMethodAdded: () => void;
}

// Stripe Card Form Component
const StripeCardForm: React.FC<{
  onCancel: () => void;
  onSuccess: () => void;
  clientSecret: string;
}> = ({ onCancel, onSuccess, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe) {
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
          onSuccess();
        },
        onError: (err: any) => {
          setStripeError(
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
      setStripeError("Payment form is not ready. Please wait a moment.");
      return;
    }

    setIsSubmitting(true);
    setStripeError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setStripeError("Card element not found");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: confirmError, setupIntent } =
        await stripe.confirmCardSetup(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

      if (confirmError) {
        setStripeError(confirmError.message || "Failed to add payment method");
        setIsSubmitting(false);
        return;
      }

      if (setupIntent?.status === "succeeded" && setupIntent.payment_method) {
        attachPaymentMethod({
          payment_method_id: setupIntent.payment_method,
        });
      } else {
        setStripeError("Payment method setup failed");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setStripeError("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || isAttaching;
  const isButtonDisabled = !stripe || !clientSecret || isLoading;

  return (
    <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="p-4 border border-gray-300 rounded-xl bg-white">
          {stripe ? (
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#1f2937",
                    "::placeholder": {
                      color: "#9ca3af",
                    },
                  },
                  invalid: {
                    color: "#dc2626",
                    iconColor: "#dc2626",
                  },
                },
              }}
            />
          ) : (
            <div className="text-center py-4 text-gray-500 flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading payment form...
            </div>
          )}
        </div>
        {stripeError && (
          <p className="mt-2 text-sm text-red-600">{stripeError}</p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          Your card information is securely processed by Stripe.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 h-12 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isButtonDisabled}
          className="flex-1 h-12 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add card"
          )}
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">
        <Lock className="h-3 w-3" />
        <span>Your card details are encrypted and secure</span>
      </div>
    </form>
  );
};

// Add Payment Method Modal
const AddPaymentMethodModal: React.FC<{
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}> = ({ open, onCancel, onSuccess }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate: createSetupIntent } = useApiMutation({
    endpoint: "/api/payments/setup-intent",
    method: "post",
    config: {
      onSuccess: (response: any) => {
        const secret =
          response?.data?.client_secret ||
          response?.client_secret ||
          response?.data?.setup_intent?.client_secret;

        if (secret) {
          setClientSecret(secret);
          setError(null);
        } else {
          setError("Failed to initialize payment form");
        }
        setIsLoading(false);
      },
      onError: (err: any) => {
        console.error("Setup Intent Error:", err);
        setError(
          err?.response?.data?.message || "Failed to initialize payment form"
        );
        setIsLoading(false);
      },
    },
  });

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      setError(null);
      setClientSecret(null);
      createSetupIntent({});
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden [&>button]:hidden">
        <DialogClose asChild>
          <button
            onClick={onCancel}
            className="absolute right-4 top-4 rounded-full bg-gray-100 hover:bg-gray-200 p-1.5 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none z-10"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogClose>
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold text-center">
            Add payment method
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <Skeleton className="h-8 w-8 rounded-full mb-3" />
            <span className="text-gray-600">Loading payment form...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 px-6">
            <p className="text-red-600 font-semibold mb-2">
              Failed to load payment form
            </p>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        ) : clientSecret ? (
          <StripeProvider clientSecret={clientSecret}>
            <StripeCardForm
              onCancel={onCancel}
              onSuccess={onSuccess}
              clientSecret={clientSecret}
            />
          </StripeProvider>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

const PaymentSection: React.FC<PaymentSectionProps> = ({
  stayData,
  bookingParams,
  paymentMethods,
  isLoadingPayments,
  onPaymentMethodAdded,
}) => {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get pricing from API response
  const pricing = stayData?.pricing || stayData;
  const grandTotal = pricing?.grand_total || pricing?.total_price || 0;

  // Normalize payment methods array
  const normalizedPaymentMethods: PaymentMethod[] = Array.isArray(
    paymentMethods
  )
    ? paymentMethods
    : [];

  // Auto-select first payment method when loaded
  useEffect(() => {
    if (normalizedPaymentMethods.length > 0 && !selectedPaymentMethod) {
      setSelectedPaymentMethod(normalizedPaymentMethods[0].id);
    }
  }, [normalizedPaymentMethods, selectedPaymentMethod]);

  // Create booking mutation
  const { mutateAsync: createBooking } = useApiMutation({
    endpoint: "/api/bookings",
    method: "post",
  });

  // Process payment mutation
  const { mutateAsync: processPayment } = useApiMutation({
    endpoint: "/api/bookings", // Will be updated dynamically
    method: "post",
  });

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    setErrorMessage(null);
  };

  const handleCardAdded = () => {
    setShowAddCardModal(false);
    onPaymentMethodAdded();
  };

  const handleConfirmBooking = async () => {
    setErrorMessage(null);

    if (!selectedPaymentMethod) {
      setErrorMessage("Please select a payment method");
      return;
    }

    setIsProcessing(true);

    // Check if instant booking (can be boolean or number 0/1)
    const isInstantBooking =
      stayData?.instant_booking === true ||
      stayData?.instant_booking === 1 ||
      stayData?.instant_booking === "1";

    try {
      // Step 1: Create booking
      setProcessingStep(
        isInstantBooking
          ? "Creating your booking..."
          : "Creating booking request..."
      );

      // Prepare listing snapshot (important details for record-keeping)
      const listingSnapshot = {
        id: stayData?.id,
        title: stayData?.title,
        address: stayData?.address,
        city: stayData?.city,
        state: stayData?.state,
        country: stayData?.country,
        zipcode: stayData?.zipcode,
        lodging_type: stayData?.lodging_type,
        type_of_space: stayData?.type_of_space,
        no_of_bedrooms: stayData?.no_of_bedrooms,
        no_of_bathrooms: stayData?.no_of_bathrooms,
        no_of_beds: stayData?.no_of_beds,
        no_of_guest: stayData?.no_of_guest,
        nightly_price: stayData?.nightly_price,
        check_in_after: stayData?.check_in_after,
        check_out_before: stayData?.check_out_before,
        host_id: stayData?.host_id,
        host_name:
          stayData?.host?.display_name ||
          `${stayData?.host?.first_name} ${stayData?.host?.last_name}`,
        host_email: stayData?.host?.email,
        host_phone: stayData?.host?.phone,
        primary_image:
          stayData?.images?.[0]?.url || stayData?.images?.[0]?.image,
        cancellation_policy_short: stayData?.cancellation_policy_short,
        cancellation_policy_long: stayData?.cancellation_policy_long,
      };

      const bookingPayload = {
        stay_id: stayData?.id,
        payment_method_id: selectedPaymentMethod,
        arrival_date: bookingParams.arrival_date,
        departure_date: bookingParams.departure_date,
        guests: bookingParams.guests,
        children: bookingParams.children || 0,
        infants: bookingParams.infants || 0,
        pets: bookingParams.pets || 0,
        pricing: {
          base_avg_nightly_price: pricing?.base_avg_nightly_price,
          base_total_price: pricing?.base_total_price,
          extra_guest_fee: pricing?.extra_guest_fee,
          pet_fee: pricing?.pet_fee,
          avg_nightly_price: pricing?.avg_nightly_price,
          total_price: pricing?.total_price,
          nights: pricing?.nights,
          cleaning_fee: pricing?.cleaning_fee,
          city_fee: pricing?.city_fee,
          platform_fee: pricing?.platform_fee,
          lodging_tax: pricing?.lodging_tax,
          grand_total: pricing?.grand_total,
        },
        listing_snapshot: JSON.stringify(listingSnapshot),
      };

      console.log("Creating booking with payload:", bookingPayload);

      const bookingResponse: any = await createBooking(bookingPayload);
      console.log("Booking created:", bookingResponse);

      const bookingId =
        bookingResponse?.data?.id ||
        bookingResponse?.data?.booking_id ||
        bookingResponse?.id;

      if (!bookingId) {
        throw new Error("Failed to create booking - no booking ID returned");
      }

      // Step 2: Process payment or authorize payment based on instant_booking
      if (isInstantBooking) {
        // Instant booking: Process payment immediately
        setProcessingStep("Processing payment...");

        const paymentResponse = await fetch(`/api/bookings/${bookingId}/pay`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payment_method_id: selectedPaymentMethod,
          }),
        });

        const paymentResult = await paymentResponse.json();
        console.log("Payment result:", paymentResult);

        if (!paymentResponse.ok || paymentResult?.status === false) {
          throw new Error(
            paymentResult?.message || "Payment processing failed"
          );
        }

        // Success!
        setProcessingStep("Confirming your reservation...");

        const bookingReference =
          paymentResult?.data?.booking_reference ||
          bookingResponse?.data?.booking_reference ||
          `BK-${bookingId}`;

        // Store booking details for confirmation page
        const confirmationData = {
          booking_reference: bookingReference,
          stay_title: stayData?.title || "Your stay",
          stay_city: stayData?.city || "",
          stay_state: stayData?.state || "",
          arrival_date: bookingParams.arrival_date,
          departure_date: bookingParams.departure_date,
          guests: bookingParams.guests,
          children: bookingParams.children || 0,
          pets: bookingParams.pets || 0,
          grand_total: Number(grandTotal),
        };

        // Store in sessionStorage for the confirmation page
        sessionStorage.setItem(
          "booking_confirmation",
          JSON.stringify(confirmationData)
        );

        // Redirect to confirmation page
        setTimeout(() => {
          router.push(`/public/booking-confirmation?ref=${bookingReference}`);
        }, 500);
      } else {
        // Request booking: Authorize payment (hold funds)
        setProcessingStep("Authorizing payment...");

        const authorizeResponse = await fetch(
          `/api/bookings/${bookingId}/authorize`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              payment_method_id: selectedPaymentMethod,
            }),
          }
        );

        const authorizeResult = await authorizeResponse.json();
        console.log("Authorization result:", authorizeResult);

        if (!authorizeResponse.ok || authorizeResult?.status === false) {
          throw new Error(
            authorizeResult?.message || "Payment authorization failed"
          );
        }

        // Success!
        setProcessingStep("Submitting request...");

        const bookingReference =
          authorizeResult?.data?.booking_reference ||
          bookingResponse?.data?.booking_reference ||
          `BK-${bookingId}`;

        // Store booking details for request confirmation page
        const confirmationData = {
          booking_reference: bookingReference,
          stay_title: stayData?.title || "Your stay",
          stay_city: stayData?.city || "",
          stay_state: stayData?.state || "",
          arrival_date: bookingParams.arrival_date,
          departure_date: bookingParams.departure_date,
          guests: bookingParams.guests,
          children: bookingParams.children || 0,
          pets: bookingParams.pets || 0,
          grand_total: Number(grandTotal),
        };

        // Store in sessionStorage for the request confirmation page
        sessionStorage.setItem(
          "booking_request_confirmation",
          JSON.stringify(confirmationData)
        );

        // Redirect to request confirmation page
        setTimeout(() => {
          router.push(
            `/public/booking-request-confirmation?ref=${bookingReference}`
          );
        }, 500);
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Booking failed. Please try again."
      );
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  const hasPaymentMethods = normalizedPaymentMethods.length > 0;

  // Check if instant booking (can be boolean or number 0/1)
  const isInstantBooking =
    stayData?.instant_booking === true ||
    stayData?.instant_booking === 1 ||
    stayData?.instant_booking === "1";

  const formatExpiry = (month: number, year: number) => {
    const formattedMonth = String(month).padStart(2, "0");
    const shortYear = String(year).slice(-2);
    return `${formattedMonth}/${shortYear}`;
  };

  return (
    <div className="space-y-8">
      {/* Payment Method Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Choose how you'll pay</h2>
        <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6 space-y-4">
          {isLoadingPayments ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading payment methods...</p>
            </div>
          ) : (
            <>
              {hasPaymentMethods && (
                <div className="w-full space-y-3">
                  {normalizedPaymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => handlePaymentMethodSelect(method.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                        selectedPaymentMethod === method.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                            selectedPaymentMethod === method.id
                              ? "border-primary bg-primary"
                              : "border-gray-300"
                          )}
                        >
                          {selectedPaymentMethod === method.id && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <CreditCard className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-900 capitalize">
                            {method.card?.brand} •••• {method.card?.last4}
                          </span>
                          {method.is_default && (
                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      {method.card && (
                        <span className="text-sm text-gray-500">
                          {formatExpiry(
                            method.card.exp_month,
                            method.card.exp_year
                          )}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {!hasPaymentMethods && (
                <div className="py-6 text-center text-gray-500">
                  <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-medium">
                    No saved payment methods
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Add a card to complete your booking
                  </p>
                </div>
              )}

              {/* Add new card button */}
              <button
                onClick={() => setShowAddCardModal(true)}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="font-medium">Add payment method</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Confirm Booking Button */}
      <div className="space-y-4">
        <button
          onClick={handleConfirmBooking}
          disabled={isProcessing || !selectedPaymentMethod}
          className="w-full h-14 border-0 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {processingStep || "Processing..."}
            </>
          ) : isInstantBooking ? (
            `Confirm and pay $${grandTotal.toFixed(2)}`
          ) : (
            `Request to book $${grandTotal.toFixed(2)}`
          )}
        </button>
      </div>

      {/* Trust indicators */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Lock className="h-4 w-4 text-green-500" />
          <span>Your payment is secure and encrypted</span>
        </div>
        <p className="text-xs text-gray-400">
          By confirming, you agree to our{" "}
          <a
            href="/public/terms-of-service"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/public/privacy-policy"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </p>
      </div>

      {/* Add Card Modal */}
      <AddPaymentMethodModal
        open={showAddCardModal}
        onCancel={() => setShowAddCardModal(false)}
        onSuccess={handleCardAdded}
      />
    </div>
  );
};

export default PaymentSection;
