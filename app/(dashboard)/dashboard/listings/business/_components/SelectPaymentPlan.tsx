"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button, Spin } from "antd";
import { CheckCircleOutlined, DollarOutlined } from "@ant-design/icons";
import { getBusinessSubTypeLabel } from "@/constants/business";
import { useApiGet } from "@/http-service";

const tiers = ["SILVER", "GOLD", "PLATINUM"];
const PLAN_FEATURES = [
  [
    "Full-Color listing",
    "Link to your website",
    "Fly-Inn Find game Participation",
    "Fly-Inn Plaque",
    "Instagram frame",
    "Blog just about YOU that links to your website",
    "First-Class Perks Pass",
  ],
  [
    "Full-Color listing",
    "Link to your website",
    "Fly-Inn Find game Participation",
    "Fly-Inn Plaque",
    "Instagram frame",
    "Blog just about YOU that links to your website",
    "First-Class Perks Pass",
    "$50 gift certificate plus another $50 gift certificate if you film your stay!",
    "15-second video in our social media accounts!",
  ],
  [
    "Full-Color listing",
    "Link to your website",
    "Fly-Inn Find game Participation",
    "Fly-Inn Plaque",
    "Instagram frame",
    "Blog just about YOU that links to your website",
    "First-Class Perks Pass",
    "$50 gift certificate plus another $50 gift certificate if you film your stay!",
    "30-second video in our social media accounts!",
    "Feature your business, FREE for 30 days",
    "Podcast/interview",
  ],
];

const PLAN_PRICING = [
  { yearly: 120, monthly: 15 },
  { yearly: 180, monthly: 27 },
  { yearly: 240, monthly: 36 },
];

interface SelectPaymentPlanProps {
  selectedPlanIndex: Record<string, number | null>;
  setSelectedPlanIndex: React.Dispatch<
    React.SetStateAction<Record<string, number | null>>
  >;
  plans: Array<{
    name: string;
    price: number;
    product_id: string;
    price_id: string;
    tier?: string;
    interval?: string;
  }>;
  setCurrentStep: (step: number) => void;
  businessTypes: string[];
  selectedPlansAndBilling: Record<
    string,
    { freq: string; value: any; tiers: string }
  >;
  setSelectedPlansAndBilling: React.Dispatch<
    React.SetStateAction<
      Record<string, { freq: string; value: any; tiers: string }>
    >
  >;
  loadingPlans?: boolean;
}

