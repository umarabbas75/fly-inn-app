import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "antd";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import FormFieldWrapper from "@/components/shared/FormFieldWrapper";

const EmergencyContact = () => {
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  return (
    <div
      className="bg-white rounded-xl shadow-sm p-3 sm:p-5 md:p-6"
      id="emergency-contact"
    >
      <h2 className="flex items-center text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
        Emergency Contact
      </h2>

      <div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-6">
        Provide contact information for someone we can reach in case of
        emergency
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 md:gap-6">
        {/* Contact Name */}
        <div className="flex flex-col justify-between">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Contact Name <span className="text-red-500">*</span>
          </label>
          <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-3">
            Full name of your emergency contact
          </p>
          <Controller
            name="contact_name"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.contact_name}>
                <Input
                  {...field}
                  size="large"
                  placeholder="Jane Smith"
                  status={errors.contact_name ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Relationship */}
        <div className="flex flex-col justify-between">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Relationship <span className="text-red-500">*</span>
          </label>
          <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-3">
            How this person is related to you (cannot be yourself)
          </p>
          <Controller
            name="contact_relationship"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.contact_relationship}>
                <Input
                  {...field}
                  size="large"
                  placeholder="Spouse"
                  status={errors.contact_relationship ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col justify-between">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <Controller
            name="contact_email"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.contact_email}>
                <Input
                  {...field}
                  type="email"
                  size="large"
                  placeholder="jane@example.com"
                  status={errors.contact_email ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col justify-between">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-3">
            First, click the flag icon to select your country. This will automatically insert your country code. Then enter your phone number, starting with the appropriate regional or local code for your number.
          </p>
          <Controller
            name="contact_phone"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormFieldWrapper error={errors.contact_phone}>
                <PhoneInput
                  placeholder="Enter phone number"
                  defaultCountry="US"
                  value={value || undefined}
                  international={true}
                  countryCallingCodeEditable={false}
                  withCountryCallingCode={true}
                  onChange={(value) => {
                    // Allow clearing the field - pass undefined if empty
                    onChange(value || null);
                  }}
                  className={`border ${
                    errors.contact_phone ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 w-full`}
                />
              </FormFieldWrapper>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default EmergencyContact;
