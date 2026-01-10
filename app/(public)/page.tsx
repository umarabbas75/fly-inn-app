"use client";

import { useMemo, useEffect } from "react";
import MagazineEndorsementsSection from "./_components/magazine-endorsements-section";
import PromisesSection from "./_components/promises-section";
import FindSpacesSection from "./_components/find-spaces-section";
import SharePropertySection from "./_components/share-property-section";
import FeaturedStaysSection from "./_components/featured-stays-section";
import FlyInnDifferenceSection from "./_components/flyinn-difference-section";
import TestimonialsSection from "./_components/testimonials-section";
import AppPromotionSection from "./_components/app-promotion-section";
import NewsletterSection from "./_components/newsletter-section";
import HeroSection from "./_components/hero-section";
import { useApiGet } from "@/http-service";
import Loading from "@/src/components/Loading";
import { useFilter } from "@/components/app-layouts/public-layout/filter-links";

interface Stay {
  id: number;
  title: string;
  nightly_price: string;
  latitude: string;
  longitude: string;
  fake_latitude?: string | null;
  fake_longitude?: string | null;
  images?: Array<{ url: string; image: string }>;
  rating?: number;
  reviews_count?: number;
  no_of_bedrooms?: number;
  no_of_bathrooms?: string;
  no_of_guest?: number;
  address?: string;
  city?: string;
  state?: string;
}

interface Business {
  business_id: number;
  name: string;
  latitude?: number | null;
  longitude?: number | null;
  type?: string;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  airport?: string;
  distance_from_runway?: string;
  images?: Array<{ url: string; image: string }>;
}

export default function Home() {
  const {
    selectedFilter,
    selectedBusinessSubtype,
    distanceFromRunwayFilter,
    isMapVisible,
    setIsMapVisible,
  } = useFilter();

  // Build the endpoint with distance filter if selected
  const staysEndpoint = useMemo(() => {
    if (distanceFromRunwayFilter !== null) {
      return `/stays/public?distance_from_runway=${distanceFromRunwayFilter}`;
    }
    return "/stays/public";
  }, [distanceFromRunwayFilter]);

  const {
    data: staysData,
    isLoading: staysLoading,
    error: staysError,
  } = useApiGet({
    endpoint: staysEndpoint,
    queryKey: ["public-stays", distanceFromRunwayFilter],
    config: {
      refetchOnWindowFocus: false,
    },
    axiosConfig: {
      baseURL: process.env.NEXT_PUBLIC_API_URI,
    },
  });

  const {
    data: businessesData,
    isLoading: businessesLoading,
    error: businessesError,
  } = useApiGet({
    endpoint: "/api/business?limit=2000",
    queryKey: ["public-businesses"],
    config: {
      refetchOnWindowFocus: false,
    },
  });

  // Extract stays from response - handle both array and object responses
  const stays = useMemo(() => {
    if (!staysData) return [];

    // If it's already an array, return it
    if (Array.isArray(staysData)) {
      return staysData;
    }

    // If it's wrapped in a data property
    if (staysData?.data && Array.isArray(staysData.data)) {
      return staysData.data;
    }

    // If it's wrapped in a stays property
    if (staysData?.stays && Array.isArray(staysData.stays)) {
      return staysData.stays;
    }

    return [];
  }, [staysData]);

  // Extract businesses from response
  const businesses = useMemo(() => {
    if (!businessesData) return [];
    const businessesList =
      businessesData?.businesses || businessesData?.data?.businesses || [];

    // Log businesses without coordinates for debugging
    const businessesWithoutCoords = businessesList.filter(
      (b: Business) => !b.latitude || !b.longitude
    );
    if (businessesWithoutCoords.length > 0) {
      console.warn(
        `${businessesWithoutCoords.length} businesses missing coordinates:`,
        businessesWithoutCoords.map((b: Business) => ({
          id: b.business_id,
          name: b.name,
          airport: b.airport,
        }))
      );
    }

    return businessesList;
  }, [businessesData]);

  // Filter businesses based on selected subtype
  const filteredBusinesses = useMemo(() => {
    if (!selectedBusinessSubtype) return businesses;
    return businesses.filter(
      (b: Business) => b.type === selectedBusinessSubtype
    );
  }, [businesses, selectedBusinessSubtype]);

  console.log({
    staysData,
    stays,
    businessesData,
    businesses,
    filteredBusinesses,
    selectedFilter,
    selectedBusinessSubtype,
    distanceFromRunwayFilter,
    staysEndpoint,
    businessesWithCoords: businesses.filter(
      (b: Business) => b.latitude && b.longitude
    ).length,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <HeroSection
          filter={selectedFilter}
          stays={selectedFilter === "stays" ? stays : []}
          businesses={selectedFilter === "business" ? filteredBusinesses : []}
          isLoading={staysLoading || businessesLoading}
          onMapVisibilityChange={setIsMapVisible}
          staysError={staysError}
          businessesError={businessesError}
        />

        {/* Magazine Endorsements */}
        <MagazineEndorsementsSection />

        {/* Find Spaces Section */}
        <FindSpacesSection />

        {/* Share Your Property Section */}
        {/* <SharePropertySection /> */}

        {/* Featured Stays Section */}
        <FeaturedStaysSection />

        {/* Fly-Inn Difference Section */}
        <FlyInnDifferenceSection />

        {/* Testimonials Section */}
        {/* <TestimonialsSection /> */}

        {/* App Promotion Section */}
        {/* <AppPromotionSection /> */}
        {/* 5 Promises Section */}
        {/* <PromisesSection /> */}
        {/* Newsletter Section */}
        <section className="bg-gray-100">
          <div className="app-container py-12">
            <NewsletterSection />
          </div>
        </section>
      </main>
    </div>
  );
}
