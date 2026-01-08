"use client";

import React, { useEffect, useState } from "react";
import { Button, Spin, Alert } from "antd";
import RelevantListing from "../stay-search/_components/relevant-listing";
import GoogleMapComponent from "../../../../../components/shared/map";
import { useSearchParams, useRouter } from "next/navigation";
import { useApiGet } from "@/http-service";

export default function StayLodgingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [queryParams, setQueryParams] = useState<URLSearchParams | null>(null);
  const [lodgingType, setLodgingType] = useState<string | null>(null);

  // Get search parameters from URL
  useEffect(() => {
    if (searchParams) {
      const params = new URLSearchParams();
      searchParams.forEach((value, key) => {
        params.append(key, value);
      });

      // Extract lodging_type from URL params
      const lodgingTypeParam = params.get("lodging_type");
      if (lodgingTypeParam) {
        setLodgingType(lodgingTypeParam);
      }

      setQueryParams(params);
      console.log(
        "Lodging search parameters:",
        Object.fromEntries(params.entries())
      );
    }
  }, [searchParams]);

  // Build API endpoint with query parameters
  const buildApiEndpoint = () => {
    if (!queryParams) return "/stays/public";

    const params = new URLSearchParams();

    // Copy all query parameters to the API request
    queryParams.forEach((value, key) => {
      // Handle special cases for the API
      if (key === "address.state[or]") {
        // Parse the JSON string back to array format for API
        try {
          const parsedValue = JSON.parse(value);
          if (Array.isArray(parsedValue)) {
            params.append(key, JSON.stringify(parsedValue));
          }
        } catch (e) {
          console.warn("Failed to parse address.state[or]:", value);
        }
      } else {
        params.append(key, value);
      }
    });

    // Ensure lodging_type is included
    if (lodgingType && !params.has("lodging_type")) {
      params.append("lodging_type", lodgingType);
    }

    const endpoint = `/stays/public?${params.toString()}`;
    console.log("API endpoint:", endpoint);
    return endpoint;
  };

  // API call for stays search filtered by lodging type
  const {
    data: staysData,
    isLoading,
    error,
  } = useApiGet({
    endpoint: buildApiEndpoint(),
    queryKey: ["stays-lodging", queryParams?.toString() || "", lodgingType],
    config: {
      enabled: !!queryParams || !!lodgingType, // Only run query when we have search params or lodging type
      refetchOnWindowFocus: false,
    },
    axiosConfig: {
      baseURL: process.env.NEXT_PUBLIC_API_URI,
    },
  });
  console.log("lodging tyoe stas,", { staysData });

  // Extract stays from API response
  const stays = staysData?.stays || staysData || [];

  // Debug: Log the API response
  useEffect(() => {
    if (staysData) {
      console.log("API response:", staysData);
    }
  }, [staysData]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="app-container my-10">
        <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-gray-600">Loading stays...</p>
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
            message="Error Loading Stays"
            description="Failed to load stays. Please try again."
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
            We couldn't find any stays matching this lodging type. Try browsing
            other types or adjusting your search.
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
          {lodgingType
            ? `Stays - ${lodgingType
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}`
            : "Browse Stays by Lodging Type"}
        </h1>
        <p className="text-gray-600">
          Found {stays.length} stays matching your criteria
        </p>
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
