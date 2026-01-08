"use client";

/// <reference types="@types/google.maps" />
import { useState, useCallback } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { Input } from "antd";
import { getTimezoneFromCoordinates } from "@/utils/timezone";

const libraries: "places"[] = ["places"];

type AddressDetails = {
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
};

type Props = {
  onSelect?: (details: AddressDetails) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export default function GooglePlacesInput({
  onSelect,
  placeholder = "Search for a place",
  className,
  value,
  onChange,
}: Props) {
  const [ac, setAc] = useState<google.maps.places.Autocomplete | null>(null);

  const handleLoad = useCallback(
    (a: google.maps.places.Autocomplete) => setAc(a),
    []
  );
  const handleChange = useCallback(async () => {
    if (!ac) return;
    const place = ac.getPlace();
    if (!place) return;
    // Helper to find component by type
    const getComponent = (type: string): string => {
      if (!place.address_components) return "";
      return (
        place.address_components.find((c) => c.types.includes(type))
          ?.long_name || ""
      );
    };

    const latitude = place.geometry?.location?.lat();
    const longitude = place.geometry?.location?.lng();

    // Fetch timezone if we have coordinates
    let timezone = "America/New_York"; // Default
    if (latitude && longitude) {
      const fetchedTimezone = await getTimezoneFromCoordinates(
        latitude,
        longitude
      );
      if (fetchedTimezone) timezone = fetchedTimezone;
    }

    const details: AddressDetails = {
      address: place.formatted_address || "",
      city: getComponent("locality"),
      state: getComponent("administrative_area_level_1"),
      country: getComponent("country"),
      zipcode: getComponent("postal_code"),
      latitude,
      longitude,
      timezone,
    };
    onSelect?.(details);
  }, [ac, onSelect]);

  return (
    <Autocomplete onLoad={handleLoad} onPlaceChanged={handleChange}>
      <Input
        allowClear
        size="large"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
        className={`w-full rounded-lg focus:shadow-sm ${className ?? ""}`}
      />
    </Autocomplete>
  );
}
