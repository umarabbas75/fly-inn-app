"use client";

import React from "react";
import { Button, Card } from "antd";
import { getBusinessSubTypeLabel } from "@/constants/business";

interface SummaryProps {
  setCurrentStep: (step: number) => void;
  selectedPlansAndBilling: Record<
    string,
    { freq: string; value: any; tiers: string }
  >;
  businessTypes: string[];
}

const Summary: React.FC<SummaryProps> = ({
  setCurrentStep,
  selectedPlansAndBilling,
  businessTypes,
}) => {
  // Filter selectedPlansAndBilling to only include current businessTypes
  // This prevents stale data from previous selections being included in the total
  const filteredPlans = Object.entries(selectedPlansAndBilling)
    .filter(([key]) => businessTypes.includes(key))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as typeof selectedPlansAndBilling);

  const totalAmount = Object.values(filteredPlans).reduce((acc, plan) => {
    return acc + (plan.value?.price || 0);
  }, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
        Order Summary
      </h2>
      <p className="text-sm sm:text-base text-gray-600">
        Review your selected plans before proceeding to payment.
      </p>

      {Object.keys(filteredPlans).length > 0 ? (
        <>
          {businessTypes.map((type) => {
            const planDetails = filteredPlans[type];
            if (!planDetails || !planDetails.value) return null;

            const isYearly = planDetails.freq === "yearly";
            const displayedPrice = planDetails.value.price;
            const tierName = planDetails.tiers;

            return (
              <Card key={type} className="mb-4">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
                        Plan for{" "}
                        <span className="text-red-600">
                          "{getBusinessSubTypeLabel(type)}"
                        </span>
                      </h3>
                      <span className="inline-block bg-red-100 text-red-700 font-bold rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm uppercase tracking-wide">
                        {tierName || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <div>
                      <span className="text-sm sm:text-base text-gray-700">
                        Base Plan Cost
                      </span>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {isYearly
                          ? "Annual subscription (12 months)"
                          : "Monthly subscription"}
                      </p>
                    </div>
                    <span className="text-sm sm:text-base font-medium text-gray-800">
                      ${displayedPrice?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <div>
                      <span className="text-sm sm:text-base text-gray-700">
                        Billing Cycle
                      </span>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {isYearly ? "Billed annually" : "Billed monthly"}
                      </p>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600">
                      {isYearly ? "Per year" : "Per month"}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}

          <Card className="bg-gradient-to-r from-red-50 to-white border border-red-200">
            <div className="flex justify-between items-center">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-red-800">
                Overall Total
              </h3>
              <div className="text-right">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-900">
                  ${totalAmount.toFixed(2)}
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  This total will be charged{" "}
                  {Object.keys(filteredPlans).length > 1
                    ? "based on your selections"
                    : "according to your plan"}
                  .
                </p>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <Card>
          <p className="text-center text-gray-600">
            No plans selected yet. Please go back and select plans.
          </p>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
        <Button className="w-full sm:w-auto" onClick={() => setCurrentStep(2)}>
          Back to Plans
        </Button>
        <Button
          type="primary"
          className="bg-[#AF2322] hover:bg-[#9e1f1a] w-full sm:w-auto"
          onClick={() => setCurrentStep(4)}
          disabled={Object.keys(filteredPlans).length === 0}
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};

export default Summary;
