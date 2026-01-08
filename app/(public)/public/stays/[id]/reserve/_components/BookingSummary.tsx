"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { Calendar, Users, MapPin, Home, Bath, Bed, Info } from "lucide-react";
import dayjs from "dayjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { lodgingType as lodgingTypes } from "@/constants/stays";

// Helper to get lodging type label from value
const getLodgingTypeLabel = (value: string | undefined): string => {
  if (!value) return "";
  const found = lodgingTypes.find(
    (item) => item.value.toLowerCase() === value.toLowerCase()
  );
  return found ? found.label : value;
};

interface BookingParams {
  arrival_date: string;
  departure_date: string;
  guests: number;
  children: number;
  infants: number;
  pets: number;
}

interface BookingSummaryProps {
  stayData: any;
  bookingParams: BookingParams;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  stayData,
  bookingParams,
}) => {
  // Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("ddd, MMM D, YYYY");
  };

  // Format guest label
  const guestLabel = useMemo(() => {
    const parts: string[] = [];
    if (bookingParams.guests > 0) {
      parts.push(
        `${bookingParams.guests} adult${bookingParams.guests > 1 ? "s" : ""}`
      );
    }
    if (bookingParams.children > 0) {
      parts.push(
        `${bookingParams.children} ${
          bookingParams.children > 1 ? "children" : "child"
        }`
      );
    }
    if (bookingParams.infants > 0) {
      parts.push(
        `${bookingParams.infants} infant${bookingParams.infants > 1 ? "s" : ""}`
      );
    }
    if (bookingParams.pets > 0) {
      parts.push(
        `${bookingParams.pets} pet${bookingParams.pets > 1 ? "s" : ""}`
      );
    }
    return parts.length > 0 ? parts.join(", ") : "1 guest";
  }, [bookingParams]);

  // Get pricing data from API response
  const pricing = stayData?.pricing || stayData;
  const nights = pricing?.nights || 1;
  const baseNightlyPrice = stayData?.nightly_price || 0;
  const baseAvgNightlyPrice =
    pricing?.base_avg_nightly_price || baseNightlyPrice;
  const baseTotalPrice =
    pricing?.base_total_price || baseAvgNightlyPrice * nights;
  const extraGuestFee = pricing?.extra_guest_fee || 0;
  const petFee = pricing?.pet_fee || 0;
  const avgNightlyPrice =
    pricing?.avg_nightly_price || stayData?.nightly_price || 0;
  const totalPrice = pricing?.total_price || avgNightlyPrice * nights;
  const cleaningFee = pricing?.cleaning_fee || stayData?.cleaning_fee || 0;
  const cityFee = pricing?.city_fee || stayData?.city_fee || 0;
  const platformFee = pricing?.platform_fee || 0;
  const lodgingTax = pricing?.lodging_tax || 0;
  const grandTotal = pricing?.grand_total || totalPrice;

  // Check if there are additional fees included in avg price
  const hasBreakdown = extraGuestFee > 0 || petFee > 0;

  // Stay details
  const stayTitle = stayData?.title || "Beautiful Stay";
  const stayCity = stayData?.city || "";
  const stayState = stayData?.state || "";
  const stayImage =
    stayData?.images?.[0]?.url ||
    stayData?.images?.[0]?.image ||
    "/placeholder.jpg";
  const stayTypeValue = stayData?.lodging_type || stayData?.stay_type || "";
  const stayType = getLodgingTypeLabel(stayTypeValue) || "Property";
  const stayBedrooms = stayData?.no_of_bedrooms || 0;
  const stayBathrooms = stayData?.no_of_bathrooms || 0;
  const stayBeds = stayData?.no_of_beds || 0;

  // Guest breakdown
  const baseGuestsAllowed = stayData?.no_of_guest || 1;
  const additionalGuestPrice = stayData?.additional_guest_price || 0;
  const totalAdults = bookingParams.guests || 0;
  const baseGuests = Math.min(totalAdults, baseGuestsAllowed);
  const extraGuests = Math.max(0, totalAdults - baseGuestsAllowed);
  const hasExtraGuests = extraGuests > 0;

  return (
    <div className="space-y-6">
      {/* Stay Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Stay Image & Info */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="relative w-28 h-20 flex-shrink-0 rounded-xl overflow-hidden">
              <Image
                src={stayImage}
                alt={stayTitle}
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {stayTitle}
              </h3>
              {(stayCity || stayState) && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {[stayCity, stayState].filter(Boolean).join(", ")}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                {stayType && (
                  <span className="flex items-center gap-1">
                    <Home className="h-3.5 w-3.5 text-gray-400" />
                    {stayType}
                  </span>
                )}
                {stayBedrooms > 0 && (
                  <span className="flex items-center gap-1">
                    <Bed className="h-3.5 w-3.5 text-gray-400" />
                    {stayBedrooms} bed{stayBedrooms > 1 ? "s" : ""}
                  </span>
                )}
                {stayBathrooms > 0 && (
                  <span className="flex items-center gap-1">
                    <Bath className="h-3.5 w-3.5 text-gray-400" />
                    {stayBathrooms} bath
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Trip Details */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Your trip</h2>

          <div className="space-y-3">
            {/* Dates */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-gray-600" />
                </div>
                <span className="font-medium text-gray-900">Dates</span>
              </div>
              <span className="text-gray-600 text-right">
                {formatDate(bookingParams.arrival_date)} –{" "}
                {formatDate(bookingParams.departure_date)}
              </span>
            </div>

            {/* Guests */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-gray-600" />
                </div>
                <span className="font-medium text-gray-900">Guests</span>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex cursor-pointer items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors">
                    <span>{guestLabel}</span>
                    <Info className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="w-64 p-4 bg-white rounded-xl shadow-lg border"
                  align="end"
                  sideOffset={8}
                >
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      Guest breakdown
                    </h4>
                    <div className="space-y-2 text-sm">
                      {/* Base guests */}
                      <div className="flex justify-between text-gray-600">
                        <span>Included guests</span>
                        <span>
                          {baseGuests} {baseGuests === 1 ? "adult" : "adults"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Up to {baseGuestsAllowed} guests included in base price
                      </p>

                      {/* Extra guests */}
                      {hasExtraGuests && (
                        <div className="pt-2 border-t border-gray-100">
                          <div className="flex justify-between text-gray-600">
                            <span>Extra guests</span>
                            <span>
                              {extraGuests}{" "}
                              {extraGuests === 1 ? "adult" : "adults"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">
                            ${Number(additionalGuestPrice).toFixed(2)}/night per
                            extra guest
                          </p>
                        </div>
                      )}

                      {/* Children */}
                      {bookingParams.children > 0 && (
                        <div className="flex justify-between text-gray-600 pt-2 border-t border-gray-100">
                          <span>Children</span>
                          <span>{bookingParams.children}</span>
                        </div>
                      )}

                      {/* Infants */}
                      {bookingParams.infants > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>Infants</span>
                          <span>{bookingParams.infants}</span>
                        </div>
                      )}

                      {/* Pets */}
                      {bookingParams.pets > 0 && (
                        <div className="pt-2 border-t border-gray-100">
                          <div className="flex justify-between text-gray-600">
                            <span>Pets</span>
                            <span>{bookingParams.pets}</span>
                          </div>
                          {stayData?.price_per_pet > 0 && (
                            <p className="text-xs text-gray-400">
                              ${Number(stayData.price_per_pet).toFixed(2)}/night
                              per pet
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Price Breakdown */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Price details</h2>

          <div className="space-y-3 text-sm">
            {/* Nightly price */}
            <div className="flex justify-between text-gray-700">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex cursor-pointer items-center gap-1.5 hover:text-gray-900 transition-colors text-left">
                    <span>
                      ${Number(avgNightlyPrice).toFixed(2)} × {nights} night
                      {nights > 1 ? "s" : ""}
                    </span>
                    <Info className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="w-72 p-4 bg-white rounded-xl shadow-lg border"
                  align="start"
                  sideOffset={8}
                >
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      Price breakdown
                    </h4>
                    <div className="space-y-2 text-sm">
                      {/* Base nightly rate */}
                      <div className="flex justify-between text-gray-600">
                        <span>Base rate × {nights} nights</span>
                        <span>${Number(baseTotalPrice).toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-400">
                        ${Number(baseAvgNightlyPrice).toFixed(2)}/night
                      </p>

                      {/* Extra guest fee */}
                      {extraGuestFee > 0 && (
                        <div className="flex justify-between text-gray-600 pt-1">
                          <span>Extra guest fee</span>
                          <span>${Number(extraGuestFee).toFixed(2)}</span>
                        </div>
                      )}

                      {/* Pet fee */}
                      {petFee > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>Pet fee</span>
                          <span>${Number(petFee).toFixed(2)}</span>
                        </div>
                      )}

                      {/* Total */}
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex justify-between font-medium text-gray-900">
                          <span>Subtotal</span>
                          <span>${Number(totalPrice).toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Avg. ${Number(avgNightlyPrice).toFixed(2)}/night
                        </p>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <span>${Number(totalPrice).toFixed(2)}</span>
            </div>

            {/* Cleaning fee */}
            {cleaningFee > 0 && (
              <div>
                <div className="flex justify-between text-gray-700">
                  <span>Cleaning fee</span>
                  <span>${Number(cleaningFee).toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  One-time fee for professional cleaning
                </p>
              </div>
            )}

            {/* City fee */}
            {cityFee > 0 && (
              <div>
                <div className="flex justify-between text-gray-700">
                  <span>City fee</span>
                  <span>${Number(cityFee).toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Local occupancy tax required by the city
                </p>
              </div>
            )}

            {/* Platform fee */}
            {platformFee > 0 && (
              <div>
                <div className="flex justify-between text-gray-700">
                  <span>Service fee</span>
                  <span>${Number(platformFee).toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Helps us run our platform and offer 24/7 support
                </p>
              </div>
            )}

            {/* Taxes */}
            {lodgingTax > 0 && (
              <div>
                <div className="flex justify-between text-gray-700">
                  <span>Taxes</span>
                  <span>${Number(lodgingTax).toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Lodging and sales tax as required by law
                </p>
              </div>
            )}

            {/* Total */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Total (USD)</span>
                <span>${Number(grandTotal).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
