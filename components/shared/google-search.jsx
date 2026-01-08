/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Input } from "antd";
import React, { useRef, useEffect } from "react";
import { useGoogleMaps } from "@/providers/GoogleMapsProvider";
import { getTimezoneFromCoordinates } from "@/utils/timezone";

// Custom CSS for Google Places autocomplete dropdown to match Ant Design theme
const autocompleteStyles = `
  .pac-container {
    background-color: #ffffff !important;
    border: 1px solid #d9d9d9 !important;
    border-radius: 6px !important;
    box-shadow: none !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif !important;
    font-size: 14px !important;
    line-height: 1.5715 !important;
    margin-top: 4px !important;
    z-index: 1050 !important;
    max-height: 300px !important;
    overflow-y: auto !important;
    padding: 4px 0 !important;
    outline: none !important;
  }

  .pac-item {
    background-color: #ffffff !important;
    border: none !important;
    border-bottom: 1px solid #f0f0f0 !important;
    color: #262626 !important;
    cursor: pointer !important;
    font-size: 14px !important;
    line-height: 1.5715 !important;
    padding: 8px 12px !important;
    transition: background-color 0.2s ease !important;
  }

  .pac-item:last-child {
    border-bottom: none !important;
  }

  .pac-item:hover {
    background-color: #f5f5f5 !important;
  }

  .pac-item-selected {
    background-color: #e6f7ff !important;
    color: #1890ff !important;
  }

  .pac-item-query {
    color: #262626 !important;
    font-weight: 500 !important;
    font-size: 14px !important;
  }

  .pac-matched {
    color: #1890ff !important;
    font-weight: 600 !important;
  }

  .pac-icon {
    display: none !important;
  }

  .pac-item-query {
    margin-right: 0 !important;
  }

  .pac-item {
    display: flex !important;
    align-items: center !important;
    min-height: 32px !important;
  }

  .pac-item-query {
    flex: 1 !important;
  }

  .pac-item-secondary {
    color: #8c8c8c !important;
    font-size: 12px !important;
    margin-top: 2px !important;
  }

  /* Ensure proper positioning and z-index */
  .pac-container:after {
    content: none !important;
  }

  /* Input focus state styling */
  .ant-input:focus {
    border-color: #1890ff !important;
  }

  /* Hide Google's default logo */
  .pac-logo:after {
    display: none !important;
  }

  /* Remove all Google default borders and shadows */
  .pac-container * {
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
  }

  /* Override any remaining Google styles */
  .pac-container {
    border: 1px solid #d9d9d9 !important;
    box-shadow: none !important;
    outline: none !important;
  }

  /* Ensure no thick borders on items */
  .pac-item {
    border: none !important;
    border-bottom: 1px solid #f0f0f0 !important;
    box-shadow: none !important;
    outline: none !important;
  }

  .pac-item:last-child {
    border-bottom: none !important;
  }

  /* Remove any Google default backgrounds */
  .pac-container {
    background: #ffffff !important;
  }

  .pac-item {
    background: #ffffff !important;
  }

  .pac-item:hover {
    background: #f5f5f5 !important;
  }

  .pac-item-selected {
    background: #e6f7ff !important;
  }
`;

export default function GoogleSearch({ onChange, value, ...rest }) {
  const ref = useRef(null);
  const { isLoaded } = useGoogleMaps();

  // Inject custom styles for Google Places autocomplete
  useEffect(() => {
    // Create style element if it doesn't exist
    let styleElement = document.getElementById(
      "google-places-autocomplete-styles"
    );
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "google-places-autocomplete-styles";
      styleElement.textContent = autocompleteStyles;
      document.head.appendChild(styleElement);
    }

    // Cleanup function to remove styles when component unmounts
    return () => {
      if (styleElement && document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !ref.current?.input) return;

    // Simple check for Google Maps availability
    if (!window.google?.maps?.places) return;

    const inputElement = ref.current.input;
    let observer = null;

    try {
      const autoComplete = new window.google.maps.places.Autocomplete(
        inputElement
      );

      autoComplete.addListener("place_changed", async () => {
        const addressObject = autoComplete.getPlace();
        if (!addressObject?.geometry?.location) return;

        const addressComponents = addressObject.address_components || [];
        const getComponent = (type) =>
          addressComponents.find((component) => component.types.includes(type))
            ?.long_name || "";

        const latitude = addressObject.geometry.location.lat();
        const longitude = addressObject.geometry.location.lng();

        // Fetch timezone for the address
        const timezone = await getTimezoneFromCoordinates(latitude, longitude);

        const addressDetails = {
          address: addressObject.formatted_address || "",
          city: getComponent("locality"),
          state: getComponent("administrative_area_level_1"),
          country: getComponent("country"),
          zipcode: getComponent("postal_code"),
          latitude,
          longitude,
          timezone: timezone || "America/New_York", // Default to Eastern if API fails
        };

        onChange(addressDetails);
      });

      // Function to enforce autocomplete attribute
      const enforceAutocomplete = () => {
        if (inputElement) {
          inputElement.setAttribute("autocomplete", "new-password");
          inputElement.setAttribute("aria-autocomplete", "off");
        }
      };

      // Initial set after a short delay
      setTimeout(enforceAutocomplete, 100);

      // Create a MutationObserver to watch for attribute changes
      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "attributes") {
            const currentValue = inputElement.getAttribute("autocomplete");
            if (currentValue !== "new-password") {
              enforceAutocomplete();
            }
          }
        });
      });

      // Start observing the input element for attribute changes
      observer.observe(inputElement, {
        attributes: true,
        attributeFilter: ["autocomplete"],
      });

      // Also enforce on focus to be extra sure
      const handleFocus = () => {
        enforceAutocomplete();
      };

      inputElement.addEventListener("focus", handleFocus);

      // Cleanup function
      return () => {
        if (observer) {
          observer.disconnect();
        }
        inputElement.removeEventListener("focus", handleFocus);
      };
    } catch (error) {
      console.error("Error initializing Google Places:", error);
      // Cleanup observer if initialization fails
      if (observer) {
        observer.disconnect();
      }
    }
  }, [isLoaded, onChange]);

  return (
    <Input
      id="address"
      placeholder="Search address"
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="large"
      className="w-full text-left"
      autoComplete="new-password"
      {...rest}
    />
  );
}
