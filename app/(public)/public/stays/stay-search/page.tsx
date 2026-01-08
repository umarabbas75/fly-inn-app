"use client";

import React, { useState, useMemo } from "react";
import { Button, Spin, Alert } from "antd";
import RelevantListing from "./_components/relevant-listing";
import GoogleMapComponent from "../../../../../components/shared/map";
import { useSearchParams, useRouter } from "next/navigation";
import { useApiGet } from "@/http-service";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Build API endpoint with query parameters
  const apiEndpoint = useMemo(() => {
    if (!searchParams || searchParams.toString() === "") {
      return "/api/stays/public";
    }

    // Pass through all query parameters directly to the API
    // They already match the backend format: city, arrival_date, departure_date, guests, children, infants, pets, etc.
    return `/api/stays/public?${searchParams.toString()}`;
  }, [searchParams]);

  // API call for stays search
  const {
    data: staysData,
    isLoading,
    error,
  } = useApiGet({
    endpoint: apiEndpoint,
    queryKey: ["stays-search", searchParams?.toString() || ""],
    config: {
      refetchOnWindowFocus: false,
    },
  });

  // Extract stays from API response
  const stays = useMemo(() => {
    if (!staysData) return [];
    return staysData?.stays || [];
  }, [staysData]);

  // Get search summary for display
  const searchSummary = useMemo(() => {
    const parts: string[] = [];

    const city = searchParams?.get("city");
    const arrivalDate = searchParams?.get("arrival_date");
    const departureDate = searchParams?.get("departure_date");
    const guests = searchParams?.get("guests");

    if (city) parts.push(city);
    if (arrivalDate && departureDate) {
      parts.push(`${arrivalDate} to ${departureDate}`);
    }
    if (guests) parts.push(`${guests} guest${parseInt(guests) > 1 ? "s" : ""}`);

    return parts.length > 0 ? parts.join(" · ") : null;
  }, [searchParams]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="app-container my-10">
        <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-gray-600">Searching for stays...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="app-container my-10">
        <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
          <Alert
            message="Search Error"
            description="Failed to load search results. Please try again."
            type="error"
            showIcon
            action={
              <Button size="small" onClick={() => window.location.reload()}>
                Retry
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  // Show no results state
  if (!stays || stays.length === 0) {
    return (
      <div className="app-container my-10">
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No stays found
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We couldn&apos;t find any stays matching your search criteria. Try
            adjusting your filters or search terms.
          </p>
          <Button type="primary" size="large" onClick={() => router.push("/")}>
            Browse All Stays
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container my-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {stays.length} stay{stays.length > 1 ? "s" : ""} found
        </h1>
        {searchSummary && <p className="text-gray-600">{searchSummary}</p>}
      </div>

      {/* Two Column Layout: Left - Stays List, Right - Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Stays List */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <RelevantListing stays={stays} />
          </div>
        </div>

        {/* Right Column - Map */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <GoogleMapComponent
              height="calc(100vh - 8rem)"
              filter="stays"
              stays={stays}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
