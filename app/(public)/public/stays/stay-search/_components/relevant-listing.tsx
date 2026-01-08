"use client";

import StayCard from "@/components/shared/stay-card";
import React from "react";
import { useSearchParams } from "next/navigation";

interface RelevantListingProps {
  stays: any[];
}

const RelevantListing = ({ stays }: RelevantListingProps) => {
  const searchParams = useSearchParams();

  // Build query string for detail page navigation
  const buildDetailUrl = (stayId: number) => {
    const params = new URLSearchParams();

    // Pass through search params to detail page
    const city = searchParams?.get("city");
    const arrivalDate = searchParams?.get("arrival_date");
    const departureDate = searchParams?.get("departure_date");
    const guests = searchParams?.get("guests");
    const children = searchParams?.get("children");
    const infants = searchParams?.get("infants");
    const pets = searchParams?.get("pets");

    if (city) params.append("city", city);
    if (arrivalDate) params.append("arrival_date", arrivalDate);
    if (departureDate) params.append("departure_date", departureDate);
    if (guests) params.append("guests", guests);
    if (children) params.append("children", children);
    if (infants) params.append("infants", infants);
    if (pets) params.append("pets", pets);

    const queryString = params.toString();
    return queryString
      ? `/public/stays/${stayId}?${queryString}`
      : `/public/stays/${stayId}`;
  };

  // Map stays from props to the StayCard expected structure
  const mappedStays = [...stays].map((stay) => {
    // Get location from city/state or address
    const location =
      stay.city && stay.state
        ? `${stay.city}, ${stay.state}`
        : stay.address || "";

    // Get first image URL
    // Get image with sort_order 0, fallback to first image
    const primaryImage =
      stay.images?.find((img: any) => img.sort_order === 0) || stay.images?.[0];
    const image =
      primaryImage?.url || primaryImage?.image || "/placeholder.jpg";

    return {
      id: stay.id,
      name: stay.title || stay.name || "",
      location: location,
      // Use avg_nightly_price if available, otherwise fallback to nightly_price
      price: Number(stay.avg_nightly_price) || Number(stay.nightly_price) || 0,
      rating: stay.rating || 0,
      image: image,
      beds: stay.no_of_bedrooms || 0,
      baths: Number(stay.no_of_bathrooms) || 0,
      guests: stay.no_of_guest || stay.no_of_guests || 0,
      additional_guests: stay.no_of_additional_guest || stay.additional_guests || 0,
      no_of_pets: stay.no_of_pets || stay.max_pets || 0,
      // Include special pricing fields
      avg_nightly_price: stay.avg_nightly_price,
      total_price: stay.total_price,
      nights: stay.nights,
      // Build detail URL with search params
      detailUrl: buildDetailUrl(stay.id),
    };
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {mappedStays.map((stay, idx) => (
        <StayCard
          key={stay.id || idx}
          stay={stay}
          index={idx}
          isLiked={false}
          isCompared={false}
          onToggleLike={() => {}}
          onToggleCompare={() => {}}
        />
      ))}
    </div>
  );
};

export default RelevantListing;
