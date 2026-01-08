"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Tag, message } from "antd";
import { StarOutlined } from "@ant-design/icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useApiGet, useApiMutation } from "@/http-service";
import { useApp } from "@/providers/AppMessageProvider";

interface StayListing {
  id: number;
  host_id: number;
  title: string;
  city: string;
  state: string;
}

interface FeaturedUpgradeModalProps {
  open: boolean;
  onClose: () => void;
  stay: StayListing | null;
  targetUserId: number | null;
  isAdmin: boolean;
  onSuccess: () => void;
}

const FeaturedUpgradeModal: React.FC<FeaturedUpgradeModalProps> = ({
  open,
  onClose,
  stay,
  targetUserId,
  isAdmin,
  onSuccess,
}) => {
  const router = useRouter();
  const { message: appMessage } = useApp();
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(null);

  // Fetch payment methods based on targetUserId
  const { data: paymentMethodsData, isLoading: isLoadingPaymentMethods } =
    useApiGet({
      endpoint: targetUserId
        ? `/api/payments/methods?user_id=${targetUserId}`
        : "/api/payments/methods",
      queryKey: ["payment-methods", targetUserId, stay?.id],
      config: {
        select: (res) => res?.data || res?.payment_methods || [],
        enabled: open && stay !== null, // Only fetch when modal is open and stay is set
      },
    });

  const paymentMethods: Array<{
    id: string;
    type: string;
    card?: {
      brand: string;
      last4: string;
      exp_month: number;
      exp_year: number;
    };
    is_default?: boolean;
  }> = paymentMethodsData || [];

  // Auto-select default payment method when payment methods load
  useEffect(() => {
    if (
      paymentMethods.length > 0 &&
      !selectedPaymentMethodId &&
      !isLoadingPaymentMethods &&
      open
    ) {
      const defaultMethod = paymentMethods.find((pm) => pm.is_default);
      if (defaultMethod) {
        setSelectedPaymentMethodId(defaultMethod.id);
      } else {
        // If no default, select the first one
        setSelectedPaymentMethodId(paymentMethods[0].id);
      }
    }
  }, [paymentMethods, selectedPaymentMethodId, isLoadingPaymentMethods, open]);

  // Purchase featured status mutation
  const { mutate: purchaseFeatured, isPending: purchasingFeatured } =
    useApiMutation({
      endpoint: `/api/stays/${stay?.id}/purchase-featured`,
      method: "post",
      config: {
        onSuccess: () => {
          appMessage.success("Stay upgraded to featured successfully!");
          // Reset state and close modal
          setSelectedPaymentMethodId(null);
          onClose();
          onSuccess();
        },
        onError: (err) => {
          appMessage.error(
            err?.response?.data?.message || "Failed to upgrade stay to featured"
          );
        },
      },
    });

  const handleClose = () => {
    if (!purchasingFeatured) {
      setSelectedPaymentMethodId(null);
      onClose();
    }
  };

  const handlePurchase = () => {
    if (!selectedPaymentMethodId) {
      appMessage.error("Please select a payment method");
      return;
    }
    if (!stay) {
      appMessage.error("Stay information is missing");
      return;
    }
    purchaseFeatured({
      stay_id: stay.id,
      payment_method_id: selectedPaymentMethodId,
      admin_payment: false,
    });
  };

  if (!stay) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-[600px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StarOutlined className="text-yellow-500" />
            Upgrade to Featured
          </DialogTitle>
          <DialogDescription>
            Feature your stay for $49/week subscription. Featured stays are
            displayed prominently in listings and get more visibility.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Stay Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold text-gray-900 mb-1">{stay.title}</p>
            <p className="text-sm text-gray-600">
              {stay.city}, {stay.state}
            </p>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Payment Method
              {isAdmin && (
                <span className="text-xs text-gray-500 ml-2 font-normal">
                  (Stay owner's payment methods)
                </span>
              )}
            </label>
            {isLoadingPaymentMethods ? (
              <div className="text-center py-4">
                <span className="text-gray-500">
                  Loading payment methods...
                </span>
              </div>
            ) : paymentMethods.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 mb-2">
                  No payment methods found. Please add a payment method first.
                </p>
                <Button
                  type="link"
                  onClick={() => {
                    router.push("/dashboard/settings");
                    handleClose();
                  }}
                  className="p-0 h-auto"
                >
                  Go to Settings
                </Button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {paymentMethods.map((pm) => (
                  <div
                    key={pm.id}
                    onClick={() => setSelectedPaymentMethodId(pm.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPaymentMethodId === pm.id
                        ? "border-[#AF2322] bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedPaymentMethodId === pm.id
                              ? "border-[#AF2322] bg-[#AF2322]"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedPaymentMethodId === pm.id && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {pm.card?.brand
                                ? pm.card.brand.charAt(0).toUpperCase() +
                                  pm.card.brand.slice(1)
                                : "Card"}{" "}
                              •••• {pm.card?.last4}
                            </span>
                            {pm.is_default && <Tag color="blue">Default</Tag>}
                          </div>
                          <p className="text-xs text-gray-500">
                            Expires {pm.card?.exp_month}/
                            {pm.card?.exp_year?.toString().slice(-2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Featured Subscription</span>
              <div className="text-right">
                <span className="font-semibold text-gray-900">$49.00 USD</span>
                <span className="text-sm text-gray-500 ml-1">/week</span>
              </div>
            </div>
            {/* <p className="text-xs text-gray-500 mt-2">
              Billed weekly. You can cancel anytime from your dashboard.
            </p> */}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleClose} disabled={purchasingFeatured}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handlePurchase}
            loading={purchasingFeatured}
            disabled={!selectedPaymentMethodId || purchasingFeatured}
            className="bg-[#AF2322] hover:bg-[#8f1d1c] text-white"
          >
            {purchasingFeatured
              ? "Processing..."
              : "Subscribe to Featured ($49/week)"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeaturedUpgradeModal;
