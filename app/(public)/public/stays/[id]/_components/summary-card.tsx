import React from "react";
import {
  FaUsers,
  FaBed,
  FaBath,
  FaUserCircle,
  FaUserPlus,
  FaDog,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { lodgingType as lodgingTypes } from "@/constants/stays";

// Helper to get lodging type label from value
const getLodgingTypeLabel = (value: string | undefined): string => {
  if (!value) return "";
  const found = lodgingTypes.find(
    (item) => item.value.toLowerCase() === value.toLowerCase()
  );
  return found ? found.label : value;
};

interface SummaryCardProps {
  mockListing?: {
    type_of_space?: string;
    lodging_type?: string;
    no_of_guest?: number;
    no_of_beds?: number;
    no_of_bedrooms?: number;
    no_of_bathrooms?: string | number;
    no_of_additional_guest?: number | null;
    additional_guests?: number;
    pet_allowed?: number | boolean;
    no_of_pets?: number | null;
    max_pets?: number | null;
    city?: string;
    state?: string;
    country?: string;
    host?: {
      id?: number | string;
      display_name?: string;
      first_name?: string;
      last_name?: string;
      profile_picture?: string;
      avatar?: string;
      image?: string;
    };
  };
}

// Helper to format the space type display
const formatSpaceTypeDisplay = (
  spaceType: string | undefined,
  lodgingType: string
): { prefix: string; separator: string } => {
  if (!spaceType) return { prefix: "", separator: " " };

  const normalizedSpace = spaceType.toLowerCase();

  if (normalizedSpace === "entire place") {
    // "Entire {lodgingType} hosted by"
    return { prefix: "Entire", separator: " " };
  } else if (normalizedSpace === "private room") {
    // "Private room - {lodgingType} Hosted by"
    return { prefix: "Private room -", separator: " " };
  } else if (normalizedSpace === "shared room") {
    // "Shared room - {lodgingType} Hosted by"
    return { prefix: "Shared room -", separator: " " };
  }

  // Fallback for any other type
  return { prefix: spaceType, separator: " " };
};

const SummaryCard = ({ mockListing }: SummaryCardProps) => {
  console.log("mockListing", mockListing);
  const spaceType = mockListing?.type_of_space;
  const lodgingType = getLodgingTypeLabel(mockListing?.lodging_type);
  const { prefix, separator } = formatSpaceTypeDisplay(spaceType, lodgingType);

  const hostName = mockListing?.host?.display_name;

  // Build location string
  const locationParts = [
    mockListing?.city,
    mockListing?.state,
    mockListing?.country,
  ].filter(Boolean);
  const locationString =
    locationParts.length > 0 ? locationParts.join(", ") : "";

  const hostId = mockListing?.host?.id;
  const guestCount = mockListing?.no_of_guest || 0;
  const bedCount = mockListing?.no_of_beds || 0;
  const bedroomCount = mockListing?.no_of_bedrooms || 0;
  const bathroomCount = mockListing?.no_of_bathrooms
    ? parseFloat(String(mockListing.no_of_bathrooms)).toFixed(1)
    : "0";
  const additionalGuestsCount =
    mockListing?.additional_guests || mockListing?.no_of_additional_guest || 0;
  const petsCount = mockListing?.no_of_pets || mockListing?.max_pets || 0;

  const hostAvatar = mockListing?.host?.image;
  const HostLink = hostId && hostName ? Link : ("div" as any);
  const hostLinkProps =
    hostId && hostName
      ? {
          href: `/public/fly-inn-family-member/${encodeURIComponent(
            hostName
          )}?id=${hostId}`,
        }
      : {};

  return (
    <div className="py-4 md:py-6 border-b border-gray-200">
      {/* Mobile: Header with Avatar */}
      <div className="flex items-center justify-between mb-4 md:mb-0 md:hidden">
        <h2 className="flex-1 min-w-0 text-base font-medium text-gray-700 leading-snug">
          {prefix}
          {separator}
          {lodgingType} Hosted by{" "}
          <HostLink
            {...hostLinkProps}
            className="font-semibold text-gray-800 hover:underline transition-colors cursor-pointer"
          >
            {hostName}
          </HostLink>
          {locationString && (
            <span className="text-gray-500 font-normal">
              {" "}
              in {locationString}
            </span>
          )}
        </h2>
        <HostLink {...hostLinkProps} className="block cursor-pointer ml-3">
          {hostAvatar ? (
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 hover:ring-2 hover:ring-gray-300 transition-all">
              <Image
                src={hostAvatar || "/placeholder-avatar.png"}
                alt={hostName || "Host"}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 hover:ring-2 hover:ring-gray-300 transition-all">
              <FaUserCircle className="text-gray-400 text-lg" />
            </div>
          )}
        </HostLink>
      </div>

      {/* Desktop: Header */}
      <div className="hidden md:flex md:items-center md:justify-between md:mb-4">
        <h2 className="text-xl font-medium text-gray-800">
          {prefix}
          {separator}
          {lodgingType} Hosted by{" "}
          <HostLink
            {...hostLinkProps}
            className="font-semibold hover:underline transition-colors cursor-pointer"
          >
            {hostName}
          </HostLink>
          {locationString && (
            <span className="text-gray-500 font-normal">
              {" "}
              in {locationString}
            </span>
          )}
        </h2>

        <HostLink {...hostLinkProps} className="block cursor-pointer">
          {hostAvatar ? (
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 hover:ring-2 hover:ring-gray-300 transition-all">
              <Image
                src={hostAvatar || "/placeholder-avatar.png"}
                alt={hostName || "Host"}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 hover:ring-2 hover:ring-gray-300 transition-all">
              <FaUserCircle className="text-gray-400 text-xl" />
            </div>
          )}
        </HostLink>
      </div>

      {/* Details Section */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FaUsers className="text-gray-400 text-sm flex-shrink-0" />
          <span className="whitespace-nowrap">
            {guestCount} {guestCount === 1 ? "guest" : "guests"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FaBed className="text-gray-400 text-sm flex-shrink-0" />
          <span className="whitespace-nowrap">
            {bedroomCount} {bedroomCount === 1 ? "bedroom" : "bedrooms"}
          </span>
          <span className="text-gray-400">·</span>
          <span className="whitespace-nowrap">
            {bedCount} {bedCount === 1 ? "bed" : "beds"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FaBath className="text-gray-400 text-sm flex-shrink-0" />
          <span className="whitespace-nowrap">
            {bathroomCount} {parseFloat(bathroomCount) === 1 ? "bath" : "baths"}
          </span>
        </div>

        {additionalGuestsCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaUserPlus className="text-gray-400 text-sm flex-shrink-0" />
            <span className="whitespace-nowrap">
              {additionalGuestsCount}{" "}
              {additionalGuestsCount === 1
                ? "additional guest"
                : "additional guests"}
            </span>
          </div>
        )}

        {mockListing?.pet_allowed && petsCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaDog className="text-gray-400 text-sm flex-shrink-0" />
            <span className="whitespace-nowrap">
              {petsCount} {petsCount === 1 ? "pet" : "pets"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
