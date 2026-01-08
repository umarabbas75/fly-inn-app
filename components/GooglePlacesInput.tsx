import React, { useRef, useEffect } from "react";
import { Input } from "antd";
import { getTimezoneFromCoordinates } from "@/utils/timezone";

interface AddressDetails {
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

interface GooglePlacesInputProps {
  value?: string;
  onChange?: (value: string | AddressDetails) => void;
  onBlur?: () => void;
  isLoaded?: boolean; // If you use a loader, otherwise can omit
  className?: string;
  placeholder?: string;
}

const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({
  value,
  onChange,
  onBlur,
  isLoaded = true, // Assume script is loaded unless managed elsewhere
  className = "",
  placeholder = "Search address",
  ...rest
}) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (isLoaded && window.google && window.google.maps && ref.current) {
      const autoComplete = new window.google.maps.places.Autocomplete(
        ref.current,
        {
          types: ["geocode"],
        }
      );
      autoComplete.addListener("place_changed", async () => {
        const addressObject = autoComplete.getPlace();
        const addressComponents = addressObject?.address_components || [];
        const getComponent = (type: string) =>
          addressComponents.find((component: any) =>
            component.types.includes(type)
          )?.long_name || "";

        const latitude = addressObject?.geometry?.location?.lat();
        const longitude = addressObject?.geometry?.location?.lng();

        // Fetch timezone if we have coordinates
        let timezone = "America/New_York"; // Default
        if (latitude && longitude) {
          const fetchedTimezone = await getTimezoneFromCoordinates(
            latitude,
            longitude
          );
          if (fetchedTimezone) timezone = fetchedTimezone;
        }

        const addressDetails: AddressDetails = {
          address: addressObject?.formatted_address || "",
          city: getComponent("locality"),
          state: getComponent("administrative_area_level_1"),
          country: getComponent("country"),
          zipcode: getComponent("postal_code"),
          latitude,
          longitude,
          timezone,
        };
        if (onChange) onChange(addressDetails);
      });
    }
  }, [isLoaded]);

  return (
    <Input
      ref={ref}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      onBlur={onBlur}
      size="large"
      placeholder={placeholder}
      className={className + " bg-white"}
      autoComplete="new-password"
      {...rest}
    />
  );
};

export default GooglePlacesInput;
