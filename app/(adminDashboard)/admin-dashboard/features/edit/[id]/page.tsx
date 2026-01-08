"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Modal, Skeleton, Alert } from "antd";
import {
  ArrowLeftOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  ExclamationCircleOutlined,
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
        id: yup.number().optional(),
        featureId: yup.number().optional(),
      })
    )
    .required("Sub-features are required")
    .min(1, "At least one sub-feature is required"),
  delete_sub_heading: yup.array().of(yup.number()).default([]),
});

type FormData = yup.InferType<typeof schema>;

export default function EditFeaturePage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [pendingData, setPendingData] = useState<FormData | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      heading: "",
      sub_heading: [{ name: "" }],
      delete_sub_heading: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sub_heading",
  });

  const deleteSubHeading = watch("delete_sub_heading") || [];

  // Get feature
  const { data: feature, isPending } = useQuery({
    queryKey: ["feature", id],
    queryFn: async () => {
      const response = await fetch(`/api/admin/features/${id}`);
      if (!response.ok) throw new Error("Failed to fetch feature");
      const data = await response.json();
      return data;
    },
    enabled: !!id,
  });

  // Reset form when feature loads
  useEffect(() => {
    if (feature) {
      const subFeatures =
        feature.sub_heading?.map((item: any) => ({
          name: item.name,
          featureId: item.id,
        })) || [];

      reset({
        heading: feature.heading,
        sub_heading: subFeatures.length > 0 ? subFeatures : [{ name: "" }],
        delete_sub_heading: [],
      });
    }
  }, [feature, reset]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch(`/api/admin/features/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update feature");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
      queryClient.invalidateQueries({ queryKey: ["feature", id] });
      toast.success("Feature updated successfully!");
      router.push("/admin-dashboard/features");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update feature");
    },
  });

  const onSubmit = (data: FormData) => {
    // If there are items to delete, show warning
    if (deleteSubHeading.length > 0) {
      setPendingData(data);
      setShowDeleteWarning(true);
    } else {
      updateMutation.mutate(data);
    }
  };

  const handleConfirmDelete = () => {
    if (pendingData) {
      updateMutation.mutate(pendingData);
      setShowDeleteWarning(false);
      setPendingData(null);
    }
  };

  const handleRemoveSubFeature = (index: number) => {
    const item = fields[index];
    if (item.featureId) {
      const currentDeleted = getValues("delete_sub_heading") || [];
      setValue("delete_sub_heading", [...currentDeleted, item.featureId]);
    }
    remove(index);
  };

  const getDeletedSubFeatureNames = () => {
    if (!feature?.sub_heading) return "";
    return feature.sub_heading
      .filter((item: any) => deleteSubHeading.includes(item.id))
      .map((item: any) => item.name)
      .join(", ");
  };

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton.Button active size="large" />
          <Skeleton.Input active size="large" style={{ width: 300 }} />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-3 md:p-6">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  if (!feature) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            size="large"
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Edit Feature</h1>
        </div>
        <Alert
          message="Feature Not Found"
          description="The feature you're looking for doesn't exist or has been deleted."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <>
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
            <h1 className="text-2xl font-bold text-gray-800">Edit Feature</h1>
            <p className="text-sm text-gray-600 mt-1">
              Update feature details and subcategories
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
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              // Preserve the ID when editing
                              if (fields[index].featureId) {
                                setValue(
                                  `sub_heading.${index}.id`,
                                  fields[index].featureId
                                );
                              }
                            }}
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
                      onClick={() => handleRemoveSubFeature(index)}
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
                <Button
                  type="default"
                  size="large"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={updateMutation.isPending}
                >
                  Update Feature
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Warning Modal */}
      <Modal
        title={
          <span className="flex items-center">
            <ExclamationCircleOutlined className="text-orange-500 mr-2" />
            Confirm Deletion
          </span>
        }
        open={showDeleteWarning}
        onOk={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteWarning(false);
          setPendingData(null);
        }}
        okText="Delete and Update"
        okButtonProps={{ danger: true, loading: updateMutation.isPending }}
        cancelText="Cancel"
      >
        <p className="text-gray-600 mb-2">
          <strong>Warning:</strong> The following sub-features will be
          permanently deleted:
        </p>
        <p className="text-red-600 font-semibold">
          {getDeletedSubFeatureNames()}
        </p>
        <p className="text-gray-600 mt-2">
          This action cannot be undone. Are you sure you want to proceed?
        </p>
      </Modal>
    </>
  );
}
