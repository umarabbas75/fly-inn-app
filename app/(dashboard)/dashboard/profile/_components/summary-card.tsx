import {
  CameraOutlined,
  CheckCircleFilled,
  UserOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  DownOutlined,
  IdcardOutlined,
  SafetyOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useState, useEffect } from "react";
import { useProfileContext } from "./profile-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApp } from "@/providers/AppMessageProvider";
import imageCompression from "browser-image-compression";

const SummaryCard = () => {
  const {
    profileComplete,
    profileStatus,
    userData,
    documentStatuses,
    bffEndpoint,
    queryKey,
  } = useProfileContext();
  const { first_name, last_name, role, image } = userData || {};
  const queryClient = useQueryClient();
  const completionPercentage = profileComplete?.percentage;
  const remainingFields = profileComplete?.remaining_fields || [];
  const [compressingImage, setCompressingImage] = useState(false);
  const { message } = useApp();
  console.log({ image });
  const getStatusConfig = () => {
    switch (profileStatus) {
      case "in-review":
        return {
          color: "bg-amber-500",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          textColor: "text-amber-700",
          icon: <ClockCircleOutlined className="text-amber-500" />,
          text: "Under Review",
          description:
            "Your account is now under review. Please give the system some time to verify. The process may take up to 60 minutes. You will receive an email notification when the process is complete.",
        };
      case "verified":
        return {
          color: "bg-emerald-500",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          textColor: "text-emerald-700",
          icon: <CheckCircleFilled className="text-emerald-500" />,
          text: "Verified",
          description:
            "Your profile is verified! You can now book and host accommodations.",
        };
      default:
        return {
          color: "bg-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-700",
          icon: <ExclamationCircleOutlined className="text-red-500" />,
          text: "Action Required",
          description: (
            <>
              Your profile is not complete. You will not be able to host or book
              until it is complete. Please complete your profile to 100%. Once
              we have verified your identity, you will receive a message,
              letting you know you are all set!
              <br />
              To complete your profile properly, watch the Registration video on
              our{" "}
              <a
                href="https://www.youtube.com/@Fly-Inn"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold hover:text-red-800"
              >
                YouTube Channel
              </a>
              .
            </>
          ),
        };
    }
  };

  const statusConfig = getStatusConfig();
  console.log({ profileStatus, statusConfig });

  // Construct full image URL
  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return undefined;
    // If already a full URL, return as-is
    if (imagePath.startsWith("http")) return imagePath;
    // Otherwise, prepend backend URL
    return `${process.env.NEXT_PUBLIC_API_URI}/uploads/${imagePath}`;
  };

  const [profilePreview, setProfilePreview] = useState<string | undefined>(
    getImageUrl(image)
  );

  // Update profile preview when image changes
  useEffect(() => {
    setProfilePreview(getImageUrl(image));
  }, [image]);
  console.log({ profilePreview });
  // Image compression function
  const compressProfileImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 0.5,
      useWebWorker: true,
      maxWidthOrHeight: 800,
      fileType: file.type,
    };

    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Profile image compression error:", error);
      return file;
    }
  };

  const handleProfileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // Check file type
    if (!file.type.startsWith("image/")) {
      message.error("You can only upload image files!");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error("Image must be smaller than 5MB!");
      return;
    }

    setCompressingImage(true);

    try {
      // Compress image if needed
      let processedFile = file;
      if (file.size > 0.5 * 1024 * 1024) {
        processedFile = await compressProfileImage(file);
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(processedFile);
      setProfilePreview(previewUrl);

      // Create FormData and upload to server
      const formData = new FormData();
      formData.append("image", processedFile);

      // Upload to server
      updateProfile(formData);
    } catch (error) {
      message.error("Failed to process image. Please try again.");
      console.error("Image processing error:", error);
    } finally {
      setCompressingImage(false);
    }
  };

  const getFieldDisplayName = (field: string) => {
    const fieldMap: { [key: string]: string } = {
      driving_license: "Driver License Front",
      driving_license_back: "Driver License Back",
      image: "Profile image",
      air_men: "Airmen Certificate Front",
      air_men_back: "Airmen Certificate Back",
      bio: "Biography",
      "contact.name": "Emergency Contact Name",
      "contact.relationship": "Emergency Contact Relationship",
      "contact.email": "Emergency Contact Email",
      "contact.phone": "Emergency Contact Phone",
      "mailing_address.address": "Mailing Address",
      "mailing_address.city": "City",
      "mailing_address.state": "State",
      "mailing_address.zip_code": "ZIP Code",
      "mailing_address.country": "Country",
    };
    return (
      fieldMap[field] ||
      field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  const getFieldSection = (field: string) => {
    if (field.includes("license")) return "driver-license";
    if (field.includes("certificate")) return "airmen-certifications";
    if (field.includes("image")) return "image-upload";
    if (field.includes("contact.") || field.includes("mailing_address."))
      return "emergency-contact";
    if (field.includes("bio")) return "personal-info";
    return "personal-info";
  };

  const navigateToField = (field: string) => {
    const section = getFieldSection(field);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const { mutate: updateProfile, isPending: updatingProfile } = useMutation({
    mutationFn: async (formData: FormData) => {
      // Use fetch for multipart/form-data with dynamic endpoint
      const response = await fetch(bffEndpoint, {
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
        queryKey: queryKey,
      });
      message.success("Profile picture updated successfully!");
    },
    onError: (errRes: any) => {
      console.log("error", errRes);
      message.error(
        errRes?.message || "An error occurred while updating the user"
      );
    },
  });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header with Status */}
      <div
        className={`${statusConfig.bgColor} ${statusConfig.borderColor} border-b px-4 sm:px-6 py-4`}
      >
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={`p-2 rounded-full ${statusConfig.bgColor} flex-shrink-0`}
          >
            {statusConfig.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={`font-bold text-base sm:text-lg ${statusConfig.textColor} break-words`}
            >
              Profile Status: {statusConfig.text}
            </h3>
            <p
              className={`text-xs sm:text-sm ${statusConfig.textColor} opacity-80 mt-1`}
            >
              {statusConfig.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="relative mb-4">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full relative overflow-hidden border-4 border-white shadow-lg flex items-center justify-center">
                  {profilePreview ? (
                    <Image
                      src={profilePreview}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <UserOutlined className="text-2xl sm:text-3xl text-gray-400" />
                      <span className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                        No image
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <label
                className={`cursor-pointer border-0 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-[70px] sm:w-[82px] h-[24px] sm:h-[27px] gap-1 ${
                  compressingImage || updatingProfile
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleProfileUpload(e)}
                  disabled={compressingImage || updatingProfile}
                />
                <span className="text-[10px] sm:text-xs">
                  {compressingImage
                    ? "Processing..."
                    : updatingProfile
                    ? "Uploading..."
                    : profilePreview
                    ? "Edit"
                    : "Upload"}
                </span>
                {compressingImage ? (
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CameraOutlined className="text-gray-700 text-xs sm:text-md" />
                )}
              </label>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="flex-1 min-w-0">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 break-words">
                {first_name} {last_name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 uppercase break-words">
                {role?.map((r: any) => r).join(", ")}
              </p>

              {/* Profile Completion */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    Profile Completion
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      completionPercentage === 100
                        ? "text-emerald-500"
                        : "text-red-600"
                    }`}
                  >
                    {completionPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                  <div
                    className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                      completionPercentage === 100
                        ? "bg-emerald-500"
                        : "bg-red-600"
                    }`}
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>

                {profileStatus === "incomplete" && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-2 flex flex-wrap items-center gap-1">
                    <span>
                      Complete your profile to unlock booking capabilities.
                    </span>
                    <span className="font-medium text-red-600">
                      {100 - completionPercentage}% remaining.
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <span className="text-red-600 underline uppercase cursor-pointer hover:text-red-700 flex items-center gap-1">
                          {remainingFields.length} fields remaining
                          <DownOutlined className="text-xs" />
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="min-w-[220px] max-h-[300px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.25)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                        align="end"
                      >
                        {remainingFields.map((field: string, index: number) => (
                          <DropdownMenuItem
                            key={index}
                            onSelect={(e) => {
                              e.preventDefault();
                              navigateToField(field);
                            }}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-[rgba(175,35,34,0.08)] hover:text-[#AF2322] focus:bg-[rgba(175,35,34,0.08)] focus:text-[#AF2322] cursor-pointer"
                          >
                            <span className="flex-1">
                              {getFieldDisplayName(field)}
                            </span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </p>
                )}
              </div>

              {/* Document Verification Status - Only show when in-review */}
              {profileStatus === "in-review" && (
                <div className="mt-4">
                  <div className="text-xs sm:text-sm font-medium text-gray-700 mb-3">
                    Document Verification Status
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    {/* Driver License Status */}
                    <div className="flex items-center gap-3 sm:gap-4 justify-between p-3 bg-gray-50 rounded-lg flex-1 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <IdcardOutlined className="text-gray-600 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-700 truncate">
                          Driver License
                        </span>
                      </div>
                      <div className="flex-shrink-0">
                        {documentStatuses.driver.status === "verified" ? (
                          <span className="flex items-center gap-1 text-green-600 text-[10px] sm:text-xs whitespace-nowrap">
                            <CheckCircleFilled /> Verified
                          </span>
                        ) : documentStatuses.driver.status === "rejected" ? (
                          <span className="flex items-center gap-1 text-red-600 text-[10px] sm:text-xs whitespace-nowrap">
                            <CloseCircleFilled /> Rejected
                          </span>
                        ) : documentStatuses.driver.status ===
                          "under-review" ? (
                          <span className="flex items-center gap-1 text-amber-600 text-[10px] sm:text-xs whitespace-nowrap">
                            <ClockCircleOutlined /> Under Review
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-500 text-[10px] sm:text-xs whitespace-nowrap">
                            <ExclamationCircleOutlined /> Not Submitted
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Airmen Certificate Status */}
                    <div className="flex items-center gap-3 sm:gap-4 justify-between p-3 bg-gray-50 rounded-lg flex-1 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <SafetyOutlined className="text-gray-600 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-700 truncate">
                          Airmen Certificate
                        </span>
                      </div>
                      <div className="flex-shrink-0">
                        {documentStatuses.airmen.status === "verified" ? (
                          <span className="flex items-center gap-1 text-green-600 text-[10px] sm:text-xs whitespace-nowrap">
                            <CheckCircleFilled /> Verified
                          </span>
                        ) : documentStatuses.airmen.status === "rejected" ? (
                          <span className="flex items-center gap-1 text-red-600 text-[10px] sm:text-xs whitespace-nowrap">
                            <CloseCircleFilled /> Rejected
                          </span>
                        ) : documentStatuses.airmen.status ===
                          "under-review" ? (
                          <span className="flex items-center gap-1 text-amber-600 text-[10px] sm:text-xs whitespace-nowrap">
                            <ClockCircleOutlined /> Under Review
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-500 text-[10px] sm:text-xs whitespace-nowrap">
                            <ExclamationCircleOutlined /> Not Submitted
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Compression Dialog */}
      <Dialog open={compressingImage} onOpenChange={() => {}}>
        <DialogContent className="max-w-sm [&>button]:hidden">
          <div className="flex flex-col items-center p-4">
            <Skeleton className="h-8 w-8 rounded-full mb-4" />
            <h3 className="text-lg font-medium mb-1">Processing Image</h3>
            <p className="text-gray-600 text-center">
              Please wait while we optimize and upload your profile picture
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SummaryCard;
