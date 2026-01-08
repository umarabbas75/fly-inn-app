import { CameraOutlined, UserOutlined } from "@ant-design/icons";
import { Image, Modal, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { useProfileContext } from "@/app/(dashboard)/dashboard/profile/_components/profile-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApp } from "@/providers/AppMessageProvider";
import imageCompression from "browser-image-compression";

const AdminSummaryCard = () => {
  const { profileComplete, userData } = useProfileContext();
  const { first_name, last_name, role, image } = userData || {};
  const queryClient = useQueryClient();
  const completionPercentage = profileComplete?.percentage;
  const [compressingImage, setCompressingImage] = useState(false);
  const { message } = useApp();

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

  const { mutate: updateProfile, isPending: updatingProfile } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/users/current-user", {
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
      queryClient.invalidateQueries({
        queryKey: ["user-profile"],
      });
      message.success("Profile picture updated successfully!");
    },
    onError: (errRes: any) => {
      message.error(
        errRes?.message || "An error occurred while updating the user"
      );
    },
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Main Content - Compact Design */}
      <div className="p-6">
        <div className="flex items-center gap-2 md:gap-6">
          {/* Profile Image Section */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-20 h-20 rounded-full relative overflow-hidden border-4 border-white shadow-lg flex items-center justify-center">
                {profilePreview ? (
                  <Image
                    src={profilePreview}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    fallback="/placeholder-user.jpg"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <UserOutlined className="text-2xl text-gray-400" />
                  </div>
                )}
              </div>
              <label
                className={`cursor-pointer border-0 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors absolute -bottom-1 left-1/2 -translate-x-1/2 w-[70px] h-[24px] gap-1 ${
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
                <span className="text-xs">
                  {compressingImage
                    ? "Processing..."
                    : updatingProfile
                    ? "Uploading..."
                    : profilePreview
                    ? "Edit"
                    : "Upload"}
                </span>
                {compressingImage ? (
                  <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CameraOutlined className="text-gray-700 text-xs" />
                )}
              </label>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800 mb-1">
              {first_name} {last_name}
            </h1>
            <p className="text-sm text-gray-500 mb-3 uppercase">
              {role?.map((r: any) => r).join(", ")}
            </p>

            {/* Profile Completion - Compact */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-gray-700">
                  Profile Completion
                </span>
                <span
                  className={`text-xs font-medium ${
                    completionPercentage === 100
                      ? "text-emerald-500"
                      : "text-[#AF2322]"
                  }`}
                >
                  {completionPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    completionPercentage === 100
                      ? "bg-emerald-500"
                      : "bg-[#AF2322]"
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compression Modal */}
      <Modal
        open={compressingImage}
        footer={null}
        closable={false}
        centered
        maskClosable={false}
        width={300}
      >
        <div className="flex flex-col items-center p-4">
          <Spin size="large" className="mb-4" />
          <h3 className="text-lg font-medium mb-1">Processing Image</h3>
          <p className="text-gray-600 text-center">
            Please wait while we optimize and upload your profile picture
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default AdminSummaryCard;
