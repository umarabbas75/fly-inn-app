// components/PlacesAutocomplete.tsx
"use client";

import { useGoogleMaps } from "@/providers/GoogleMapsProvider";
import React, { useState, useRef, useEffect } from "react";

interface PlacesAutocompleteProps {
  onPlaceSelected: (
    place: google.maps.places.PlaceResult,
    inputValue: string
  ) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  options?: google.maps.places.AutocompleteOptions;
  defaultValue?: string;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  onPlaceSelected,
  placeholder = "Enter a location",
  className = "",
  inputClassName = "",
  options = {
    types: ["geocode", "establishment"],
    componentRestrictions: { country: "us" },
  },
  defaultValue = "",
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isLoaded, googleMaps } = useGoogleMaps();

  useEffect(() => {
    if (isLoaded && googleMaps && inputRef.current) {
      autocompleteRef.current = new googleMaps.places.Autocomplete(
        inputRef.current,
        options
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place) {
          const address =
            place.formatted_address || inputRef.current?.value || "";
          setInputValue(address);
          onPlaceSelected(place, address);
        }
      });
    }

    return () => {
      if (autocompleteRef.current && googleMaps) {
        googleMaps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, googleMaps, onPlaceSelected, options]);

  return (
    <div className={className}>
      <input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputClassName}`}
      />
    </div>
  );
};

export default PlacesAutocomplete;
