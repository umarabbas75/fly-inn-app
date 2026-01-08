"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import ProfileCard from "./_components/summary-card";
import SummaryCard from "./_components/summary-card";
import PersonalInfo from "./_components/personal-info";
import Certifications from "./_components/certifications";
import MailingAddress from "./_components/mailing-address";
import EmergencyContact from "./_components/emergency-contact";
import SocialMediaForm from "./_components/social-media";
import { Button, Skeleton } from "antd";
import {
  ProfileProvider,
  useProfileContext,
} from "./_components/profile-context";

const ProfileContent = () => {
  const {
    methods,
    handleSubmit,
    onSubmit,
    onError,
    updatingProfile,
    loadingUserData,
    isCheckingEmail,
  } = useProfileContext();

  // Show skeleton loader while loading
  if (loadingUserData) {
    return (
      <div className="">
        <div className="flex flex-col gap-3 sm:gap-5 md:gap-6">
          {/* Summary Card Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-3 md:p-6">
            <Skeleton active avatar paragraph={{ rows: 2 }} />
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-3 sm:gap-5 md:gap-6">
            <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col gap-3 sm:gap-5 md:gap-6">
              {/* Personal Information Skeleton */}
              <div className="bg-white rounded-xl shadow-sm p-3 md:p-6">
                <Skeleton active title paragraph={{ rows: 4 }} />
              </div>

              {/* Mailing Address Skeleton */}
              <div className="bg-white rounded-xl shadow-sm p-3 md:p-6">
                <Skeleton active title paragraph={{ rows: 4 }} />
              </div>

              {/* Emergency Contact Skeleton */}
              <div className="bg-white rounded-xl shadow-sm p-3 md:p-6">
                <Skeleton active title paragraph={{ rows: 3 }} />
              </div>

              {/* Social Media Skeleton */}
              <div className="bg-white rounded-xl shadow-sm p-3 md:p-6">
                <Skeleton active title paragraph={{ rows: 3 }} />
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-5">
              {/* Certifications Skeleton */}
              <div className="bg-white rounded-xl shadow-sm p-3 md:p-6">
                <Skeleton active title paragraph={{ rows: 6 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-col gap-3 sm:gap-5 md:gap-6">
        <SummaryCard />

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-3 sm:gap-5 md:gap-6">
          <div className="order-2 lg:order-1 lg:col-span-7">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit, onError)}>
                <div className=" flex flex-col gap-3 sm:gap-5 md:gap-6">
                  {/* Personal Information */}
                  <PersonalInfo />

                  {/* Mailing Address */}
                  <MailingAddress />

                  {/* Emergency Contact */}
                  <EmergencyContact />

                  <SocialMediaForm />

                  {/* Sticky Save Button - Fixed at bottom */}
                  <div className="sticky bottom-0 bg-white shadow-sm border-gray-200 py-3 sm:py-4 px-4 sm:px-6 mt-3 sm:mt-5 md:mt-6 z-10">
                    <div className="flex justify-end gap-4">
                      <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={updatingProfile}
                        disabled={isCheckingEmail || updatingProfile}
                      >
                        {isCheckingEmail ? "Checking email..." : "Save"}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-5">
            {/* Certifications */}
            <Certifications />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  return (
    <ProfileProvider>
      <ProfileContent />
    </ProfileProvider>
  );
}
