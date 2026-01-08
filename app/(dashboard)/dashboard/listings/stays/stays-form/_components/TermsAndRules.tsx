/* eslint-disable react/jsx-props-no-spreading */
import React, { memo, ReactNode, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input, InputNumber, Slider, Button, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { rules, timesOptions, welcomeMessageList } from "@/constants/stays";
import { useApiGet } from "@/http-service";
import ReactQuillEditor from "@/components/shared/ReactQuillEditor";
import FormFieldWrapper from "@/components/shared/FormFieldWrapper";
import { FieldLabel } from "@/components/shared/FieldLabel";
import { SearchableSelect } from "@/components/ui/searchable-select";

const { TextArea } = Input;

// Options for boolean fields
const booleanOptions = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

// Type definitions
interface CancellationPolicy {
  id: string | number;
  type: string;
  group_name: string;
  before_check_in: string;
}

interface RuleOption {
  id: string | number;
  value: string;
  label: string;
}

interface WelcomeMessageOption {
  key: string;
  value: string;
  label: string;
}

const TermsAndRules: React.FC = () => {
  const {
    control,
    watch,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useFormContext(); // Access form context

  const { data: cancellationPolicyList } = useApiGet({
    endpoint: `/api/admin/cancellation-policy`,
    queryKey: ["cancellation-policy"],
    config: {
      select: (data: any) => {
        return data?.data || data || [];
      },
    },
  });

  // Filter policies by type
  const shortPolicies =
    cancellationPolicyList?.filter(
      (policy: CancellationPolicy) => policy.type === "short"
    ) || [];

  const longPolicies =
    cancellationPolicyList?.filter(
      (policy: CancellationPolicy) => policy.type === "long"
    ) || [];

  const smokingAllowed = watch("smoking_allowed");
  const rulesPetAllowed = watch("rules_pet_allowed");
  const partyAllowed = watch("party_allowed");
  const childrenAllowed = watch("children_allowed");

  // Transform cancellation policies into SearchableSelect options
  const shortPolicyOptions = useMemo(() => {
    if (!shortPolicies?.length) return [];
    return shortPolicies.map((policy: CancellationPolicy) => ({
      value: policy.id.toString(),
      label: `${policy.group_name}: ${policy.before_check_in}`,
    }));
  }, [shortPolicies]);

  const longPolicyOptions = useMemo(() => {
    if (!longPolicies?.length) return [];
    return longPolicies.map((policy: CancellationPolicy) => ({
      value: policy.id.toString(),
      label: `${policy.group_name}: ${policy.before_check_in}`,
    }));
  }, [longPolicies]);

  // Transform time options
  const timeOptions = useMemo(
    () => timesOptions.map((time) => ({ value: time, label: time })),
    []
  );

  // Transform rule options
  const ruleOptions = useMemo(
    () =>
      rules.map((rule: RuleOption) => ({
        value: rule.value,
        label: rule.label,
      })),
    []
  );

  // Transform welcome message options
  const welcomeOptions = useMemo(
    () =>
      welcomeMessageList.map((msg: WelcomeMessageOption) => ({
        value: msg.value,
        label: msg.label,
      })),
    []
  );

  return (
    <div
      className="bg-white rounded-xl shadow-sm p-3 md:p-6"
      id="terms-and-rules"
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
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        Terms & Rules
      </h2>

      <div className="text-gray-600 mb-6">
        Set your property's terms, rules, and policies for guests
      </div>

      {/* Cancellation Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-4">
        <div className="flex flex-col justify-between">
          <FieldLabel label="Short Cancellation Policy" required={true} />
          <p className="text-sm text-gray-500 mb-3">
            Brief cancellation terms for guests
          </p>
          <Controller
            name="cancellation_policy_short"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.cancellation_policy_short}>
                <SearchableSelect
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
                  options={shortPolicyOptions}
                  placeholder={
                    shortPolicyOptions.length > 0
                      ? "Select short-term cancellation policy"
                      : "No short-term cancellation policy found"
                  }
                  error={!!errors.cancellation_policy_short}
                  showSearch={false}
                  disabled={shortPolicyOptions.length === 0}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        <div className="flex flex-col justify-between">
          <FieldLabel
            label="Long Cancellation Policy"
            conditionalText="Required if max booking days is 28 or more"
          />
          <p className="text-sm text-gray-500 mb-3">
            Detailed cancellation terms for guests
          </p>
          <Controller
            name="cancellation_policy_long"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.cancellation_policy_long}>
                <SearchableSelect
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
                  options={longPolicyOptions}
                  placeholder={
                    longPolicyOptions.length > 0
                      ? "Select long-term cancellation policy"
                      : "No long-term cancellation policy found"
                  }
                  error={!!errors.cancellation_policy_long}
                  showSearch={false}
                  disabled={longPolicyOptions.length === 0}
                />
              </FormFieldWrapper>
            )}
          />
        </div>
      </div>

      {/* Booking and Check-in/out Times */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-3 mb-6">
        <div className="flex flex-col justify-between">
          <FieldLabel label="Minimum Days of Booking" required={true} />
          <p className="text-sm text-gray-500 mb-3">Minimum stay requirement</p>
          <Controller
            name="min_day_booking"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.min_day_booking}>
                <InputNumber
                  {...field}
                  size="large"
                  placeholder="e.g. 1"
                  min={1}
                  status={errors?.min_day_booking ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        <div className="flex flex-col justify-between">
          <FieldLabel label="Maximum Days of Booking" required={true} />
          <p className="text-sm text-gray-500 mb-3">Maximum stay limit</p>
          <Controller
            name="max_day_booking"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.max_day_booking}>
                <InputNumber
                  {...field}
                  size="large"
                  placeholder="e.g. 30"
                  min={1}
                  max={365}
                  status={errors?.max_day_booking ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        <div className="flex flex-col justify-between">
          <FieldLabel label="Check In After" required={true} />
          <p className="text-sm text-gray-500 mb-3">Earliest check-in time</p>
          <Controller
            name="check_in_after"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.check_in_after}>
                <SearchableSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={timeOptions}
                  placeholder="Select a time"
                  error={!!errors.check_in_after}
                  showSearch={false}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        <div className="flex flex-col justify-between">
          <FieldLabel label="Check Out Before" required={true} />
          <p className="text-sm text-gray-500 mb-3">Latest check-out time</p>
          <Controller
            name="check_out_before"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.check_out_before}>
                <SearchableSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={timeOptions}
                  placeholder="Select a time"
                  error={!!errors.check_out_before}
                  showSearch={false}
                />
              </FormFieldWrapper>
            )}
          />
        </div>
      </div>

      {/* Smoking Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-4">
        <div className="flex flex-col justify-between">
          <FieldLabel label="Smoking Allowed" required={true} />
          <p className="text-sm text-gray-500 mb-3">
            Whether smoking is permitted
          </p>
          <Controller
            name="smoking_allowed"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.smoking_allowed}>
                <SearchableSelect
                  value={field.value?.toString()}
                  onValueChange={(value) => {
                    const boolValue = value === "true";
                    field.onChange(boolValue);
                    if (boolValue === false) {
                      setValue("smoking_rules", "");
                    }
                    trigger("smoking_rules");
                  }}
                  options={booleanOptions}
                  placeholder="Select option"
                  error={!!errors?.smoking_allowed}
                  showSearch={false}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Smoking Rules - Always show but disabled if smoking not allowed */}
        <div className="flex flex-col justify-between">
          <div>
            <FieldLabel
              label="Smoking Rules"
              conditionalText="Required if smoking is allowed"
            />
            <p className="text-sm text-gray-500 mb-3">
              Specific smoking guidelines
            </p>
            <Controller
              name="smoking_rules"
              control={control}
              render={({ field }) => (
                <FormFieldWrapper error={errors?.smoking_rules}>
                  <Input
                    {...field}
                    size="large"
                    placeholder="Write your condition here"
                    status={errors?.smoking_rules ? "error" : ""}
                    className="w-full"
                    disabled={smokingAllowed !== true}
                  />
                </FormFieldWrapper>
              )}
            />
          </div>
        </div>
      </div>

      {/* Pet Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-4">
        <div className="flex flex-col justify-between">
          <FieldLabel label="Pet Allowed" required={true} />
          <p className="text-sm text-gray-500 mb-3">
            Whether pets are permitted
          </p>
          <Controller
            name="rules_pet_allowed"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.rules_pet_allowed}>
                <SearchableSelect
                  value={field.value?.toString()}
                  onValueChange={(value) => {
                    const boolValue = value === "true";
                    field.onChange(boolValue);

                    // Sync with pet_allowed field in pricing section
                    setValue("pet_allowed", boolValue, {
                      shouldValidate: false,
                    });

                    if (boolValue === false) {
                      setValue("pet_rules", null);
                      // Also clear pricing pet fields when pets not allowed
                      setValue("price_per_pet", null);
                      setValue("no_of_pets", null);
                    }

                    // Trigger validation for all pet-related fields
                    trigger("pet_rules");
                    trigger("no_of_pets");
                    trigger("price_per_pet");
                  }}
                  options={booleanOptions}
                  placeholder="Select option"
                  error={!!errors?.rules_pet_allowed}
                  showSearch={false}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Pet Rules - Always show but disabled if pets not allowed */}
        <div className="flex flex-col justify-between">
          <div>
            <FieldLabel
              label="Pet Rules"
              conditionalText="Required if pets are allowed"
            />
            <p className="text-sm text-gray-500 mb-3">
              Specific pet guidelines
            </p>
            <Controller
              name="pet_rules"
              control={control}
              render={({ field }) => (
                <FormFieldWrapper error={errors?.pet_rules}>
                  <Input
                    {...field}
                    size="large"
                    placeholder="Write your condition here"
                    status={errors?.pet_rules ? "error" : ""}
                    className="w-full"
                    disabled={rulesPetAllowed !== true}
                  />
                </FormFieldWrapper>
              )}
            />
          </div>
        </div>
      </div>

      {/* Party Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-4">
        <div className="flex flex-col justify-between">
          <FieldLabel label="Parties Allowed" required={true} />
          <p className="text-sm text-gray-500 mb-3">
            Whether parties are permitted
          </p>
          <Controller
            name="party_allowed"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.party_allowed}>
                <SearchableSelect
                  value={field.value?.toString()}
                  onValueChange={(value) => {
                    const boolValue = value === "true";
                    field.onChange(boolValue);
                    if (boolValue === false) {
                      setValue("party_rules", "");
                    }
                    trigger("party_rules");
                  }}
                  options={booleanOptions}
                  placeholder="Select option"
                  error={!!errors?.party_allowed}
                  showSearch={false}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Party Rules - Always show but disabled if parties not allowed */}
        <div className="flex flex-col justify-between">
          <div>
            <FieldLabel
              label="Party Rules"
              conditionalText="Required if parties are allowed"
            />
            <p className="text-sm text-gray-500 mb-3">
              Specific party guidelines
            </p>
            <Controller
              name="party_rules"
              control={control}
              render={({ field }) => (
                <FormFieldWrapper error={errors?.party_rules}>
                  <Input
                    {...field}
                    size="large"
                    placeholder="Write your condition here"
                    status={errors?.party_rules ? "error" : ""}
                    className="w-full"
                    disabled={partyAllowed !== true}
                  />
                </FormFieldWrapper>
              )}
            />
          </div>
        </div>
      </div>

      {/* Children Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-4">
        <div className="flex flex-col justify-between">
          <FieldLabel label="Children Allowed" required={true} />
          <p className="text-sm text-gray-500 mb-3">
            Whether children are permitted
          </p>
          <Controller
            name="children_allowed"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors?.children_allowed}>
                <SearchableSelect
                  value={field.value?.toString()}
                  onValueChange={(value) => {
                    const boolValue = value === "true";
                    field.onChange(boolValue);
                    if (boolValue === false) {
                      setValue("children_rules", "");
                    }
                    trigger("children_rules");
                  }}
                  options={booleanOptions}
                  placeholder="Select option"
                  error={!!errors?.children_allowed}
                  showSearch={false}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Children Rules - Always show but disabled if children not allowed */}
        <div className="flex flex-col justify-between">
          <div>
            <FieldLabel
              label="Children Rules"
              conditionalText="Required if children are allowed"
            />
            <p className="text-sm text-gray-500 mb-3">
              Specific children guidelines
            </p>
            <Controller
              name="children_rules"
              control={control}
              render={({ field }) => (
                <FormFieldWrapper error={errors?.children_rules}>
                  <Input
                    {...field}
                    size="large"
                    placeholder="Write your condition here"
                    status={errors?.children_rules ? "error" : ""}
                    className="w-full"
                    disabled={childrenAllowed !== true}
                  />
                </FormFieldWrapper>
              )}
            />
          </div>
        </div>
      </div>

      {/* Age Ranges for Children */}
      {childrenAllowed === true && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-4">
          <div className="flex flex-col justify-between">
            <FieldLabel label="Children Ages (Months)" required={true} />
            <p className="text-sm text-gray-500 mb-3">
              Age range for children: {watch("children_ages")?.[0] || 0} -{" "}
              {watch("children_ages")?.[1] || 24} months
            </p>
            <Controller
              name="children_ages"
              control={control}
              render={({ field }) => (
                <FormFieldWrapper error={errors?.children_ages}>
                  <Slider
                    {...field}
                    range
                    min={0}
                    max={24}
                    marks={{
                      0: "0m",
                      6: "6m",
                      12: "12m",
                      18: "18m",
                      24: "24m",
                    }}
                    tooltip={{
                      formatter: (value: ReactNode) => `${value} months`,
                    }}
                  />
                </FormFieldWrapper>
              )}
            />
          </div>

          <div className="flex flex-col justify-between">
            <FieldLabel label="Infant Ages (Years)" required={true} />
            <p className="text-sm text-gray-500 mb-3">
              Age range for infants: {watch("infant_ages")?.[0] || 0} -{" "}
              {watch("infant_ages")?.[1] || 17} years
            </p>
            <Controller
              name="infant_ages"
              control={control}
              render={({ field }) => (
                <FormFieldWrapper error={errors?.infant_ages}>
                  <Slider
                    {...field}
                    range
                    min={2}
                    max={17}
                    marks={{
                      2: "2y",
                      5: "5y",
                      10: "10y",
                      15: "15y",
                      17: "17y",
                    }}
                    tooltip={{
                      formatter: (value: ReactNode) => `${value} years`,
                    }}
                  />
                </FormFieldWrapper>
              )}
            />
          </div>
        </div>
      )}

      {/* House Rules */}
      <div className="mb-6">
        <FieldLabel label="House Rules (List Below)" required={true} />
        <p className="text-sm text-gray-500 mb-3">
          Select multiple rules to add to your listing
        </p>
        <Controller
          name="rules_instructions"
          control={control}
          render={({ field }) => (
            <FormFieldWrapper error={errors.rules_instructions}>
              <SearchableSelect
                value={field.value}
                onValueChange={(currentValue) => {
                  const value = Array.isArray(currentValue)
                    ? currentValue[0]
                    : currentValue;
                  field.onChange(value);

                  const prevRulesMessage = getValues("rules") || "";
                  if (value && !prevRulesMessage.includes(value)) {
                    const newChange = prevRulesMessage
                      ? `${prevRulesMessage}\n${value}`
                      : value;
                    setValue("rules", newChange, { shouldValidate: true });
                  }
                }}
                options={ruleOptions}
                placeholder="Select a rule to add"
                error={!!errors.rules_instructions}
                showSearch={false}
              />
            </FormFieldWrapper>
          )}
        />
      </div>

      <div className="mb-6">
        <FieldLabel label="Edit House Rules" required={true} />
        <p className="text-sm text-gray-500 mb-3">
          Customize your house rules for guests
        </p>
        <Controller
          name="rules"
          control={control}
          render={({ field }) => (
            <FormFieldWrapper error={errors?.rules}>
              <div
                className={`${
                  errors?.rules?.message ? "border-red-500" : "border-gray-300"
                } rounded-md border`}
                id="rules"
              >
                <ReactQuillEditor
                  name="rules"
                  placeholder=""
                  rows={6}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </div>
            </FormFieldWrapper>
          )}
        />
      </div>

      {/* Welcome Message */}
      <div className="mb-6">
        <FieldLabel label="Welcome Information (List Below)" required={true} />
        <p className="text-sm text-gray-500 mb-3">
          Select multiple welcome messages to add
        </p>
        <Controller
          name="welcome_message_instructions"
          control={control}
          render={({ field }) => (
            <FormFieldWrapper error={errors.welcome_message_instructions}>
              <SearchableSelect
                value={field.value}
                onValueChange={(currentValue) => {
                  const value = Array.isArray(currentValue)
                    ? currentValue[0]
                    : currentValue;
                  field.onChange(value);

                  const prevWelcomeMessage = getValues("welcome_message") || "";
                  if (value && !prevWelcomeMessage.includes(value)) {
                    const newChange = prevWelcomeMessage
                      ? `${prevWelcomeMessage}\n${value}`
                      : value;
                    setValue("welcome_message", newChange, {
                      shouldValidate: true,
                    });
                  }
                }}
                options={welcomeOptions}
                placeholder="Select a welcome message to add"
                error={!!errors.welcome_message_instructions}
                showSearch={false}
              />
            </FormFieldWrapper>
          )}
        />
      </div>

      <div className="mb-6">
        <FieldLabel label="Edit Welcome Message" required={true} />
        <p className="text-sm text-gray-500 mb-3">
          Customize your welcome message for guests
        </p>
        <Controller
          name="welcome_message"
          control={control}
          render={({ field }) => (
            <FormFieldWrapper error={errors?.welcome_message}>
              <div
                className={`${
                  errors?.welcome_message?.message
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md border`}
                id="welcome_message"
              >
                <ReactQuillEditor
                  name="welcome_message"
                  placeholder=""
                  rows={6}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </div>
            </FormFieldWrapper>
          )}
        />
      </div>
    </div>
  );
};

export default memo(TermsAndRules);
