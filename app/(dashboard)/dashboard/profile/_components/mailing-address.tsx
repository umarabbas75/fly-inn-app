import React, { useRef } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { Controller, useFormContext } from "react-hook-form";
import { Input, Select } from "antd";
import useGoogleMap from "@/hooks/use-google-hook";
import GoogleSearch from "@/components/shared/google-search";
import FormFieldWrapper from "@/components/shared/FormFieldWrapper";

const { Option } = Select;

const MailingAddress = () => {
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const { isLoaded, loadError } = useGoogleMap();

  if (loadError) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-5 md:p-6">
        <div className="text-red-600 text-center py-4 sm:py-8 text-xs sm:text-sm">
          Error loading Google Maps. Please refresh the page and try again.
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-5 md:p-6">
        <div className="text-center py-4 sm:py-8">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto mb-2 sm:mb-4"></div>
          <span className="text-xs sm:text-sm">Loading Google Maps...</span>
        </div>
      </div>
    );
  }
  return (
    <div
      className="bg-white rounded-xl shadow-sm p-3 sm:p-5 md:p-6"
      id="mailing-address"
    >
      <h2 className="flex items-center text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        Mailing Address
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 md:gap-6">
        {/* Street Address */}
        <div className="flex flex-col justify-between">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Street Address <span className="text-red-500">*</span>
          </label>
          <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-3">
            Start typing to search for your address
          </p>
          <Controller
            name="address"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormFieldWrapper error={errors.address}>
                <GoogleSearch
                  onChange={(address: {
                    address: any;
                    city: any;
                    state: any;
                    country: any;
                    zipcode: any;
                    latitude: any;
                    longitude: any;
                  }) => {
                    onChange(address?.address ?? address);
                    if (address?.address) {
                      // Set form values (flat structure)
                      setValue("address", address.address);
                      setValue("city", address.city || null, {
                        shouldValidate: true,
                      });
                      setValue("state", address.state || null, {
                        shouldValidate: true,
                      });
                      setValue("country", address.country || null, {
                        shouldValidate: true,
                      });
                      setValue("zip_code", address.zipcode || null, {
                        shouldValidate: true,
                      });
                      setValue("unit_no", null, {
                        shouldValidate: true,
                      });
                      setValue("neighbourhood", null, {
                        shouldValidate: true,
                      });
                    }
                  }}
                  value={value}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Apartment/Suite (unit_no) */}
        <div className="flex flex-col justify-between">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Apartment/Suite{" "}
            <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-3">
            Unit, suite, or building number
          </p>
          <Controller
            name="unit_no"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.unit_no}>
                <Input
                  {...field}
                  size="large"
                  type="text"
                  placeholder="Apt 4B"
                  status={errors.unit_no ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* City */}
        <div className="flex flex-col justify-between">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.city}>
                <Input
                  {...field}
                  size="large"
                  placeholder="New York"
                  status={errors.city ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* State */}
        <div className="flex flex-col justify-between">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State <span className="text-red-500">*</span>
          </label>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.state}>
                <Input
                  {...field}
                  size="large"
                  placeholder="NY"
                  status={errors.state ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* ZIP Code */}
        <div className="flex flex-col justify-between">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ZIP Code <span className="text-red-500">*</span>
          </label>
          <Controller
            name="zip_code"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.zip_code}>
                <Input
                  {...field}
                  size="large"
                  placeholder="10001"
                  status={errors.zip_code ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Neighbourhood */}
        <div className="flex flex-col justify-between">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Neighbourhood{" "}
            <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-3">
            Your neighborhood or district
          </p>
          <Controller
            name="neighbourhood"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.neighbourhood}>
                <Input
                  {...field}
                  size="large"
                  placeholder="Manhattan"
                  status={errors.neighbourhood ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Country */}
        <div className="flex flex-col justify-between">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.country}>
                <Input
                  {...field}
                  size="large"
                  placeholder="United States"
                  status={errors.country ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default MailingAddress;
