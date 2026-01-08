"use client";

import React from "react";
import { Button, Card, Alert } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface UpdateSummaryProps {
  setCurrentStep: (step: number) => void;
  billingCycle: {
    freq: string;
    value: any;
    tiers: string;
  };
}

const UpdateSummary: React.FC<UpdateSummaryProps> = ({
  setCurrentStep,
  billingCycle,
}) => {
  const isYearly = billingCycle.freq === "yearly";
  const displayedPrice = billingCycle.value?.price || 0;
  const tierName = billingCycle.tiers;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
          Order Summary
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Review your selected plan before proceeding to payment.
        </p>
      </div>

      {/* Warning Message */}
      <Alert
        message="Important"
        description="This action will replace your previous subscription plan. Any subscription fees already paid will not be refunded."
        type="warning"
        icon={<ExclamationCircleOutlined />}
        showIcon
        className="mb-6"
      />

      {/* Plan Details */}
      <Card className="bg-gradient-to-r from-gray-50 to-white border border-gray-200">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                Membership Plan
              </h3>
              <span className="inline-block bg-red-100 text-red-700 font-bold rounded-full px-3 py-1 text-xs sm:text-sm uppercase tracking-wide">
                {tierName || "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-gray-100 rounded-lg px-3 py-1 text-sm font-medium">
                {isYearly ? "Annual Billing" : "Monthly Billing"}
              </div>
              {isYearly && (
                <div className="bg-green-100 text-green-700 rounded-lg px-3 py-1 text-sm font-medium">
                  Save 20%
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-700">Base Plan</h4>
                <p className="text-sm text-gray-500 mt-1">
                  {isYearly
                    ? "Annual subscription (12 months)"
                    : "Monthly subscription"}
                </p>
              </div>
              <span className="font-medium text-gray-800">
                ${displayedPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div>
                <h4 className="font-medium text-gray-700">Billing Cycle</h4>
                <p className="text-sm text-gray-500 mt-1">
                  {isYearly ? "Charged annually" : "Charged monthly"}
                </p>
              </div>
              <span className="text-sm text-gray-600">
                {isYearly ? "Per year" : "Per month"}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Total Amount */}
      <Card className="bg-gradient-to-r from-gray-50 to-white border border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700">
            Total Amount
          </h3>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              ${displayedPrice.toFixed(2)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {isYearly ? "Billed annually" : "Billed monthly"}
            </p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between mt-6 pt-6 border-t border-gray-200">
        <Button className="w-full sm:w-auto" onClick={() => setCurrentStep(1)}>
          Back to Plans
        </Button>
        <Button
          type="primary"
          className="bg-[#AF2322] hover:bg-[#9e1f1a] w-full sm:w-auto"
          onClick={() => setCurrentStep(3)}
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};

export default UpdateSummary;
