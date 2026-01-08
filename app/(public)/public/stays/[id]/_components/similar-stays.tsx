"use client";
import StayCard from "@/components/shared/stay-card";
import { Spin } from "antd";
import React, { useMemo } from "react";
import { useApiGet } from "@/http-service";

interface SimilarStaysProps {
  stayId: string | number;
  radiusKm?: number;
  limit?: number;
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
  rating?: number;
  images?: Array<{ id: number; url?: string; image?: string }>;
}

const SimilarStays = ({
  stayId,
  radiusKm = 10000,
  limit = 15,
}: SimilarStaysProps) => {
  // Fetch similar stays from API
  const {
    data: similarStaysResponse,
    isLoading,
    error,
  } = useApiGet({
    endpoint: `/api/stays/${stayId}/similar?radius_km=${1200}&limit=${limit}`,
    queryKey: ["similar-stays", stayId, radiusKm, limit],
    config: {
      enabled: !!stayId,
    },
  });
  console.log({ similarStaysResponse });
  // Extract stays from response
  const similarStays: Stay[] = useMemo(() => {
    const data = similarStaysResponse?.stays || [];
    return Array.isArray(data) ? data : [];
  }, [similarStaysResponse]);

  // Map stays to StayCard format
  const mappedStays = useMemo(() => {
    return similarStays.map((stay: Stay) => {
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
        rating: stay.rating || 0,
        image,
        beds: stay.no_of_bedrooms || 0,
        baths: Number(stay.no_of_bathrooms) || 0,
        guests: stay.no_of_guest || 0,
        additional_guests: stay.no_of_additional_guest || stay.additional_guests || 0,
        no_of_pets: stay.no_of_pets || stay.max_pets || 0,
      };
    });
  }, [similarStays]);

  // Don't render if no stays or loading
  if (isLoading) {
    return (
      <div className="mt-12">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-2">
            Similar Stays Nearby
          </h2>
        </div>
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error || mappedStays.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-primary mb-2">
          Similar Stays Nearby
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {mappedStays.map((item) => (
          <StayCard key={item.id} stay={item} index={item.id} />
        ))}
      </div>
    </div>
  );
};

export default SimilarStays;
