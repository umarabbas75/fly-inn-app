/* eslint-disable react/jsx-props-no-spreading */
import { Input, Select, InputNumber, Button } from "antd";
import React, { useRef } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { InfoCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import FormFieldWrapper from "@/components/shared/FormFieldWrapper";
import { FieldLabel } from "@/components/shared/FieldLabel";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  airportDefaultValues,
  airportUse,
  distanceOptions,
  fuelOptions,
  groundTransportationOptions,
  hangarOptions,
  lighting,
  patternOptions,
} from "@/constants/stays";

const { Option } = Select;

const AirportInformationFields = () => {
  const {
    control,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext(); // Access form context

  const watchFieldArray = watch("airports");

  const { fields, append, remove } = useFieldArray({
    control, // Pass the control object from `useForm`
    name: "airports", // Name of the field array
  });

  // Type assertion for airports errors
  const airportErrors = (errors.airports as any) || [];

  // Combine field metadata and watched values for each dependant
  const airPortList = fields.map((field, index) => {
    return {
      ...field, // Include field metadata from `useFieldArray`
      ...watchFieldArray?.[index], // Include watched values from `watch`
    };
  });

  // Utility to round to two decimal places
  const round2 = (val: number) => Math.round(val * 100) / 100;

  const elevationUnitA = watch("elevationUnitA");
  const elevationMin = watch("elevationMin");
  const elevationMax = watch("elevationMax");
  const length = watch("length");
  const width = watch("width");

  const handleUnitChange = (newUnit: "ft" | "m") => {
    if (newUnit === "m") {
      // Convert feet to meters
      setValue(
        "elevationMin",
        elevationMin !== "" && !isNaN(Number(elevationMin))
          ? round2(Number(elevationMin) * 0.3048)
          : ""
      );
      setValue(
        "elevationMax",
        elevationMax !== "" && !isNaN(Number(elevationMax))
          ? round2(Number(elevationMax) * 0.3048)
          : ""
      );
    } else if (newUnit === "ft") {
      // Convert meters to feet
      setValue(
        "elevationMin",
        elevationMin !== "" && !isNaN(Number(elevationMin))
          ? round2(Number(elevationMin) / 0.3048)
          : ""
      );
      setValue(
        "elevationMax",
        elevationMax !== "" && !isNaN(Number(elevationMax))
          ? round2(Number(elevationMax) / 0.3048)
          : ""
      );
    }
  };

  const handleDimensionUnitChange = (newUnit: "ft" | "m") => {
    if (newUnit === "m") {
      // Convert feet to meters
      setValue(
        "length",
        length !== "" && !isNaN(Number(length))
          ? round2(Number(length) * 0.3048)
          : ""
      );
      setValue(
        "width",
        width !== "" && !isNaN(Number(width))
          ? round2(Number(width) * 0.3048)
          : ""
      );
    } else if (newUnit === "ft") {
      // Convert meters to feet
      setValue(
        "length",
        length !== "" && !isNaN(Number(length))
          ? round2(Number(length) / 0.3048)
          : ""
      );
      setValue(
        "width",
        width !== "" && !isNaN(Number(width))
          ? round2(Number(width) / 0.3048)
          : ""
      );
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm p-3 md:p-6"
      id="airport-information-fields"
    >
      <h2 className="flex items-center text-xl font-bold text-gray-800 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-black mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
        </svg>
        Airport Information
      </h2>

      <div className="text-gray-600 mb-6">
        Provide detailed information about nearby airports including
        identifiers, facilities, and access details
      </div>

      {/* Helicopters Allowed */}
      {airPortList?.map((airPort, index) => {
        return (
          <div
            key={airPort.id}
            id="airports"
            className="mb-8 p-3 sm:p-4 md:p-6 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 mb-6">
              {/* Airport Identifier */}
              <div className="flex flex-col justify-between">
                <FieldLabel label="Identifier" required={true} />
                <p className="text-sm text-gray-500 mb-3">
                  2-4 digit identifier or special designation
                </p>
                <Controller
                  name={`airports[${index}].identifier`}
                  control={control}
                  render={({ field }) => (
                    <FormFieldWrapper
                      error={airportErrors?.[index]?.identifier}
                    >
                      <Input
                        {...field}
                        size="large"
                        placeholder="e.g., EGHG"
                        status={
                          airportErrors?.[index]?.identifier ? "error" : ""
                        }
                        className="w-full"
                      />
                    </FormFieldWrapper>
                  )}
                />
              </div>

              {/* Airport Name */}
              <div className="flex flex-col justify-between">
                <FieldLabel label="Airport Name" required={true} />
                <p className="text-sm text-gray-500 mb-3">
                  Full name of the airport
                </p>
                <Controller
                  name={`airports[${index}].name`}
                  control={control}
                  render={({ field }) => (
                    <FormFieldWrapper error={airportErrors?.[index]?.name}>
                      <Input
                        {...field}
                        size="large"
                        placeholder="e.g., Heathrow Airport"
                        status={airportErrors?.[index]?.name ? "error" : ""}
                        className="w-full"
                      />
                    </FormFieldWrapper>
                  )}
                />
              </div>

              {/* Airport Use */}
              <div className="flex flex-col justify-between">
                <FieldLabel label="Airport Use" required={true} />
                <p className="text-sm text-gray-500 mb-3">
                  Type of airport operation
                </p>
                <Controller
                  name={`airports[${index}].use`}
                  control={control}
                  render={({ field }) => (
                    <FormFieldWrapper error={airportErrors?.[index]?.use}>
                      <SearchableSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        options={airportUse}
                        placeholder="Select airport use"
                        error={!!airportErrors?.[index]?.use}
                        showSearch={false}
                      />
                    </FormFieldWrapper>
                  )}
                />
              </div>
            </div>

            {/* Operation Hours */}
            <div className="col-span-full mb-4 sm:mb-5 md:mb-6">
              <FieldLabel label="Operation Hours" required={true} />
              <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                Enter the airport operation hours (e.g., "Mon-Fri: 6:00 AM -
                8:00 PM, Sat-Sun: 24/7")
              </p>
              <Controller
                name={`airports[${index}].operation_hours`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter operation hours"
                    status={
                      airportErrors?.[index]?.operation_hours ? "error" : ""
                    }
                  />
                )}
              />
              {airportErrors?.[index]?.operation_hours && (
                <span className="text-xs text-red-500 mt-1">
                  {airportErrors[index].operation_hours.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 mb-6">
              {/* Lighting */}
              <div className="flex flex-col justify-between">
                <FieldLabel label="Lighting" required={true} />
                <p className="text-sm text-gray-500 mb-3">
                  Runway lighting availability
                </p>
                <Controller
                  name={`airports[${index}].lighting`}
                  control={control}
                  render={({ field }) => (
                    <FormFieldWrapper error={airportErrors?.[index]?.lighting}>
                      <SearchableSelect
                        value={field.value?.toString()}
                        onValueChange={(val) => field.onChange(val === "true")}
                        options={[
                          { value: "true", label: "Yes" },
                          { value: "false", label: "No" },
                        ]}
                        placeholder="Select lighting option"
                        error={!!airportErrors?.[index]?.lighting}
                        showSearch={false}
                      />
                    </FormFieldWrapper>
                  )}
                />
              </div>

              {/* Helicopters Allowed */}
              <div className="flex flex-col justify-between">
                <FieldLabel label="Helicopters Allowed" required={true} />

                <p className="text-sm text-gray-500 mb-3">
                  Specify if helicopter operations are permitted
                </p>
                <Controller
                  name={`airports[${index}].helicopter_allowed`}
                  control={control}
                  render={({ field }) => (
                    <FormFieldWrapper
                      error={airportErrors?.[index]?.helicopter_allowed}
                    >
                      <SearchableSelect
                        value={field.value?.toString()}
                        onValueChange={(val) => field.onChange(val === "true")}
                        options={[
                          { value: "true", label: "Yes" },
                          { value: "false", label: "No" },
                        ]}
                        placeholder="Select option"
                        error={!!airportErrors?.[index]?.helicopter_allowed}
                        showSearch={false}
                      />
                    </FormFieldWrapper>
                  )}
                />
              </div>

              <div className="flex flex-col justify-between">
                <FieldLabel label="CTAF/UNICOM" required={true} />

                <p className="text-sm text-gray-500 mb-3">
                  Communication frequency
                </p>
                <Controller
                  name={`airports[${index}].ctaf_unicom`}
                  control={control}
                  render={({ field }) => (
                    <FormFieldWrapper
                      error={airportErrors?.[index]?.ctaf_unicom}
                    >
                      <Input
                        {...field}
                        size="large"
                        placeholder="e.g., 122.8"
                        status={
                          airportErrors?.[index]?.ctaf_unicom ? "error" : ""
                        }
                        className="w-full"
                      />
                    </FormFieldWrapper>
                  )}
                />
              </div>
            </div>

            <div
              className={`grid grid-cols-1 ${
                airPortList?.[index]?.fuel?.includes("other")
                  ? "md:grid-cols-4"
                  : "md:grid-cols-3"
              } gap-x-6 gap-y-3 mb-6`}
            >
              {/* Fuel */}
              <div className="flex flex-col justify-between">
                <FieldLabel label="Fuel Available" required={true} />
                <p className="text-sm text-gray-500 mb-3">
                  Select available fuel types
                </p>
                <Controller
                  name={`airports[${index}].fuel`}
                  control={control}
                  render={({ field }) => (
                    <FormFieldWrapper error={airportErrors?.[index]?.fuel}>
                      <SearchableSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        options={fuelOptions}
                        placeholder="Select fuel options"
                        multiple={true}
                        error={!!airportErrors?.[index]?.fuel}
                        showSearch={false}
                      />
                    </FormFieldWrapper>
                  )}
                />
              </div>

              {/* Other Fuel Name - Conditional */}
              {airPortList?.[index]?.fuel?.includes("other") && (
                <div className="flex flex-col justify-between">
                  <FieldLabel label="Other Fuel Name" required={true} />
                  <p className="text-sm text-gray-500 mb-3">
                    Specify the fuel type
                  </p>
                  <Controller
                    name={`airports[${index}].other_fuel_name`}
                    control={control}
                    render={({ field }) => (
                      <FormFieldWrapper
                        error={airportErrors?.[index]?.other_fuel_name}
                      >
                        <Input
                          {...field}
                          size="large"
                          placeholder="Enter fuel type"
                          status={
                            airportErrors?.[index]?.other_fuel_name
                              ? "error"
                              : ""
                          }
                          className="w-full"
                        />
                      </FormFieldWrapper>
                    )}
                  />
                </div>
              )}

              {/* Parking */}
              <div className="flex flex-col justify-between">
                <FieldLabel label="Parking Available" required={true} />
                <p className="text-sm text-gray-500 mb-3">
                  Aircraft parking options
                </p>
                <Controller
                  name={`airports[${index}].parking`}
                  control={control}
                  render={({ field }) => (
                    <FormFieldWrapper error={airportErrors?.[index]?.parking}>
                      <SearchableSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        options={hangarOptions}
                        placeholder="Select parking option"
                        error={!!airportErrors?.[index]?.parking}
                        showSearch={false}
                      />
                    </FormFieldWrapper>
                  )}
                />
              </div>

              {/* Orientation */}
              <div className="flex flex-col justify-between">
                <FieldLabel label="Runway Orientation" optional={true} />
                <p className="text-sm text-gray-500 mb-3">
                  Runway heading (XX/XX format)
                </p>
                <Controller
                  name={`airports[${index}].orientation`}
                  control={control}
                  render={({ field }) => (
                    <FormFieldWrapper
                      error={airportErrors?.[index]?.orientation}
                    >
                      <Input
                        {...field}
                        size="large"
                        placeholder="XX/XX"
                        status={
                          airportErrors?.[index]?.orientation ? "error" : ""
                        }
                        className="w-full"
                        onChange={(e) => {
                          let { value: val } = e.target;
                          val = val.replace(/[^\d]/g, "");
                          if (val.length > 2) {
                            val = `${val.slice(0, 2)}/${val.slice(2)}`;
                          }
                          if (val.length > 5) {
                            val = val.slice(0, 5);
                          }
                          field.onChange(val);
                        }}
                      />
                    </FormFieldWrapper>
                  )}
                />
              </div>
            </div>

            {/* Elevation Range */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Elevation Range
              </h3>
              <div className="text-gray-600 mb-4">
                Specify the elevation range of the airport. This helps pilots
                understand the terrain and approach conditions.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col justify-between">
                  <FieldLabel label="Point A" required={true} />
                  <Controller
                    name={`airports[${index}].elevation_start`}
                    control={control}
                    render={({ field }) => (
                      <FormFieldWrapper
                        error={airportErrors?.[index]?.elevation_start}
                      >
                        <Input
                          {...field}
                          size="large"
                          placeholder="Elevation"
                          type="number"
                          addonAfter="ft"
                          min={0}
                        />
                      </FormFieldWrapper>
                    )}
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <FieldLabel label="Point B" required={true} />
                  <Controller
                    name={`airports[${index}].elevation_end`}
                    control={control}
                    render={({ field }) => (
                      <FormFieldWrapper
                        error={airportErrors?.[index]?.elevation_end}
                      >
                        <Input
                          {...field}
                          size="large"
                          placeholder="Elevation"
                          type="number"
                          addonAfter="ft"
                          min={0}
                        />
                      </FormFieldWrapper>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Surface */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Runway Surface
              </h3>
              <div className="text-gray-600 mb-4">
                Select the runway surface types available at this airport
                location.
              </div>
              <div
                className={`grid grid-cols-1 ${
                  airPortList?.[index]?.surface?.includes("Other")
                    ? "md:grid-cols-2"
                    : "md:grid-cols-1"
                } gap-6`}
              >
                <div className="flex flex-col justify-between">
                  <FieldLabel label="Surface Types" required={true} />
                  <Controller
                    name={`airports[${index}].surface`}
                    control={control}
                    render={({ field }) => (
                      <FormFieldWrapper error={airportErrors?.[index]?.surface}>
                        <SearchableSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          options={[
                            { value: "Asphalt", label: "Asphalt" },
                            { value: "Concrete", label: "Concrete" },
                            { value: "Grass", label: "Grass" },
                            { value: "Gravel", label: "Gravel" },
                            { value: "Dirt", label: "Dirt" },
                            { value: "Turf", label: "Turf" },
                            { value: "Water", label: "Water" },
                            { value: "Snow", label: "Snow" },
                            { value: "Ice", label: "Ice" },
                            { value: "Other", label: "Other" },
                          ]}
                          placeholder="Select surface types"
                          multiple={true}
                          error={!!airportErrors?.[index]?.surface}
                          showSearch={false}
                        />
                      </FormFieldWrapper>
                    )}
                  />
                </div>

                {/* Other Runway Type - Conditional */}
                {airPortList?.[index]?.surface?.includes("Other") && (
                  <div className="flex flex-col justify-between">
                    <FieldLabel label="Other Runway Type" required={true} />
                    <Controller
                      name={`airports[${index}].other_runway_type`}
                      control={control}
                      render={({ field }) => (
                        <FormFieldWrapper
                          error={airportErrors?.[index]?.other_runway_type}
                        >
                          <Input
                            {...field}
                            size="large"
                            placeholder="Enter runway surface type"
                            status={
                              airportErrors?.[index]?.other_runway_type
                                ? "error"
                                : ""
                            }
                            className="w-full"
                          />
                        </FormFieldWrapper>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Dimensions */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Runway Dimensions
              </h3>
              <div className="text-gray-600 mb-4">
                Provide the runway dimensions to help pilots assess aircraft
                compatibility and landing requirements for your location.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col justify-between">
                  <FieldLabel label="Length" required={true} />
                  <Controller
                    name={`airports[${index}].dimension_length`}
                    control={control}
                    render={({ field }) => (
                      <FormFieldWrapper
                        error={airportErrors?.[index]?.dimension_length}
                      >
                        <Input
                          {...field}
                          size="large"
                          placeholder="Length"
                          type="number"
                          addonAfter="ft"
                          min={0}
                        />
                      </FormFieldWrapper>
                    )}
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <FieldLabel label="Width" required={true} />
                  <Controller
                    name={`airports[${index}].dimension_width`}
                    control={control}
                    render={({ field }) => (
                      <FormFieldWrapper
                        error={airportErrors?.[index]?.dimension_width}
                      >
                        <Input
                          {...field}
                          size="large"
                          placeholder="Width"
                          type="number"
                          addonAfter="ft"
                          min={0}
                        />
                      </FormFieldWrapper>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-6">
              {/* Pattern */}
              <div className="flex flex-col justify-between">
                <FieldLabel label="Traffic Pattern" required={true} />
                <p className="text-sm text-gray-500 mb-3">
                  Standard traffic pattern direction
                </p>
                <Controller
                  name={`airports[${index}].pattern`}
                  control={control}
                  render={({ field }) => (
                    <FormFieldWrapper error={airportErrors?.[index]?.pattern}>
                      <SearchableSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        options={patternOptions}
                        placeholder="Select pattern"
                        error={!!airportErrors?.[index]?.pattern}
                        showSearch={false}
                      />
                    </FormFieldWrapper>
                  )}
                />
              </div>

              {/* Distance from Runway */}
              <div className="flex flex-col justify-between">
                <FieldLabel label="Distance from Runway" required={true} />
                <p className="text-sm text-gray-500 mb-3">
                  How far accommodations are from the runway
                </p>
                <Controller
                  name={`airports[${index}].distance_from_runway`}
                  control={control}
                  render={({ field }) => (
                    <FormFieldWrapper
                      error={airportErrors?.[index]?.distance_from_runway}
                    >
                      <SearchableSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        options={distanceOptions}
                        placeholder="Select distance"
                        error={!!airportErrors?.[index]?.distance_from_runway}
                        showSearch={false}
                      />
                    </FormFieldWrapper>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-6">
              {/* Airnav.com Information */}
              <div className="flex flex-col justify-between">
                <FieldLabel label="Airnav.com Information" optional={true} />
                <p className="text-sm text-gray-500 mb-3">
                  Link to airport details on airnav.com
                </p>
                <Controller
                  name={`airports[${index}].air_nav`}
                  control={control}
                  render={({ field }) => (
                    <FormFieldWrapper error={airportErrors?.[index]?.air_nav}>
                      <Input
                        {...field}
                        size="large"
                        placeholder="https://airnav.com/airport/"
                        status={airportErrors?.[index]?.air_nav ? "error" : ""}
                        className="w-full"
                      />
                    </FormFieldWrapper>
                  )}
                />
              </div>

              {/* Ground Transportation */}
              <div className="flex flex-col justify-between">
                <FieldLabel label="Ground Transportation" required={true} />
                <p className="text-sm text-gray-500 mb-3">
                  Available transportation options
                </p>
                <Controller
                  name={`airports[${index}].ground_transportation`}
                  control={control}
                  render={({ field }) => (
                    <FormFieldWrapper
                      error={airportErrors?.[index]?.ground_transportation}
                    >
                      <SearchableSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        options={groundTransportationOptions}
                        placeholder="Select transportation"
                        error={!!airportErrors?.[index]?.ground_transportation}
                        showSearch={false}
                      />
                    </FormFieldWrapper>
                  )}
                />
              </div>
            </div>

            {/* Additional Info */}
            <div className="mb-6">
              <FieldLabel
                label="Additional Ground Transportation Info"
                optional={true}
              />
              <p className="text-sm text-gray-500 mb-3">
                Any additional details about transportation options
              </p>
              <Controller
                name={`airports[${index}].additional_info`}
                control={control}
                render={({ field }) => (
                  <FormFieldWrapper
                    error={airportErrors?.[index]?.additional_info}
                  >
                    <Input
                      {...field}
                      size="large"
                      // placeholder="e.g., Taxi, Uber, Shuttle"
                      status={
                        airportErrors?.[index]?.additional_info ? "error" : ""
                      }
                      className="w-full"
                    />
                  </FormFieldWrapper>
                )}
              />
            </div>

            {/* Remove Airport Button */}
            {airPortList?.length > 1 && (
              <div className="flex justify-end">
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => remove(index)}
                  className="!bg-red-600 hover:!bg-red-700 !text-white"
                >
                  Remove Airport
                </Button>
              </div>
            )}
          </div>
        );
      })}

      <Button
        type="dashed"
        size="large"
        onClick={() => {
          append(airportDefaultValues);
        }}
        className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 hover:text-blue-600 py-4"
      >
        + Add New Airport
      </Button>
    </div>
  );
};

export default AirportInformationFields;
