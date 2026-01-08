/* eslint-disable react/jsx-props-no-spreading */
import { lodgingType, spaceTypes, unitMeasure } from "@/constants/stays";
import React, { memo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input, InputNumber } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import ReactQuillEditor from "@/components/shared/ReactQuillEditor";
import FormFieldWrapper from "@/components/shared/FormFieldWrapper";
import { FieldLabel } from "@/components/shared/FieldLabel";
import { SearchableSelect } from "@/components/ui/searchable-select";

const { TextArea } = Input;

// Lodging types that require floor number
const FLOOR_NUMBER_LODGING_TYPES = [
  "hotel_room",
  "apt_condo_loft",
  "bed_breakfast",
];

const InformationFields = () => {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext(); // Access form context
  const lodgingValue = watch("lodging_type");

  // Handle lodging type change - reset floor_number if switching to a type that doesn't need it
  const handleLodgingTypeChange = (
    newValue: string | string[],
    fieldOnChange: (value: string | string[]) => void
  ) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    const currentLodging = getValues("lodging_type");
    const wasFloorRequired =
      FLOOR_NUMBER_LODGING_TYPES.includes(currentLodging);
    const isFloorRequired = FLOOR_NUMBER_LODGING_TYPES.includes(value);

    // If switching from a type that needs floor to one that doesn't, reset floor_number
    if (wasFloorRequired && !isFloorRequired) {
      setValue("floor_number", null);
    }

    fieldOnChange(newValue);
  };
  return (
    <div
      className="bg-white rounded-xl shadow-sm p-3 md:p-6"
      id="information-fields"
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
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
        Property Information
      </h2>

      <div className="text-gray-600 mb-6">
        Provide detailed information about your property including space type,
        capacity, and amenities
      </div>

      <div
        className={`grid grid-cols-1 ${
          lodgingValue === "hotel_room" ? "md:grid-cols-3" : `md:grid-cols-2`
        } gap-x-6 gap-y-3 mb-6`}
      >
        {/* Type of Space */}
        <div className="flex flex-col justify-between">
          <FieldLabel label="Type of Space" required={true} />
          <p className="text-sm text-gray-500 mb-3">
            Select the type of space you're offering
          </p>
          <Controller
            name="type_of_space"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.type_of_space}>
                <SearchableSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={spaceTypes}
                  placeholder="Select a space type"
                  error={!!errors?.type_of_space}
                  showSearch={false}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Lodging Type */}
        <div className="flex flex-col justify-between">
          <FieldLabel label="Lodging Type" required={true} />
          <p className="text-sm text-gray-500 mb-3">
            Choose the type of accommodation
          </p>
          <Controller
            name="lodging_type"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.lodging_type}>
                <SearchableSelect
                  value={field.value}
                  onValueChange={(value) =>
                    handleLodgingTypeChange(value, field.onChange)
                  }
                  options={lodgingType}
                  placeholder="Select a lodging type"
                  error={!!errors?.lodging_type}
                  showSearch={false}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {lodgingValue && FLOOR_NUMBER_LODGING_TYPES.includes(lodgingValue) && (
          <div className="flex flex-col justify-between">
            <FieldLabel
              label="Floor Number"
              required={lodgingValue === "hotel_room"}
            />
            <p className="text-sm text-gray-500 mb-3">
              Enter the floor number of your property
            </p>
            <Controller
              name="floor_number"
              control={control}
              rules={{
                required: FLOOR_NUMBER_LODGING_TYPES.includes(lodgingValue)
                  ? "Floor number is required"
                  : false,
              }}
              render={({ field }) => (
                <FormFieldWrapper error={errors?.floor_number}>
                  <InputNumber
                    {...field}
                    size="large"
                    placeholder="Enter the floor number"
                    status={errors?.floor_number ? "error" : ""}
                    className="w-full"
                    min={0}
                  />
                </FormFieldWrapper>
              )}
            />
          </div>
        )}
      </div>

      {/* Title Field */}
      {/* <div className="mb-6">
        <FieldLabel label="Property Title" required={true} />
        <p className="text-sm text-gray-500 mb-3">
          Format: (Airport Identifier) Airport Name - Title
        </p>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <FormFieldWrapper error={errors?.title}>
              <Input
                {...field}
                size="large"
                placeholder="(KJFK) John F. Kennedy Airport - Luxury Villa"
                status={errors?.title ? "error" : ""}
                className="w-full"
                suffix={
                  <InfoCircleOutlined
                    className="text-blue-500 cursor-help"
                    title="Please enter the airport identifier in parentheses, then a space, then the name of the airport, then space hyphen space, and then the title of your choice."
                  />
                }
              />
            </FormFieldWrapper>
          )}
        />
      </div> */}

      {/* Capacity Fields - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="flex flex-col justify-between">
          <FieldLabel label="Number of Guests" required={true} />
          <Controller
            name="no_of_guest"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.no_of_guest}>
                <InputNumber
                  {...field}
                  size="large"
                  placeholder="1"
                  min={1}
                  step={1}
                  precision={0}
                  status={errors?.no_of_guest ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        <div className="flex flex-col justify-between">
          <FieldLabel label="Number of Bedrooms" required={true} />
          <Controller
            name="no_of_bedrooms"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.no_of_bedrooms}>
                <InputNumber
                  {...field}
                  size="large"
                  placeholder="2"
                  min={0}
                  step={1}
                  precision={0}
                  status={errors?.no_of_bedrooms ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        <div className="flex flex-col justify-between">
          <FieldLabel label="Number of Beds" required={true} />
          <Controller
            name="no_of_beds"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.no_of_beds}>
                <InputNumber
                  {...field}
                  size="large"
                  placeholder="3"
                  min={0}
                  step={1}
                  precision={0}
                  status={errors?.no_of_beds ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>
      </div>

      {/* Bathrooms and Rooms - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="flex flex-col justify-between">
          <FieldLabel label="Number of Bathrooms" required={true} />
          <Controller
            name="no_of_bathrooms"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.no_of_bathrooms}>
                <InputNumber
                  {...field}
                  size="large"
                  placeholder="2.5"
                  min={0}
                  step={0.25}
                  status={errors?.no_of_bathrooms ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        <div className="flex flex-col justify-between">
          <FieldLabel label="Number of Rooms" required={true} />
          <Controller
            name="no_of_rooms"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.no_of_rooms}>
                <InputNumber
                  {...field}
                  size="large"
                  placeholder="3"
                  min={0}
                  status={errors?.no_of_rooms ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Size and Unit of Measure - Merged into single field */}

        <div className="flex flex-col justify-between">
          <FieldLabel label="Size" required={true} />
          <p className="text-sm text-gray-500 mb-3">
            Enter the size of your property
          </p>
          <Controller
            name="size"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.size}>
                <InputNumber
                  {...field}
                  size="large"
                  placeholder="200"
                  min={1}
                  step={1}
                  precision={0}
                  status={errors?.size ? "error" : ""}
                  className="w-full"
                  addonBefore={
                    <Controller
                      name="unit_of_measure"
                      control={control}
                      render={({ field: unitField }) => (
                        <div style={{ minWidth: 120 }}>
                          <SearchableSelect
                            value={unitField.value}
                            onValueChange={unitField.onChange}
                            options={unitMeasure}
                            placeholder="Unit"
                            error={!!errors?.unit_of_measure}
                            showSearch={false}
                          />
                        </div>
                      )}
                    />
                  }
                />
              </FormFieldWrapper>
            )}
          />
        </div>
      </div>

      {/* Description Field */}
      <div className="mb-6">
        <FieldLabel label="Description" required={true} />
        <p className="text-sm text-gray-500 mb-3">
          Provide a detailed description of your property
        </p>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <FormFieldWrapper error={errors?.description}>
              <ReactQuillEditor
                name="description"
                placeholder=""
                rows={6}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            </FormFieldWrapper>
          )}
        />
      </div>
    </div>
  );
};

export default memo(InformationFields);
