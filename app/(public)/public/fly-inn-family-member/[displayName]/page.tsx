"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useApiGet } from "@/http-service";
import Image from "next/image";
import { Spin, Empty, Tag } from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
  CalendarOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";
import StayCard from "@/components/shared/stay-card";

interface UserListing {
  id: number;
  title: string;
  description: string;
  city: string;
  state: string;
  country: string;
  no_of_guest: number;
  no_of_bedrooms: number;
  no_of_bathrooms: number;
  nightly_price: number;
  instant_booking: boolean;
  images: Array<{
    id: number;
    url: string;
    is_primary: boolean;
    sort_order?: number;
  }>;
  average_rating?: number;
  review_count?: number;
}

interface PublicUserProfile {
  id: number;
  display_name: string;
  native_language?: string;
  other_language?: string;
  bio?: string;
  image?: string;
  profile_status?: string;
  created_at: string;
  listings: UserListing[];
}

function FamilyMemberContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const { data, isLoading, error } = useApiGet<{
    data: PublicUserProfile;
  }>({
    endpoint: `/users/public/${userId}`,
    queryKey: ["public-user-profile", userId],
    config: {
      enabled: !!userId,
    },
    axiosConfig: {
      baseURL: process.env.NEXT_PUBLIC_API_URI,
    },
  });

  console.log("user profile", data);

  const userProfile = data || (data as any)?.data || {};

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !userProfile || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Empty description="User profile not found" />
      </div>
    );
  }

  const memberSince = userProfile?.created_at
    ? format(new Date(userProfile?.created_at), "MMMM yyyy")
    : "Unknown";

  const primaryImage = (listing: UserListing) => {
    // Get image with sort_order 0, fallback to is_primary, then first image
    const sortedPrimary = listing.images?.find((img) => img.sort_order === 0);
    const isPrimary = listing.images?.find((img) => img.is_primary);
    const image = sortedPrimary || isPrimary || listing.images?.[0];
    return image?.url || "/placeholder-listing.jpg";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="app-container">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {userProfile?.image ? (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden">
                  <Image
                    src={userProfile?.image}
                    alt={userProfile?.display_name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserOutlined className="text-4xl md:text-5xl text-gray-400" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
                  {userProfile?.display_name}
                </h1>
                {userProfile?.profile_status === "verified" && (
                  <Tag
                    icon={<CheckCircleOutlined />}
                    color="success"
                    className="text-sm"
                  >
                    Verified
                  </Tag>
                )}
              </div>

              {userProfile?.bio && (
                <p className="text-gray-600 mb-4 max-w-3xl">
                  {userProfile?.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {(userProfile?.native_language ||
                  userProfile.other_language) && (
                  <div className="flex items-center gap-2">
                    <GlobalOutlined className="text-gray-400" />
                    <span>
                      {userProfile?.native_language}
                      {userProfile.other_language &&
                        `, ${userProfile?.other_language}`}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <CalendarOutlined className="text-gray-400" />
                  <span>Member since {memberSince}</span>
                </div>

                <div className="flex items-center gap-2">
                  <HomeOutlined className="text-gray-400" />
                  <span>{userProfile?.listings?.length || 0} listings</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {userProfile?.display_name}&apos;s Listings
          </h2>

          {userProfile.listings && userProfile.listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userProfile.listings.map((listing: any, index: number) => {
                // Transform listing data to match StayCard props
                const stayData = {
                  id: listing.id,
                  name: listing.title,
                  location: `${listing.city}, ${listing.state}`,
                  price: listing.nightly_price,
                  rating: listing.average_rating || 0,
                  image: primaryImage(listing),
                  beds: listing.no_of_beds || listing.no_of_bedrooms || 0,
                  baths: listing.no_of_bathrooms || 0,
                  guests: listing.no_of_guest || 0,
                  additional_guests: listing.no_of_additional_guest || listing.additional_guests || 0,
                  no_of_pets: listing.no_of_pets || listing.max_pets || 0,
                };

                return (
                  <StayCard key={listing.id} stay={stayData} index={index} />
                );
              })}
            </div>
          ) : (
            <Empty
              description={`${userProfile.display_name} doesn't have any listings yet`}
              className="py-12"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function FlyInnFamilyMemberPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spin size="large" />
        </div>
      }
    >
      <FamilyMemberContent />
    </Suspense>
  );
}

