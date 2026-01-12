import React, { memo } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Input, InputNumber, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { customPeriodDefaultValues } from "@/constants/stays";
import FormFieldWrapper from "@/components/shared/FormFieldWrapper";
import { FieldLabel } from "@/components/shared/FieldLabel";
import { SearchableSelect } from "@/components/ui/searchable-select";

// Options for various select fields
const booleanOptions = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

const weekendOptions = [
  { value: "Friday and Saturday", label: "Friday and Saturday" },
  { value: "Saturday and Sunday", label: "Saturday and Sunday" },
  {
    value: "Friday, Saturday, and Sunday",
    label: "Friday, Saturday, and Sunday",
  },
];

const frequencyOptions = [
  { value: "per_stay", label: "Per stay" },
  { value: "daily", label: "Daily" },
];

interface CustomPeriod {
  id: string;
  start_date: string;
  end_date: string;
  nightly_price: number;
}

const PricingInformationFields = () => {
  const {
    control,
    trigger,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const watchFieldArray = watch("custom_periods");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "custom_periods",
  });

  // Combine field metadata and watched values for each dependant
  const customPeriodsList = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray?.[index],
    };
  });

  const petsAllowed = watch("pet_allowed") === true;
  const customPeriodPricing = watch("custom_period_pricing") === true;
  const additionalGuestAllowed = watch("additional_guest") === true;
  const applyWeekendPrice = watch("apply_weekend_price");

  // Type assertion for custom_periods errors
  const customPeriodErrors = (errors.custom_periods as any) || [];

  return (
    <div
      className="bg-white rounded-xl shadow-sm p-3 md:p-6"
      id="pricing-information-fields"
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
        Pricing Information
      </h2>

      <div className="text-gray-600 mb-6">
        Set your pricing strategy including base rates, discounts for longer
        stays, and special pricing for weekends or custom periods
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Instant Booking */}
        <div className="flex flex-col justify-between">
          <FieldLabel label="Instant Booking" required={true} />
          <p className="text-sm text-gray-500 mb-3">
            Allow guests to book immediately
          </p>
          <Controller
            name="instant_booking"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.instant_booking}>
                <SearchableSelect
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(value === "true")}
                  options={booleanOptions}
                  placeholder="Select option"
                  error={!!errors?.instant_booking}
                  showSearch={false}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Nightly Price */}
        <div className="flex flex-col justify-between">
          <FieldLabel label="Nightly Price" required={true} />
          <p className="text-sm text-gray-500 mb-3">Base price per night</p>
          <Controller
            name="nightly_price"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.nightly_price}>
                <InputNumber
                  {...field}
                  size="large"
                  placeholder="Enter price"
                  status={errors?.nightly_price ? "error" : ""}
                  className="w-full"
                  addonBefore="$"
                  min={1}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Nightly Price (7+ nights) */}
        <div className="flex flex-col justify-between">
          <FieldLabel label="Nightly Price (7+ nights)" optional={true} />
          <p className="text-sm text-gray-500 mb-3">
            Per night discounted rate
          </p>
          <Controller
            name="nightly_price_seven_plus"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.nightly_price_seven_plus}>
                <InputNumber
                  {...field}
                  size="large"
                  placeholder="Enter price"
                  status={errors?.nightly_price_seven_plus ? "error" : ""}
                  className="w-full"
                  addonBefore="$"
                  min={1}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Nightly Price (30+ nights) */}
        <div className="flex flex-col justify-between">
          <FieldLabel label="Nightly Price (30+ nights)" optional={true} />
          <p className="text-sm text-gray-500 mb-3">
            Per night discounted rate
          </p>
          <Controller
            name="nightly_price_thirty_plus"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.nightly_price_thirty_plus}>
                <InputNumber
                  {...field}
                  size="large"
                  placeholder="Enter price"
                  status={errors?.nightly_price_thirty_plus ? "error" : ""}
                  className="w-full"
                  addonBefore="$"
                  min={1}
                />
              </FormFieldWrapper>
            )}
          />
        </div>
      </div>

      {/* Weekend Pricing - Always show both fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Apply Weekend Price */}
        <div className="flex flex-col justify-between">
          <FieldLabel
            label="Apply Weekend Price"
            optional={true}
            conditionalText="Required if Weekend Nightly Price is entered"
          />
          <p className="text-sm text-gray-500 mb-3">
            Set special pricing for weekends
          </p>
          <Controller
            name="apply_weekend_price"
            control={control}
            render={({ field }) => {
              return (
                <FormFieldWrapper error={errors?.apply_weekend_price}>
                  <SearchableSelect
                    value={field.value}
                    onValueChange={(value) => {
                      console.log({ value });
                      field.onChange(value);
                      if (value === "" || !value) {
                        // Clear the weekend_nightly_price when apply_weekend_price is cleared
                        setValue("weekend_nightly_price", null, {
                          shouldValidate: false, // Don't validate immediately
                        });
                        // Clear any existing error on weekend_nightly_price
                        clearErrors("weekend_nightly_price");
                      } else {
                        // Trigger validation on weekend_nightly_price when apply_weekend_price has a value
                        trigger("weekend_nightly_price");
                      }
                    }}
                    options={weekendOptions}
                    placeholder="Select weekend pricing"
                    error={!!errors?.apply_weekend_price}
                    showSearch={false}
                  />
                </FormFieldWrapper>
              );
            }}
          />
        </div>

        {/* Weekend Nightly Price - Always show but disabled until Apply Weekend Price has value */}
        <div className="flex flex-col justify-between">
          <FieldLabel
            label="Weekend Nightly Price"
            optional={true}
            conditionalText="Required if Apply Weekend Price is selected"
          />
          <p className="text-sm text-gray-500 mb-3">
            Special rate for weekend stays
          </p>
          <Controller
            name="weekend_nightly_price"
            control={control}
            render={({ field }) => {
              const isEnabled = !!applyWeekendPrice && applyWeekendPrice !== "";
              return (
                <FormFieldWrapper error={errors?.weekend_nightly_price}>
                  <InputNumber
                    {...field}
                    size="large"
                    placeholder="Enter weekend price"
                    status={errors?.weekend_nightly_price ? "error" : ""}
                    className="w-full"
                    addonBefore="$"
                    min={0}
                    disabled={!isEnabled}
                    onChange={(value) => {
                      field.onChange(value);
                      // Trigger validation on apply_weekend_price when weekend_nightly_price changes
                      trigger("apply_weekend_price");
                    }}
                  />
                </FormFieldWrapper>
              );
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Additional Guest */}
        <div className="flex flex-col justify-between">
          <FieldLabel label="Additional Guest" required={true} />
          <p className="text-sm text-gray-500 mb-3">
            Allow extra guests beyond base capacity
          </p>
          <Controller
            name="additional_guest"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.additional_guest}>
                <SearchableSelect
                  value={field.value?.toString()}
                  onValueChange={(value) => {
                    const boolValue = value === "true";
                    field.onChange(boolValue);

                    // Trigger validation for additional guest-related fields when enabled
                    trigger("no_of_additional_guest");
                    trigger("additional_guest_price");

                    if (boolValue === false) {
                      setValue("additional_guest_price", "");
                      setValue("no_of_additional_guest", "");
                    }
                  }}
                  options={booleanOptions}
                  placeholder="Select option"
                  error={!!errors?.additional_guest}
                  showSearch={false}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Additional Guest Price - Always show but disabled if additional guests not allowed */}
        <div className="flex flex-col justify-between">
          <FieldLabel
            label="Additional Guest Price"
            conditionalText="Required if additional guests allowed"
          />
          <p className="text-sm text-gray-500 mb-3">
            Extra cost per additional guest
          </p>
          <Controller
            name="additional_guest_price"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.additional_guest_price}>
                <InputNumber
                  {...field}
                  size="large"
                  placeholder="Enter price"
                  status={errors?.additional_guest_price ? "error" : ""}
                  className="w-full"
                  addonBefore="$"
                  min={0}
                  disabled={!additionalGuestAllowed}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Number of Additional Guests - Always show but disabled if additional guests not allowed */}
        <div className="flex flex-col justify-between">
          <FieldLabel
            label="Number of Additional Guests"
            conditionalText="Required if additional guests allowed"
          />
          <p className="text-sm text-gray-500 mb-3">
            Maximum number of extra guests allowed
          </p>
          <Controller
            name="no_of_additional_guest"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.no_of_additional_guest}>
                <InputNumber
                  {...field}
                  size="large"
                  placeholder="Enter number"
                  status={errors?.no_of_additional_guest ? "error" : ""}
                  className="w-full"
                  min={1}
                  disabled={!additionalGuestAllowed}
                />
              </FormFieldWrapper>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Pet Allowed */}
        <div className="flex flex-col justify-between">
          <FieldLabel label="Pet Allowed" required={true} />
          <p className="text-sm text-gray-500 mb-3">
            Allow guests to bring pets
          </p>
          <Controller
            name="pet_allowed"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.pet_allowed}>
                <SearchableSelect
                  value={field.value?.toString()}
                  onValueChange={(value) => {
                    const boolValue = value === "true";
                    field.onChange(boolValue);

                    // Sync with rules_pet_allowed field
                    setValue("rules_pet_allowed", boolValue, {
                      shouldValidate: false,
                    });

                    // Trigger validation for pet-related fields when pets are allowed
                    trigger("no_of_pets");
                    trigger("price_per_pet");

                    if (boolValue === false) {
                      setValue("price_per_pet", null);
                      setValue("no_of_pets", null);
                      setValue("pet_rules", null); // Also clear pet_rules when pets not allowed
                    }

                    // Trigger validation on pet_rules field
                    trigger("pet_rules");
                  }}
                  options={booleanOptions}
                  placeholder="Select option"
                  error={!!errors?.pet_allowed}
                  showSearch={false}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Number of Pets - Always show but disabled if pets not allowed */}
        <div className="flex flex-col justify-between">
          <FieldLabel
            label="Number of Pets"
            conditionalText="Required if pets allowed"
          />
          <p className="text-sm text-gray-500 mb-3">
            Maximum number of pets allowed
          </p>
          <Controller
            name="no_of_pets"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.no_of_pets}>
                <InputNumber
                  {...field}
                  size="large"
                  placeholder="Enter number"
                  status={errors?.no_of_pets ? "error" : ""}
                  className="w-full"
                  min={1}
                  disabled={!petsAllowed}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Pet Price - Always show but disabled if pets not allowed */}
        <div className="flex flex-col justify-between">
          <FieldLabel
            label="Pet Price"
            conditionalText="Required if pets allowed"
          />
          <p className="text-sm text-gray-500 mb-3">Additional cost for pets</p>
          <Controller
            name="price_per_pet"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.price_per_pet}>
                <InputNumber
                  {...field}
                  size="large"
                  placeholder="Enter pet price"
                  status={errors?.price_per_pet ? "error" : ""}
                  className="w-full"
                  addonBefore="$"
                  min={0}
                  disabled={!petsAllowed}
                />
              </FormFieldWrapper>
            )}
          />
        </div>
      </div>

      {/* Additional Fees and Taxes */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Additional Fees & Taxes
            </h3>
            <p className="text-sm text-gray-600">
              Set cleaning fees, city fees, and tax rates
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Cleaning Fee with Frequency */}
          <div className="flex flex-col justify-between">
            <FieldLabel label="Cleaning Fee" required={true} />
            <p className="text-sm text-gray-500 mb-3">
              One-time cleaning charge per stay
            </p>
            <Controller
              name="cleaning_fee"
              control={control}
              render={({ field }) => (
                <FormFieldWrapper error={errors?.cleaning_fee}>
                  <InputNumber
                    {...field}
                    size="large"
                    placeholder="Enter cleaning fee"
                    status={errors?.cleaning_fee ? "error" : ""}
                    className="w-full"
                    addonBefore="$"
                    addonAfter={
                      <Controller
                        name="cleaning_freq"
                        control={control}
                        render={({ field: freqField }) => (
                          <div style={{ minWidth: 120 }}>
                            <SearchableSelect
                              value={freqField.value}
                              onValueChange={freqField.onChange}
                              options={frequencyOptions}
                              placeholder="Frequency"
                              error={!!errors?.cleaning_freq}
                              showSearch={false}
                            />
                          </div>
                        )}
                      />
                    }
                    min={0}
                  />
                </FormFieldWrapper>
              )}
            />
          </div>

          {/* City Fee with Frequency */}
          <div className="flex flex-col justify-between">
            <FieldLabel label="City Fee" />
            <p className="text-sm text-gray-500 mb-3">
              Very rare. Please check with your city to see if they have one. In
              New York City, for example, Guests pay an occupancy tax of 5.875%
              along with a flat &apos;hotel unit fee&apos; of $1.50 per unit per
              day. It is this flat fee that we are referring to when we ask if a
              City Fee applies. If there isn&apos;t one, leave this blank.
            </p>
            <Controller
              name="city_fee"
              control={control}
              render={({ field }) => (
                <FormFieldWrapper error={errors?.city_fee}>
                  <InputNumber
                    {...field}
                    size="large"
                    placeholder="Enter city fee"
                    status={errors?.city_fee ? "error" : ""}
                    className="w-full"
                    addonBefore="$"
                    addonAfter={
                      <Controller
                        name="city_fee_freq"
                        control={control}
                        render={({ field: freqField }) => (
                          <div style={{ minWidth: 120 }}>
                            <SearchableSelect
                              value={freqField.value}
                              onValueChange={freqField.onChange}
                              options={frequencyOptions}
                              placeholder="Frequency"
                              error={!!errors?.city_fee_freq}
                              showSearch={false}
                            />
                          </div>
                        )}
                      />
                    }
                    min={0}
                  />
                </FormFieldWrapper>
              )}
            />
          </div>
        </div>

        {/* Tax Percentage */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
          <div className="flex flex-col justify-between">
            <FieldLabel label="Tax Percentage" required={true} />
            <p className="text-sm text-gray-500 mb-3">
              Total of local, state, and lodging tax combined. Required for
              accurate pricing calculations. Enter 0 if no tax applies.
            </p>
            <Controller
              name="tax_percentage"
              control={control}
              render={({ field }) => (
                <FormFieldWrapper error={errors?.tax_percentage}>
                  <InputNumber
                    {...field}
                    size="large"
                    placeholder="Enter tax percentage"
                    status={errors?.tax_percentage ? "error" : ""}
                    className="w-full"
                    addonAfter="%"
                    min={0}
                    max={100}
                  />
                </FormFieldWrapper>
              )}
            />
          </div>
        </div>
      </div>

      {/* Custom Period Pricing */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Custom Period Pricing
            </h3>
            <p className="text-sm text-gray-600">
              Set special rates for peak seasons, holidays, events, or specific
              date ranges. Perfect for maximizing revenue during high-demand
              periods.
            </p>
          </div>
        </div>

        {/* Custom Period Pricing Toggle */}
        <div className="mb-6">
          <div className="flex flex-col justify-between">
            <Controller
              name="custom_period_pricing"
              control={control}
              render={({ field }) => (
                <FormFieldWrapper error={errors?.custom_period_pricing}>
                  <SearchableSelect
                    value={field.value?.toString()}
                    onValueChange={(value) => {
                      const boolValue = value === "true";
                      field.onChange(boolValue);
                      if (boolValue === true) {
                        // If no periods exist, add one default period
                        const currentPeriods = watch("custom_periods");
                        if (!currentPeriods || currentPeriods.length === 0) {
                          append(customPeriodDefaultValues);
                        }
                      } else {
                        // When "No" is selected, clear all periods
                        setValue("custom_periods", []);
                      }
                      trigger("custom_periods");
                    }}
                    options={booleanOptions}
                    placeholder="Select option"
                    error={!!errors?.custom_period_pricing}
                    showSearch={false}
                  />
                </FormFieldWrapper>
              )}
            />
          </div>
        </div>

        {customPeriodPricing &&
          fields.map((field, index, arr) => (
            <div key={field.id} className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-700">
                  Period {index + 1}
                </h4>

                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => remove(index)}
                  className="!bg-red-600 hover:!bg-red-700 !text-white"
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Start Date */}
                <div>
                  <FieldLabel
                    label="Start Date"
                    conditionalText="Required if custom pricing enabled"
                  />
                  <Controller
                    name={`custom_periods.${index}.start_date`}
                    control={control}
                    render={({ field: dateField }) => (
                      <FormFieldWrapper
                        error={customPeriodErrors[index]?.start_date}
                      >
                        <Input
                          {...dateField}
                          type="date"
                          size="large"
                          status={
                            customPeriodErrors[index]?.start_date ? "error" : ""
                          }
                          className="w-full"
                          onChange={(e) => {
                            const newValue = e.target.value;
                            dateField.onChange(newValue);
                            // Trigger validation for end_date to check if it's after start_date
                            trigger(`custom_periods.${index}.end_date`);
                            trigger("custom_periods");
                          }}
                        />
                      </FormFieldWrapper>
                    )}
                  />
                </div>

                {/* End Date */}
                <div>
                  <FieldLabel
                    label="End Date"
                    conditionalText="Required if custom pricing enabled"
                  />
                  <Controller
                    name={`custom_periods.${index}.end_date`}
                    control={control}
                    render={({ field: dateField }) => (
                      <FormFieldWrapper
                        error={customPeriodErrors[index]?.end_date}
                      >
                        <Input
                          {...dateField}
                          type="date"
                          size="large"
                          status={
                            customPeriodErrors[index]?.end_date ? "error" : ""
                          }
                          className="w-full"
                          min={
                            customPeriodsList?.[index]?.start_date || undefined
                          }
                          onChange={(e) => {
                            dateField.onChange(e.target.value);
                            // Trigger validation for all custom_periods when any field changes
                            trigger("custom_periods");
                          }}
                        />
                      </FormFieldWrapper>
                    )}
                  />
                </div>

                {/* Nightly Price */}
                <div>
                  <FieldLabel
                    label="Nightly Price"
                    conditionalText="Required if custom pricing enabled"
                  />
                  <Controller
                    name={`custom_periods.${index}.nightly_price`}
                    control={control}
                    render={({ field: priceField }) => (
                      <FormFieldWrapper
                        error={customPeriodErrors[index]?.nightly_price}
                      >
                        <InputNumber
                          {...priceField}
                          size="large"
                          placeholder="Enter price"
                          status={
                            customPeriodErrors[index]?.nightly_price
                              ? "error"
                              : ""
                          }
                          className="w-full"
                          addonBefore="$"
                          min={0}
                          onChange={(value) => {
                            priceField.onChange(value);
                            // Trigger validation for all custom_periods when any field changes
                            trigger("custom_periods");
                          }}
                        />
                      </FormFieldWrapper>
                    )}
                  />
                </div>

                {/* Additional Guest Price */}
                <div>
                  <FieldLabel
                    label="Additional Guest Price"
                    conditionalText="Required if custom pricing enabled"
                  />
                  <Controller
                    name={`custom_periods.${index}.price_add_guest`}
                    control={control}
                    render={({ field: guestPriceField }) => (
                      <FormFieldWrapper
                        error={customPeriodErrors[index]?.price_add_guest}
                      >
                        <InputNumber
                          {...guestPriceField}
                          size="large"
                          placeholder="Enter price"
                          status={
                            customPeriodErrors[index]?.price_add_guest
                              ? "error"
                              : ""
                          }
                          className="w-full"
                          addonBefore="$"
                          min={0}
                          onChange={(value) => {
                            guestPriceField.onChange(value);
                            // Trigger validation for all custom_periods when any field changes
                            trigger("custom_periods");
                          }}
                        />
                      </FormFieldWrapper>
                    )}
                  />
                </div>
              </div>
            </div>
          ))}

        {customPeriodPricing && (
          <div className="flex flex-col gap-1 ">
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => append(customPeriodDefaultValues)}
              className="flex items-center w-full h-10"
            >
              Add Custom Period
            </Button>
            <span className="text-red-500">
              {(errors.custom_periods as any)?.message}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(PricingInformationFields);
