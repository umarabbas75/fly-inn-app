"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FaChevronDown, FaMinus, FaPlus, FaLock } from "react-icons/fa";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import dayjs from "dayjs";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "antd";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/providers/AuthProvider";

interface BookingCardProps {
  mockListing: any;
  isFetching?: boolean;
}

const BookingCard = ({ mockListing, isFetching }: BookingCardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  // Get current user from global auth context
  const { isAuthenticated, user } = useAuth();

  // Initialize guest counts from URL params
  const [guestCounts, setGuestCounts] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
  });

  // Initialize date range from URL params
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [guestPickerOpen, setGuestPickerOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Helper to parse date string as local date (not UTC)
  const parseLocalDate = (dateStr: string): Date => {
    // Parse with dayjs and convert to local date
    // This ensures "2024-01-14" is treated as local midnight, not UTC midnight
    const parsed = dayjs(dateStr);
    return new Date(parsed.year(), parsed.month(), parsed.date());
  };

  // Pre-populate from URL params on mount
  useEffect(() => {
    if (searchParams) {
      // Pre-populate dates
      const arrivalDate = searchParams.get("arrival_date");
      const departureDate = searchParams.get("departure_date");

      if (arrivalDate && departureDate) {
        setDateRange({
          from: parseLocalDate(arrivalDate),
          to: parseLocalDate(departureDate),
        });
      }

      // Pre-populate guests
      const guests = searchParams.get("guests");
      const children = searchParams.get("children");
      const infants = searchParams.get("infants");
      const pets = searchParams.get("pets");

      setGuestCounts({
        adults: guests ? parseInt(guests) : 0,
        children: children ? parseInt(children) : 0,
        infants: infants ? parseInt(infants) : 0,
        pets: pets ? parseInt(pets) : 0,
      });
    }
  }, [searchParams]);

  // Update URL when dates or guests change to trigger refetch in parent
  const updateUrlParams = useCallback(
    (newDateRange?: DateRange, newGuestCounts?: typeof guestCounts) => {
      const dates = newDateRange || dateRange;
      const guests = newGuestCounts || guestCounts;

      if (!dates?.from || !dates?.to) return;

      const params = new URLSearchParams();
      params.set("arrival_date", dayjs(dates.from).format("YYYY-MM-DD"));
      params.set("departure_date", dayjs(dates.to).format("YYYY-MM-DD"));

      if (guests.adults > 0) params.set("guests", guests.adults.toString());

      if (guests.pets > 0) params.set("pets", guests.pets.toString());

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [dateRange, guestCounts, pathname, router]
  );

  // Define guest types with dynamic limits based on mockListing
  const guestTypesConfig = useMemo(
    () => [
      {
        key: "adults",
        label: "Adults",
        description: "Ages 13 or above",
        maxAllowed:
          (mockListing?.no_of_guest || 2) +
          (mockListing?.additional_guest
            ? mockListing?.no_of_additional_guest || 0
            : 0),
        additionalInfo: "Base guests",
      },
      // {
      //   key: "children",
      //   label: "Children",
      //   description: "Ages 2 – 12",
      //   maxAllowed: mockListing?.children_allowed
      //     ? mockListing?.max_children || 5
      //     : 0,
      //   additionalInfo: mockListing?.children_allowed
      //     ? "Children allowed"
      //     : "Children not allowed",
      // },
      // {
      //   key: "infants",
      //   label: "Infants",
      //   description: "Under 2",
      //   maxAllowed: mockListing?.children_allowed
      //     ? mockListing?.max_infants || 3
      //     : 0,
      //   additionalInfo: mockListing?.children_allowed
      //     ? "Infants allowed"
      //     : "Infants not allowed",
      // },
      {
        key: "pets",
        label: "Pets",
        description: "",
        maxAllowed:
          mockListing?.pet_allowed || mockListing?.rules_pet_allowed
            ? mockListing?.no_of_pets || mockListing?.max_pets || 2
            : 0,
        additionalInfo:
          mockListing?.pet_allowed || mockListing?.rules_pet_allowed
            ? "Pets allowed"
            : "Pets not allowed",
      },
    ],
    [mockListing]
  );

  const updateCount = (type: string, delta: number) => {
    const newCounts = {
      ...guestCounts,
      [type]: Math.max(
        0,
        guestCounts[type as keyof typeof guestCounts] + delta
      ),
    };
    setGuestCounts(newCounts);
    // Update URL in real-time to trigger refetch
    if (dateRange?.from && dateRange?.to) {
      updateUrlParams(dateRange, newCounts);
    }
  };

  // Get pricing data from mockListing (comes from parent API call)
  const pricingData = useMemo(() => {
    // Check if we have pricing fields from the API response
    if (mockListing?.avg_nightly_price || mockListing?.total_price) {
      return {
        base_avg_nightly_price: mockListing.base_avg_nightly_price,
        base_total_price: mockListing.base_total_price,
        avg_nightly_price: mockListing.avg_nightly_price,
        total_price: mockListing.total_price,
        nights: mockListing.nights,
        extra_guest_fee: mockListing.extra_guest_fee || 0,
        pet_fee: mockListing.pet_fee || 0,
        cleaning_fee: mockListing.cleaning_fee || 0,
        city_fee: mockListing.city_fee || 0,
        platform_fee: mockListing.platform_fee || 0,
        lodging_tax: mockListing.lodging_tax || 0,
        grand_total: mockListing.grand_total,
      };
    }
    return null;
  }, [mockListing]);

  // Get display price
  const displayPrice = useMemo(() => {
    if (pricingData?.avg_nightly_price) {
      return pricingData.avg_nightly_price;
    }
    return parseFloat(mockListing?.nightly_price) || 0;
  }, [pricingData, mockListing]);

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day

  // Get blocked dates from mockListing
  const blockedDates = useMemo(() => {
    if (
      !mockListing?.blocked_dates ||
      !Array.isArray(mockListing.blocked_dates)
    ) {
      return [];
    }

    const blockedDatesArray: Date[] = [];
    const blockedDatesData = mockListing.blocked_dates;

    // Check if it's an array of range objects
    if (
      blockedDatesData.length > 0 &&
      typeof blockedDatesData[0] === "object" &&
      "start_date" in blockedDatesData[0]
    ) {
      // It's an array of BlockedDateRange objects
      blockedDatesData.forEach((range: any) => {
        // Parse as local dates to avoid timezone issues
        const startParsed = dayjs(range.start_date);
        const endParsed = dayjs(range.end_date);
        const startDate = new Date(
          startParsed.year(),
          startParsed.month(),
          startParsed.date()
        );
        const endDate = new Date(
          endParsed.year(),
          endParsed.month(),
          endParsed.date()
        );

        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          blockedDatesArray.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });
    } else if (typeof blockedDatesData[0] === "string") {
      // It's an array of date strings - parse as local dates
      blockedDatesData.forEach((dateStr: string) => {
        const parsed = dayjs(dateStr);
        const date = new Date(parsed.year(), parsed.month(), parsed.date());
        blockedDatesArray.push(date);
      });
    }

    return blockedDatesArray;
  }, [mockListing?.blocked_dates]);

  // Create disabled dates function for DayPicker
  const isDateDisabled = useCallback(
    (date: Date) => {
      const dateNormalized = new Date(date);
      dateNormalized.setHours(0, 0, 0, 0);

      // Disable dates before today
      if (dateNormalized < today) {
        return true;
      }

      // Disable blocked dates
      const dateStr = dayjs(date).format("YYYY-MM-DD");
      return blockedDates.some((blockedDate) => {
        return dayjs(blockedDate).format("YYYY-MM-DD") === dateStr;
      });
    },
    [blockedDates, today]
  );

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);

    // If both dates are selected, validate and show error if needed
    if (range?.from && range?.to) {
      const minDays = mockListing?.min_day_booking || 1;
      const maxDays = mockListing?.max_day_booking || null;
      const selectedNights = dayjs(range.to).diff(dayjs(range.from), "day");

      // Validate minimum stay
      if (selectedNights < minDays) {
        setErrorMessage(
          `Minimum stay is ${minDays} ${
            minDays === 1 ? "night" : "nights"
          }. Please select at least ${minDays} ${
            minDays === 1 ? "night" : "nights"
          }.`
        );
      }
      // Validate maximum stay
      else if (maxDays && selectedNights > maxDays) {
        setErrorMessage(
          `Maximum stay is ${maxDays} ${
            maxDays === 1 ? "night" : "nights"
          }. Please select no more than ${maxDays} ${
            maxDays === 1 ? "night" : "nights"
          }.`
        );
      }
      // Valid selection
      else {
        setErrorMessage(null);
        setDatePickerOpen(false);
        // Update URL to trigger refetch with new dates
        updateUrlParams(range, guestCounts);
      }
    } else {
      // Just updating the from date, clear error
      setErrorMessage(null);
    }
  };

  const handleReserve = () => {
    setErrorMessage(null);

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    // Check profile completeness
    const profileCompleteness = user?.profile_completeness ?? 0;
    if (profileCompleteness < 100) {
      setShowProfileModal(true);
      return;
    }

    // Check profile status
    const profileStatus = user?.profile_status;
    if (profileStatus === "in-review") {
      setShowProfileModal(true);
      return;
    }

    if (!dateRange?.from || !dateRange?.to) {
      setErrorMessage("Please select check-in and check-out dates");
      return;
    }

    if (guestCounts.adults === 0) {
      setErrorMessage("Please select at least one adult");
      return;
    }

    // Build query parameters for the reserve page
    const queryParams = new URLSearchParams({
      stay_id: mockListing.id?.toString() || "",
      arrival_date: dayjs(dateRange.from).format("YYYY-MM-DD"),
      departure_date: dayjs(dateRange.to).format("YYYY-MM-DD"),
      guests: guestCounts.adults.toString(),
      children: guestCounts.children.toString(),
      infants: guestCounts.infants.toString(),
      pets: guestCounts.pets.toString(),
    });

    window.open(
      `/public/stays/${mockListing.id}/reserve?${queryParams.toString()}`,
      "_blank"
    );
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    // Build return URL with current booking parameters
    const returnParams = new URLSearchParams();
    if (dateRange?.from && dateRange?.to) {
      returnParams.set(
        "arrival_date",
        dayjs(dateRange.from).format("YYYY-MM-DD")
      );
      returnParams.set(
        "departure_date",
        dayjs(dateRange.to).format("YYYY-MM-DD")
      );
    }
    if (guestCounts.adults > 0)
      returnParams.set("guests", guestCounts.adults.toString());
    if (guestCounts.children > 0)
      returnParams.set("children", guestCounts.children.toString());
    if (guestCounts.infants > 0)
      returnParams.set("infants", guestCounts.infants.toString());
    if (guestCounts.pets > 0)
      returnParams.set("pets", guestCounts.pets.toString());

    const returnUrl = `${pathname}${
      returnParams.toString() ? `?${returnParams.toString()}` : ""
    }`;
    router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  const handleSignup = () => {
    setShowLoginModal(false);
    // Build return URL with current booking parameters
    const returnParams = new URLSearchParams();
    if (dateRange?.from && dateRange?.to) {
      returnParams.set(
        "arrival_date",
        dayjs(dateRange.from).format("YYYY-MM-DD")
      );
      returnParams.set(
        "departure_date",
        dayjs(dateRange.to).format("YYYY-MM-DD")
      );
    }
    if (guestCounts.adults > 0)
      returnParams.set("guests", guestCounts.adults.toString());
    if (guestCounts.children > 0)
      returnParams.set("children", guestCounts.children.toString());
    if (guestCounts.infants > 0)
      returnParams.set("infants", guestCounts.infants.toString());
    if (guestCounts.pets > 0)
      returnParams.set("pets", guestCounts.pets.toString());

    const returnUrl = `${pathname}${
      returnParams.toString() ? `?${returnParams.toString()}` : ""
    }`;
    router.push(`/auth/signup?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  // Format guest label
  const guestLabel = useMemo(() => {
    const parts: string[] = [];
    if (guestCounts.adults > 0) {
      parts.push(
        `${guestCounts.adults} adult${guestCounts.adults > 1 ? "s" : ""}`
      );
    }
    if (guestCounts.children > 0) {
      parts.push(
        `${guestCounts.children} ${
          guestCounts.children > 1 ? "children" : "child"
        }`
      );
    }
    if (guestCounts.infants > 0) {
      parts.push(
        `${guestCounts.infants} infant${guestCounts.infants > 1 ? "s" : ""}`
      );
    }
    if (guestCounts.pets > 0) {
      parts.push(`${guestCounts.pets} pet${guestCounts.pets > 1 ? "s" : ""}`);
    }
    return parts.length > 0 ? parts.join(", ") : "Add guests";
  }, [guestCounts]);

  // Format date label
  const dateLabel = useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      return `${dayjs(dateRange.from).format("MMM D")} - ${dayjs(
        dateRange.to
      ).format("MMM D")}`;
    }
    return "Select dates";
  }, [dateRange]);

  return (
    <div className="border border-gray-200 rounded-2xl p-6 mb-6 shadow-xl bg-white sticky top-24 transition-all hover:shadow-2xl">
      {/* Price Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            ${displayPrice.toFixed(2)}{" "}
            <span className="text-lg font-normal text-gray-500">night</span>
          </h2>
          {pricingData?.nights && (
            <p className="text-sm text-gray-500 mt-1">
              {pricingData.nights} night{pricingData.nights > 1 ? "s" : ""}
            </p>
          )}
          {/* {isFetching && (
            <p className="text-xs text-primary mt-1 animate-pulse">
              Updating prices...
            </p>
          )} */}
        </div>
      </div>

      {/* Date Picker */}
      <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center justify-between rounded-t-lg border border-gray-300 px-4 py-3 cursor-pointer hover:border-gray-500 transition-colors">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase">
                  Check-in / Check-out
                </div>
                <div className="font-medium text-gray-900">{dateLabel}</div>
              </div>
            </div>
            <FaChevronDown className="text-gray-500" />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-auto p-0 bg-white rounded-2xl shadow-xl border",
            isMobile && "max-w-[calc(100vw-32px)]"
          )}
          align="start"
          sideOffset={8}
        >
          <div className={cn("p-4", isMobile && "p-3")}>
            <DayPicker
              mode="range"
              selected={dateRange}
              onSelect={handleDateSelect}
              numberOfMonths={isMobile ? 1 : 2}
              disabled={isDateDisabled}
              showOutsideDays={false}
              classNames={{
                today: "border-2 border-primary text-primary font-semibold",
                selected: "!bg-primary !text-white",
                range_start: "!bg-primary !text-white",
                range_end: "!bg-primary !text-white",
                range_middle: "!bg-primary/15 !text-gray-900",
                disabled: "!text-gray-300 !cursor-not-allowed !opacity-50",
              }}
              components={{
                Chevron: ({ orientation }) =>
                  orientation === "left" ? (
                    <ChevronLeft className="h-4 w-4 text-gray-900" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-900" />
                  ),
              }}
            />
          </div>
        </PopoverContent>
      </Popover>

      {/* Guest Picker */}
      <Popover open={guestPickerOpen} onOpenChange={setGuestPickerOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center justify-between rounded-b-lg border border-t-0 border-gray-300 px-4 py-3 mb-4 cursor-pointer hover:border-gray-500 transition-colors">
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase">
                Guests
              </div>
              <div className="font-medium text-gray-900">{guestLabel}</div>
            </div>
            <FaChevronDown className="text-gray-500" />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[340px] bg-white rounded-2xl shadow-xl border-0 p-0"
          align="start"
          sideOffset={8}
        >
          <div className="p-5 space-y-5">
            {guestTypesConfig.map(
              ({ key, label, description, maxAllowed, additionalInfo }) => {
                const currentCount =
                  guestCounts[key as keyof typeof guestCounts];
                const isDisabled = maxAllowed === 0;
                const isAtMax = currentCount >= maxAllowed;

                return (
                  <div key={key} className="flex justify-between items-center">
                    <div>
                      <div className="text-[15px] font-medium text-gray-900">
                        {label}
                      </div>
                      {description && (
                        <div className="text-sm text-gray-500">
                          {description}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        {additionalInfo}
                        {maxAllowed > 0 && (
                          <span className="ml-2 text-primary">
                            Max: {maxAllowed}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateCount(key, -1)}
                        disabled={currentCount === 0 || isDisabled}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                          currentCount === 0 || isDisabled
                            ? "border-gray-200 text-gray-300 cursor-not-allowed"
                            : "border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900 active:scale-95"
                        )}
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="w-6 text-center font-medium text-gray-900">
                        {currentCount}
                      </span>
                      <button
                        onClick={() => updateCount(key, 1)}
                        disabled={isAtMax || isDisabled}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                          isAtMax || isDisabled
                            ? "border-gray-200 text-gray-300 cursor-not-allowed"
                            : "border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900 active:scale-95"
                        )}
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Reserve Button */}
      <button
        onClick={handleReserve}
        className="w-full h-12 border-0 text-lg font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition-all transform  shadow-md hover:shadow-lg active:scale-[0.98]"
      >
        Reserve
      </button>

      <div className="mt-4 text-center text-sm text-gray-600">
        You won&apos;t be charged yet
      </div>

      {/* Price Breakdown */}
      {/* {pricingData && dateRange?.from && dateRange?.to && (
        <>
          <div className="my-4 border-t border-dashed border-gray-200" />

          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>
                $
                {pricingData.base_avg_nightly_price?.toFixed(2) ||
                  displayPrice.toFixed(2)}{" "}
                x {pricingData.nights} night{pricingData.nights > 1 ? "s" : ""}
              </span>
              <span>
                $
                {pricingData.base_total_price?.toFixed(2) ||
                  (displayPrice * pricingData.nights).toFixed(2)}
              </span>
            </div>

            {pricingData.extra_guest_fee > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Extra guest fee</span>
                <span>${pricingData.extra_guest_fee.toFixed(2)}</span>
              </div>
            )}

            {pricingData.pet_fee > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Pet fee</span>
                <span>${pricingData.pet_fee.toFixed(2)}</span>
              </div>
            )}

            {pricingData.cleaning_fee > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Cleaning fee</span>
                <span>${pricingData.cleaning_fee.toFixed(2)}</span>
              </div>
            )}

            {pricingData.city_fee > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>City fee</span>
                <span>${pricingData.city_fee.toFixed(2)}</span>
              </div>
            )}

            {pricingData.platform_fee > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Service fee</span>
                <span>${pricingData.platform_fee.toFixed(2)}</span>
              </div>
            )}

            {pricingData.lodging_tax > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Taxes</span>
                <span>${pricingData.lodging_tax.toFixed(2)}</span>
              </div>
            )}

            <div className="my-2 border-t border-gray-200" />
            <div className="flex justify-between font-bold text-lg text-foreground">
              <span>Total</span>
              <span>
                $
                {pricingData.grand_total?.toFixed(2) ||
                  pricingData.total_price?.toFixed(2)}
              </span>
            </div>
          </div>
        </>
      )} */}

      {/* Login Dialog */}
      <Dialog
        open={showLoginModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowLoginModal(false);
          }
        }}
      >
        <DialogContent className="max-w-[500px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Sign in to book</DialogTitle>
            <DialogDescription>
              <div className="space-y-3 mt-2">
                <p>Create an account or sign in to complete your reservation</p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:flex-row sm:justify-end">
            <Button onClick={() => setShowLoginModal(false)} size="middle">
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleLogin}
              className="bg-[#AF2322] hover:bg-[#9e1f1a] text-sm"
              size="middle"
            >
              Sign in
            </Button>
            <Button
              type="primary"
              onClick={handleSignup}
              className="bg-[#AF2322] hover:bg-[#9e1f1a] text-sm"
              size="middle"
            >
              Create account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Status Dialog */}
      <Dialog
        open={showProfileModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowProfileModal(false);
          }
        }}
      >
        <DialogContent className="max-w-[500px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>
              {(user?.profile_completeness ?? 0) < 100
                ? "Profile Incomplete"
                : "Profile Under Review"}
            </DialogTitle>
            <DialogDescription>
              <div className="space-y-3 mt-2">
                {(user?.profile_completeness ?? 0) < 100 ? (
                  <>
                    <p>
                      Your profile is not complete. You will not be able to book
                      until it is complete. Please complete your profile to
                      100%. Once we have verified your identity, you will
                      receive a message, letting you know you are all set!
                    </p>
                    <p className="text-sm text-gray-600">
                      To complete your profile properly, watch the Registration
                      video on our{" "}
                      <a
                        href="https://www.youtube.com/@Fly-Inn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-semibold hover:text-red-800 text-[#AF2322]"
                      >
                        YouTube Channel
                      </a>
                      .
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Your profile is currently under review. Once we have
                      verified your identity, you will receive a message letting
                      you know you are all set!
                    </p>
                    <p className="text-sm text-gray-600">
                      This process typically takes 1-2 business days. Thank you
                      for your patience.
                    </p>
                  </>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {(user?.profile_completeness ?? 0) < 100 ? (
              <Button
                type="primary"
                onClick={() => {
                  router.push("/dashboard/profile");
                  setShowProfileModal(false);
                }}
                className="bg-[#AF2322] hover:bg-[#9e1f1a] text-sm"
                size="middle"
              >
                Go to Profile
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => {
                  setShowProfileModal(false);
                }}
                className="bg-[#AF2322] hover:bg-[#9e1f1a] text-sm"
                size="middle"
              >
                OK
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingCard;
