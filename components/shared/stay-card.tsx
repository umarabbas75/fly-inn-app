"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Button, Rate } from "antd";
import { StarFilled } from "@ant-design/icons";
import {
  FaBed,
  FaBath,
  FaUser,
  FaUsers,
  FaPlane,
  FaExchangeAlt,
  FaHeart,
  FaDog,
} from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/providers/AuthProvider";
import { useCompare } from "@/providers/CompareProvider";
import { useQueryClient } from "@tanstack/react-query";
import { bffMutation } from "@/lib/bff-client";

type Stay = {
  id?: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  beds: number;
  baths: number;
  guests: number;
  title?: string;
  nightly_price?: string;
  images?: Array<{ url: string; image?: string }>;
  city?: string;
  state?: string;
  no_of_bedrooms?: number;
  no_of_bathrooms?: string;
  no_of_guest?: number;
  airports?: any[];
  // Special pricing fields from search
  avg_nightly_price?: number;
  total_price?: number;
  nights?: number;
  // Custom detail URL with search params
  detailUrl?: string;
  [key: string]: any;
};

type Props = {
  stay: Stay;
  index: number;
  isLiked?: boolean;
  isCompared?: boolean;
  onToggleLike?: (index: number) => void;
  onToggleCompare?: (index: number) => void;
};

