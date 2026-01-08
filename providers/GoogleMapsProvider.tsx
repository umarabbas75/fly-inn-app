// contexts/GoogleMapsContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useJsApiLoader } from "@react-google-maps/api";

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
  googleMaps: typeof google.maps | null;
}

const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(
  undefined
);

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({
  children,
}) => {
  const [googleMaps, setGoogleMaps] = useState<typeof google.maps | null>(null);
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDXJS_VZMhnp0szh92aZGg8RHszz6RMQN8",
    libraries: ["places"],
  });

  useEffect(() => {
    if (isLoaded && window.google) {
      setGoogleMaps(window.google.maps);
    }
  }, [isLoaded]);

  const value = {
    isLoaded,
    loadError,
    googleMaps,
  };

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (context === undefined) {
    throw new Error("useGoogleMaps must be used within a GoogleMapsProvider");
  }
  return context;
};
