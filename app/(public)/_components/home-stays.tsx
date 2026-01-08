"use client";
import React, { useState } from "react";

import StayCard from "@/components/shared/stay-card";

const HomeStays = ({ stays }: { stays: any[] }) => {
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [comparedItems, setComparedItems] = useState<number[]>([]);

  const toggleLike = (stayId: number) => {
    setLikedItems((prev) =>
      prev.includes(stayId)
        ? prev.filter((id) => id !== stayId)
        : [...prev, stayId]
    );
  };

  const toggleCompare = (stayId: number) => {
    setComparedItems((prev) =>
      prev.includes(stayId)
        ? prev.filter((id) => id !== stayId)
        : [...prev, stayId]
    );
  };

  // Map stays from props to the StayCard expected structure
  const mappedStays = stays.map((stay) => {
    // Get location from city/state or address
    const location =
      stay.city && stay.state
        ? `${stay.city}, ${stay.state}`
        : stay.address || "";

    // Get image with sort_order 0, fallback to first image
    const primaryImage =
      stay.images?.find((img: any) => img.sort_order === 0) || stay.images?.[0];
    const image =
      primaryImage?.url || primaryImage?.image || "/placeholder.jpg";

    return {
      id: stay.id, // Include the id for API calls
      name: stay.title || stay.name || "",
      location: location,
      price: Number(stay.nightly_price) || 0,
      rating: stay.rating || 0,
      image: image,
      beds: stay.no_of_bedrooms || 0,
      baths: Number(stay.no_of_bathrooms) || 0,
      guests: stay.no_of_guest || stay.no_of_guests || 0,
      additional_guests: stay.no_of_additional_guest || stay.additional_guests || 0,
      no_of_pets: stay.no_of_pets || stay.max_pets || 0,
    };
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
      {mappedStays.map((stay) => (
        <StayCard
          key={stay.id}
          stay={stay}
          index={stay.id}
          isLiked={likedItems.includes(stay.id)}
          isCompared={comparedItems.includes(stay.id)}
          onToggleLike={toggleLike}
          onToggleCompare={toggleCompare}
        />
      ))}
    </div>
  );
};

export default HomeStays;
