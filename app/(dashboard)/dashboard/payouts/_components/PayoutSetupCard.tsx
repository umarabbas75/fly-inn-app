"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Skeleton, Alert } from "antd";
import {
  CheckCircle,
  Clock,
  CreditCard,
  ExternalLink,
  AlertCircle,
  Banknote,
  Shield,
  Zap,
} from "lucide-react";
import { useApiGet, useApiMutation } from "@/http-service";
import { useApp } from "@/providers/AppMessageProvider";

interface ConnectStatus {
  has_connect_account: boolean;
  is_onboarded: boolean;
  payouts_enabled: boolean;
  account_id: string | null;
}

type OnboardingState =
  | "not_started"
  | "in_progress"
  | "verification_pending"
  | "completed";

const PayoutSetupCard: React.FC = () => {
  const searchParams = useSearchParams();
  const { message: appMessage } = useApp();

  // Check if returning from Stripe onboarding
  const onboardingComplete = searchParams.get("onboarding") === "complete";

  // Fetch connect status
  const {
    data: statusResponse,
    isLoading: statusLoading,
    refetch: refetchStatus,
    error: statusError,
  } = useApiGet({
    endpoint: "/api/connect/status",
    queryKey: ["connect-status"],
  });

  const connectStatus: ConnectStatus | null = statusResponse?.data || null;

  // Onboarding mutation
  const { mutate: startOnboarding, isPending: onboardingPending } =
    useApiMutation({
      endpoint: "/api/connect/onboard",
      method: "post",
      config: {
        onSuccess: (response: any) => {
          console.log({ response });
          const url = response?.data?.onboarding_url;
          if (url) {
            // Redirect to Stripe onboarding
            window.location.href = url;
          } else {
            appMessage.error("Failed to get onboarding URL");
          }
        },
        onError: (err: any) => {
          appMessage.error(
            err?.response?.data?.message || "Failed to start onboarding"
          );
        },
      },
    });

  // State for dashboard link loading
  const [dashboardPending, setDashboardPending] = useState(false);

  // Fetch dashboard link (GET request, so we use fetch directly)
  const getDashboardLink = async () => {
    setDashboardPending(true);
    try {
      const response = await fetch("/api/connect/dashboard");
      const data = await response.json();

      if (data?.data?.url) {
        // Open Stripe dashboard in new tab
        window.open(data.data.url, "_blank");
      } else {
        appMessage.error("Failed to get dashboard URL");
      }
    } catch (err: any) {
      appMessage.error(err?.message || "Failed to open dashboard");
    } finally {
      setDashboardPending(false);
    }
  };

  // Refetch status when returning from Stripe
  useEffect(() => {
    if (onboardingComplete) {
      refetchStatus();
      appMessage.success("Welcome back! Checking your payout setup status...");
    }
  }, [onboardingComplete, refetchStatus, appMessage]);

  // Determine current state
  const getOnboardingState = (): OnboardingState => {
    if (!connectStatus) return "not_started";

    if (!connectStatus.has_connect_account) {
      return "not_started";
    }

    if (connectStatus.has_connect_account && !connectStatus.is_onboarded) {
      return "in_progress";
    }

    if (connectStatus.is_onboarded && !connectStatus.payouts_enabled) {
      return "verification_pending";
    }

    if (connectStatus.payouts_enabled) {
      return "completed";
    }

    return "not_started";
  };

  const currentState = getOnboardingState();

  // Handle set up / continue setup
  const handleSetupPayouts = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    startOnboarding({
      refresh_url: `${baseUrl}/dashboard/payouts`,
      return_url: `${baseUrl}/dashboard/payouts?onboarding=complete`,
    });
  };

  // Handle manage payouts (open Stripe dashboard)
  const handleManagePayouts = () => {
    getDashboardLink();
  };

  if (statusLoading) {
    return <PayoutSetupSkeleton />;
  }

  if (statusError) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <Alert
          type="error"
          message="Failed to load payout status"
          description="Please try refreshing the page."
          showIcon
          action={
            <Button size="small" onClick={() => refetchStatus()}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#AF2322] to-[#8a1c1b] px-6 py-5 md:px-8 md:py-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Payout Settings
            </h2>
            <p className="text-white/80 text-sm">
              Manage how you receive payments from guests
            </p>
          </div>
        </div>
      </div>

      {/* Content based on state */}
      <div className="p-6 md:p-8">
        {currentState === "not_started" && (
          <NotStartedState
            onSetup={handleSetupPayouts}
            isLoading={onboardingPending}
          />
        )}

        {currentState === "in_progress" && (
          <InProgressState
            onContinue={handleSetupPayouts}
            isLoading={onboardingPending}
          />
        )}

        {currentState === "verification_pending" && (
          <VerificationPendingState />
        )}

        {currentState === "completed" && (
          <CompletedState
            onManage={handleManagePayouts}
            isLoading={dashboardPending}
          />
        )}
      </div>
    </div>
  );
};

