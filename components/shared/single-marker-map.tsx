"use client";

import { useMemo } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import Loading from "@/src/components/Loading";
import { MAP_THEME } from "@/constants/google-map";
import { useGoogleMaps } from "@/providers/GoogleMapsProvider";

interface SingleMarkerMapProps {
  height: string;
  mapClasses?: string;
  latitude: number;
  longitude: number;
  zoom?: number;
  markerTitle?: string;
}

export default function SingleMarkerMap({
  height,
  mapClasses,
  latitude,
  longitude,
  zoom = 15,
  markerTitle = "Location",
}: SingleMarkerMapProps) {
  const { isLoaded, loadError, googleMaps } = useGoogleMaps();

  // Center the map on the provided coordinates
  const center = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude]
  );

  // Basic map options, minimal to just get a map
  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true, // Disable all default UI controls
      gestureHandling: "cooperative", // Allows panning with one finger on touch devices
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      scrollwheel: true, // Keep scrollwheel for zooming
      keyboardShortcuts: false,
      styles: MAP_THEME, // Apply custom theme
    }),
    []
  );

  console.log({ isLoaded, loadError, googleMaps });

  if (loadError)
    return (
      <div
        className={`w-full ${height} flex items-center justify-center text-red-600`}
      >
        Error loading maps
      </div>
    );

  if (!isLoaded)
    return (
      <div className={`w-full ${height} flex items-center justify-center`}>
        <Loading size="medium" />
      </div>
    );

  return (
    <div className={`w-full ${height} relative bg-gray-50`}>
      <GoogleMap
        zoom={zoom}
        center={center}
        mapContainerClassName={`w-full h-full cursor-grab active:cursor-grabbing ${mapClasses}`}
        options={mapOptions}
      >
        {/* Single marker at the specified location */}
        <Marker
          position={center}
          title={markerTitle}
          options={{
            // Custom marker styling
            icon: {
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 0C10.477 0 6 4.477 6 10c0 7 10 22 10 22s10-15 10-22c0-5.523-4.477-10-10-10z" fill="#DC2626"/>
                  <circle cx="16" cy="10" r="6" fill="white"/>
                  <circle cx="16" cy="10" r="3" fill="#DC2626"/>
                </svg>
              `),
              scaledSize: googleMaps ? new googleMaps.Size(32, 32) : undefined,
              anchor: googleMaps ? new googleMaps.Point(16, 32) : undefined,
            },
          }}
        />
      </GoogleMap>
    </div>
  );
}
