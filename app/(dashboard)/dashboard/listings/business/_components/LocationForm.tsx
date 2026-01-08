"use client";

import React, { useCallback, useEffect } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "antd";
import useGoogleMap from "@/hooks/use-google-hook";
import GoogleSearch from "@/components/shared/google-search";
import { MAP_THEME } from "@/constants/google-map";

const LocationForm = () => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useFormContext();

  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const { isLoaded, onLoad, onUnmount } = useGoogleMap();

  const formatPrecision = (value: any, precision = 6) => {
    return parseFloat(parseFloat(value).toFixed(precision));
  };

  const findAddress = useCallback(() => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng) || !window.google?.maps) {
      return;
    }

    const latLng = new window.google.maps.LatLng(lat, lng);
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const addressObject = results[0];
        const addressComponents = addressObject?.address_components || [];

        const getComponent = (type: string) =>
          addressComponents.find((component) => component.types.includes(type))
            ?.long_name || "";

        setValue("address", addressObject.formatted_address);
        setValue("city", getComponent("locality"));
        setValue("state", getComponent("administrative_area_level_1"));
        setValue("country", getComponent("country"));
        setValue("zipcode", getComponent("postal_code"));

        trigger(["address", "city", "state", "country", "zipcode"]);
      }
    });
  }, [latitude, longitude, setValue, trigger]);

  const onDragEnd = useCallback(
    (e: any) => {
      const newLat = formatPrecision(e.latLng.lat());
      const newLng = formatPrecision(e.latLng.lng());

      setValue("latitude", newLat);
      setValue("longitude", newLng);
      trigger(["latitude", "longitude"]);
    },
    [setValue, trigger]
  );

  if (!isLoaded)
    return (
      <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center">
          <p className="text-gray-600 mt-2">Loading map...</p>
        </div>
      </div>
    );

  return (
    <div className="bg-white rounded-xl space-y-6">
      <div className=" pb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <i className="fa fa-map-marker-alt text-blue-500 mr-2"></i>
          Business Location
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fa fa-search text-blue-500 mr-2"></i>
              Search Address
              <span className="text-red-500 ml-1">*</span>
            </label>
            <p className="text-sm text-gray-500 !mb-3">
              Search for your business address to automatically fill location
              details.
            </p>
          </div>

          <Controller
            name="address"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="flex flex-col gap-1">
                <GoogleSearch
                  isLoaded={isLoaded}
                  onChange={(address: any) => {
                    if (typeof address === "string") {
                      onChange(address);
                    } else if (address?.address) {
                      onChange(address.address);
                      setValue("city", address.city, { shouldValidate: true });
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
                    }
                  }}
                  value={value}
                />
                {errors.address && (
                  <span className="text-red-500 text-sm mt-2 flex items-center">
                    <i className="fa fa-exclamation-circle mr-1"></i>
                    {errors.address.message as string}
                  </span>
                )}
              </div>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 !mb-2">
            <i className="fa fa-city text-blue-500 mr-2"></i>
            City
            <span className="text-red-500 ml-1">*</span>
          </label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className="w-full"
                size="large"
                placeholder="e.g. New York"
              />
            )}
          />
          {errors.city && (
            <span className="text-red-500 text-sm mt-2 flex items-center">
              <i className="fa fa-exclamation-circle mr-1"></i>
              {errors.city.message as string}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 !mb-2">
            <i className="fa fa-flag text-blue-500 mr-2"></i>
            State
            <span className="text-red-500 ml-1">*</span>
          </label>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className="w-full"
                size="large"
                placeholder="e.g. New York"
              />
            )}
          />
          {errors.state && (
            <span className="text-red-500 text-sm mt-2 flex items-center">
              <i className="fa fa-exclamation-circle mr-1"></i>
              {errors.state.message as string}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 !mb-2">
            <i className="fa fa-envelope text-blue-500 mr-2"></i>
            ZIP / Postal Code
            <span className="text-red-500 ml-1">*</span>
          </label>
          <Controller
            name="zipcode"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className="w-full"
                size="large"
                placeholder="e.g. 10001"
              />
            )}
          />
          {errors.zipcode && (
            <span className="text-red-500 text-sm mt-2 flex items-center">
              <i className="fa fa-exclamation-circle mr-1"></i>
              {errors.zipcode.message as string}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 !mb-2">
            <i className="fa fa-globe text-blue-500 mr-2"></i>
            Country
            <span className="text-red-500 ml-1">*</span>
          </label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className="w-full"
                size="large"
                placeholder="e.g. United States"
              />
            )}
          />
          {errors.country && (
            <span className="text-red-500 text-sm mt-2 flex items-center">
              <i className="fa fa-exclamation-circle mr-1"></i>
              {errors.country.message as string}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="!mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <i className="fa fa-map-pin text-blue-500 mr-2"></i>
            Location Map
          </label>
          <p className="text-sm text-gray-500 !mb-0">
            Drag the marker to adjust your precise location. Coordinates will
            update automatically.
          </p>
        </div>

        <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-300 shadow-sm">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={{ lat: +latitude || 39.5, lng: +longitude || -100.0 }}
            zoom={+latitude && +longitude ? 15 : 3.6}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              styles: MAP_THEME,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            <MarkerF
              draggable
              onDragEnd={onDragEnd}
              position={{ lat: +latitude || 39.5, lng: +longitude || -100.0 }}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          </GoogleMap>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 hidden">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <i className="fa fa-latitude text-blue-500 mr-2"></i>
            Latitude
            <span className="text-red-500 ml-1">*</span>
          </label>
          <Controller
            name="latitude"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                min="-90"
                size="large"
                max="90"
                step="any"
                className="w-full"
                placeholder="Latitude"
              />
            )}
          />
          {errors.latitude && (
            <span className="text-red-500 text-sm mt-2 flex items-center">
              <i className="fa fa-exclamation-circle mr-1"></i>
              {errors.latitude.message as string}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <i className="fa fa-longitude text-blue-500 mr-2"></i>
            Longitude
            <span className="text-red-500 ml-1">*</span>
          </label>
          <Controller
            name="longitude"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                min="-180"
                size="large"
                max="180"
                step="any"
                className="w-full"
                placeholder="Longitude"
              />
            )}
          />
          {errors.longitude && (
            <span className="text-red-500 text-sm mt-2 flex items-center">
              <i className="fa fa-exclamation-circle mr-1"></i>
              {errors.longitude.message as string}
            </span>
          )}
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={findAddress}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-3 px-4 rounded-md shadow-md transition-all duration-300 h-[50px]"
          >
            <i className="fa fa-map-marked-alt mr-2"></i>
            Find Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationForm;
