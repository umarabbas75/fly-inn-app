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
}

const HeroSection = ({
  filter,
  stays,
  businesses,
  isLoading = false,
  onMapVisibilityChange,
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

  return (
    <section className="relative bg-white">
      <div className="relative">
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
