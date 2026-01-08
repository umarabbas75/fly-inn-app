"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApiGet } from "@/http-service";
import { Spin, message } from "antd";
import BookingSummary from "./_components/BookingSummary";
import PaymentSection from "./_components/PaymentSection";

// Dummy data for development
const dummyStayData = {
  id: 163,
  title: "(5B6) Falmouth Airpark - Cape Cod Home On The Runway",
  stay_type: "Hangar Home",
  no_of_bedrooms: 3,
  no_of_bathrooms: "2.50",
  city: "Falmouth",
  state: "MA",
  cleaning_fee: "225.00",
  tax_percentage: "7.00",
  images: [
    {
      id: 2348,
      image:
        "https://s3.amazonaws.com/flyinn-app-bucket/listing/1743786206_IMG_3082.jpg",
      sort_order: 0,
      description: "",
    },
  ],
  rules: {
    children_allowed: 1,
    pets_allowed: 0,
    additional_guest: 1,
  },
  max_children: 2,
  max_infants: 1,
  max_pets: 0,
  additional_guests: 2,
};

const dummyPricingData = {
  nightly_price: 395.0,
  weekend_price: 450.0,
  weekly_discount: 0.1,
  monthly_discount: 0.15,
};

const ReservePage = () => {
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState<any>(null);

  // Extract query parameters
  const stayId = searchParams.get("stay_id");
  const checkIn = searchParams.get("check_in");
  const checkOut = searchParams.get("check_out");
  const noOfAdults = searchParams.get("no_of_adults");
  const noOfChildren = searchParams.get("no_of_children");
  const noOfInfants = searchParams.get("no_of_infants");
  const noOfPets = searchParams.get("no_of_pets");
  const nightlyPrice = searchParams.get("nightly_price");

  // For development, use dummy data instead of API calls
  useEffect(() => {
    // Simulate API loading delay
    const timer = setTimeout(() => {
      const mockBookingData = {
        stay: dummyStayData,
        pricing: dummyPricingData,
        booking: {
          checkIn: checkIn || "2025-09-24T00:00:00.000Z",
          checkOut: checkOut || "2025-09-27T00:00:00.000Z",
          noOfAdults: parseInt(noOfAdults || "2"),
          noOfChildren: parseInt(noOfChildren || "1"),
          noOfInfants: parseInt(noOfInfants || "0"),
          noOfPets: parseInt(noOfPets || "0"),
          nightlyPrice: parseFloat(nightlyPrice || "395.00"),
        },
      };

      console.log("🎯 Reserve Page - Dummy Data Loaded:", mockBookingData);
      setBookingData(mockBookingData);
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    checkIn,
    checkOut,
    noOfAdults,
    noOfChildren,
    noOfInfants,
    noOfPets,
    nightlyPrice,
  ]);

  // Log URL parameters for debugging
  useEffect(() => {
    console.log("🔍 Reserve Page - URL Parameters:", {
      stayId,
      checkIn,
      checkOut,
      noOfAdults,
      noOfChildren,
      noOfInfants,
      noOfPets,
      nightlyPrice,
    });
  }, [
    stayId,
    checkIn,
    checkOut,
    noOfAdults,
    noOfChildren,
    noOfInfants,
    noOfPets,
    nightlyPrice,
  ]);

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="text-gray-600 mt-4">Loading booking information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="app-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Confirm Your Booking
          </h1>
          <p className="text-gray-600 mt-2">
            Review your trip details and complete payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Section */}
          <div className="lg:col-span-1">
            <PaymentSection bookingData={bookingData} />
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-2">
            <BookingSummary bookingData={bookingData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservePage;