const StayCard = ({
  stay,
  index,
  isLiked,
  isCompared,
  onToggleLike,
  onToggleCompare,
}: Props) => {
  const { user, isAuthenticated, refetch } = useAuth();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const queryClient = useQueryClient();
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  console.log({ user });
  // Extract favorite stay IDs from user data
  const favoriteIds = useMemo(() => {
    if (!user) return [];
    const favorites = user.favorite_stay_ids || [];
    return Array.isArray(favorites)
      ? favorites.map((fav: any) =>
          typeof fav === "number" ? fav : fav?.stay_id || fav?.id
        )
      : [];
  }, [user]);

  // Check if this stay is favorited
  const isFavorited =
    stay.id !== undefined ? favoriteIds.includes(stay.id) : false;

  // Check if this stay is in compare list
  const isComparedInContext =
    stay.id !== undefined ? isInCompare(stay.id) : false;

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !stay.id || isTogglingFavorite) {
      return;
    }

    setIsTogglingFavorite(true);
    try {
      if (isFavorited) {
        // Remove from favorites
        await bffMutation(`/api/favorites/stays/${stay.id}`, {
          method: "DELETE",
        });
      } else {
        // Add to favorites
        await bffMutation(`/api/favorites/stays/${stay.id}`, {
          method: "POST",
        });
      }

      // Refetch current-user to get updated favorite IDs
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      refetch();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleToggleCompare = () => {
    if (!stay.id) return;

    if (isComparedInContext) {
      removeFromCompare(stay.id);
    } else {
      addToCompare(stay as any);
    }
  };

  return (
    <TooltipProvider>
      <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
        <div className="relative aspect-[4/3]">
          <Image
            src={stay.image}
            alt={stay.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
          />
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            {/* Only show heart icon if user is logged in */}
            {isAuthenticated && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleToggleFavorite}
                    disabled={isTogglingFavorite}
                    className={`w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center border border-gray-200/50 hover:scale-110 active:scale-95 ${
                      isFavorited
                        ? "bg-[#AF2322]/10 border-[#AF2322]/30"
                        : "hover:bg-gray-50"
                    } ${
                      isTogglingFavorite ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    aria-label={
                      isFavorited ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    <FaHeart
                      className={`text-sm transition-colors ${
                        isFavorited
                          ? "text-[#AF2322] fill-[#AF2322]"
                          : "text-gray-700"
                      }`}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-gradient-to-b from-gray-900 to-black text-white text-[10px] px-2.5 py-1.5 border-0 shadow-xl backdrop-blur-sm">
                  <p className="text-white font-medium">
                    {isFavorited ? "Remove from favorites" : "Add to favorites"}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleToggleCompare}
                  className={`w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center border border-gray-200/50 hover:scale-110 active:scale-95 ${
                    isComparedInContext
                      ? "bg-[#AF2322]/10 border-[#AF2322]/30"
                      : "hover:bg-gray-50"
                  }`}
                  aria-label={
                    isComparedInContext
                      ? "Remove from compare"
                      : "Add to compare"
                  }
                >
                  <FaExchangeAlt
                    className={`text-sm ${
                      isComparedInContext ? "text-[#AF2322]" : "text-gray-700"
                    }`}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="bg-gradient-to-b from-gray-900 to-black text-white text-[10px] px-2.5 py-1.5 border-0 shadow-xl backdrop-blur-sm"
              >
                <p className="text-white font-medium">
                  {isComparedInContext
                    ? "Remove from compare"
                    : "Add to compare"}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center max-w-[80%]">
            <FaPlane className="text-[#AF2322] mr-1 flex-shrink-0" />
            <span className="text-xs font-medium truncate">
              {stay.location}
            </span>
          </div>
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <Tooltip>
            <TooltipTrigger asChild>
              <h3 className="font-bold text-gray-900 text-base truncate cursor-default">
                {stay.name}
              </h3>
            </TooltipTrigger>
            <TooltipContent className="bg-gradient-to-b from-gray-900 to-black text-white text-[10px] px-2.5 py-1.5 border-0 shadow-xl backdrop-blur-sm">
              <p className="text-white font-medium">{stay.name}</p>
            </TooltipContent>
          </Tooltip>

          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <Rate
                disabled
                defaultValue={stay.rating}
                allowHalf
                className="text-xs [&>li]:!mr-0.5"
                character={<StarFilled className="text-[#AF2322]" />}
              />
              <span className="text-xs text-gray-600 ml-1">{stay.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-gray-600 cursor-default">
                  <FaBed className="text-sm" />
                  <span className="text-xs">{stay.beds}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-gradient-to-b from-gray-900 to-black text-white text-[10px] px-2.5 py-1.5 border-0 shadow-xl backdrop-blur-sm">
                <p className="text-white font-medium">{stay.beds} bedrooms</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-gray-600 cursor-default">
                  <FaBath className="text-sm" />
                  <span className="text-xs">{stay.baths}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-gradient-to-b from-gray-900 to-black text-white text-[10px] px-2.5 py-1.5 border-0 shadow-xl backdrop-blur-sm">
                <p className="text-white font-medium">{stay.baths} bathrooms</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-gray-600 cursor-default">
                  <FaUser className="text-sm" />
                  <span className="text-xs">{stay.guests}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-gradient-to-b from-gray-900 to-black text-white text-[10px] px-2.5 py-1.5 border-0 shadow-xl backdrop-blur-sm">
                <p className="text-white font-medium">{stay.guests} guests</p>
              </TooltipContent>
            </Tooltip>

            {(() => {
              const additionalGuests =
                stay.additional_guests || stay.no_of_additional_guest || 0;
              return additionalGuests > 0 ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-gray-600 cursor-default">
                      <FaUsers className="text-sm" />
                      <span className="text-xs">{additionalGuests}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gradient-to-b from-gray-900 to-black text-white text-[10px] px-2.5 py-1.5 border-0 shadow-xl backdrop-blur-sm">
                    <p className="text-white font-medium">
                      {additionalGuests} additional guests
                    </p>
                  </TooltipContent>
                </Tooltip>
              ) : null;
            })()}

            {(() => {
              const petsCount =
                stay.no_of_pets || stay.max_pets || stay.pets || 0;
              return petsCount > 0 ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-gray-600 cursor-default">
                      <FaDog className="text-sm" />
                      <span className="text-xs">{petsCount}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gradient-to-b from-gray-900 to-black text-white text-[10px] px-2.5 py-1.5 border-0 shadow-xl backdrop-blur-sm">
                    <p className="text-white font-medium">
                      {petsCount} {petsCount === 1 ? "pet" : "pets"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ) : null;
            })()}
          </div>

          <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-lg font-bold text-[#AF2322]">
                ${stay.price}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  /night
                </span>
              </p>
              {stay.total_price && stay.nights && (
                <p className="text-xs text-gray-500">
                  ${stay.total_price} total · {stay.nights} night
                  {stay.nights > 1 ? "s" : ""}
                </p>
              )}
            </div>

            <a
              href={stay.detailUrl || `/public/stays/${stay.id || index}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="small"
                className="text-xs font-medium border-gray-300"
              >
                View Details
              </Button>
            </a>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default StayCard;