// State: Not Started
const NotStartedState: React.FC<{
  onSetup: () => void;
  isLoading: boolean;
}> = ({ onSetup, isLoading }) => (
  <div className="space-y-6">
    <div className="text-center md:text-left">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Set up your payout method
      </h3>
      <p className="text-gray-600">
        Connect your bank account to receive payments from guests. We use Stripe
        for secure, fast payouts.
      </p>
    </div>

    {/* Features */}
    <div className="grid md:grid-cols-3 gap-4">
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">Fast Payouts</h4>
          <p className="text-sm text-gray-500">
            Receive payments within 2-7 business days
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Banknote className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">Direct Deposits</h4>
          <p className="text-sm text-gray-500">
            Bank transfers directly to your account
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Shield className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">Secure & Safe</h4>
          <p className="text-sm text-gray-500">
            Bank-level encryption and security
          </p>
        </div>
      </div>
    </div>

    <div className="flex justify-center md:justify-start">
      <Button
        type="primary"
        size="large"
        onClick={onSetup}
        loading={isLoading}
        className="bg-[#AF2322] hover:bg-[#8a1c1b] h-12 px-8 text-base font-semibold"
        icon={<ExternalLink className="h-4 w-4" />}
      >
        Set Up Payouts
      </Button>
    </div>

    <p className="text-xs text-gray-400 text-center md:text-left">
      You&apos;ll be redirected to Stripe to securely set up your bank account.
    </p>
  </div>
);

// State: In Progress
const InProgressState: React.FC<{
  onContinue: () => void;
  isLoading: boolean;
}> = ({ onContinue, isLoading }) => (
  <div className="space-y-6">
    <div className="flex items-start gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
      <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="font-semibold text-yellow-800">
          Payout setup incomplete
        </h3>
        <p className="text-yellow-700 text-sm mt-1">
          You started setting up your payouts but didn&apos;t finish. Complete
          your setup to start receiving payments from guests.
        </p>
      </div>
    </div>

    <div className="flex justify-center md:justify-start">
      <Button
        type="primary"
        size="large"
        onClick={onContinue}
        loading={isLoading}
        className="bg-[#AF2322] hover:bg-[#8a1c1b] h-12 px-8 text-base font-semibold"
        icon={<ExternalLink className="h-4 w-4" />}
      >
        Continue Setup
      </Button>
    </div>
  </div>
);

// State: Verification Pending
const VerificationPendingState: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
      <Clock className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5 animate-pulse" />
      <div>
        <h3 className="font-semibold text-blue-800">
          Verification in progress
        </h3>
        <p className="text-blue-700 text-sm mt-1">
          Stripe is reviewing your information. This usually takes 1-2 business
          days. You&apos;ll be able to receive payouts once verification is
          complete.
        </p>
      </div>
    </div>

    <div className="bg-gray-50 rounded-xl p-4">
      <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
      <ul className="text-sm text-gray-600 space-y-2">
        <li className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>Stripe verifies your identity and bank account</span>
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>You&apos;ll receive an email once approved</span>
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>Payouts will be automatically enabled</span>
        </li>
      </ul>
    </div>
  </div>
);

// State: Completed
const CompletedState: React.FC<{
  onManage: () => void;
  isLoading: boolean;
}> = ({ onManage, isLoading }) => (
  <div className="space-y-6">
    <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="font-semibold text-green-800">Payouts enabled</h3>
        <p className="text-green-700 text-sm mt-1">
          You&apos;re all set to receive payments! Earnings from your bookings
          will be automatically transferred to your bank account.
        </p>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        type="primary"
        size="large"
        onClick={onManage}
        loading={isLoading}
        className="bg-[#AF2322] hover:bg-[#8a1c1b] h-12 px-8 text-base font-semibold"
        icon={<ExternalLink className="h-4 w-4" />}
      >
        Manage Payouts
      </Button>
    </div>

    <p className="text-xs text-gray-400">
      View your payout history, update bank details, and manage your settings on
      Stripe.
    </p>
  </div>
);

// Loading Skeleton
const PayoutSetupSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
    <div className="bg-gradient-to-r from-gray-200 to-gray-300 px-6 py-5 md:px-8 md:py-6">
      <div className="flex items-center gap-3">
        <Skeleton.Avatar active size={48} shape="square" />
        <div className="space-y-2">
          <Skeleton.Input active style={{ width: 150 }} />
          <Skeleton.Input active style={{ width: 200 }} size="small" />
        </div>
      </div>
    </div>
    <div className="p-6 md:p-8">
      <Skeleton active paragraph={{ rows: 4 }} />
    </div>
  </div>
);

export default PayoutSetupCard;