const SelectPaymentPlan: React.FC<SelectPaymentPlanProps> = ({
  selectedPlanIndex,
  setSelectedPlanIndex,
  plans,
  setCurrentStep,
  businessTypes,
  selectedPlansAndBilling,
  setSelectedPlansAndBilling,
  loadingPlans = false,
}) => {
  const billingRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleSelectPlan = (businessType: string, planIdx: number) => {
    setSelectedPlanIndex((prev) => ({
      ...prev,
      [businessType]: planIdx,
    }));
    setSelectedPlansAndBilling((prev) => ({
      ...prev,
      [businessType]: { freq: "", value: null, tiers: "" },
    }));

    setTimeout(() => {
      if (billingRefs.current[businessType]) {
        billingRefs.current[businessType]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  };

  const handleSelectBillingCycle = (
    businessType: string,
    freq: string,
    value: any,
    tierName: string
  ) => {
    setSelectedPlansAndBilling((prev) => ({
      ...prev,
      [businessType]: { freq, value, tiers: tierName },
    }));
  };

  const renderBillingOptions = (businessType: string) => {
    const selectedIdx = selectedPlanIndex[businessType];
    const currentBillingCycle = selectedPlansAndBilling[businessType];

    if (selectedIdx === null || selectedIdx === undefined) {
      return (
        <div className="text-center text-gray-600 p-4 bg-gray-50 rounded-xl mt-4 border-2 border-dashed border-gray-300">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 text-white text-xs font-bold">
              2
            </span>
            <span className="text-sm font-semibold text-gray-500">
              STEP 2: Choose Your Billing Cycle
            </span>
          </div>
          <DollarOutlined className="text-2xl mx-auto mb-2 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            Complete Step 1 first!
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Select Silver, Gold, or Platinum above to unlock billing options.
          </p>
        </div>
      );
    }

    const selectedTierName = tiers[selectedIdx];

    // IMPORTANT: Backend tier/interval fields are unreliable - parse from plan NAME instead
    // Plan names follow format: "Business Subscription {TIER} - {Monthly|Yearly}"
    const monthlyPlan = plans.find((plan) => {
      const nameUpper = plan.name.toUpperCase();
      const tierMatch = nameUpper.includes(selectedTierName);
      const isMonthly = nameUpper.includes("MONTHLY");
      return tierMatch && isMonthly;
    });

    const yearlyPlan = plans.find((plan) => {
      const nameUpper = plan.name.toUpperCase();
      const tierMatch = nameUpper.includes(selectedTierName);
      const isYearly = nameUpper.includes("YEARLY");
      return tierMatch && isYearly;
    });

    if (!monthlyPlan || !yearlyPlan) {
      return (
        <div className="text-center text-gray-900 p-4 bg-gray-50 rounded-xl mt-3">
          <p className="text-sm font-medium">
            Billing details for {selectedTierName} for "{businessType}" not
            found. Please try again later.
          </p>
          <p className="text-xs text-gray-600 mt-1">
            There might be an issue fetching plan details from our payment
            provider.
          </p>
        </div>
      );
    }

    const monthlyPriceYearly = monthlyPlan.price * 12;
    const yearlyPrice = yearlyPlan.price;
    const savings = monthlyPriceYearly - yearlyPrice;
    const savingsPercentage =
      monthlyPriceYearly > 0
        ? ((savings / monthlyPriceYearly) * 100).toFixed(0)
        : 0;

    return (
      <div className="mt-6 space-y-3 bg-gray-50 rounded-xl p-4">
        {/* STEP 2: Choose Billing Cycle */}
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#AF2322] text-white text-xs font-bold">
            2
          </span>
          <h3 className="text-sm font-semibold text-gray-900">
            STEP 2: Choose Your Billing Cycle
          </h3>
        </div>
        <p className="text-sm text-gray-600 ml-8 mb-3">
          You selected{" "}
          <span className="font-semibold text-[#AF2322]">
            {selectedTierName}
          </span>{" "}
          for "{getBusinessSubTypeLabel(businessType)}". Now choose monthly or
          yearly billing.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-2">
          <button
            type="button"
            className={`px-4 py-2 rounded-md text-sm font-medium border transition-all duration-150
            ${
              currentBillingCycle?.freq === "yearly"
                ? "bg-[#AF2322] text-white border-[#AF2322] ring-2 ring-[#AF2322]/20"
                : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectBillingCycle(
                businessType,
                "yearly",
                yearlyPlan,
                selectedTierName
              );
            }}
          >
            Pay Yearly – ${yearlyPlan.price}/year
          </button>

          <button
            type="button"
            className={`px-4 py-2 rounded-md text-sm font-medium border transition-all duration-150
            ${
              currentBillingCycle?.freq === "monthly"
                ? "bg-[#AF2322] text-white border-[#AF2322] ring-2 ring-[#AF2322]/20"
                : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectBillingCycle(
                businessType,
                "monthly",
                monthlyPlan,
                selectedTierName
              );
            }}
          >
            Pay Monthly – ${monthlyPlan.price}/month
          </button>
        </div>

        {savings > 0 && (
          <p className="text-center text-sm text-gray-600 mt-1">
            Save {savingsPercentage}% by choosing yearly billing (${savings}{" "}
            off)
          </p>
        )}

        {currentBillingCycle?.freq &&
          currentBillingCycle?.tiers === selectedTierName && (
            <div className="mt-3 text-center text-sm font-medium text-gray-700">
              You selected the{" "}
              <span className="text-[#AF2322] font-semibold">
                {selectedTierName}
              </span>{" "}
              plan for{" "}
              <span className="text-[#AF2322] font-semibold">
                "{getBusinessSubTypeLabel(businessType)}"
              </span>
              , billed{" "}
              <span className="text-[#AF2322] font-semibold">
                {currentBillingCycle.freq}
              </span>{" "}
              at{" "}
              <span className="text-[#AF2322] font-semibold">
                ${currentBillingCycle.value.price}
                {currentBillingCycle.freq === "yearly" ? "/year" : "/month"}
              </span>
              .
            </div>
          )}
      </div>
    );
  };

  // Show loading state only when actually loading, not when plans array is empty
  if (loadingPlans) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="flex flex-col items-center">
          <Spin size="large" className="mb-3" />
          <p className="text-sm text-gray-700">Loading plans...</p>
        </div>
      </div>
    );
  }

  // Show error if no plans after loading is complete
  if (!loadingPlans && (!plans || plans.length === 0)) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-900">
            No payment plans available. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const allPlansSelected = businessTypes.every((type) => {
    return (
      selectedPlanIndex[type] !== null &&
      selectedPlanIndex[type] !== undefined &&
      selectedPlansAndBilling[type]?.value?.product_id
    );
  });

  return (
    <div className="flex flex-col items-center w-full pb-4 !pt-0">
      {businessTypes.map((type, typeIdx) => (
        <div key={type} className="w-full mb-6">
          <h2 className="text-sm font-medium text-gray-900 text-center mb-4 bg-gray-50 py-2 rounded-lg px-3">
            Configure Plan for{" "}
            <span className="text-[#AF2322]">
              "{getBusinessSubTypeLabel(type)}"
            </span>
          </h2>

          {/* STEP 1: Choose Tier */}
          <div className="mb-2 px-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#AF2322] text-white text-xs font-bold">
                1
              </span>
              <h3 className="text-sm font-semibold text-gray-900">
                STEP 1: Choose Your Plan Tier
              </h3>
            </div>
            <p className="text-sm text-gray-600 ml-8">
              Select Silver, Gold, or Platinum based on the features you need.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full justify-center px-2">
            {PLAN_PRICING.map((plan, planIdx) => (
              <div
                key={planIdx}
                className={`flex-1 border-solid hover:border-gray-500 hover:border-solid hover:border rounded-lg shadow-sm border-1 transition-all duration-200 bg-white px-3 py-3 flex flex-col items-center cursor-pointer relative
                  ${
                    selectedPlanIndex[type] === planIdx
                      ? "border-gray-700 ring-2 ring-gray-700/20 shadow-md z-10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                onClick={() => handleSelectPlan(type, planIdx)}
              >
                <div className="mb-3 w-full">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 text-center">
                    {tiers[planIdx]} Plan
                  </h3>
                  <ul className="text-left space-y-1 !pl-0 mt-2">
                    {PLAN_FEATURES[planIdx].map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-1.5 text-sm text-gray-700"
                      >
                        <CheckCircleOutlined className="w-3.5 h-3.5 text-[#AF2322] mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className={`mt-auto mb-1 rounded-lg flex flex-col items-center py-2 rounded-b-lg w-[calc(100%+2px)] -mx-3 border-t border-gray-100 transition-all duration-200 cursor-pointer
                    ${
                      selectedPlanIndex[type] === planIdx
                        ? "bg-gray-700 !text-white"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-900"
                    }`}
                >
                  <span
                    className={`text-lg font-bold mb-0.5 ${
                      selectedPlanIndex[type] === planIdx ? "!text-white" : ""
                    }`}
                  >
                    ${plan.yearly}
                    <span
                      className={`text-xs font-normal ${
                        selectedPlanIndex[type] === planIdx
                          ? " !text-white"
                          : ""
                      }`}
                    >
                      /year
                    </span>
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      selectedPlanIndex[type] === planIdx ? "!text-white" : ""
                    }`}
                  >
                    or ${plan.monthly}/month
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div
            ref={(el) => {
              billingRefs.current[type] = el;
            }}
            className="w-full mt-4"
          >
            {renderBillingOptions(type)}
          </div>
          {typeIdx < businessTypes.length - 1 && (
            <hr className="my-6 border-t border-gray-200" />
          )}
        </div>
      ))}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-between w-full px-2">
        <Button
          className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors duration-200"
          onClick={() => setCurrentStep(1)}
        >
          Back
        </Button>
        <Button
          type="primary"
          className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
            ${
              allPlansSelected
                ? "bg-[#AF2322] text-white hover:bg-[#9e1f1a]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          onClick={() => allPlansSelected && setCurrentStep(3)}
          disabled={!allPlansSelected}
        >
          Next: Summary
        </Button>
      </div>
    </div>
  );
};

export default SelectPaymentPlan;
