// components/PlacesAutocomplete.tsx
"use client";

import { useGoogleMaps } from "@/providers/GoogleMapsProvider";
import React, { useRef, useEffect } from "react";
import { getTimezoneFromCoordinates } from "@/utils/timezone";

interface PlacesAutocompleteProps {
  onPlaceSelected: (addressDetails: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
    latitude: number;
    longitude: number;
    timezone?: string;
  }) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  onPlaceSelected,
  placeholder = "Enter a location",
  className = "",
  defaultValue = "",
}) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isLoaded, googleMaps } = useGoogleMaps();

  useEffect(() => {
    if (isLoaded && googleMaps && inputRef.current) {
      autocompleteRef.current = new googleMaps.places.Autocomplete(
        inputRef.current,
        {
          types: ["geocode", "establishment"],
          componentRestrictions: { country: "us" },
        }
      );

      autocompleteRef.current.addListener("place_changed", async () => {
        const place = autocompleteRef.current?.getPlace();
        if (!place?.geometry?.location) return;

        const addressComponents = place.address_components || [];
        const getComponent = (type: string) =>
          addressComponents.find((component) => component.types.includes(type))
            ?.long_name || "";

        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();

        // Fetch timezone
        const timezone = await getTimezoneFromCoordinates(latitude, longitude);

        const addressDetails = {
          address: place.formatted_address || "",
          city: getComponent("locality"),
          state: getComponent("administrative_area_level_1"),
          country: getComponent("country"),
          zipcode: getComponent("postal_code"),
          latitude,
          longitude,
          timezone: timezone || "America/New_York", // Default if API fails
        };

        onPlaceSelected(addressDetails);
      });
    }

    return () => {
      if (autocompleteRef.current && googleMaps) {
        googleMaps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, googleMaps, onPlaceSelected]);

  return (
    <div className={className}>
      <input
        ref={inputRef}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

export default PlacesAutocomplete;
