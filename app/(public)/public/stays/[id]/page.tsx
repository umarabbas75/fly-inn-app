"use client";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Spin, Alert } from "antd";
import NewsletterSection from "../../../_components/newsletter-section";
import { useApiGet } from "@/http-service";
import { keepPreviousData } from "@tanstack/react-query";

import { HeroImagesSection } from "./_components/hero-section";
import FeatureDetails from "./_components/feature-details";
import AirportDetails from "./_components/airport-details";
import StayInfo from "./_components/stay-info";
import BedroomSection from "./_components/bedrooms";
import MapLocation from "./_components/map-location";
import HouseRules from "./_components/house-rules";
import CancellationPolicy from "./_components/cancellation-policy";
import AvailabilityCalendar from "./_components/availability-calendar";
import SimilarStays from "./_components/similar-stays";
import HostCard from "./_components/host-details";
import TitleLocation from "./_components/title-location";
import Description from "./_components/description";
import SummaryCard from "./_components/summary-card";
import BookingCard from "./_components/booking-card";
import HostListings from "./_components/host-listings";

const StayDetails = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const stayId = params?.id as string;

  // Build query string from search params
  const queryString = searchParams?.toString() || "";

  // Build endpoint with query parameters for pricing calculation
  const endpoint = queryString
    ? `/api/stays/${stayId}/public?${queryString}`
    : `/api/stays/${stayId}/public`;

  // Fetch stay details from API (via BFF route)
  // Using placeholderData to keep showing previous data while fetching new data
  const {
    data: stayData,
    isLoading,
    isFetching,
    error,
  } = useApiGet({
    endpoint,
    queryKey: ["stay-details-public", stayId, queryString],
    config: {
      enabled: !!stayId,
      placeholderData: keepPreviousData,
    },
  });

  // Only show full-page loader on initial load (no previous data)
  if (isLoading && !stayData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Loading stay details..." />
      </div>
    );
  }

  if (error || !stayData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert
          message="Error Loading Stay"
          description="The stay you're looking for could not be found or there was an error loading it."
          type="error"
          showIcon
        />
      </div>
    );
  }

  // Cast to any since useApiGet with keepPreviousData has complex type inference
  const listing = stayData as any;
  return (
    <div className="py-12">
      <main className="app-container">
        <TitleLocation mockListing={listing} />

        <HeroImagesSection images={listing?.images} />

        <div className="flex flex-col md:grid md:grid-cols-3 gap-8 mt-8">
          <div className="order-2 md:order-1 md:col-span-2">
            <SummaryCard mockListing={listing} />

            <Description mockListing={listing} />

            <AirportDetails airports={listing?.airports} />

            <StayInfo listing={listing} />

            <BedroomSection bedrooms={listing?.bedrooms} />

            <FeatureDetails features={listing?.features} />

            <MapLocation listing={listing} />

            <HouseRules mockListing={listing} />

            <CancellationPolicy mockListing={listing} />

            <div className="print-hidden">
              <AvailabilityCalendar blockedDates={listing?.blocked_dates} />
            </div>
          </div>

          <div className="order-1 md:order-2 md:col-span-1">
            <BookingCard mockListing={listing} isFetching={isFetching} />
          </div>
        </div>
      </main>

      <div className="app-container print-hidden">
        <SimilarStays stayId={stayId} />

        {listing?.host?.id && (
          <HostListings
            hostId={listing.host.id}
            hostName={listing.host.display_name}
            currentStayId={stayId}
          />
        )}

        <HostCard
          host={listing.host}
          listingCount={listing.host.listing_count}
        />
      </div>

      <section className="bg-gray-100 print-hidden">
        <div className="app-container py-12">
          <NewsletterSection />
        </div>
      </section>

      {/* Print-only footer */}
      <div className="print-only text-center mt-8 pt-4 border-t border-gray-300">
        <p className="text-lg font-semibold text-primary">
          Fly-Inn and Stay Awhile!
        </p>
        <p className="text-sm text-gray-600">
          <a href="https://fly-inn.com" className="text-primary">
            Fly-inn.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default StayDetails;
