import React, { useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Badge, Alert, Button } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ImageUpload from "./image-upload";
import { useProfileContext } from "./profile-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApp } from "@/providers/AppMessageProvider";

type DocumentStatus =
  | "not-submitted"
  | "under-review"
  | "rejected"
  | "verified";

// Airmen Certificate Form Schema with Yup validation
const airmenValidationSchema = yup.object({
  air_men: yup
    .mixed()
    .required("Front image is required")
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value) return false;
      if (value instanceof File) {
        return value.type.startsWith("image/");
      }
      if (typeof value === "string") {
        // Allow string URLs (existing images)
        return value.startsWith("http") || value.startsWith("data:");
      }
      return true;
    })
    .test("fileSize", "File size must be less than 5MB", (value) => {
      if (!value) return false;
      if (value instanceof File) {
        return value.size <= 5 * 1024 * 1024; // 5MB
      }
      // Skip size validation for string URLs (existing images)
      return true;
    }),
  air_men_back: yup
    .mixed()
    .required("Back image is required")
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value) return false;
      if (value instanceof File) {
        return value.type.startsWith("image/");
      }
      if (typeof value === "string") {
        // Allow string URLs (existing images)
        return value.startsWith("http") || value.startsWith("data:");
      }
      return true;
    })
    .test("fileSize", "File size must be less than 5MB", (value) => {
      if (!value) return false;
      if (value instanceof File) {
        return value.size <= 5 * 1024 * 1024; // 5MB
      }
      // Skip size validation for string URLs (existing images)
      return true;
    }),
});

type AirmenFormData = yup.InferType<typeof airmenValidationSchema>;

