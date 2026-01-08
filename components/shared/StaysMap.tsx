"use client";

import React, { useCallback, useState } from "react";
import { useApiGet } from "@/http-service";
import { Card, Spin, Alert, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import LocationMap from "./LocationMap";

interface StaysMapProps {
  queryParams?: Record<string, any>;
  height?: string;
  showFilters?: boolean;
  onStayClick?: (stay: any) => void;
}

const StaysMap: React.FC<StaysMapProps> = ({
  queryParams = {},
  height = "600px",
  showFilters = false,
  onStayClick,
}) => {
  const [mapKey, setMapKey] = useState(0); // For forcing map re-render

  // Build API endpoint with query parameters
  const buildApiEndpoint = () => {
    if (Object.keys(queryParams).length === 0) return "/stays/public";

    const params = new URLSearchParams();

    // Convert query params to API format
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const endpoint = `/stays/public?${params.toString()}`;
    console.log("StaysMap API endpoint:", endpoint);
    return endpoint;
  };

  // Fetch stays data
  const {
    data: staysData,
    isLoading,
    error,
    refetch,
  } = useApiGet({
    endpoint: buildApiEndpoint(),
    queryKey: ["stays-map", JSON.stringify(queryParams)],
    config: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    axiosConfig: {
      baseURL: process.env.NEXT_PUBLIC_API_URI,
    },
  });

  // Extract stays from API response
  const stays = staysData?.stays || staysData?.data || staysData || [];

  // Handle stay marker click
  const handleMarkerClick = useCallback(
    (marker: any, index: number) => {
      if (onStayClick && marker.stayId) {
        const stay = stays.find((s: any) => s.id == marker.stayId);
        if (stay) {
          onStayClick(stay);
        }
      }
    },
    [onStayClick, stays]
  );

  // Handle map click
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    console.log("Map clicked at:", e.latLng?.toJSON());
  }, []);

  // Refresh map
  const handleRefresh = () => {
    setMapKey((prev) => prev + 1);
    refetch();
  };

  // Show loading state
  if (isLoading) {
    return (
      <Card className="w-full">
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-gray-600">Loading stays...</p>
          </div>
        </div>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card className="w-full">
        <div className="flex items-center justify-center" style={{ height }}>
          <Alert
            message="Error Loading Stays"
            description="Failed to load stays data. Please try again."
            type="error"
            showIcon
            action={
              <Button
                size="small"
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
              >
                Retry
              </Button>
            }
          />
        </div>
      </Card>
    );
  }

  // Show no results state
  if (!stays || stays.length === 0) {
    return (
      <Card className="w-full">
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🗺️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Stays Found
            </h3>
            <p className="text-gray-600 mb-4">
              {Object.keys(queryParams).length > 0
                ? "Try adjusting your search criteria"
                : "No stays are currently available"}
            </p>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="w-full"
      title={
        <div className="flex items-center justify-between">
          <span>Stays Map ({stays.length} properties)</span>
          <Button
            icon={<ReloadOutlined />}
            size="small"
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </div>
      }
    >
      <LocationMap
        key={mapKey}
        stays={stays}
        containerStyle={{ width: "100%", height }}
        zoom={10}
        onMarkerClick={handleMarkerClick}
        onMapClick={handleMapClick}
        onMapLoad={(map) => {
          console.log("Map loaded with", stays.length, "stays");

          // Auto-fit bounds to show all stays
          if (stays.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            stays.forEach((stay: any) => {
              const lat = parseFloat(stay.latitude?.toString() || "0");
              const lng = parseFloat(stay.longitude?.toString() || "0");
              if (!isNaN(lat) && !isNaN(lng)) {
                bounds.extend({ lat, lng });
              }
            });

            if (!bounds.isEmpty()) {
              map.fitBounds(bounds);
              // Add some padding
              map.setZoom(Math.min(map.getZoom() || 10, 15));
            }
          }
        }}
      />
    </Card>
  );
};

export default StaysMap;
