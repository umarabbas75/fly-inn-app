"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Steps } from "@/components/ui/steps";
import SelectPaymentPlan from "./SelectPaymentPlan";
import UpdateSummary from "./UpdateSummary";
import Payment from "./Payment";

interface UpdatePlanModalProps {
  isOpen: boolean;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  setIsModalOpen: (open: boolean) => void;
  businessId: string;
  businessType: string;
  onSuccess: () => void;
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

const UpdatePlanModal: React.FC<UpdatePlanModalProps> = ({
  isOpen,
  currentStep,
  setCurrentStep,
  setIsModalOpen,
  businessId,
  businessType,
  onSuccess,
  selectedPlanIndex,
  setSelectedPlanIndex,
  selectedPlansAndBilling,
  setSelectedPlansAndBilling,
  plans,
  loadingPlans = false,
}) => {
  const steps = [
    { title: "Select Plan", description: "" },
    { title: "Summary", description: "" },
    { title: "Payment", description: "" },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <SelectPaymentPlan
            setCurrentStep={setCurrentStep}
            businessTypes={[businessType]}
            selectedPlanIndex={selectedPlanIndex}
            setSelectedPlanIndex={setSelectedPlanIndex}
            selectedPlansAndBilling={selectedPlansAndBilling}
            setSelectedPlansAndBilling={setSelectedPlansAndBilling}
            plans={plans}
            loadingPlans={loadingPlans}
          />
        );
      case 2:
        const billingCycle = selectedPlansAndBilling[businessType];
        if (!billingCycle || !billingCycle.value) {
          return (
            <div className="text-center py-8">
              <p className="text-gray-600">
                Please select a plan first before proceeding.
              </p>
              <button
                onClick={() => setCurrentStep(1)}
                className="mt-4 px-4 py-2 bg-[#AF2322] text-white rounded-lg hover:bg-[#9e1f1a]"
              >
                Back to Plans
              </button>
            </div>
          );
        }
        return (
          <UpdateSummary
            setCurrentStep={setCurrentStep}
            billingCycle={billingCycle}
          />
        );
      case 3:
        return (
          <Payment
            setIsModalOpen={setIsModalOpen}
            setCurrentStep={setCurrentStep}
            onSuccess={onSuccess}
            selectedPlansAndBilling={selectedPlansAndBilling}
            isUpdatePlan={true}
            businessId={businessId}
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

export default UpdatePlanModal;
