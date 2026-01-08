"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Input } from "antd";
import { Label } from "@/components/ui/label";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import useGoogleMap from "@/hooks/use-google-hook";
import GooglePlacesInput from "@/components/shared/goggle-places-input";

const Step2LocationForm = () => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const latitude = watch("latitude");
  const longitude = watch("longitude");

  const { isLoaded, onLoad, onUnmount } = useGoogleMap();

  const onDragEnd = (e: any) => {
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();
    console.log("New position:", { lat: newLat, lng: newLng });

    // Update the form values for latitude and longitude
    setValue("latitude", newLat);
    setValue("longitude", newLng);
  };

  if (!isLoaded) return "Loading...";
  return (
    <div className="space-y-6 w-[70%] mx-auto">
      <h2 className="text-2xl font-semibold text-center">
        Where's your place located
      </h2>
      <div
        style={{
          width: "100%",
          height: "320px",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={{ lat: +latitude || 40.7128, lng: +longitude || -74.006 }}
          zoom={20}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <MarkerF
            onDragEnd={onDragEnd}
            draggable
            position={{ lat: +latitude || 40.7128, lng: +longitude || -74.006 }}
          />
        </GoogleMap>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label>Address</Label>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <>
                <GooglePlacesInput
                  onSelect={(address) => {
                    console.log({ address });
                    if (address?.address) {
                      // Set form values
                      setValue("address", address.address, {
                        shouldValidate: true,
                      });
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
                      setValue("latitude", address?.latitude, {
                        shouldValidate: true,
                      });
                      setValue("longitude", address?.longitude, {
                        shouldValidate: true,
                      });
                      // Set timezone if available
                      if (address?.timezone) {
                        setValue("timezone", address.timezone, {
                          shouldValidate: true,
                        });
                      }
                    }
                  }}
                  value={field.value}
                  onChange={field.onChange}
                />

                {errors.address && (
                  <p className="text-red-500 text-sm">
                    {errors.address.message?.toString()}
                  </p>
                )}
              </>
            )}
          />
        </div>

        <div>
          <Label>Unit No (Optional)</Label>
          <Controller
            name="unit_no"
            control={control}
            render={({ field }) => (
              <Input size="large" placeholder="Apt, Suite, etc." />
            )}
          />
        </div>

        <div>
          <Label>City</Label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Input size="large" {...field} placeholder="City" />
            )}
          />
          {errors.city && (
            <p className="text-red-500 text-sm">
              {errors.city.message?.toString()}
            </p>
          )}
        </div>

        <div>
          <Label>State</Label>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <Input size="large" {...field} placeholder="State" />
            )}
          />
          {errors.state && (
            <p className="text-red-500 text-sm">
              {errors.state.message?.toString()}
            </p>
          )}
        </div>

        <div>
          <Label>Zip Code</Label>
          <Controller
            name="zipcode"
            control={control}
            render={({ field }) => (
              <Input size="large" {...field} placeholder="Zip Code" />
            )}
          />
          {errors.zipcode && (
            <p className="text-red-500 text-sm">
              {errors.zipcode.message?.toString()}
            </p>
          )}
        </div>

        <div>
          <Label>Area (Optional)</Label>
          <Controller
            name="area"
            control={control}
            render={({ field }) => (
              <Input size="large" {...field} placeholder="Area / Locality" />
            )}
          />
        </div>

        <div>
          <Label>Country</Label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Input size="large" {...field} placeholder="Country" />
            )}
          />
          {errors.country && (
            <p className="text-red-500 text-sm">
              {errors.country.message?.toString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2LocationForm;
