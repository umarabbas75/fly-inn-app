"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input } from "antd";
import {
  ArrowLeftOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";
import FormFieldWrapper from "@/components/shared/FormFieldWrapper";

const schema = yup.object().shape({
  heading: yup.string().required("Feature name is required"),
  sub_heading: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Sub feature name is required"),
      })
    )
    .required("Sub-features are required")
    .min(1, "At least one sub-feature is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function AddFeaturePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      heading: "",
      sub_heading: [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sub_heading",
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/admin/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create feature");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
      toast.success("Feature created successfully!");
      router.push("/admin-dashboard/features");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create feature");
    },
  });

  const onSubmit = (data: FormData) => {
    console.log({ data });
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          type="default"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          size="large"
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Add Feature</h1>
          <p className="text-sm text-gray-600 mt-1">
            Create a new feature with subcategories
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-3 md:p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Feature Details
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Feature Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Feature Title <span className="text-red-500">*</span>
            </label>
            <Controller
              name="heading"
              control={control}
              render={({ field }) => (
                <FormFieldWrapper error={errors.heading}>
                  <Input
                    {...field}
                    size="large"
                    placeholder="e.g., Amenities, Room Features"
                    status={errors.heading ? "error" : ""}
                  />
                </FormFieldWrapper>
              )}
            />
          </div>

          {/* Sub-features */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Sub-features <span className="text-red-500">*</span>
            </label>

            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <div className="flex-1">
                  <Controller
                    name={`sub_heading.${index}.name`}
                    control={control}
                    render={({ field }) => (
                      <FormFieldWrapper
                        error={errors.sub_heading?.[index]?.name}
                      >
                        <Input
                          {...field}
                          size="large"
                          placeholder={`Sub-feature ${index + 1}`}
                          status={
                            errors.sub_heading?.[index]?.name ? "error" : ""
                          }
                        />
                      </FormFieldWrapper>
                    )}
                  />
                </div>
                {fields.length > 1 && (
                  <Button
                    type="default"
                    danger
                    size="large"
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(index)}
                  />
                )}
              </div>
            ))}

            <Button
              type="dashed"
              size="large"
              icon={<PlusCircleOutlined />}
              onClick={() => append({ name: "" })}
              className="w-full"
            >
              Add Sub-feature
            </Button>
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-0 bg-white shadow-lg border-t border-gray-200 py-4 px-6 z-10 rounded-lg -mx-6 -mb-6">
            <div className="flex justify-end gap-4">
              <Button type="default" size="large" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={createMutation.isPending}
              >
                Create Feature
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
