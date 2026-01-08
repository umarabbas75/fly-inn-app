"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Steps } from "@/components/ui/steps";
import BusinessDetail from "./BusinessDetail";
import SelectPaymentPlan from "./SelectPaymentPlan";
import Summary from "./Summary";
import Payment from "./Payment";

interface PaymentModalProps {
  isOpen: boolean;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  setIsModalOpen: (open: boolean) => void;
  businessData: any;
  businessTypes: string[];
  onSuccess: (paymentMethodId: string) => void;
  selectedPlanIndex: Record<string, number | null>;
  setSelectedPlanIndex: React.Dispatch<
    React.SetStateAction<Record<string, number | null>>
  >;
  selectedPlansAndBilling: Record<
    string,
    { freq: string; value: any; tiers: string }
  >;
  setSelectedPlansAndBilling: React.Dispatch<
    React.SetStateAction<
      Record<string, { freq: string; value: any; tiers: string }>
    >
  >;
  plans: Array<{
    name: string;
    price: number;
    product_id: string;
    price_id: string;
  }>;
  loadingPlans?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  currentStep,
  setCurrentStep,
  setIsModalOpen,
  businessData,
  businessTypes,
  onSuccess,
  selectedPlanIndex,
  setSelectedPlanIndex,
  selectedPlansAndBilling,
  setSelectedPlansAndBilling,
  plans,
  loadingPlans = false,
}) => {
  const steps = [
    { title: "Business Details", description: "" },
    { title: "Select Plan", description: "" },
    { title: "Summary", description: "" },
    { title: "Payment", description: "" },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessDetail
            businessData={businessData}
            setIsModalOpen={setIsModalOpen}
            setCurrentStep={setCurrentStep}
          />
        );
      case 2:
        return (
          <SelectPaymentPlan
            setCurrentStep={setCurrentStep}
            businessTypes={businessTypes}
            selectedPlanIndex={selectedPlanIndex}
            setSelectedPlanIndex={setSelectedPlanIndex}
            selectedPlansAndBilling={selectedPlansAndBilling}
            setSelectedPlansAndBilling={setSelectedPlansAndBilling}
            plans={plans}
            loadingPlans={loadingPlans}
          />
        );
      case 3:
        return (
          <Summary
            setCurrentStep={setCurrentStep}
            selectedPlansAndBilling={selectedPlansAndBilling}
            businessTypes={businessTypes}
          />
        );
      case 4:
        return (
          <Payment
            setIsModalOpen={setIsModalOpen}
            setCurrentStep={setCurrentStep}
            onSuccess={onSuccess}
            selectedPlansAndBilling={selectedPlansAndBilling}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsModalOpen(false);
          setCurrentStep(1);
        }
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <div className="py-4">
          <Steps
            current={currentStep - 1}
            items={steps}
            className="mb-4 sm:mb-6"
            size="small"
          />
          {renderStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
