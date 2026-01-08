"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import AdminSummaryCard from "./_components/admin-summary-card";
import PersonalInfo from "@/app/(dashboard)/dashboard/profile/_components/personal-info";
import MailingAddress from "@/app/(dashboard)/dashboard/profile/_components/mailing-address";
import EmergencyContact from "@/app/(dashboard)/dashboard/profile/_components/emergency-contact";
import SocialMediaForm from "@/app/(dashboard)/dashboard/profile/_components/social-media";
import { Button, Skeleton } from "antd";
import {
  ProfileProvider,
  useProfileContext,
} from "@/app/(dashboard)/dashboard/profile/_components/profile-context";

const AdminProfileContent = () => {
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
      <div className="">
        <div className="flex flex-col gap-6">
          {/* Summary Card Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-3 md:p-6">
            <Skeleton active avatar paragraph={{ rows: 1 }} />
          </div>

          {/* Profile Form Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-3 md:p-6">
            <Skeleton active title paragraph={{ rows: 8 }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-col gap-6">
        {/* Compact Admin Summary Card */}
        <AdminSummaryCard />

        {/* Single Column Layout - No Certifications */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <div className="flex flex-col gap-6">
              {/* Personal Information */}
              <PersonalInfo />

              {/* Mailing Address */}
              <MailingAddress />

              {/* Emergency Contact */}
              <EmergencyContact />

              {/* Social Media */}
              <SocialMediaForm />

              {/* Sticky Save Button - Fixed at bottom */}
              <div className="sticky bottom-0 bg-white shadow-sm border-gray-200 py-4 px-6 z-10">
                <div className="flex justify-end gap-4">
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
    </div>
  );
};

export default function AdminProfilePage() {
  return (
    <ProfileProvider>
      <AdminProfileContent />
    </ProfileProvider>
  );
}
