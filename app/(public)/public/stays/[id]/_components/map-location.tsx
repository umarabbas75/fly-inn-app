"use client";
import React, { useMemo } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Skeleton } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { useGoogleMaps } from "@/providers/GoogleMapsProvider";
import { MAP_THEME } from "@/constants/google-map";

interface MapLocationProps {
  listing?: {
    latitude?: string | number;
    longitude?: string | number;
    fake_latitude?: string | number | null;
    fake_longitude?: string | number | null;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipcode?: string;
  };
}

const MapLocation = ({ listing }: MapLocationProps) => {
  // Use the shared Google Maps provider instead of useLoadScript
  const { isLoaded, loadError } = useGoogleMaps();

  const lat = useMemo(() => {
    // Prioritize fake coordinates over real coordinates
    const coord = listing?.fake_latitude ?? listing?.latitude;
    if (!coord) return 40.7128; // Default to NYC
    return typeof coord === "string" ? parseFloat(coord) : coord;
  }, [listing?.fake_latitude, listing?.latitude]);

  const lng = useMemo(() => {
    // Prioritize fake coordinates over real coordinates
    const coord = listing?.fake_longitude ?? listing?.longitude;
    if (!coord) return -74.006; // Default to NYC
    return typeof coord === "string" ? parseFloat(coord) : coord;
  }, [listing?.fake_longitude, listing?.longitude]);

  const center = useMemo(() => ({ lat, lng }), [lat, lng]);

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
      zoomControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      mapTypeControl: true,
      styles: MAP_THEME,
    }),
    []
  );

  const fullAddress = useMemo(() => {
    const parts = [
      listing?.address,
      listing?.city,
      listing?.state,
      listing?.zipcode,
      listing?.country,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Address not available";
  }, [listing]);

  if (loadError) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Where you'll be
        </h2>
        <div className="h-[400px] bg-gray-100 rounded-lg flex flex-col items-center justify-center border border-gray-200">
          <EnvironmentOutlined className="text-gray-400 text-4xl mb-4" />
          <p className="text-gray-600 font-medium">Unable to load map</p>
          <p className="text-gray-500 text-sm mt-2">
            Please check your Google Maps API key configuration
          </p>
          {fullAddress && (
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 max-w-md">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Location:</span> {fullAddress}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-primary mb-4">Location</h2>
        <Skeleton.Node
          active
          className="w-full h-[400px] flex items-center justify-center"
        >
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            <p className="text-gray-500 text-sm mt-4">Loading map...</p>
          </div>
        </Skeleton.Node>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-primary mb-4">
        Where you'll be
      </h2>

      <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <GoogleMap
          mapContainerClassName="w-full h-[400px]"
          center={center}
          zoom={15}
          options={mapOptions}
        >
          <Marker
            position={center}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        </GoogleMap>
      </div>

      {/* <div className="mt-4 flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <EnvironmentOutlined className="text-primary text-xl mt-1" />
        <div>
          <h3 className="font-semibold text-gray-800 mb-1">
            {listing?.city || "Location"}
            {listing?.state && `, ${listing.state}`}
          </h3>
          <p className="text-sm text-gray-600">{fullAddress}</p>
        </div>
      </div> */}

      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Note:</span> The exact location will
          be provided after your booking is confirmed.
        </p>
      </div>
    </div>
  );
};

export default MapLocation;
