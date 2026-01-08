import React, { useRef, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input, Form } from "antd";
import { LoadingOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { languageOptions } from "@/constants/profile";
import FormFieldWrapper from "@/components/shared/FormFieldWrapper";
import { useProfileContext } from "./profile-context";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const { TextArea } = Input;

const PersonalInfo = () => {
  const {
    control,
    setValue,
    getValues,
    watch,
    setError,
    clearErrors,
    trigger,
    formState: { errors },
  } = useFormContext();

  const { isCheckingEmail, setIsCheckingEmail, userData } = useProfileContext();
  console.log("test");
  // Display Name Guidelines content for Popover
  const displayNameGuidelines = (
    <>
      <h4 className="text-xs font-semibold text-gray-900 mb-2">
        Display Name Guidelines
      </h4>
      <ul className="text-xs text-gray-700 space-y-1.5">
        <li className="flex items-start">
          <span className="mr-1.5">•</span>
          <span>Display names can only be assigned to one person</span>
        </li>
        <li className="flex items-start">
          <span className="mr-1.5">•</span>
          <span>Your display name cannot contain any part of your email</span>
        </li>
        <li className="flex items-start">
          <span className="mr-1.5">•</span>
          <span>Your display name cannot contain tail numbers or websites</span>
        </li>
        <li className="flex items-start">
          <span className="mr-1.5">•</span>
          <span className="font-medium">
            We take privacy very seriously and will change display names that
            contain identifying information
          </span>
        </li>
        <li className="flex items-start mt-2 pt-2 border-t border-gray-200">
          <span className="mr-1.5">•</span>
          <span className="font-medium">
            We reserve the right to change the Display Name if it violates our
            rules.
          </span>
        </li>
      </ul>
    </>
  );

  // Check email availability on blur
  const handleEmailBlur = async (email: string) => {
    // Clear any previous email-exists errors first
    clearErrors("additional_email");

    // Skip if empty (optional field)
    if (!email || !email.trim()) {
      setIsCheckingEmail(false);
      return;
    }

    // Skip if email format is invalid (let yup validation handle it)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setIsCheckingEmail(false);
      return;
    }

    setIsCheckingEmail(true);

    try {
      const response = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login: email }),
      });

      const data = await response.json();

      // Check API response: { status: true, exists: true/false }
      if (response.ok && data.status && data.exists === true) {
        setError("additional_email", {
          type: "manual",
          message: userData?.additional_email
            ? "The entered email was already registered. so it reverted to the previous record."
            : "The entered email is already registered.",
        });
        setValue("additional_email", userData?.additional_email, {
          shouldValidate: false,
        });
      }
    } catch (error) {
      // Silently fail - don't block user
      console.error("Email check error:", error);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm p-3 sm:p-5 md:p-6"
      id="personal-information"
    >
      <h2 className="flex items-center text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-2 flex-shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
        <span className="break-words">Personal Information</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 md:gap-6">
        {/* First Name */}
        <div className="flex flex-col justify-between">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-3">
            Your legal first name as it appears on official documents
          </p>
          <Controller
            name="first_name"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.first_name}>
                <Input
                  {...field}
                  size="large"
                  placeholder="John"
                  status={errors.first_name ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Middle Name */}
        <div className="flex flex-col justify-between">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Middle Name{" "}
            <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-3">
            Your legal middle name as it appears on official documents
          </p>
          <Controller
            name="middle_name"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.middle_name}>
                <Input
                  {...field}
                  size="large"
                  placeholder="Doe"
                  status={errors.middle_name ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Last name */}
        <div className="flex flex-col justify-between">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-3">
            Your legal last name/surname as it appears on official documents
          </p>
          <Controller
            name="last_name"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.last_name}>
                <Input
                  {...field}
                  size="large"
                  placeholder="Doe"
                  status={errors.last_name ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Display Name */}
        <div className="flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Display Name <span className="text-red-500">*</span>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-full"
                  aria-label="Display name guidelines"
                >
                  <QuestionCircleOutlined className="text-blue-600 cursor-pointer hover:text-blue-700 transition-colors text-sm sm:text-base" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 max-w-xs p-4 bg-white border border-gray-200 shadow-lg"
                align="start"
                side="top"
                sideOffset={8}
              >
                {displayNameGuidelines}
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-3">
            Cannot contain identifying information such as your name, nickname,
            business name, address, or anything that would help identify you.
          </p>

          <Controller
            name="display_name"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.display_name}>
                <Input
                  {...field}
                  size="large"
                  placeholder="Enter display name"
                  status={errors.display_name ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Native Language */}
        <div className="flex flex-col justify-between">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Native Languages <span className="text-red-500">*</span>
          </label>
          <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-3">
            Select your primary language(s) for communication
          </p>
          <Controller
            name="native_language"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.native_language}>
                <SearchableSelect
                  value={field.value || []}
                  onValueChange={(value) => {
                    field.onChange(value);
                    trigger("other_language");
                  }}
                  options={languageOptions}
                  placeholder="Select your native language(s)"
                  searchPlaceholder="Search language..."
                  emptyMessage="No language found."
                  error={!!errors.native_language}
                  showSearch={true}
                  multiple={true}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Other Languages */}
        <div className="flex flex-col justify-between">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Other Languages{" "}
            <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-3">
            Select any other language(s) you're comfortable communicating in
          </p>
          <Controller
            name="other_language"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.other_language}>
                <SearchableSelect
                  value={field.value || []}
                  onValueChange={(value) => {
                    field.onChange(value);
                    trigger("native_language");
                  }}
                  options={languageOptions}
                  placeholder="Select languages you speak"
                  searchPlaceholder="Search language..."
                  emptyMessage="No language found."
                  error={!!errors.other_language}
                  showSearch={true}
                  multiple={true}
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
            First, click the flag icon to select your country. This will
            automatically insert your country code. Then enter your phone
            number, starting with the appropriate regional or local code for
            your number.
          </p>
          <Controller
            name="phone"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormFieldWrapper error={errors.phone}>
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
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-2 sm:px-3 py-2 w-full text-sm sm:text-base`}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Additional Phone */}
        <div className="flex flex-col justify-between">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Additional Phone{" "}
            <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-3">
            First, click the flag icon to select your country. This will
            automatically insert your country code. Then enter your phone
            number, starting with the appropriate regional or local code for
            your number.
          </p>
          <Controller
            name="other_phone"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormFieldWrapper error={errors.other_phone}>
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
                    errors.other_phone ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-2 sm:px-3 py-2 w-full text-sm sm:text-base`}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Email Address */}
        <div className="flex flex-col justify-between">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <p className="text-xs sm:text-sm text-gray-500 mb-1">
            Primary email for account notifications.
          </p>
          <p className="text-xs text-gray-500 mb-1.5 sm:mb-2">
            Need to change it? Contact{" "}
            <a
              href="mailto:support@fly-inn.com"
              className="text-[#AF2322] hover:underline"
            >
              support@fly-inn.com
            </a>{" "}
            or visit our{" "}
            <a
              href="/public/contact"
              className="text-[#AF2322] hover:underline"
            >
              Contact Page
            </a>
            .
          </p>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.email}>
                <Input
                  {...field}
                  type="email"
                  disabled={true}
                  size="large"
                  value={getValues("email")}
                  placeholder="john@example.com"
                  status={errors.email ? "error" : ""}
                  className="w-full bg-gray-50 cursor-not-allowed"
                  readOnly
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Additional Email */}
        <div className="flex flex-col justify-between">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Additional Email{" "}
            <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-3">
            Backup email address
          </p>
          <Controller
            name="additional_email"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.additional_email}>
                <Input
                  {...field}
                  type="email"
                  size="large"
                  placeholder="backup@example.com"
                  status={errors.additional_email ? "error" : ""}
                  className="w-full"
                  suffix={
                    isCheckingEmail ? (
                      <LoadingOutlined className="text-gray-400" spin />
                    ) : undefined
                  }
                  onBlur={(e) => {
                    field.onBlur();
                    handleEmailBlur(e.target.value);
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    // Clear the manual error when user starts typing
                    if (errors.additional_email?.type === "manual") {
                      clearErrors("additional_email");
                    }
                  }}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Bio */}
        <div className="col-span-1 md:col-span-2 flex flex-col">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Bio <span className="text-red-500">*</span>
          </label>
          <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-3">
            Tell others about yourself, your aviation interests, and
            experiences. Please omit any identifying info, contact info,
            websites, etc.
          </p>
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.bio}>
                <TextArea
                  {...field}
                  rows={4}
                  placeholder="Share your story..."
                  status={errors.bio ? "error" : ""}
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

export default PersonalInfo;
