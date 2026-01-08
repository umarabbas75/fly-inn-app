"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Skeleton, Alert } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { CancellationPolicyForm } from "../../_components/CancellationPolicyForm";
import { useUpdateCancellationPolicy } from "../../_hooks/useCancellationPolicy";
import {
  cancellationPolicySchema,
  CancellationPolicyFormData,
} from "../../_utils/validation";
import { useQuery } from "@tanstack/react-query";

export default function EditCancellationPolicyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: policy, isPending } = useQuery({
    queryKey: ["sing-cancellation-123", id],
    queryFn: async () => {
      const response = await fetch(`/api/admin/cancellation-policy/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log({ response });

      if (!response.ok) {
        throw new Error("Failed to fetch cancellation policy");
      }

      const data = await response.json();
      console.log({ data });
      console.log({ data, id });
      return data;
    },
    enabled: !!id,
  });
  console.log({ policy });
  const updateMutation = useUpdateCancellationPolicy(id);
  const methods = useForm<CancellationPolicyFormData>({
    resolver: yupResolver(cancellationPolicySchema),
    defaultValues: {
      type: "",
      group_name: "",
      before_check_in: "",
      after_check_in: "",
    },
  });

  const { handleSubmit, reset } = methods;

  // Reset form when policy data is loaded
  useEffect(() => {
    if (policy) {
      reset({
        type: policy.type,
        group_name: policy.group_name,
        before_check_in: policy.before_check_in,
        after_check_in: policy.after_check_in,
      });
    }
  }, [policy, reset]);

  const onSubmit = (data: CancellationPolicyFormData) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        router.push("/admin-dashboard/cancellation-policy");
      },
    });
  };

  const onError = (errors: any) => {
    console.log("Form validation errors:", errors);
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

  if (!policy) {
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
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Cancellation Policy
          </h1>
        </div>
        <Alert
          message="Policy Not Found"
          description="The cancellation policy you're looking for doesn't exist or has been deleted."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
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
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Cancellation Policy
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Update the cancellation policy details
          </p>
        </div>
      </div>

      {/* Form */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="flex flex-col gap-6">
            <CancellationPolicyForm initialData={policy} />

            {/* Submit Button - Sticky at bottom */}
            <div className="sticky bottom-0 bg-white shadow-lg border-t border-gray-200 py-4 px-6 z-10 rounded-lg">
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
                  Update Policy
                </Button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
