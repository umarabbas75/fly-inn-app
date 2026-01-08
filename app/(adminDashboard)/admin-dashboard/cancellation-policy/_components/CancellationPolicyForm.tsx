"use client";

import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "antd";
import FormFieldWrapper from "@/components/shared/FormFieldWrapper";
import {
  SearchableSelect,
  SearchableSelectOption,
} from "@/components/ui/searchable-select";

const { TextArea } = Input;

const cancellationTypes: SearchableSelectOption[] = [
  { label: "Short term cancellation", value: "short" },
  { label: "Long term cancellation", value: "long" },
];

interface CancellationPolicyFormProps {
  initialData?: {
    type: string;
    group_name: string;
    before_check_in: string;
    after_check_in: string;
  };
}

export function CancellationPolicyForm({
  initialData,
}: CancellationPolicyFormProps) {
  const {
    control,
    reset,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-3 md:p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Cancellation Policy Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Type <span className="text-red-500">*</span>
          </label>
          <Controller
            name="type"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <FormFieldWrapper error={errors.type}>
                <SearchableSelect
                  {...field}
                  value={value || undefined}
                  onValueChange={(val) => {
                    onChange(
                      typeof val === "string"
                        ? val
                        : Array.isArray(val)
                        ? val[0]
                        : undefined
                    );
                  }}
                  options={cancellationTypes}
                  placeholder="Select type"
                  error={!!errors.type}
                  showSearch={false}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Title/Group Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <Controller
            name="group_name"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.group_name}>
                <Input
                  {...field}
                  size="large"
                  placeholder="e.g., Flexible Cancellation"
                  status={errors.group_name ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* Before Check In */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Before Check In <span className="text-red-500">*</span>
          </label>
          <Controller
            name="before_check_in"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.before_check_in}>
                <TextArea
                  {...field}
                  size="large"
                  rows={3}
                  placeholder="e.g., Free cancellation up to 48 hours before check-in..."
                  status={errors.before_check_in ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* After Check In */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            After Check In <span className="text-red-500">*</span>
          </label>
          <Controller
            name="after_check_in"
            control={control}
            render={({ field }) => (
              <FormFieldWrapper error={errors.after_check_in}>
                <TextArea
                  {...field}
                  size="large"
                  rows={3}
                  placeholder="e.g., No refund available after check-in..."
                  status={errors.after_check_in ? "error" : ""}
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          />
        </div>
      </div>
    </div>
  );
}
