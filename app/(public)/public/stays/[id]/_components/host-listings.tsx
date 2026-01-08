"use client";
import StayCard from "@/components/shared/stay-card";
import { Spin, Empty } from "antd";
import React, { useMemo } from "react";
import { useApiGet } from "@/http-service";
import Link from "next/link";

interface HostListingsProps {
  hostId: number | string;
  hostName?: string;
  currentStayId: number | string;
}

interface Stay {
  id: number;
  title?: string;
  name?: string;
  city?: string;
  state?: string;
  address?: string;
  nightly_price?: string | number;
  no_of_bedrooms?: number;
  no_of_bathrooms?: string | number;
  no_of_guest?: number;
  average_rating?: number;
  images?: Array<{
    id: number;
    url?: string;
    image?: string;
    sort_order?: number;
  }>;
}

const HostListings = ({
  hostId,
  hostName,
  currentStayId,
}: HostListingsProps) => {
  // Fetch host's public profile which includes their listings
  const {
    data: profileData,
    isLoading,
    error,
  } = useApiGet<{ data?: { listings: Stay[] }; listings?: Stay[] }>({
    endpoint: `/users/public/${hostId}`,
    queryKey: ["host-listings", hostId],
    config: {
      enabled: !!hostId,
    },
    axiosConfig: {
      baseURL: process.env.NEXT_PUBLIC_API_URI,
    },
  });

  // Extract listings from response, excluding current stay
  const hostListings: Stay[] = useMemo(() => {
    const data =
      profileData?.listings || (profileData as any)?.data?.listings || [];
    const listings = Array.isArray(data) ? data : [];
    // Filter out the current stay
    return listings.filter((stay) => stay.id !== Number(currentStayId));
  }, [profileData, currentStayId]);

  // Map stays to StayCard format
  const mappedStays = useMemo(() => {
    return hostListings.map((stay: Stay) => {
      const location =
        stay.city && stay.state
          ? `${stay.city}, ${stay.state}`
          : stay.address || "";

      const primaryImage =
        stay.images?.find((img: any) => img.sort_order === 0) ||
        stay.images?.[0];
      const image =
        primaryImage?.url || primaryImage?.image || "/placeholder.jpg";

      return {
        id: stay.id,
        name: stay.title || stay.name || "",
        location,
        price: Number(stay.nightly_price) || 0,
        rating: stay.average_rating || 0,
        image,
        beds: stay.no_of_bedrooms || 0,
        baths: Number(stay.no_of_bathrooms) || 0,
        guests: stay.no_of_guest || 0,
        additional_guests: stay.no_of_additional_guest || stay.additional_guests || 0,
        no_of_pets: stay.no_of_pets || stay.max_pets || 0,
      };
    });
  }, [hostListings]);

  // Don't render if loading
  if (isLoading) {
    return (
      <div className="mt-12">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-2">
            More from {hostName || "this Host"}
          </h2>
        </div>
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  // Don't render if no other listings
  if (error || mappedStays.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-primary">
          More from {hostName || "this Host"}
        </h2>
        {hostId && hostName && (
          <Link
            href={`/public/fly-inn-family-member/${encodeURIComponent(
              hostName
            )}?id=${hostId}`}
            className="text-sm text-[#AF2322] hover:underline"
          >
            View all listings →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {mappedStays.slice(0, 4).map((item) => (
          <StayCard key={item.id} stay={item} index={item.id} />
        ))}
      </div>
    </div>
  );
};

export default HostListings;
