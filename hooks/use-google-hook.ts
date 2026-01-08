import { useGoogleMaps } from "@/providers/GoogleMapsProvider";
import React, { useRef } from "react";

/**
 * Custom hook to load and manage a Google Map instance.
 * Now uses the centralized GoogleMapsProvider to avoid conflicts.
 *
 * @returns {Object} - An object containing the map instance, loading state, and event handlers.
 */
const useGoogleMap = () => {
  const { isLoaded, loadError } = useGoogleMaps();

  const mapRef: any = useRef<any>(null);

  const onLoad = React.useCallback((map: any) => {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    map.setZoom(10);

    mapRef.current = map;
  }, []);

  const onUnmount = React.useCallback(() => {
    mapRef.current = null;
  }, []);

  // Check if both Maps API and Places library are loaded
  const isFullyLoaded = React.useMemo(() => {
    return (
      isLoaded &&
      typeof window !== "undefined" &&
      window.google &&
      window.google.maps &&
      window.google.maps.places
    );
  }, [isLoaded]);

  return {
    mapRef,
    onUnmount,
    isLoaded: isFullyLoaded,
    onLoad,
    loadError,
  };
};

export default useGoogleMap;
