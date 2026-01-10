import GoogleMapComponent from "@/components/shared/map";
import { Button, Spin } from "antd";
import React, { useState, useEffect } from "react";
import HomeStays from "./home-stays";

type FilterType = "stays" | "business";

interface HeroSectionProps {
  filter: FilterType;
  stays: any[];
  businesses: any[];
  isLoading?: boolean;
  onMapVisibilityChange?: (visible: boolean) => void;
  staysError?: any;
  businessesError?: any;
}

const HeroSection = ({
  filter,
  stays,
  businesses,
  isLoading = false,
  onMapVisibilityChange,
  staysError,
  businessesError,
}: HeroSectionProps) => {
  const [showList, setShowList] = useState(false);

  // Notify parent when map visibility changes
  useEffect(() => {
    onMapVisibilityChange?.(!showList);
  }, [showList, onMapVisibilityChange]);

  // Also notify on initial mount
  useEffect(() => {
    onMapVisibilityChange?.(true);
  }, []);

  const handleToggleView = () => {
    setShowList(!showList);
  };

  // Get error message based on current filter
  const currentError = filter === "stays" ? staysError : businessesError;
  const getErrorMessage = (error: any) => {
    if (!error) return null;
    return (
      error?.response?.data?.message ||
      error?.message ||
      "Unable to load data. Please try again later."
    );
  };

  return (
    <section className="relative bg-white">
      <div className="relative">
        {/* Error banner */}
        {currentError && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    {getErrorMessage(currentError)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="ml-4 text-sm text-yellow-700 hover:text-yellow-900 underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {showList ? (
          filter === "stays" ? (
            <HomeStays stays={stays} />
          ) : (
            <div className="p-6 text-center text-gray-500">
              Business list view coming soon
            </div>
          )
        ) : (
          <div className="relative">
            <GoogleMapComponent
              filter={filter}
              stays={filter === "stays" ? stays : []}
              businesses={filter === "business" ? businesses : []}
              height="500px"
            />
            {/* Loading overlay when filtering */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                <Spin size="large" />
              </div>
            )}
          </div>
        )}
        {filter === "stays" && (
          <div className="absolute bottom-4 left-[50%] translate-x-[-50%]">
            <Button type="primary" onClick={handleToggleView}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="#fff"
                  d="M15.5 21.5v-17m0 17h-.333l-.358-.22A12 12 0 0 0 8.52 19.5H8.5m7 2h.177a12 12 0 0 0 6.173-1.71l.65-.39V2.5h-.25l-.357.22a12 12 0 0 1-6.29 1.78h-.353l-.483-.29A12 12 0 0 0 8.593 2.5H8.5m0 0h-.176A12 12 0 0 0 2.15 4.21l-.65.39v16.9h.25l.357-.22a12 12 0 0 1 6.29-1.78m.103-17v17m0 0h-.104m0 0H8.25"
                  strokeWidth={1}
                ></path>
              </svg>
              {showList ? "Show Map" : "Show List"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
