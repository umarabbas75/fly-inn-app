"use client";

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useApiGet } from "@/http-service";
import { bffMutation } from "@/lib/bff-client";
import { Spin, Empty } from "antd";
import { HeartFilled } from "@ant-design/icons";
import { FaBed, FaBath, FaUser, FaPlane } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/providers/AppMessageProvider";

interface FavoriteStay {
  id: number;
  stay_id?: number;
  title?: string;
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  nightly_price?: string | number;
  no_of_bedrooms?: number;
  no_of_bathrooms?: string | number;
  no_of_guest?: number;
  images?: Array<{ id: number; url?: string; image?: string }>;
  stay?: {
    id: number;
    title?: string;
    address?: string;
    city?: string;
    state?: string;
    nightly_price?: string | number;
    no_of_bedrooms?: number;
    no_of_bathrooms?: string | number;
    no_of_guest?: number;
    images?: Array<{ id: number; url?: string; image?: string }>;
  };
}

export default function FavoritesPage() {
  const { message } = useApp();
  const queryClient = useQueryClient();

  // Fetch favorite stays
  const {
    data: favoritesResponse,
    isLoading,
    error,
  } = useApiGet({
    endpoint: "/api/favorites/stays",
    queryKey: ["favoriteStays"],
  });
  console.log({ favoritesResponse });
  // Extract favorites from response
  const favorites: FavoriteStay[] = favoritesResponse || [];

  const handleRemoveFavorite = async (stayId: number) => {
    try {
      await bffMutation(`/api/favorites/stays/${stayId}`, {
        method: "DELETE",
      });
      message.success("Removed from favorites!");
      // Refetch favorites
      queryClient.invalidateQueries({ queryKey: ["favoriteStays"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      message.error("Failed to remove from favorites");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">Failed to load favorites</p>
      </div>
    );
  }

  // Helper to get stay data (handle both nested and flat structures)
  const getStayData = (item: FavoriteStay) => {
    const stay = item.stay || item;
    return {
      id: item.stay_id || stay.id || item.id,
      title: stay.title || item.name || "Untitled Stay",
      location:
        stay.city && stay.state
          ? `${stay.city}, ${stay.state}`
          : stay.address || "Location not available",
      price: Number(stay.nightly_price) || 0,
      beds: stay.no_of_bedrooms || 0,
      baths: Number(stay.no_of_bathrooms) || 0,
      guests: stay.no_of_guest || 0,
      image:
        stay.images?.[0]?.url || stay.images?.[0]?.image || "/placeholder.jpg",
    };
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Favorite Stays</h1>
        <p className="text-gray-600 mt-2">Your saved stays for easy access</p>
      </div>

      {!Array.isArray(favorites) || favorites.length === 0 ? (
        <Empty description="No favorite stays yet" className="py-20" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favorites.map((item) => {
            const stay = getStayData(item);
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={stay.image}
                    alt={stay.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                  {/* Heart icon to remove */}
                  <button
                    onClick={() => handleRemoveFavorite(stay.id)}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-[#AF2322]/10 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center border border-[#AF2322]/30 hover:scale-110 active:scale-95"
                    aria-label="Remove from favorites"
                  >
                    <HeartFilled className="text-[#AF2322] text-sm" />
                  </button>
                  {/* Location badge */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center max-w-[80%]">
                    <FaPlane className="text-[#AF2322] mr-1 flex-shrink-0 text-xs" />
                    <span className="text-xs font-medium truncate">
                      {stay.location}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <Link href={`/public/stays/${stay.id}`} target="_blank">
                    <h3 className="font-bold text-gray-900 text-base truncate hover:text-[#AF2322] transition-colors cursor-pointer">
                      {stay.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-4 mt-2 text-gray-600">
                    <div className="flex items-center gap-1">
                      <FaBed className="text-sm" />
                      <span className="text-xs">{stay.beds}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaBath className="text-sm" />
                      <span className="text-xs">{stay.baths}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaUser className="text-sm" />
                      <span className="text-xs">{stay.guests}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-lg font-bold text-[#AF2322]">
                      ${stay.price}
                    </span>
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      / Night
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

