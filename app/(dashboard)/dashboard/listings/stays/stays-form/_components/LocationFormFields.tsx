import React, { useCallback, useEffect, useRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { Input } from "antd";
import { MdQuestionMark } from "react-icons/md";
import useGoogleMap from "@/hooks/use-google-hook";
import GoogleSearch from "@/components/shared/google-search";
import { MAP_THEME } from "@/constants/google-map";
import GoogleMapComponent from "@/components/shared/map";
import SingleMarkerMap from "@/components/shared/single-marker-map";
import PlacesAutocomplete from "./PlacesAutocomplete";
import FormFieldWrapper from "@/components/shared/FormFieldWrapper";
import { FieldLabel } from "@/components/shared/FieldLabel";
import { DraggableLocationMap } from "./DraggableLocationMap";
import { getTimezoneFromCoordinates } from "@/utils/timezone";

/**
 * A form field component for handling location-related inputs, including a Google Map.
 * It is styled using Ant Design components and manages state with react-hook-form.
 */
const LocationFormFields = () => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useFormContext();

  const latitude = watch("latitude");
  const longitude = watch("longitude");
  // const { isLoaded, onLoad, onUnmount } = useGoogleMap();
  console.log({ latitude, longitude });

  const findAddress = useCallback(async () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      console.error("Invalid latitude or longitude");
      return;
    }

    const latLng = new window.google.maps.LatLng(lat, lng);
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ location: latLng }, async (results, status) => {
      if (status === "OK" && results?.[0]) {
        const addressObject = results?.[0];
        const addressComponents = addressObject?.address_components || [];

        const getComponent = (type: string) =>
          addressComponents.find((component) => component.types.includes(type))
            ?.long_name || "";

        setValue("address", addressObject.formatted_address);
        setValue("city", getComponent("locality"));
        setValue("state", getComponent("administrative_area_level_1"));
        setValue("country", getComponent("country"));
        setValue("zipcode", getComponent("postal_code"));

        // Fetch and set timezone
        const timezone = await getTimezoneFromCoordinates(lat, lng);
        if (timezone) {
          setValue("timezone", timezone);
        }

        // Trigger validation for all fields
        trigger(["address", "city", "state", "country", "zipcode", "timezone"]);
      } else {
        console.error("Geocoder failed due to: ", status);
      }
    });
  }, [latitude, longitude, setValue, trigger]);

  // Reverse geocode from map marker movement
  const reverseGeocodeFromMap = useCallback(
    async (lat: number, lng: number) => {
      if (!window.google?.maps) {
        console.error("Google Maps not loaded");
        return;
      }

      const latLng = new window.google.maps.LatLng(lat, lng);
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ location: latLng }, async (results, status) => {
        if (status === "OK" && results?.[0]) {
          const addressObject = results?.[0];
          const addressComponents = addressObject?.address_components || [];

          const getComponent = (type: string) =>
            addressComponents.find((component) =>
              component.types.includes(type)
            )?.long_name || "";

          // Update all address-related fields
          setValue("address", addressObject.formatted_address);
          setValue("city", getComponent("locality"));
          setValue("state", getComponent("administrative_area_level_1"));
          setValue("country", getComponent("country"));
          setValue("zipcode", getComponent("postal_code"));

          // Also update area if available
          const area =
            getComponent("sublocality_level_1") ||
            getComponent("neighborhood") ||
            "";
          if (area) {
            setValue("area", area);
          }

          // Fetch and set timezone
          const timezone = await getTimezoneFromCoordinates(lat, lng);
          if (timezone) {
            setValue("timezone", timezone);
          }

          console.log("Address updated from map:", {
            address: addressObject.formatted_address,
            city: getComponent("locality"),
            state: getComponent("administrative_area_level_1"),
            country: getComponent("country"),
            zipcode: getComponent("postal_code"),
            timezone,
          });

          // Trigger validation for all fields
          trigger([
            "address",
            "city",
            "state",
            "country",
            "zipcode",
            "area",
            "timezone",
          ]);
        } else {
          console.error("Reverse geocoding failed:", status);
        }
      });
    },
    [setValue, trigger]
  );

  // const onDragEnd = (e: any) => {
  //   const newLat = e.latLng.lat();
  //   const newLng = e.latLng.lng();
  //   console.log("New position:", { lat: newLat, lng: newLng });

  //   // Update the form values for latitude and longitude
  //   setValue("latitude", newLat);
  //   setValue("longitude", newLng);
  // };

  return (
    <div
      className="bg-white rounded-xl shadow-sm p-3 md:p-6"
      id="location-form-fields"
    >
      <h2 className="flex items-center text-xl font-bold text-gray-800 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-black mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        Location Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        {/* Address Search */}
        <div className="md:col-span-2">
          <div className="flex flex-col justify-between">
            <FieldLabel label="Search Address" required={true} />
            <p className="text-sm text-gray-500 mb-3">
              Address MUST be TYPED in. Please START TYPING and choose an
              address that Google is suggesting BELOW the address field bar.
              Please do NOT choose an address that your device has saved.
            </p>
            <Controller
              name="address"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormFieldWrapper error={errors?.address}>
                  <GoogleSearch
                    onChange={(address: any) => {
                      if (typeof address === "string") {
                        onChange(address);
                      } else if (address?.address) {
                        // Set all form values from the address object
                        onChange(address.address);
                        setValue("city", address.city, {
                          shouldValidate: true,
                        });
                        setValue("state", address.state, {
                          shouldValidate: true,
                        });
                        setValue("country", address.country, {
                          shouldValidate: true,
                        });
                        setValue("zipcode", address.zipcode, {
                          shouldValidate: true,
                        });
                        setValue("latitude", address.latitude, {
                          shouldValidate: true,
                        });
                        setValue("longitude", address.longitude, {
                          shouldValidate: true,
                        });
                        // Set timezone if available
                        if (address.timezone) {
                          setValue("timezone", address.timezone, {
                            shouldValidate: true,
                          });
                        }
                      }
                    }}
                    value={value}
                  />
                </FormFieldWrapper>
              )}
            />
          </div>
        </div>

        {/* Apartment/Suite */}
        <div className="flex flex-col justify-between">
          <FieldLabel label="Apartment/Suite" optional={true} />
          <Controller
            name="unit_no"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.unit_no}>
                <Input
                  {...field}
                  size="large"
                  placeholder="e.g. Suite 405"
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* City */}
        <div className="flex flex-col justify-between">
          <FieldLabel label="City" required={true} />
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.city}>
                <Input
                  {...field}
                  size="large"
                  placeholder="e.g. New York"
                  status={errors.city ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* State */}
        <div className="flex flex-col justify-between">
          <FieldLabel label="State" required={true} />
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.state}>
                <Input
                  {...field}
                  size="large"
                  placeholder="e.g. NY"
                  status={errors.state ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* ZIP / Postal Code */}
        <div className="flex flex-col justify-between">
          <FieldLabel label="ZIP / Postal Code" required={true} />
          <Controller
            name="zipcode"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.zipcode}>
                <Input
                  {...field}
                  size="large"
                  placeholder="e.g. 10001"
                  status={errors.zipcode ? "error" : ""}
                  className="w-full"
                  onChange={(e) => {
                    setValue("zipcode", e.target.value);
                    trigger("zipcode");
                  }}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Area */}
        <div className="flex flex-col justify-between">
          <FieldLabel label="Area" optional={true} />
          <Controller
            name="area"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.area}>
                <Input
                  {...field}
                  size="large"
                  placeholder="e.g. Manhattan"
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Country */}
        <div className="flex flex-col justify-between">
          <FieldLabel label="Country" required={true} />
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.country}>
                <Input
                  {...field}
                  size="large"
                  placeholder="e.g. United States"
                  status={errors.country ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location Map
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Drag the marker or click on the map to adjust your precise location.
            Coordinates will update automatically.
          </p>
        </div>

        <div className="h-[400px] w-full overflow-hidden rounded-lg border border-gray-300 shadow-sm">
          <DraggableLocationMap
            latitude={parseFloat(latitude) || 40.7128}
            longitude={parseFloat(longitude) || -74.006}
            height="h-[400px]"
            onLocationChange={(lat, lng) => {
              console.log("Location changed:", lat, lng);
              setValue("latitude", lat);
              setValue("longitude", lng);
              // Trigger validation for coordinates
              trigger(["latitude", "longitude"]);
            }}
            onReverseGeocode={(lat, lng) => {
              // This will update address, city, state, country, zipcode, and area
              reverseGeocodeFromMap(lat, lng);
            }}
          />
        </div>
      </div>

      {/* Coordinates Section */}
      <div className="mt-8  grid-cols-1 gap-6 md:grid-cols-3 hidden">
        {/* Latitude */}
        <div className="flex flex-col justify-between">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Latitude
          </label>
          <Controller
            name="latitude"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.latitude}>
                <Input
                  {...field}
                  type="number"
                  size="large"
                  min="-90"
                  max="90"
                  step="any"
                  placeholder="Latitude"
                  status={errors.latitude ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Longitude */}
        <div className="flex flex-col justify-between">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Longitude
          </label>
          <Controller
            name="longitude"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.longitude}>
                <Input
                  {...field}
                  type="number"
                  size="large"
                  min="-180"
                  max="180"
                  step="any"
                  placeholder="Longitude"
                  status={errors.longitude ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Find Address Button */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={findAddress}
            className="h-[40px] w-full rounded-md bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 font-medium text-white shadow-md transition-all duration-300 hover:from-red-700 hover:to-red-800"
          >
            <i className="fa fa-map-marked-alt mr-2" />
            Find Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationFormFields;
