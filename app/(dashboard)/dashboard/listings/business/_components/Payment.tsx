"use client";

import React, { useState, useEffect } from "react";
import { Button, Radio, Card, Spin } from "antd";
import {
  PlusOutlined,
  CheckCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useApiGet, useApiMutation } from "@/http-service";
import { useApp } from "@/providers/AppMessageProvider";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { StripeProvider } from "@/providers/StripeProvider";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { bffQuery } from "@/lib/bff-client";

interface PaymentProps {
  setIsModalOpen: (open: boolean) => void;
  setCurrentStep: (step: number) => void;
  onSuccess: (paymentMethodId: string) => void;
  selectedPlansAndBilling?: Record<
    string,
    { freq: string; value: any; tiers: string }
  >;
  isUpdatePlan?: boolean;
  businessId?: string;
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

const PaymentForm: React.FC<{
  clientSecret: string;
  onCancel: () => void;
  onSuccess: (paymentMethodId: string) => void;
  totalAmount?: number;
  isUpdatePlan?: boolean;
  businessId?: string;
  selectedPlansAndBilling?: Record<
    string,
    { freq: string; value: any; tiers: string }
  >;
}> = ({
  clientSecret,
  onCancel,
  onSuccess,
  totalAmount = 0,
  isUpdatePlan = false,
  businessId,
  selectedPlansAndBilling = {},
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { message: appMessage } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Upgrade package mutation for update plan flow
  const { mutate: upgradePackage } = useApiMutation({
    endpoint: "/api/business/upgrade-package",
    method: "post",
    config: {
      onSuccess: () => {
        setIsSubmitting(false);
        onSuccess("");
        appMessage.success("Payment plan updated successfully!");
      },
      onError: (err: any) => {
        setIsSubmitting(false);
        appMessage.error(
          err?.response?.data?.message || "Failed to update payment plan"
        );
      },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Confirm the setup intent
      const { error: confirmError, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: "if_required",
      });

      if (confirmError) {
        setError(confirmError.message || "Payment setup failed");
        setIsSubmitting(false);
        return;
      }

      if (setupIntent?.payment_method) {
        // Payment method is ready, call success callback
        // payment_method can be string (ID) or object, extract ID
        const paymentMethodId =
          typeof setupIntent.payment_method === "string"
            ? setupIntent.payment_method
            : (setupIntent.payment_method as any)?.id ||
              setupIntent.payment_method;

        if (isUpdatePlan && businessId) {
          // Get the selected plan from selectedPlansAndBilling
          const planEntries = Object.values(selectedPlansAndBilling);
          const selectedPlan = planEntries.find((p) => p.value);

          if (!selectedPlan?.value?.price_id) {
            setError("Please select a plan first");
            setIsSubmitting(false);
            return;
          }

          upgradePackage({
            business_id: parseInt(businessId),
            new_price_id: selectedPlan.value.price_id,
            payment_method_id: paymentMethodId,
          });
        } else {
          onSuccess(paymentMethodId);
        }
      } else {
        setError("Failed to retrieve payment method");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Card Details
        </label>
        <div className="p-4 border border-gray-300 rounded-lg bg-white">
          {stripe ? (
            <PaymentElement
              options={{
                layout: "tabs",
                paymentMethodOrder: ["card"],
                wallets: {
                  applePay: "auto",
                  googlePay: "auto",
                },
                business: {
                  name: "FlyInn",
                },
              }}
            />
          ) : (
            <div className="text-center py-4 text-gray-500">
              <Spin size="small" className="mr-2" />
              Loading payment form...
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <span className="mr-1">⚠️</span>
            {error}
          </p>
        )}
        <p className="mt-3 text-xs text-gray-500 flex items-start">
          <LockOutlined className="mr-1.5 mt-0.5 text-gray-400" />
          Your card information is securely processed by Stripe. We never store
          your full card details.
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          disabled={!stripe || isSubmitting}
          className="bg-[#AF2322] hover:bg-[#9e1f1a] disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
        >
          {totalAmount > 0 ? `Pay $${totalAmount.toFixed(2)}` : "Use This Card"}
        </Button>
      </div>
    </form>
  );
};

const Payment: React.FC<PaymentProps> = ({
  setIsModalOpen,
  setCurrentStep,
  onSuccess,
  selectedPlansAndBilling = {},
  isUpdatePlan = false,
  businessId,
}) => {
  const { message: appMessage } = useApp();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [isLoadingSetupIntent, setIsLoadingSetupIntent] = useState(false);

  // Fetch existing payment methods
  const {
    data: paymentMethodsData,
    isLoading: isLoadingPaymentMethods,
    refetch: refetchPaymentMethods,
  } = useApiGet({
    endpoint: "/api/payments/methods",
    queryKey: ["payment-methods"],
    config: {
      select: (res) => res?.data || res?.payment_methods || [],
    },
  });

  const paymentMethods: PaymentMethod[] = paymentMethodsData || [];

  // Get current user data
  const { data: session } = useSession();
  const { data: userResponse } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => bffQuery("/api/users/current-user"),
    retry: false,
    enabled: !!session,
  });

  const user = userResponse?.data || session?.user || null;
  const userEmail = user?.email || "";
  const userName = user?.display_name || user?.first_name || user?.name || "";

  // Check if user has Stripe customer, create if needed
  const { mutate: createCustomer } = useApiMutation({
    endpoint: "/api/business/payment/create-customer",
    method: "post",
    config: {
      onSuccess: () => {
        setIsCreatingCustomer(false);
        appMessage.success("Account setup complete!");
        // After customer creation, fetch setup intent for new card
        if (showNewCardForm) {
          fetchSetupIntent();
        }
      },
      onError: (err: any) => {
        setIsCreatingCustomer(false);
        appMessage.error(
          err?.response?.data?.message ||
            "Failed to setup account. Please try again."
        );
      },
    },
  });

  // Fetch setup intent for new payment method
  const fetchSetupIntent = async () => {
    setIsLoadingSetupIntent(true);
    try {
      const response = await fetch("/api/business/payment/setup-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (data?.client_secret || data?.data?.client_secret) {
        setClientSecret(data.client_secret || data.data.client_secret);
      } else {
        appMessage.error("Failed to load payment form");
      }
    } catch (error) {
      appMessage.error("Failed to load payment form");
    } finally {
      setIsLoadingSetupIntent(false);
    }
  };

  // Handle showing new card form
  const handleAddNewCard = async () => {
    setShowNewCardForm(true);
    setSelectedPaymentMethod(null);

    // Check if we need to create customer first
    // If user has no payment methods, they likely don't have a customer
    if (paymentMethods.length === 0 && userEmail) {
      setIsCreatingCustomer(true);
      createCustomer({
        email: userEmail,
        name: userName,
      });
    } else {
      // User has payment methods, so customer exists - fetch setup intent
      fetchSetupIntent();
    }
  };

  // Upgrade package mutation for update plan flow
  const { mutate: upgradePackage } = useApiMutation({
    endpoint: "/api/business/upgrade-package",
    method: "post",
    config: {
      onSuccess: () => {
        setIsProcessingPayment(false);
        setCurrentStep(1);
        setIsModalOpen(false);
        onSuccess("");
        appMessage.success("Payment plan updated successfully!");
      },
      onError: (err: any) => {
        setIsProcessingPayment(false);
        appMessage.error(
          err?.response?.data?.message || "Failed to update payment plan"
        );
      },
    },
  });

  // Handle using existing payment method
  const handleUseExisting = async () => {
    if (!selectedPaymentMethod) {
      appMessage.error("Please select a payment method");
      return;
    }
    setIsProcessingPayment(true);

    if (isUpdatePlan && businessId) {
      // Get the selected plan from selectedPlansAndBilling
      const planEntries = Object.values(selectedPlansAndBilling);
      const selectedPlan = planEntries.find((p) => p.value);

      if (!selectedPlan?.value?.price_id) {
        appMessage.error("Please select a plan first");
        setIsProcessingPayment(false);
        return;
      }

      upgradePackage({
        business_id: parseInt(businessId),
        new_price_id: selectedPlan.value.price_id,
        payment_method_id: selectedPaymentMethod,
      });
    } else {
      try {
        await onSuccess(selectedPaymentMethod);
      } catch (error) {
        setIsProcessingPayment(false);
      }
    }
  };

  // Handle new card success
  const handleNewCardSuccess = async (paymentMethodId: string) => {
    appMessage.success("Payment method added successfully!");
    setShowNewCardForm(false);
    setClientSecret(null);
    refetchPaymentMethods();
    setIsProcessingPayment(true);

    if (isUpdatePlan && businessId) {
      // Get the selected plan from selectedPlansAndBilling
      const planEntries = Object.values(selectedPlansAndBilling);
      const selectedPlan = planEntries.find((p) => p.value);

      if (!selectedPlan?.value?.price_id) {
        appMessage.error("Please select a plan first");
        setIsProcessingPayment(false);
        return;
      }

      upgradePackage({
        business_id: parseInt(businessId),
        new_price_id: selectedPlan.value.price_id,
        payment_method_id: paymentMethodId,
      });
    } else {
      try {
        await onSuccess(paymentMethodId);
      } catch (error) {
        setIsProcessingPayment(false);
      }
    }
  };

  const getCardBrandIcon = (brand: string) => {
    const brandLower = brand?.toLowerCase() || "";
    if (brandLower.includes("visa")) return "💳";
    if (brandLower.includes("mastercard")) return "💳";
    if (brandLower.includes("amex")) return "💳";
    if (brandLower.includes("discover")) return "💳";
    return "💳";
  };

  const formatCardNumber = (last4: string) => {
    return `•••• •••• •••• ${last4}`;
  };

  const formatExpiry = (month: number, year: number) => {
    return `${String(month).padStart(2, "0")}/${String(year).slice(-2)}`;
  };

  // Calculate total amount from selected plans
  const totalAmount = Object.values(selectedPlansAndBilling).reduce(
    (acc, plan) => {
      return acc + (plan.value?.price || 0);
    },
    0
  );

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
        <p className="text-gray-600 mt-1">
          Choose how you'd like to pay for your business subscription.
        </p>
      </div>

      {/* Loading State */}
      {isLoadingPaymentMethods || isCreatingCustomer ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
          <span className="ml-3 text-gray-600">
            {isCreatingCustomer
              ? "Setting up your account..."
              : "Loading payment methods..."}
          </span>
        </div>
      ) : showNewCardForm ? (
        /* New Card Form */
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Add New Card
            </h3>
            <Button
              type="text"
              onClick={() => {
                setShowNewCardForm(false);
                setClientSecret(null);
              }}
            >
              ← Back
            </Button>
          </div>

          {isLoadingSetupIntent ? (
            <div className="flex justify-center items-center py-12">
              <Spin size="large" />
              <span className="ml-3 text-gray-600">
                Loading payment form...
              </span>
            </div>
          ) : clientSecret ? (
            <StripeProvider clientSecret={clientSecret}>
              <PaymentForm
                clientSecret={clientSecret}
                onCancel={() => {
                  setShowNewCardForm(false);
                  setClientSecret(null);
                }}
                onSuccess={handleNewCardSuccess}
                totalAmount={totalAmount}
                isUpdatePlan={isUpdatePlan}
                businessId={businessId}
                selectedPlansAndBilling={selectedPlansAndBilling}
              />
            </StripeProvider>
          ) : (
            <div className="text-center py-8">
              <p className="text-red-600 font-semibold mb-2">
                Failed to load payment form
              </p>
              <Button onClick={fetchSetupIntent} className="mt-4">
                Try Again
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Payment Method Selection */
        <div className="space-y-4">
          {paymentMethods.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">
                Select a saved payment method
              </h3>
              <Radio.Group
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="w-full"
              >
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <Radio key={method.id} value={method.id} className="w-full">
                      <Card
                        className={`w-full border-2 transition-all ${
                          selectedPaymentMethod === method.id
                            ? "border-gray-700 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        bodyStyle={{ padding: "16px" }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">
                              {getCardBrandIcon(method.card?.brand || "")}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {method.card?.brand
                                  ? `${method.card.brand.toUpperCase()} ${formatCardNumber(
                                      method.card.last4
                                    )}`
                                  : "Card"}
                              </div>
                              <div className="text-sm text-gray-500">
                                Expires{" "}
                                {method.card
                                  ? formatExpiry(
                                      method.card.exp_month,
                                      method.card.exp_year
                                    )
                                  : ""}
                              </div>
                            </div>
                          </div>
                          {/* {selectedPaymentMethod === method.id && (
                            <CheckCircleOutlined className="text-[#AF2322] text-xl" />
                          )} */}
                        </div>
                      </Card>
                    </Radio>
                  ))}
                </div>
              </Radio.Group>
            </div>
          )}

          {/* Add New Card Button */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddNewCard}
              className="w-full h-12 text-base disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
              size="large"
              disabled={
                isLoadingPaymentMethods ||
                isCreatingCustomer ||
                isLoadingSetupIntent
              }
            >
              {paymentMethods.length > 0
                ? "Add New Payment Method"
                : "Add Payment Method"}
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!showNewCardForm && (
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <Button
            onClick={() => setCurrentStep(3)}
            disabled={isProcessingPayment}
          >
            Back
          </Button>
          <Button
            type="primary"
            className="bg-[#AF2322] hover:bg-[#9e1f1a] disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
            onClick={
              selectedPaymentMethod
                ? handleUseExisting
                : paymentMethods.length === 0
                ? handleAddNewCard
                : undefined
            }
            disabled={
              (!selectedPaymentMethod && paymentMethods.length > 0) ||
              isLoadingPaymentMethods ||
              isProcessingPayment
            }
            loading={isProcessingPayment}
          >
            {paymentMethods.length === 0
              ? "Add Payment Method"
              : totalAmount > 0
              ? `Pay $${totalAmount.toFixed(2)}`
              : "Complete Payment"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Payment;
