"use client";

import React, { useMemo, useCallback, useState, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Skeleton } from "antd";
import { useGoogleMaps } from "@/providers/GoogleMapsProvider";
import { MAP_THEME } from "@/constants/google-map";

interface DraggableLocationMapProps {
  latitude: number;
  longitude: number;
  onLocationChange?: (lat: number, lng: number) => void;
  onReverseGeocode?: (lat: number, lng: number) => void;
  height?: string;
  zoom?: number;
}

export const DraggableLocationMap: React.FC<DraggableLocationMapProps> = ({
  latitude,
  longitude,
  onLocationChange,
  onReverseGeocode,
  height = "h-[400px]",
  zoom = 15,
}) => {
  const { isLoaded, loadError, googleMaps } = useGoogleMaps();
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isGeocodingInProgress, setIsGeocodingInProgress] = useState(false);

  // Initialize marker position when coordinates change
  useEffect(() => {
    // Parse coordinates in case they come as strings
    const lat = typeof latitude === "string" ? parseFloat(latitude) : latitude;
    const lng =
      typeof longitude === "string" ? parseFloat(longitude) : longitude;

    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      setMarkerPosition({ lat, lng });
    }
  }, [latitude, longitude]);

  // Center the map on the provided coordinates
  const center = useMemo(() => {
    if (markerPosition) {
      return markerPosition;
    }
    // Parse coordinates and default to New York City if invalid
    const lat = typeof latitude === "string" ? parseFloat(latitude) : latitude;
    const lng =
      typeof longitude === "string" ? parseFloat(longitude) : longitude;

    return {
      lat: lat && !isNaN(lat) ? lat : 40.7128,
      lng: lng && !isNaN(lng) ? lng : -74.006,
    };
  }, [latitude, longitude, markerPosition]);

  // Map options with draggable marker support
  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      gestureHandling: "greedy",
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      scrollwheel: true,
      keyboardShortcuts: true,
      styles: MAP_THEME,
      zoomControlOptions: {
        position: googleMaps
          ? googleMaps.ControlPosition.RIGHT_CENTER
          : undefined,
      },
    }),
    [googleMaps]
  );

  // Handle marker drag end
  const onMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();

        setMarkerPosition({ lat: newLat, lng: newLng });

        // Notify parent component
        if (onLocationChange) {
          onLocationChange(newLat, newLng);
        }

        // Trigger reverse geocoding to update address fields
        if (onReverseGeocode) {
          setIsGeocodingInProgress(true);
          onReverseGeocode(newLat, newLng);
          // Reset after a delay (geocoding typically takes 1-2 seconds)
          setTimeout(() => setIsGeocodingInProgress(false), 2000);
        }

        // Center map on new position
        if (mapInstance) {
          mapInstance.panTo({ lat: newLat, lng: newLng });
        }
      }
    },
    [onLocationChange, onReverseGeocode, mapInstance]
  );

  // Handle map click to move marker
  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();

        setMarkerPosition({ lat: newLat, lng: newLng });

        // Notify parent component
        if (onLocationChange) {
          onLocationChange(newLat, newLng);
        }

        // Trigger reverse geocoding to update address fields
        if (onReverseGeocode) {
          setIsGeocodingInProgress(true);
          onReverseGeocode(newLat, newLng);
          // Reset after a delay (geocoding typically takes 1-2 seconds)
          setTimeout(() => setIsGeocodingInProgress(false), 2000);
        }
      }
    },
    [onLocationChange, onReverseGeocode]
  );

  // Handle map load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
  }, []);

  // Loading state with skeleton
  if (!isLoaded) {
    return (
      <div className={`w-full ${height} p-4`}>
        <Skeleton.Node active className="w-full h-full">
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            <p className="text-gray-500 text-sm">Loading map...</p>
          </div>
        </Skeleton.Node>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div
        className={`w-full ${height} flex flex-col items-center justify-center text-red-600 bg-red-50 rounded-lg border border-red-200`}
      >
        <svg
          className="w-12 h-12 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="font-medium">Error loading maps</p>
        <p className="text-sm text-gray-600 mt-1">
          Please check your internet connection
        </p>
      </div>
    );
  }

  return (
    <div
      className={`w-full ${height} relative bg-gray-50 rounded-lg overflow-hidden`}
    >
      {/* Info tooltip */}
      <div className="absolute top-4 left-4 z-10 bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
        {isGeocodingInProgress ? (
          <p className="text-xs text-blue-600 flex items-center gap-2 font-medium">
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Updating address...</span>
          </p>
        ) : (
          <p className="text-xs text-gray-600 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Drag marker or click map to set location</span>
          </p>
        )}
      </div>

      <GoogleMap
        zoom={zoom}
        center={center}
        mapContainerClassName="w-full h-full"
        options={mapOptions}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {markerPosition && (
          <Marker
            position={markerPosition}
            draggable={true}
            onDragEnd={onMarkerDragEnd}
            title="Drag to adjust location"
            options={{
              animation: googleMaps ? googleMaps.Animation.DROP : undefined,
              icon: {
                url:
                  "data:image/svg+xml;charset=UTF-8," +
                  encodeURIComponent(`
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 0C13.373 0 8 5.373 8 12c0 9 12 28 12 28s12-19 12-28c0-6.627-5.373-12-12-12z" fill="#AF2322"/>
                    <circle cx="20" cy="12" r="7" fill="white"/>
                    <circle cx="20" cy="12" r="4" fill="#AF2322"/>
                  </svg>
                `),
                scaledSize: googleMaps
                  ? new googleMaps.Size(40, 40)
                  : undefined,
                anchor: googleMaps ? new googleMaps.Point(20, 40) : undefined,
              },
            }}
          />
        )}
      </GoogleMap>

      {/* Coordinates display */}
      {markerPosition && (
        <div className="absolute bottom-4 right-4 z-10 bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="text-xs text-gray-500">Current Position:</p>
          <p className="text-xs font-mono text-gray-700">
            {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
};