const AirmenCertifications = () => {
  const { message } = useApp();
  const {
    documentStatuses,
    userData,
    loadingUserData,
    licenseBffEndpoint,
    queryKey: profileQueryKey,
  } = useProfileContext();
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending: updatingProfile } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(licenseBffEndpoint, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ error: "Request failed" }));
        throw new Error(error.message || error.error || "Request failed");
      }

      return response.json();
    },
    onSuccess: (res) => {
      console.log("invalidated", res);
      queryClient.invalidateQueries({
        queryKey: profileQueryKey,
      });
      message.success("Your Airmen Certificate has been successfully uploaded");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (errRes: any) => {
      console.log("error", errRes);
      message.error(
        errRes?.message ||
          "An error occurred while updating the airmen certificate"
      );
    },
  });

  // Airmen Certificate Form with validation
  const airmenForm = useForm<AirmenFormData>({
    resolver: yupResolver(airmenValidationSchema),
    defaultValues: {
      air_men: undefined,
      air_men_back: undefined,
    },
    mode: "onChange",
  });

  // Watch form values to check if both documents are present
  const airMenFront = airmenForm.watch("air_men");
  const airMenBack = airmenForm.watch("air_men_back");
  const hasBothAirmenDocs = airMenFront && airMenBack;

  // Helper function to get image URL (handles both S3 URLs and old format)
  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return undefined;
    // If already a full URL (S3), return as-is
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    // Otherwise, construct old format URL for backward compatibility
    return `${process.env.NEXT_PUBLIC_API_URI}/uploads/${imagePath}`;
  };

  useEffect(() => {
    console.log("userData airmen certificates", userData);
    if (userData && userData?.air_men && userData?.air_men_back) {
      airmenForm.reset({
        air_men: getImageUrl(userData?.air_men),
        air_men_back: getImageUrl(userData?.air_men_back),
      });
    }
  }, [userData, airmenForm.reset]);

  console.log("getCert", airmenForm.getValues());

  const getStatusConfig = (status: DocumentStatus) => {
    switch (status) {
      case "verified":
        return {
          color: "success",
          icon: <CheckCircleFilled className="text-green-500" />,
          text: "Verified",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-700",
        };
      case "rejected":
        return {
          color: "error",
          icon: <CloseCircleFilled className="text-red-500" />,
          text: "Rejected",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-700",
        };
      case "under-review":
        return {
          color: "warning",
          icon: <ClockCircleOutlined className="text-amber-500" />,
          text: "Under Review",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          textColor: "text-amber-700",
        };
      default:
        return {
          color: "default",
          icon: <ExclamationCircleOutlined className="text-gray-400" />,
          text: "Not Submitted",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          textColor: "text-gray-500",
        };
    }
  };

  const onAirmenSubmit = useCallback(
    async (data: AirmenFormData) => {
      try {
        const { air_men, air_men_back } = data;
        console.log("data", data);

        // Check if at least one file is uploaded
        const hasAirMenFile =
          air_men && (air_men instanceof File || air_men instanceof Blob);
        const hasAirMenBackFile =
          air_men_back &&
          (air_men_back instanceof File || air_men_back instanceof Blob);

        if (!hasAirMenFile && !hasAirMenBackFile) {
          message.error("Your documents have already been submitted.");
          return;
        }

        // Create FormData for file uploads
        const formData = new FormData();

        if (air_men instanceof File || air_men instanceof Blob) {
          console.log("append1");
          formData.append("air_men", air_men);
        }

        if (air_men_back instanceof File || air_men_back instanceof Blob) {
          console.log("append2");

          formData.append("air_men_back", air_men_back);
        }

        updateProfile(formData);

        // Reset the form
      } catch (error) {
        message.error("Failed to submit airmen certificate. Please try again.");
        console.error("Airmen certificate submission error:", error);
      }
    },
    [airmenForm, message]
  );

  return (
    <div
      className="bg-white rounded-xl shadow-sm p-4 sm:p-5 md:p-6"
      id="airmen-certifications"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-4">
        <h2 className="flex items-center text-lg sm:text-xl font-bold text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-2 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="break-words">Airmen Certificate</span>
        </h2>
        <Badge
          status={getStatusConfig(documentStatuses.airmen.status).color as any}
          text={
            <span className="text-[10px] sm:text-xs whitespace-nowrap">
              {getStatusConfig(documentStatuses.airmen.status).text}
            </span>
          }
        />
      </div>

      <div className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
        Upload clear photos of your airmen certificate. Both front and back
        sides are required for verification.
      </div>

      {/* Airmen Certificate Section */}
      <form onSubmit={airmenForm.handleSubmit(onAirmenSubmit)}>
        <div className="border border-gray-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          {/* Header with Status */}
          <div className="mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-gray-600">
              Upload both sides of your airmen certificate
            </p>
          </div>

          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Airmen Certificate Front *
            </label>

            <Controller
              name="air_men"
              control={airmenForm.control}
              render={({ field }) => {
                return (
                  <>
                    <ImageUpload
                      value={field.value as string | File | null}
                      setValue={(
                        fieldName: string,
                        value: any,
                        options?: any
                      ) =>
                        airmenForm.setValue(
                          fieldName as keyof AirmenFormData,
                          value as any,
                          options
                        )
                      }
                      fieldName="air_men"
                      label="Document"
                      showRemoveButton={false}
                    />
                    {airmenForm.formState.errors.air_men && (
                      <p className="text-red-500 text-xs sm:text-sm mt-2">
                        <i className="fa fa-exclamation-circle mr-1"></i>
                        {airmenForm.formState.errors.air_men.message?.toString()}
                      </p>
                    )}
                  </>
                );
              }}
            />
          </div>

          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Airmen Certificate Back *
            </label>

            <Controller
              name="air_men_back"
              control={airmenForm.control}
              render={({ field }) => {
                return (
                  <>
                    <ImageUpload
                      value={field.value as string | File | null}
                      setValue={(
                        fieldName: string,
                        value: any,
                        options?: any
                      ) =>
                        airmenForm.setValue(
                          fieldName as keyof AirmenFormData,
                          value as any,
                          options
                        )
                      }
                      fieldName="air_men_back"
                      label="Document"
                      showRemoveButton={false}
                    />
                    {airmenForm.formState.errors.air_men_back && (
                      <p className="text-red-500 text-xs sm:text-sm mt-2">
                        <i className="fa fa-exclamation-circle mr-1"></i>
                        {airmenForm.formState.errors.air_men_back.message?.toString()}
                      </p>
                    )}
                  </>
                );
              }}
            />
          </div>

          {/* File Requirements Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4">
            <h4 className="text-xs sm:text-sm font-medium text-green-800 mb-1.5 sm:mb-2">
              File Requirements:
            </h4>
            <ul className="text-[10px] sm:text-xs text-green-700 space-y-0.5 sm:space-y-1">
              <li>• Only image files (JPG, PNG, GIF) are accepted</li>
              <li>• Both front and back images are required</li>
              <li>• Ensure images are clear and readable</li>
              <li>• License must be valid and not expired</li>
            </ul>
          </div>

          {/* Airmen Save Button */}
          <div className="flex justify-end mt-3 sm:mt-4">
            <Button
              type="primary"
              variant="dashed"
              icon={<SaveOutlined />}
              htmlType="submit"
              loading={updatingProfile}
              disabled={updatingProfile}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 disabled:bg-green-400 disabled:border-green-400 disabled:text-white disabled:opacity-100"
              size="large"
            >
              <span className="text-xs sm:text-sm">
                Submit Airmen Certificate
              </span>
            </Button>
          </div>

          {/* Admin Notes for Airmen - Only show when both documents are present */}
          {documentStatuses.airmen.adminNotes && hasBothAirmenDocs && (
            <Alert
              message="Admin Notes"
              description={documentStatuses.airmen.adminNotes}
              type={
                documentStatuses.airmen.status === "rejected" ? "error" : "info"
              }
              showIcon
              className="mt-4"
            />
          )}

          {/* Last Updated for Airmen */}
          {documentStatuses.airmen.lastUpdated && (
            <p className="text-[10px] sm:text-xs text-gray-500 mt-2 sm:mt-3">
              Last updated:{" "}
              {new Date(
                documentStatuses.airmen.lastUpdated
              ).toLocaleDateString()}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AirmenCertifications;
