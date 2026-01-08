"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";
import {
  ProfileProvider,
  useProfileContext,
} from "@/app/(dashboard)/dashboard/profile/_components/profile-context";
import SummaryCard from "@/app/(dashboard)/dashboard/profile/_components/summary-card";
import PersonalInfo from "@/app/(dashboard)/dashboard/profile/_components/personal-info";
import MailingAddress from "@/app/(dashboard)/dashboard/profile/_components/mailing-address";
import EmergencyContact from "@/app/(dashboard)/dashboard/profile/_components/emergency-contact";
import SocialMediaForm from "@/app/(dashboard)/dashboard/profile/_components/social-media";
import Certifications from "@/app/(dashboard)/dashboard/profile/_components/certifications";
import { Button, Skeleton } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const AdminEditUserContent = () => {
  const router = useRouter();
  const {
    methods,
    handleSubmit,
    onSubmit,
    onError,
    updatingProfile,
    loadingUserData,
  } = useProfileContext();

  // Show skeleton loader while loading
  if (loadingUserData) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <Skeleton.Button active size="large" />
          <Skeleton active className="mt-4" />
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header with Back Button */}
      <div className="mb-6 flex items-center gap-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/admin-dashboard/users")}
          size="large"
        >
          Back to Users
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Edit User Profile
          </h1>
          <p className="text-gray-600 mt-1">
            Update user information and documents
          </p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex flex-col gap-6">
        {/* Summary Card */}
        <SummaryCard />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Form Fields */}
          <div className="col-span-1 lg:col-span-7">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit, onError)}>
                <div className="flex flex-col gap-6">
                  {/* Personal Information */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                      Personal Information
                    </h2>
                    <PersonalInfo />
                  </div>

                  {/* Mailing Address */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                      Mailing Address
                    </h2>
                    <MailingAddress />
                  </div>

                  {/* Emergency Contact */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                      Emergency Contact
                    </h2>
                    <EmergencyContact />
                  </div>

                  {/* Social Media Links */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                      Social Media Links
                    </h2>
                    <SocialMediaForm />
                  </div>

                  {/* Sticky Save Button */}
                  <div className="sticky bottom-0 bg-white shadow-lg border-t border-gray-200 py-4 px-6 z-10 rounded-lg">
                    <div className="flex justify-end gap-4">
                      <Button
                        size="large"
                        onClick={() => router.push("/admin-dashboard/users")}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={updatingProfile}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>

          {/* Right Column - Certifications */}
          <div className="col-span-1 lg:col-span-5">
            <Certifications />
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminEditUserPage = () => {
  const params = useParams();
  const userId = params?.id as string;

  return (
    <ProfileProvider userId={userId} isAdminEdit={true}>
      <AdminEditUserContent />
    </ProfileProvider>
  );
};

export default AdminEditUserPage;
