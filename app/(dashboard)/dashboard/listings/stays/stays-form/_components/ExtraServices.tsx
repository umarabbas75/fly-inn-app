/* eslint-disable react/jsx-props-no-spreading */
import { servicesDefaultValues } from "@/constants/stays";
import { Input, InputNumber, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import React, { memo } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import FormFieldWrapper from "@/components/shared/FormFieldWrapper";
import { SearchableSelect } from "@/components/ui/searchable-select";

const ExtraServices = () => {
  const {
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext(); // Access form context

  const watchFieldArray = watch("extra_services");
  const extraServices = watch("extra_services");
  const extraService = watch("extra_service");

  const { fields, append, remove } = useFieldArray({
    control, // Pass the control object from `useForm`
    name: "extra_services", // Name of the field array
  });

  // Type assertion for extra_service errors
  const extraServiceErrors = (errors.extra_services as any) || [];

  // Combine field metadata and watched values for each dependant
  const extraServiceList = fields.map((field, index) => {
    return {
      ...field, // Include field metadata from `useFieldArray`
      ...watchFieldArray?.[index], // Include watched values from `watch`
    };
  });

  console.log({ extraServiceList });

  return (
    <div className="bg-white rounded-xl shadow-sm p-3 md:p-6" id="services">
      <h2 className="flex items-center text-xl font-bold text-gray-800 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-black mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Extra Services
      </h2>

      <div className="text-gray-600 mb-6">
        Offer additional services to enhance your guests' experience
      </div>

      {/* Extra Services Toggle */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Extra Services Available
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Do you have any extra services you would like to offer?
        </p>
        <Controller
          name="extra_service"
          control={control}
          render={({ field }) => (
            <FormFieldWrapper error={errors?.extra_service}>
              <SearchableSelect
                value={field.value?.toString()}
                onValueChange={(value) => {
                  const boolValue = value === "true";
                  field.onChange(boolValue);
                  if (boolValue === true) {
                    // If no services exist, add one default service
                    if (!extraServices || extraServices.length === 0) {
                      append(servicesDefaultValues);
                    }
                  } else {
                    // When "No" is selected, clear all services
                    setValue("extra_services", []);
                  }
                  trigger("extra_services");
                }}
                options={[
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
                placeholder="Select option"
                error={!!errors?.extra_service}
                showSearch={false}
              />
            </FormFieldWrapper>
          )}
        />
      </div>

      {/* Extra Services List */}
      {extraService === true &&
        extraServiceList?.map((service, index) => {
          return (
            <div
              key={`${service?.id}-${index}`}
              className="mb-6 p-3 sm:p-4 md:p-6 border border-gray-200 rounded-lg bg-gray-50"
              id="extra_service"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Service Name */}
                <div className="flex flex-col justify-between">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Name
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Name of the service you offer
                  </p>
                  <Controller
                    name={`extra_services[${index}].name`}
                    control={control}
                    render={({ field }) => (
                      <FormFieldWrapper
                        error={extraServiceErrors?.[index]?.name}
                      >
                        <Input
                          {...field}
                          size="large"
                          placeholder="e.g. Catering"
                          status={
                            extraServiceErrors?.[index]?.name ? "error" : ""
                          }
                          className="w-full"
                          onChange={(e) => {
                            field.onChange(e);
                            // Trigger validation for all extra_services when any field changes
                            trigger("extra_services");
                          }}
                        />
                      </FormFieldWrapper>
                    )}
                  />
                </div>

                {/* Service Price */}
                <div className="flex flex-col justify-between">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Cost of the service
                  </p>
                  <Controller
                    name={`extra_services[${index}].price`}
                    control={control}
                    render={({ field }) => (
                      <FormFieldWrapper
                        error={extraServiceErrors?.[index]?.price}
                      >
                        <InputNumber
                          {...field}
                          size="large"
                          placeholder="e.g. 50"
                          min={0}
                          step={0.01}
                          status={
                            extraServiceErrors?.[index]?.price ? "error" : ""
                          }
                          className="w-full"
                          formatter={(value) =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                          onChange={(value) => {
                            field.onChange(value);
                            // Trigger validation for all extra_services when any field changes
                            trigger("extra_services");
                          }}
                        />
                      </FormFieldWrapper>
                    )}
                  />
                </div>

                {/* Service Type */}
                <div className="flex flex-col justify-between">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pricing Type
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    How the service is charged
                  </p>
                  <Controller
                    name={`extra_services[${index}].type`}
                    control={control}
                    render={({ field }) => (
                      <FormFieldWrapper
                        error={extraServiceErrors?.[index]?.type}
                      >
                        <SearchableSelect
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            // Trigger validation for all extra_services when any field changes
                            trigger("extra_services");
                          }}
                          options={[
                            { value: "Single Fee", label: "Single Fee" },
                            { value: "Per Night", label: "Per Night" },
                            { value: "Per Guest", label: "Per Guest" },
                            {
                              value: "Per Night Per Guest",
                              label: "Per Night Per Guest",
                            },
                          ]}
                          placeholder="Select pricing type"
                          error={!!extraServiceErrors?.[index]?.type}
                          showSearch={false}
                        />
                      </FormFieldWrapper>
                    )}
                  />
                </div>

                {/* Quantity Available */}
                <div className="flex flex-col justify-between">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity Available
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    How many of this service can be provided
                  </p>
                  <Controller
                    name={`extra_services[${index}].quantity`}
                    control={control}
                    render={({ field }) => (
                      <FormFieldWrapper
                        error={extraServiceErrors?.[index]?.quantity}
                      >
                        <InputNumber
                          {...field}
                          size="large"
                          placeholder="e.g. 1"
                          min={0}
                          status={
                            extraServiceErrors?.[index]?.quantity ? "error" : ""
                          }
                          className="w-full"
                          onChange={(value) => {
                            field.onChange(value);
                            // Trigger validation for all extra_services when any field changes
                            trigger("extra_services");
                          }}
                        />
                      </FormFieldWrapper>
                    )}
                  />
                </div>
              </div>

              {/* Remove Service Button */}
              {extraServiceList?.length > 1 && (
                <div className="flex justify-end mt-6">
                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => remove(index)}
                    className="!bg-red-600 hover:!bg-red-700 !text-white"
                  >
                    Remove Service
                  </Button>
                </div>
              )}
            </div>
          );
        })}

      {/* Add New Service Button */}
      {extraService === true && (
        <Button
          type="dashed"
          size="large"
          onClick={() => {
            append(servicesDefaultValues);
          }}
          className="w-full border-2 border-dashed border-gray-300  py-4"
        >
          + Add New Service
        </Button>
      )}
    </div>
  );
};

export default memo(ExtraServices);
