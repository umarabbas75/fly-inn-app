import { Input, InputNumber, Button, Select } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import React, { memo } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import FormFieldWrapper from "@/components/shared/FormFieldWrapper";

const BedroomFields = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext(); // Access form context

  const watchFieldArray = watch("bedrooms");

  const { fields, append, remove } = useFieldArray({
    control, // Pass the control object from `useForm`
    name: "bedrooms", // Name of the field array
  });

  // Type assertion for bedrooms errors
  const bedroomErrors = (errors.bedrooms as any) || [];

  // Combine field metadata and watched values for each dependant
  const bedroomsList = fields.map((field, index) => {
    return {
      ...field, // Include field metadata from `useFieldArray`
      ...watchFieldArray?.[index], // Include watched values from `watch`
    };
  });

  return (
    <div
      className="bg-white rounded-xl shadow-sm p-3 md:p-6"
      id="bedroom-fields"
    >
      <h2 className="flex items-center text-xl font-bold text-gray-800 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-primary-500 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
        Bedrooms
      </h2>

      <div className="text-gray-600 mb-6">
        Configure individual bedroom details including capacity, bed types, and
        guest accommodations
      </div>

      {/* Validation Rule Notice */}
      {bedroomsList?.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-primary/60 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-primary mb-1">
                Important: Complete Bedroom Information
              </p>
              <p className="text-sm text-primary/70">
                Once you start filling in any bedroom field, all fields for that
                bedroom become required. Please complete all fields or remove
                the bedroom entry entirely.
              </p>
            </div>
          </div>
        </div>
      )}

      {bedroomsList?.map((bedroom, index) => {
        return (
          <div
            key={bedroom.id}
            className="mb-6 p-3 sm:p-4 md:p-6 border border-gray-200 rounded-lg bg-gray-50"
            id="bedrooms"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bedroom Name */}
              <div className="flex flex-col justify-between">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedroom Name
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Give this bedroom a descriptive name
                </p>
                <Controller
                  name={`bedrooms[${index}].name`}
                  control={control}
                  render={({ field }) => (
                    <FormFieldWrapper error={bedroomErrors?.[index]?.name}>
                      <Input
                        {...field}
                        size="large"
                        placeholder="e.g. Master Bedroom"
                        status={bedroomErrors?.[index]?.name ? "error" : ""}
                        className="w-full"
                      />
                    </FormFieldWrapper>
                  )}
                />
              </div>

              {/* Number of Guests */}
              <div className="flex flex-col justify-between">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  How many guests can this bedroom accommodate
                </p>
                <Controller
                  name={`bedrooms[${index}].no_of_guest`}
                  control={control}
                  render={({ field }) => (
                    <FormFieldWrapper
                      error={bedroomErrors?.[index]?.no_of_guest}
                    >
                      <InputNumber
                        {...field}
                        size="large"
                        placeholder="e.g. 2"
                        min={0}
                        step={1}
                        precision={0}
                        status={
                          bedroomErrors?.[index]?.no_of_guest ? "error" : ""
                        }
                        className="w-full"
                      />
                    </FormFieldWrapper>
                  )}
                />
              </div>

              {/* Number of Beds */}
              <div className="flex flex-col justify-between">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Beds
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Total number of beds in this bedroom
                </p>
                <Controller
                  name={`bedrooms[${index}].no_of_beds`}
                  control={control}
                  render={({ field }) => (
                    <FormFieldWrapper
                      error={bedroomErrors?.[index]?.no_of_beds}
                    >
                      <InputNumber
                        {...field}
                        size="large"
                        placeholder="e.g. 1"
                        min={0}
                        step={1}
                        precision={0}
                        status={
                          bedroomErrors?.[index]?.no_of_beds ? "error" : ""
                        }
                        className="w-full"
                      />
                    </FormFieldWrapper>
                  )}
                />
              </div>

              {/* Bed Type */}
              <div className="flex flex-col justify-between">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bed Type
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Type of bed(s) in this bedroom
                </p>
                <Controller
                  name={`bedrooms[${index}].bed_type`}
                  control={control}
                  render={({ field }) => (
                    <FormFieldWrapper error={bedroomErrors?.[index]?.bed_type}>
                      <Input
                        {...field}
                        size="large"
                        placeholder="Enter bed type (e.g., King, Queen, Twin)"
                        status={bedroomErrors?.[index]?.bed_type ? "error" : ""}
                        className="w-full"
                      />
                    </FormFieldWrapper>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => remove(index)}
                className="!bg-red-600 hover:!bg-red-700 !text-white"
              >
                Remove Bedroom
              </Button>
            </div>
          </div>
        );
      })}

      <Button
        type="dashed"
        size="large"
        onClick={() => {
          append({
            name: null,
            no_of_guest: null,
            no_of_beds: null,
            bed_type: null,
          });
        }}
        className="w-full border-2 border-dashed border-gray-300  py-4"
      >
        + Add New Bedroom
      </Button>
    </div>
  );
};

export default memo(BedroomFields);
