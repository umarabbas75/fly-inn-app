"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useApiGet } from "@/http-service";
import { keepPreviousData } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import BookingSummary from "./_components/BookingSummary";
import PaymentSection from "./_components/PaymentSection";

const ReservePage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const stayId = params?.id as string;

  // Extract booking parameters from URL
  const bookingParams = {
    arrival_date: searchParams?.get("arrival_date") || "",
    departure_date: searchParams?.get("departure_date") || "",
    guests: parseInt(searchParams?.get("guests") || "1"),
    children: parseInt(searchParams?.get("children") || "0"),
    infants: parseInt(searchParams?.get("infants") || "0"),
    pets: parseInt(searchParams?.get("pets") || "0"),
  };

  // Build query string for stay API
  const queryString = searchParams?.toString() || "";
  const stayEndpoint = queryString
    ? `/api/stays/${stayId}/public?${queryString}`
    : `/api/stays/${stayId}/public`;

  // Fetch stay data with pricing
  const {
    data: stayData,
    isLoading: isLoadingStay,
    error: stayError,
  } = useApiGet({
    endpoint: stayEndpoint,
    queryKey: ["stay-reserve", stayId, queryString],
    config: {
      enabled: !!stayId,
      placeholderData: keepPreviousData,
    },
  });

  // Fetch payment methods (requires authentication)
  const {
    data: paymentMethodsData,
    isLoading: isLoadingPayments,
    refetch: refetchPaymentMethods,
  } = useApiGet({
    endpoint: "/api/payments/methods",
    queryKey: ["payment-methods"],
    config: {
      retry: false,
    },
  });

  const isLoading = isLoadingStay;

  if (isLoading && !stayData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-600">Loading reservation details...</p>
        </div>
      </div>
    );
  }

  if (stayError || !stayData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Reservation
          </h2>
          <p className="text-gray-600">
            We couldn&apos;t load the stay details. Please go back and try
            again.
          </p>
          <button
            onClick={() => window.close()}
            className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Cast to any for flexibility
  const stay = stayData as any;
  const paymentMethods = paymentMethodsData as any;
  console.log({ paymentMethodsData });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="app-container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Confirm and pay</h1>
          <p className="text-gray-600 mt-2">
            Review your booking details before confirming.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Booking Summary */}
          <div className="lg:col-span-1">
            <BookingSummary stayData={stay} bookingParams={bookingParams} />
          </div>

          {/* Right Column - Payment Section */}
          <div className="lg:col-span-1">
            <PaymentSection
              stayData={stay}
              bookingParams={bookingParams}
              paymentMethods={paymentMethods}
              isLoadingPayments={isLoadingPayments}
              onPaymentMethodAdded={refetchPaymentMethods}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservePage;
