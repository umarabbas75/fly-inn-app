"use client";

import React, { Suspense } from "react";
import { Skeleton } from "antd";
import PayoutSetupCard from "./_components/PayoutSetupCard";

/**
 * Payouts Page
 * Allows hosts to set up and manage their Stripe Connect account for receiving payouts.
 * 
 * Routes:
 * - /dashboard/payouts - Main payouts page
 * - /dashboard/payouts?onboarding=complete - Return URL after Stripe onboarding
 */
const PayoutsPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Payouts
          </h1>
          <p className="text-gray-600 mt-2">
            Set up and manage how you receive payments from your bookings
          </p>
        </div>

        {/* Payout Setup Card - wrapped in Suspense for useSearchParams */}
        <Suspense fallback={<PayoutSetupSkeleton />}>
          <PayoutSetupCard />
        </Suspense>

        {/* Future sections can be added here */}
        {/* 
        <div className="mt-8">
          <EarningsOverview />
        </div>
        
        <div className="mt-8">
          <PayoutHistory />
        </div>
        */}
      </div>
    </div>
  );
};

// Fallback skeleton for Suspense
const PayoutSetupSkeleton = () => (
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

export default PayoutsPage;


