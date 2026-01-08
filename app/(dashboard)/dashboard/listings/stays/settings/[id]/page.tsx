"use client";

import React, { useCallback, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { Card, Button, Typography, Alert } from "antd";
import { useApiGet, useApiMutation } from "@/http-service";
import { useApp } from "@/providers/AppMessageProvider";
import { useGoogleMaps } from "@/providers/GoogleMapsProvider";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Input } from "antd";
import GoogleSearch from "@/components/shared/google-search";
import { LoadingOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const StaySettingsPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const stayId = params?.id as string;
  const isUpdate = searchParams.get("update") === "1";
  const { message: appMessage } = useApp();
  const { isLoaded } = useGoogleMaps();

  const defaultValues = {
    address: "",
    unit_no: "",
    city: "",
    state: "",
    zipcode: "",
    area: "",
    country: "",
    latitude: "",
    longitude: "",
    timezone: "",
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const latitude = watch("latitude");
  const longitude = watch("longitude");

  // Fetch stay data
  const { data: stayData, isLoading: loadingStay } = useApiGet({
    endpoint: `/api/stays/${stayId}`,
    queryKey: ["stay-settings", stayId],
    config: {
      enabled: !!stayId,
    },
  });

  // Reset form when data is loaded
  useEffect(() => {
    if (stayData) {
      const {
        address,
        unit_no,
        city,
        state,
        zipcode,
        area,
        country,
        longitude,
        latitude,
        fake_longitude,
        fake_latitude,
      } = stayData || {};

      reset({
        address: address || "",
        unit_no: unit_no || "",
        city: city || "",
        state: state || "",
        zipcode: zipcode || "",
        area: area || "",
        country: country || "",
        longitude: fake_longitude || longitude || "",
        latitude: fake_latitude || latitude || "",
      });
    }
  }, [stayData, reset]);

  // Update coordinates mutation
  const { mutate: updateCoordinates, isPending: updatingCoordinates } =
    useApiMutation({
      endpoint: `/api/stays/${stayId}/fake-coordinates`,
      method: "patch",
      config: {
        onSuccess: () => {
          appMessage.success("Fake coordinates updated successfully!");
          // Refresh the parent window if it exists
          if (window.opener) {
            window.opener.location.reload();
          }
        },
        onError: (err) => {
          appMessage.error(
            err?.response?.data?.message || "Failed to update coordinates"
          );
        },
      },
    });

  const findAddress = useCallback(() => {
    if (!isLoaded || !latitude || !longitude) return;

    const latLng = new window.google.maps.LatLng(
      parseFloat(latitude),
      parseFloat(longitude)
    );
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
        setValue("latitude", addressObject.geometry.location.lat().toString());
        setValue("longitude", addressObject.geometry.location.lng().toString());
      } else {
        appMessage.error("Geocoding failed. Please try again.");
      }
    });
  }, [isLoaded, latitude, longitude, setValue, appMessage]);

  const onMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        setValue("latitude", newLat.toString());
        setValue("longitude", newLng.toString());
      }
    },
    [setValue]
  );

  const onSubmit = useCallback(
    (formValues: any) => {
      const payload = {
        fake_latitude: parseFloat(formValues.latitude) || null,
        fake_longitude: parseFloat(formValues.longitude) || null,
      };
      updateCoordinates(payload);
    },
    [updateCoordinates]
  );

  if (loadingStay || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingOutlined style={{ fontSize: 48 }} spin />
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 ">
      <div className=" mx-auto">
        <Card className="p-4 md:p-8">
          <FormProvider {...methods}>
            <Title level={3} className="mb-4">
              {isUpdate ? "Update Fake Coordinates" : "Set Fake Coordinates"}
            </Title>

            <Alert
              message="Fake Coordinates Information"
              description="You can set fake coordinates here that will be displayed on the map instead of the real location. You can either move the marker manually or enter a nearby address in the designated field to update the location."
              type="info"
              showIcon
              className="mb-6"
            />

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Controller
                    name="address"
                    control={methods.control}
                    render={({ field: { onChange, value } }) => (
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <GoogleSearch
                          id="address"
                          isLoaded={isLoaded}
                          onChange={(address: any) => {
                            onChange(address?.address ?? address);
                            if (address?.address) {
                              setValue("address", address.address);
                              setValue("city", address.city || "");
                              setValue("state", address.state || "");
                              setValue("country", address.country || "");
                              setValue("zipcode", address.zipcode || "");
                              setValue(
                                "latitude",
                                address?.latitude?.toString() || ""
                              );
                              setValue(
                                "longitude",
                                address?.longitude?.toString() || ""
                              );
                              // Set timezone if available
                              if (address?.timezone) {
                                setValue("timezone", address.timezone);
                              }
                            }
                          }}
                          value={value}
                        />
                      </div>
                    )}
                  />
                </div>

                <div>
                  <Controller
                    name="unit_no"
                    control={methods.control}
                    render={({ field: { onChange, value } }) => (
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                          Apartment/Suite (Optional)
                        </label>
                        <Input
                          value={value}
                          onChange={onChange}
                          placeholder="Unit number"
                        />
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Controller
                  name="city"
                  control={methods.control}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        City
                      </label>
                      <Input value={value} onChange={onChange} />
                    </div>
                  )}
                />

                <Controller
                  name="state"
                  control={methods.control}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        State
                      </label>
                      <Input value={value} onChange={onChange} />
                    </div>
                  )}
                />

                <Controller
                  name="zipcode"
                  control={methods.control}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        ZIP / Postal Code
                      </label>
                      <Input value={value} onChange={onChange} />
                    </div>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Controller
                  name="area"
                  control={methods.control}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Area (Optional)
                      </label>
                      <Input value={value} onChange={onChange} />
                    </div>
                  )}
                />

                <Controller
                  name="country"
                  control={methods.control}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <Input value={value} onChange={onChange} />
                    </div>
                  )}
                />
              </div>

              {/* Map */}
              <div className="mb-4">
                <div
                  style={{
                    width: "100%",
                    height: "500px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid #d9d9d9",
                  }}
                >
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={{
                      lat: parseFloat(latitude) || 40.7128,
                      lng: parseFloat(longitude) || -74.006,
                    }}
                    zoom={15}
                  >
                    <Marker
                      position={{
                        lat: parseFloat(latitude) || 40.7128,
                        lng: parseFloat(longitude) || -74.006,
                      }}
                      draggable
                      onDragEnd={onMarkerDragEnd}
                    />
                  </GoogleMap>
                </div>
              </div>

              {/* Latitude/Longitude inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Controller
                  name="latitude"
                  control={methods.control}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Latitude
                      </label>
                      <Input
                        value={value}
                        onChange={onChange}
                        type="number"
                        step="any"
                      />
                    </div>
                  )}
                />

                <Controller
                  name="longitude"
                  control={methods.control}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Longitude
                      </label>
                      <Input
                        value={value}
                        onChange={onChange}
                        type="number"
                        step="any"
                      />
                    </div>
                  )}
                />

                <div className="flex items-end">
                  <Button
                    type="default"
                    onClick={findAddress}
                    className="w-full"
                    disabled={!latitude || !longitude}
                  >
                    Find Address
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  onClick={() => window.close()}
                  disabled={updatingCoordinates}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={updatingCoordinates}
                >
                  {isUpdate ? "Update Fake Coordinates" : "Save Coordinates"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </Card>
      </div>
    </div>
  );
};

export default StaySettingsPage;
