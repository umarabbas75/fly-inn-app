"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Home,
  DollarSign,
  Clock,
  Check,
  X,
  Printer,
  MessageCircle,
  User,
  CreditCard,
  FileText,
  Info,
  AlertCircle,
  AlertTriangle,
  Shield,
  Percent,
  Ban,
  CheckCircle,
} from "lucide-react";
import { Button, Skeleton, Tag, Image, Tabs } from "antd";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useApiGet, useApiMutation } from "@/http-service";
import { useApp } from "@/providers/AppMessageProvider";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  BookingStatus,
  getBookingStatusConfig,
  canCancelBooking,
} from "@/constants/bookings";
import Link from "next/link";

// Extend dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

// Helper function to format time from 24-hour format to 12-hour format
const formatTime = (time: string) => {
  if (!time) return "—";
  // If already in readable format, return as is
  if (time.includes("AM") || time.includes("PM")) return time;

  try {
    // Handle HH:mm:ss or HH:mm format
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  } catch {
    return time;
  }
};

// Cancellation Policy Interface
interface CancellationPolicy {
  id: number;
  type: "short" | "long";
  group_name: string;
  before_check_in: string;
  after_check_in: string;
}

// Refund calculation result
interface RefundCalculation {
  refundPercentage: number;
  refundAmount: number;
  forfeitAmount: number;
  hostPayout: number;
  isBeforeCheckIn: boolean;
  daysUntilCheckIn: number;
  hoursUntilCheckIn: number;
  policyName: string;
  policyDescription: string;
  refundCategory: "full" | "partial" | "none";
}

// Calculate refund based on cancellation policy
const calculateRefund = (
  booking: any,
  policy: CancellationPolicy | null,
  nights: number
): RefundCalculation => {
  // Get property timezone (fallback to Eastern if not provided)
  const propertyTimezone =
    booking.stay?.timezone ||
    booking.listing_snapshot?.timezone ||
    "America/New_York";

  // Current time in PROPERTY'S timezone
  const now = dayjs().tz(propertyTimezone);

  // Combine arrival date + check-in time in property's timezone
  const checkInTime =
    booking.stay?.check_in_after ||
    booking.listing_snapshot?.check_in_after ||
    "15:00:00";

  const checkInDateTime = dayjs.tz(
    `${booking.arrival_date} ${checkInTime}`,
    propertyTimezone
  );

  const totalAmount = Number(
    booking.grand_total || booking.pricing?.grand_total || 0
  );

  // Calculate time differences using check-in datetime, not just date
  const isBeforeCheckIn = now.isBefore(checkInDateTime);
  const daysUntilCheckIn = checkInDateTime.diff(now, "day");
  const hoursUntilCheckIn = checkInDateTime.diff(now, "hour", true); // true = decimal

  // Default values
  let refundPercentage = 0;
  let refundCategory: "full" | "partial" | "none" = "none";
  let policyDescription = "No refund available.";
  let policyName = policy?.group_name || "Standard Policy";

  if (!policy) {
    // No policy, default to no refund
    return {
      refundPercentage: 0,
      refundAmount: 0,
      forfeitAmount: totalAmount,
      hostPayout: totalAmount,
      isBeforeCheckIn,
      daysUntilCheckIn,
      hoursUntilCheckIn,
      policyName: "No Policy",
      policyDescription: "No cancellation policy found for this booking.",
      refundCategory: "none",
    };
  }

  // Determine policy based on group name patterns
  const policyGroupLower = (policy.group_name || "").toLowerCase().trim();

  if (isBeforeCheckIn) {
    // BEFORE CHECK-IN policies
    policyDescription = policy.before_check_in || "No refund policy specified.";

    // Parse policy rules based on common patterns
    if (policyGroupLower.includes("easy")) {
      // Easy Short Term: Full refund if 24+ hours before
      if (hoursUntilCheckIn >= 24) {
        refundPercentage = 100;
        refundCategory = "full";
      } else {
        refundPercentage = 0;
        refundCategory = "none";
      }
    } else if (policyGroupLower.includes("flexible short")) {
      // Flexible Short Term: Full refund if 72+ hours before
      if (hoursUntilCheckIn >= 72) {
        refundPercentage = 100;
        refundCategory = "full";
      } else {
        refundPercentage = 0;
        refundCategory = "none";
      }
    } else if (policyGroupLower.includes("reasonable")) {
      // Reasonable Short Term: Full if 7+ days, 50% if 72h-7d, none within 72h
      if (daysUntilCheckIn >= 7) {
        refundPercentage = 100;
        refundCategory = "full";
      } else if (hoursUntilCheckIn >= 72) {
        refundPercentage = 50;
        refundCategory = "partial";
      } else {
        refundPercentage = 0;
        refundCategory = "none";
      }
    } else if (policyGroupLower.includes("strong")) {
      // Strong Short Term: Full if 14+ days, 50% if 7-14d, none within 7d
      if (daysUntilCheckIn >= 14) {
        refundPercentage = 100;
        refundCategory = "full";
      } else if (daysUntilCheckIn >= 7) {
        refundPercentage = 50;
        refundCategory = "partial";
      } else {
        refundPercentage = 0;
        refundCategory = "none";
      }
    } else if (policyGroupLower.includes("strict short")) {
      // Strict Short Term: Full if 28+ days, 50% if 14-28d, none within 14d
      if (daysUntilCheckIn >= 28) {
        refundPercentage = 100;
        refundCategory = "full";
      } else if (daysUntilCheckIn >= 14) {
        refundPercentage = 50;
        refundCategory = "partial";
      } else {
        refundPercentage = 0;
        refundCategory = "none";
      }
    } else if (policyGroupLower.includes("flexible long")) {
      // Flexible Long Term: Full refund if 28+ days before
      if (daysUntilCheckIn >= 28) {
        refundPercentage = 100;
        refundCategory = "full";
      } else {
        // After 28-days-prior: Complex calculation
        refundPercentage = 0;
        refundCategory = "none";
        policyDescription = policy.before_check_in;
      }
    } else if (policyGroupLower.includes("strict long")) {
      // Strict Long Term: Full refund if 28+ days before
      if (daysUntilCheckIn >= 28) {
        refundPercentage = 100;
        refundCategory = "full";
      } else {
        refundPercentage = 0;
        refundCategory = "none";
      }
    } else {
      // Default: Try to parse from policy text
      const policyText = (policy.before_check_in || "").toLowerCase();
      if (policyText.includes("full refund")) {
        if (policyText.includes("28 days") && daysUntilCheckIn >= 28) {
          refundPercentage = 100;
          refundCategory = "full";
        } else if (policyText.includes("14 days") && daysUntilCheckIn >= 14) {
          refundPercentage = 100;
          refundCategory = "full";
        } else if (policyText.includes("7 days") && daysUntilCheckIn >= 7) {
          refundPercentage = 100;
          refundCategory = "full";
        } else if (policyText.includes("72 hours") && hoursUntilCheckIn >= 72) {
          refundPercentage = 100;
          refundCategory = "full";
        } else if (policyText.includes("24 hours") && hoursUntilCheckIn >= 24) {
          refundPercentage = 100;
          refundCategory = "full";
        }
      }
    }
  } else {
    // AFTER CHECK-IN - Calculate based on nights stayed since check-in time
    policyDescription = policy.after_check_in || "No refund policy specified.";

    // Calculate nights stayed since CHECK-IN TIME (not midnight!)
    const nightsStayed = Math.max(0, now.diff(checkInDateTime, "day"));

    // Policy: "Host gets paid for nights stayed + 1 additional + 50% of remaining"
    // Correct interpretation:
    // 1. Start with nights stayed + 1 (mandatory)
    // 2. Calculate remaining after that
    // 3. Host gets 50% of those remaining nights
    const mandatoryNights = nightsStayed + 1;
    const nightsRemaining = Math.max(0, nights - mandatoryNights);
    const fiftyPercentOfRemaining = nightsRemaining * 0.5;
    const nightsPaidToHost = mandatoryNights + fiftyPercentOfRemaining;

    const nightlyRate = totalAmount / nights;
    const hostPayment = Math.min(nightsPaidToHost * nightlyRate, totalAmount);

    refundPercentage = Math.max(
      0,
      ((totalAmount - hostPayment) / totalAmount) * 100
    );
    refundCategory = refundPercentage > 0 ? "partial" : "none";
  }

  const refundAmount = (totalAmount * refundPercentage) / 100;
  const forfeitAmount = totalAmount - refundAmount;

  return {
    refundPercentage,
    refundAmount,
    forfeitAmount,
    hostPayout: forfeitAmount,
    isBeforeCheckIn,
    daysUntilCheckIn,
    hoursUntilCheckIn,
    policyName,
    policyDescription,
    refundCategory,
  };
};

export interface BookingDetailPageProps {
  isAdmin?: boolean;
  isHost?: boolean;
}

export const BookingDetailPage = ({
  isAdmin = false,
  isHost = false,
}: BookingDetailPageProps) => {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  const { message: appMessage } = useApp();

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [confirmCancel, setConfirmCancel] = useState(false);

  // Fetch booking details
  const {
    data: bookingResponse,
    isLoading,
    refetch,
  } = useApiGet({
    endpoint: `/api/bookings/${bookingId}`,
    queryKey: ["booking-detail", bookingId],
  });
  console.log({ bookingResponse });
  const booking = bookingResponse || null;

  // Cancel booking mutation
  const { mutate: cancelBooking, isPending: cancellingBooking } =
    useApiMutation({
      endpoint: `/api/bookings/${bookingId}/cancel`,
      method: "post",
      config: {
        onSuccess: () => {
          appMessage.success("Booking cancelled successfully!");
          setCancelModalVisible(false);
          setCancellationReason("");
          setConfirmCancel(false);
          refetch();
        },
        onError: (err: any) => {
          appMessage.error(
            err?.response?.data?.message || "Failed to cancel booking"
          );
        },
      },
    });

  const handleCancelBooking = () => {
    if (!confirmCancel) {
      appMessage.error("Please confirm you understand the cancellation policy");
      return;
    }
    cancelBooking({ reason: cancellationReason });
  };

  // Accept booking mutation (host only)
  const { mutate: acceptBooking, isPending: acceptingBooking } = useApiMutation(
    {
      endpoint: `/api/bookings/${bookingId}/accept`,
      method: "post",
      config: {
        onSuccess: () => {
          appMessage.success("Booking accepted successfully!");
          refetch();
        },
        onError: (err: any) => {
          appMessage.error(
            err?.response?.data?.message || "Failed to accept booking"
          );
        },
      },
    }
  );

  const handleAcceptBooking = () => {
    acceptBooking({});
  };

  // Decline booking mutation (host only)
  const { mutate: declineBooking, isPending: decliningBooking } =
    useApiMutation({
      endpoint: `/api/bookings/${bookingId}/decline`,
      method: "post",
      config: {
        onSuccess: () => {
          appMessage.success("Booking declined");
          refetch();
        },
        onError: (err: any) => {
          appMessage.error(
            err?.response?.data?.message || "Failed to decline booking"
          );
        },
      },
    });

  const handleDeclineBooking = () => {
    declineBooking({});
  };

  // Check-in mutation (both guest and host)
  const { mutate: checkInBooking, isPending: checkingIn } = useApiMutation({
    endpoint: `/api/bookings/${bookingId}/check-in`,
    method: "post",
    config: {
      onSuccess: () => {
        appMessage.success("Check-in recorded successfully!");
        refetch();
      },
      onError: (err: any) => {
        appMessage.error(
          err?.response?.data?.message || "Failed to record check-in"
        );
      },
    },
  });

  const handleCheckIn = () => {
    checkInBooking({
      checked_by: isHost ? "host" : "guest",
      check_in_method: "web",
    });
  };

  // Complete booking mutation (guest, host, or admin)
  const { mutate: completeBooking, isPending: completingBooking } =
    useApiMutation({
      endpoint: `/api/bookings/${bookingId}/complete`,
      method: "post",
      config: {
        onSuccess: () => {
          appMessage.success("Booking marked as completed successfully!");
          refetch();
        },
        onError: (err: any) => {
          appMessage.error(
            err?.response?.data?.message || "Failed to complete booking"
          );
        },
      },
    });

  const handleCompleteBooking = () => {
    if (
      !confirm(
        "Are you sure you want to mark this booking as completed? This action cannot be undone."
      )
    ) {
      return;
    }
    completeBooking({});
  };

  // Parse listing snapshot
  const parseListingSnapshot = (snapshot: string | any) => {
    if (!snapshot) return null;
    if (typeof snapshot === "string") {
      try {
        return JSON.parse(snapshot);
      } catch {
        return null;
      }
    }
    return snapshot;
  };

  const listingSnapshot = parseListingSnapshot(booking?.listing_snapshot);

  // Get stay info
  const getStayImage = () => {
    if (booking?.stay?.images && booking.stay.images.length > 0) {
      return booking.stay.images[0]?.url || booking.stay.images[0]?.image;
    }
    return listingSnapshot?.primary_image;
  };

  const getStayTitle = () => {
    return (
      booking?.stay?.title ||
      listingSnapshot?.title ||
      `Stay #${booking?.stay_id}`
    );
  };

  const getStayLocation = () => {
    const city = booking?.stay?.city || listingSnapshot?.city;
    const state = booking?.stay?.state || listingSnapshot?.state;
    return [city, state].filter(Boolean).join(", ");
  };

  // Calculate nights
  const calculateNights = () => {
    if (booking?.nights) return booking.nights;
    if (booking?.arrival_date && booking?.departure_date) {
      return dayjs(booking.departure_date).diff(
        dayjs(booking.arrival_date),
        "day"
      );
    }
    return 0;
  };

  const nights = calculateNights();

  // Determine applicable cancellation policy
  const applicablePolicy = useMemo((): CancellationPolicy | null => {
    if (!booking) return null;

    const isLongTerm = nights >= 28;
    const stay = booking.stay || listingSnapshot;
    console.log("my booking", { booking });
    if (isLongTerm) {
      return stay?.cancellation_policy_long || null;
    }
    return stay?.cancellation_policy_short || null;
  }, [booking, listingSnapshot, nights]);

  // Calculate refund
  const refundInfo = useMemo(() => {
    if (!booking) return null;
    return calculateRefund(booking, applicablePolicy, nights);
  }, [booking, applicablePolicy, nights]);

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  const handleOpenCancelModal = () => {
    setCancelModalVisible(true);
    setConfirmCancel(false);
    setCancellationReason("");
  };

  const statusConfig = getBookingStatusConfig(booking?.status);
  const canCancel =
    booking &&
    canCancelBooking(booking.status as BookingStatus) &&
    dayjs(booking.departure_date).isAfter(dayjs()); // Allow cancellation until departure date passes

  // Check if this is a pending booking request that host can accept/decline
  const isPendingBookingRequest =
    isHost &&
    booking.status === BookingStatus.PENDING_PAYMENT &&
    (booking.payment_status === "authorized" ||
      booking.payment_status === "pending");

  // Check if check-in button should be shown
  const canCheckIn = useMemo(() => {
    if (!booking) return false;
    if (booking.status !== BookingStatus.CONFIRMED) return false;
    if (booking.checked_in_at) return false; // Already checked in

    const arrivalDate = dayjs(booking.arrival_date);
    const now = dayjs();
    // Allow check-in 2 hours before arrival date or anytime after
    const twoHoursBefore = arrivalDate.subtract(2, "hour");
    return now.isAfter(twoHoursBefore) || now.isSame(twoHoursBefore);
  }, [booking]);

  // Check if booking is in progress
  const isInProgress = useMemo(() => {
    return booking?.checked_in_at && booking.status === BookingStatus.CONFIRMED;
  }, [booking]);

  // Check if booking can be completed (guest, host, or admin can complete)
  const canCompleteBooking = useMemo(() => {
    if (!booking) return false;
    // Only confirmed bookings can be completed
    if (booking.status !== BookingStatus.CONFIRMED) return false;

    // Check if checkout date and time have passed
    const propertyTimezone =
      booking.stay?.timezone ||
      booking.listing_snapshot?.timezone ||
      "America/New_York";

    const now = dayjs().tz(propertyTimezone);

    // Get checkout time (default to 11:00:00 if not specified)
    const checkOutTime =
      booking.stay?.check_out_before ||
      booking.listing_snapshot?.check_out_before ||
      "11:00:00";

    // Combine departure date + checkout time in property's timezone
    const checkOutDateTime = dayjs.tz(
      `${booking.departure_date} ${checkOutTime}`,
      propertyTimezone
    );

    // Only allow completion if checkout datetime has passed
    return now.isAfter(checkOutDateTime);
  }, [booking]);

  const tabItems = [
    {
      key: "details",
      label: (
        <span className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          Booking Details
        </span>
      ),
      children: (
        <BookingDetailsTab
          booking={booking}
          listingSnapshot={listingSnapshot}
          nights={nights}
          isHost={isHost}
          isAdmin={isAdmin}
        />
      ),
    },
    {
      key: "listing",
      label: (
        <span className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Listing Summary
        </span>
      ),
      children: (
        <ListingSummaryTab
          booking={booking}
          listingSnapshot={listingSnapshot}
        />
      ),
    },
    {
      key: "payment",
      label: (
        <span className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Payment Summary
        </span>
      ),
      children: (
        <PaymentSummaryTab booking={booking} nights={nights} isHost={isHost} />
      ),
    },
    {
      key: "cancellation",
      label: (
        <span className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Cancellation Policy
        </span>
      ),
      children: (
        <CancellationPolicyTab
          booking={booking}
          listingSnapshot={listingSnapshot}
          nights={nights}
          refundInfo={refundInfo}
          applicablePolicy={applicablePolicy}
        />
      ),
    },
  ];

  if (isLoading) {
    return <BookingDetailSkeleton />;
  }

  if (!booking) {
    return (
      <div className="bg-white p-8 text-center">
        <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Booking Not Found
        </h2>
        <p className="text-gray-500 mb-4">
          The booking you&apos;re looking for doesn&apos;t exist or you
          don&apos;t have permission to view it.
        </p>
        <Button type="primary" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-gray-200 print:hidden">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Booking Details
            </h1>
            <p className="text-gray-500 mt-1">
              Reference:{" "}
              <span className="font-mono font-semibold">
                {booking.booking_reference}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              icon={<Printer className="h-4 w-4" />}
              onClick={handlePrint}
            >
              Print
            </Button>
            {(isHost || isAdmin) && (
              <Link href={`/dashboard/chat?bookingId=${booking.id}`}>
                <Button
                  icon={<MessageCircle className="h-4 w-4" />}
                  type="primary"
                  className="bg-[#AF2322]"
                >
                  {isHost ? "Chat with Guest" : "View Chat"}
                </Button>
              </Link>
            )}
            {!isHost && !isAdmin && (
              <Link href={`/dashboard/chat?bookingId=${booking.id}`}>
                <Button
                  icon={<MessageCircle className="h-4 w-4" />}
                  type="primary"
                  className="bg-[#AF2322]"
                >
                  Chat with Host
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Status Banner */}
        <div className="mt-6 flex flex-col md:flex-row gap-6">
          {/* Stay Card */}
          <div className="flex-1 bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div className="flex gap-4">
              {getStayImage() ? (
                <Image
                  src={getStayImage()}
                  alt="Stay"
                  width={100}
                  height={100}
                  className="rounded-xl object-cover"
                />
              ) : (
                <div className="w-[100px] h-[100px] bg-gray-200 rounded-xl flex items-center justify-center">
                  <Home className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">
                  {getStayTitle()}
                </h3>
                {getStayLocation() && (
                  <p className="text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {getStayLocation()}
                  </p>
                )}
                <Link
                  href={`/public/stays/${booking.stay_id}`}
                  target="_blank"
                  className="text-[#AF2322] text-sm font-medium hover:underline mt-2 inline-block"
                >
                  View Listing →
                </Link>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="md:w-72 bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <h4 className="text-sm font-medium text-gray-500 mb-3">
              Booking Status
            </h4>
            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  isInProgress
                    ? "bg-blue-500 text-white"
                    : `${statusConfig.bgColor} ${statusConfig.textColor}`
                }`}
              >
                {isInProgress ? "In Progress" : statusConfig.text}
              </span>
            </div>

            {/* Check-in Status Display */}
            {booking?.checked_in_at && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-900 mb-1">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">Checked In</span>
                </div>
                <p className="text-xs text-blue-700">
                  {dayjs(booking.checked_in_at).format(
                    "MMM D, YYYY [at] h:mm A"
                  )}
                </p>
                {booking.checked_in_by && (
                  <p className="text-xs text-blue-600 mt-1">
                    Checked in by{" "}
                    {booking.checked_in_by === "guest" ? "Guest" : "Host"}
                  </p>
                )}
              </div>
            )}

            {/* Check-in Button */}
            {canCheckIn && !isPendingBookingRequest && (
              <Button
                type="primary"
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 border-0"
                onClick={handleCheckIn}
                loading={checkingIn}
              >
                <Check className="h-4 w-4 mr-2" />
                Check In
              </Button>
            )}

            {isPendingBookingRequest && (
              <div className="mt-4 space-y-2">
                <Button
                  type="primary"
                  className="w-full bg-green-600 hover:bg-green-700 border-0"
                  onClick={handleAcceptBooking}
                  loading={acceptingBooking}
                  disabled={decliningBooking}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Accept Booking
                </Button>
                <Button
                  danger
                  className="w-full"
                  onClick={handleDeclineBooking}
                  loading={decliningBooking}
                  disabled={acceptingBooking}
                >
                  <X className="h-4 w-4 mr-2" />
                  Decline Booking
                </Button>
              </div>
            )}
            {canCancel && !isPendingBookingRequest && (
              <Button
                danger
                className="mt-4 w-full"
                onClick={handleOpenCancelModal}
              >
                Cancel Booking
              </Button>
            )}

            {/* Complete Booking Button */}
            {canCompleteBooking && !isPendingBookingRequest && (
              <Button
                type="primary"
                className="mt-4 w-full bg-green-600 hover:bg-green-700 border-0"
                onClick={handleCompleteBooking}
                loading={completingBooking}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Completed
              </Button>
            )}
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Check-in</span>
            </div>
            <p className="font-semibold text-gray-900">
              {dayjs(booking.arrival_date).format("ddd, MMM D")}
            </p>
            <p className="text-xs text-gray-500">
              {formatTime(
                booking?.stay?.check_in_after ||
                  listingSnapshot?.check_in_after ||
                  "15:00:00"
              )}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Check-out</span>
            </div>
            <p className="font-semibold text-gray-900">
              {dayjs(booking.departure_date).format("ddd, MMM D")}
            </p>
            <p className="text-xs text-gray-500">
              {formatTime(
                booking?.stay?.check_out_before ||
                  listingSnapshot?.check_out_before ||
                  "11:00:00"
              )}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Duration</span>
            </div>
            <p className="font-semibold text-gray-900">
              {nights} night{nights > 1 ? "s" : ""}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs">Guests</span>
            </div>
            <p className="font-semibold text-gray-900">
              {booking.guests} adult{booking.guests > 1 ? "s" : ""}
            </p>
            {(booking.children > 0 || booking.pets > 0) && (
              <p className="text-xs text-gray-500">
                {booking.children > 0 && `${booking.children} children`}
                {booking.children > 0 && booking.pets > 0 && ", "}
                {booking.pets > 0 && `${booking.pets} pets`}
              </p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="booking-detail-tabs"
          />
        </div>

        {/* Footer Actions for Print */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-400 print:block hidden">
          <p>Printed on {dayjs().format("MMMM D, YYYY [at] h:mm A")}</p>
          <p>Booking Reference: {booking.booking_reference}</p>
        </div>
      </div>

      {/* Enhanced Cancel Modal */}
      <Dialog
        open={cancelModalVisible}
        onOpenChange={(open) => !open && setCancelModalVisible(false)}
      >
        <DialogContent className="max-w-lg max-h-[85vh] [&>button]:hidden flex flex-col">
          <DialogHeader className="pb-2">
            <DialogTitle className="flex items-center gap-2 text-red-600 text-lg">
              <AlertTriangle className="h-4 w-4" />
              Cancel Booking
            </DialogTitle>
            <DialogDescription className="text-xs">
              Review the cancellation policy before proceeding.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 py-2 space-y-3 pr-2">
            {/* Refund Summary */}
            {refundInfo && (
              <div
                className={`p-3 rounded-lg border ${
                  refundInfo.refundCategory === "full"
                    ? "bg-green-50 border-green-200"
                    : refundInfo.refundCategory === "partial"
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start gap-2">
                  {refundInfo.refundCategory === "full" ? (
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : refundInfo.refundCategory === "partial" ? (
                    <Percent className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Ban className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-semibold text-sm ${
                        refundInfo.refundCategory === "full"
                          ? "text-green-800"
                          : refundInfo.refundCategory === "partial"
                          ? "text-yellow-800"
                          : "text-red-800"
                      }`}
                    >
                      {refundInfo.refundCategory === "full"
                        ? "Full Refund Available"
                        : refundInfo.refundCategory === "partial"
                        ? "Partial Refund Available"
                        : "No Refund Available"}
                    </h4>
                    <p
                      className={`text-xs mt-0.5 ${
                        refundInfo.refundCategory === "full"
                          ? "text-green-700"
                          : refundInfo.refundCategory === "partial"
                          ? "text-yellow-700"
                          : "text-red-700"
                      }`}
                    >
                      {refundInfo.isBeforeCheckIn
                        ? refundInfo.daysUntilCheckIn > 0
                          ? `${refundInfo.daysUntilCheckIn} days until check-in`
                          : `${Math.round(
                              refundInfo.hoursUntilCheckIn
                            )} hours until check-in`
                        : "You have already checked in"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Refund Breakdown */}
            {refundInfo && (
              <div className="p-3 bg-white rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                  Refund Breakdown
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Total Paid</span>
                    <span className="font-medium">
                      $
                      {Number(
                        booking.grand_total || booking.pricing?.grand_total || 0
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Refund</span>
                    <span className="font-medium">
                      {refundInfo.refundPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="border-t pt-1.5 mt-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-green-600 font-medium">
                        You will receive
                      </span>
                      <span className="font-bold text-green-600">
                        ${refundInfo.refundAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs mt-0.5">
                      <span className="text-gray-500">You will forfeit</span>
                      <span className="font-medium text-gray-500">
                        ${refundInfo.forfeitAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reason Input */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Reason for cancellation (optional)
              </label>
              <textarea
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AF2322] focus:border-transparent resize-none"
                rows={2}
                placeholder="Please provide a reason..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
              />
            </div>

            {/* Confirmation Checkbox */}
            <label className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={confirmCancel}
                onChange={(e) => setConfirmCancel(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#AF2322] border-gray-300 rounded focus:ring-[#AF2322] flex-shrink-0"
              />
              <span className="text-xs text-gray-700 leading-relaxed">
                I understand the cancellation policy and acknowledge that{" "}
                {refundInfo?.refundCategory === "full"
                  ? "I will receive a full refund"
                  : refundInfo?.refundCategory === "partial"
                  ? `I will receive a partial refund of $${refundInfo.refundAmount.toFixed(
                      2
                    )}`
                  : "I will not receive any refund"}{" "}
                for this cancellation.
              </span>
            </label>
          </div>

          <DialogFooter className="flex gap-2 pt-2 border-t">
            <Button onClick={() => setCancelModalVisible(false)} size="small">
              Keep Booking
            </Button>
            <Button
              type="primary"
              danger
              onClick={handleCancelBooking}
              loading={cancellingBooking}
              disabled={!confirmCancel}
              size="small"
            >
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Booking Details Tab
const BookingDetailsTab = ({
  booking,
  listingSnapshot,
  nights,
  isHost,
  isAdmin,
}: any) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Guest Info */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-gray-400" />
          {isHost || isAdmin ? "Guest Information" : "Your Information"}
        </h3>
        <div className="flex items-start gap-4">
          {/* Guest Avatar */}
          {booking.guest?.image ? (
            <Image
              src={booking.guest.image}
              alt="Guest"
              width={56}
              height={56}
              className="rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div className="space-y-2 flex-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="font-medium text-gray-900">
                {booking.guest?.display_name ||
                  `${booking.guest?.first_name || ""} ${
                    booking.guest?.last_name || ""
                  }`.trim() ||
                  "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-900">
                {booking.guest?.email || "—"}
              </span>
            </div>
            {booking.guest?.phone && (
              <div className="flex justify-between">
                <span className="text-gray-500">Phone</span>
                <span className="font-medium text-gray-900">
                  {booking.guest.phone}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Host Info */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Home className="h-5 w-5 text-gray-400" />
          Host Information
        </h3>
        <div className="flex items-start gap-4">
          {/* Host Avatar */}
          {booking.host?.image ? (
            <Image
              src={booking.host.image}
              alt="Host"
              width={56}
              height={56}
              className="rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div className="space-y-2 flex-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="font-medium text-gray-900">
                {booking.host?.display_name ||
                  listingSnapshot?.host_name ||
                  "—"}
              </span>
            </div>
            {/* Only show host email and phone to host and admin, not to guest */}
            {
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-900">
                    {booking.host?.email || listingSnapshot?.host_email || "—"}
                  </span>
                </div>
                {(booking.host?.phone || listingSnapshot?.host_phone) && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone</span>
                    <span className="font-medium text-gray-900">
                      {booking.host?.phone || listingSnapshot?.host_phone}
                    </span>
                  </div>
                )}
              </>
            }
          </div>
        </div>
      </div>

      {/* Reservation Summary */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 md:col-span-2">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          Reservation Summary
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Booking ID</span>
              <span className="font-mono font-medium text-gray-900">
                #{booking.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Reference</span>
              <span className="font-mono font-medium text-gray-900">
                {booking.booking_reference}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Arrival Date</span>
              <span className="font-medium text-gray-900">
                {dayjs(booking.arrival_date).format("MMMM D, YYYY")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Departure Date</span>
              <span className="font-medium text-gray-900">
                {dayjs(booking.departure_date).format("MMMM D, YYYY")}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Number of Nights</span>
              <span className="font-medium text-gray-900">{nights}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Adults</span>
              <span className="font-medium text-gray-900">
                {booking.guests}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Children</span>
              <span className="font-medium text-gray-900">
                {booking.children || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pets</span>
              <span className="font-medium text-gray-900">
                {booking.pets || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Booked on</span>
            <span>
              {dayjs(booking.created_at).format("MMM D, YYYY [at] h:mm A")}
            </span>
          </div>
          {booking.confirmed_at && (
            <div className="flex justify-between text-gray-500">
              <span>Confirmed on</span>
              <span>
                {dayjs(booking.confirmed_at).format("MMM D, YYYY [at] h:mm A")}
              </span>
            </div>
          )}
          {booking.checked_in_at && (
            <div className="flex justify-between text-blue-600">
              <span>Checked in on</span>
              <span>
                {dayjs(booking.checked_in_at).format("MMM D, YYYY [at] h:mm A")}
              </span>
            </div>
          )}
          {booking.checked_in_by && (
            <div className="flex justify-between text-blue-600">
              <span>Checked in by</span>
              <span className="capitalize">{booking.checked_in_by}</span>
            </div>
          )}
          {booking.cancelled_at && (
            <div className="flex justify-between text-red-500">
              <span>Cancelled on</span>
              <span>
                {dayjs(booking.cancelled_at).format("MMM D, YYYY [at] h:mm A")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Listing Summary Tab
const ListingSummaryTab = ({ booking, listingSnapshot }: any) => {
  const listing = booking?.stay || listingSnapshot;
  const images = booking?.stay?.images || [];

  return (
    <div className="space-y-6">
      {/* Property Images */}
      {images.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Property Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.slice(0, 4).map((image: any, index: number) => (
              <div key={image.id || index} className="relative aspect-square">
                <Image
                  src={image.url || image.image}
                  alt={image.description || `Property image ${index + 1}`}
                  width={200}
                  height={200}
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
          {images.length > 4 && (
            <p className="text-sm text-gray-500 mt-3 text-center">
              +{images.length - 4} more images
            </p>
          )}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">
          Property Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Title</span>
              <span className="font-medium text-gray-900 text-right">
                {listing?.title || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Address</span>
              <span className="font-medium text-gray-900 text-right max-w-[200px]">
                {listing?.address || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">City</span>
              <span className="font-medium text-gray-900">
                {listing?.city || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">State</span>
              <span className="font-medium text-gray-900">
                {listing?.state || "—"}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Type</span>
              <span className="font-medium text-gray-900 capitalize">
                {listing?.lodging_type || listing?.type_of_space || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Space Type</span>
              <span className="font-medium text-gray-900">
                {listing?.type_of_space || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Bedrooms</span>
              <span className="font-medium text-gray-900">
                {listing?.no_of_bedrooms || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Bathrooms</span>
              <span className="font-medium text-gray-900">
                {listing?.no_of_bathrooms || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Max Guests</span>
              <span className="font-medium text-gray-900">
                {listing?.no_of_guest || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Check-in/out Times */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">
          Check-in & Check-out
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Check-in after</p>
              <p className="font-semibold text-gray-900">
                {formatTime(
                  listing?.check_in_after ||
                    listingSnapshot?.check_in_after ||
                    "15:00:00"
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <X className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Check-out before</p>
              <p className="font-semibold text-gray-900">
                {formatTime(
                  listing?.check_out_before ||
                    listingSnapshot?.check_out_before ||
                    "11:00:00"
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* House Rules */}
      {listing?.rules && (
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">House Rules</h3>
          <div
            className="text-sm text-gray-600 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: listing.rules }}
          />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {listing?.smoking_allowed !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                {listing.smoking_allowed ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span>
                  Smoking {listing.smoking_allowed ? "allowed" : "not allowed"}
                </span>
              </div>
            )}
            {listing?.rules_pet_allowed !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                {listing.rules_pet_allowed ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span>
                  Pets {listing.rules_pet_allowed ? "allowed" : "not allowed"}
                </span>
              </div>
            )}
            {listing?.party_allowed !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                {listing.party_allowed ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span>
                  Parties {listing.party_allowed ? "allowed" : "not allowed"}
                </span>
              </div>
            )}
            {listing?.children_allowed !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                {listing.children_allowed ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span>
                  Children{" "}
                  {listing.children_allowed ? "allowed" : "not allowed"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Payment Summary Tab
const PaymentSummaryTab = ({ booking, nights, isHost }: any) => {
  const pricing = booking?.pricing || {};

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-gray-400" />
          Price Breakdown
        </h3>

        <div className="space-y-3">
          {/* Base Price */}
          <div className="flex justify-between">
            <span className="text-gray-600">
              $
              {Number(
                pricing.avg_nightly_price || pricing.base_avg_nightly_price || 0
              ).toFixed(2)}{" "}
              × {nights} nights
            </span>
            <span className="font-medium">
              $
              {Number(
                pricing.total_price || pricing.base_total_price || 0
              ).toFixed(2)}
            </span>
          </div>

          {/* Extra Guest Fee */}
          {(pricing.extra_guest_fee ?? 0) > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Extra guest fee</span>
              <span className="font-medium">
                ${Number(pricing.extra_guest_fee).toFixed(2)}
              </span>
            </div>
          )}

          {/* Pet Fee */}
          {(pricing.pet_fee ?? 0) > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Pet fee</span>
              <span className="font-medium">
                ${Number(pricing.pet_fee).toFixed(2)}
              </span>
            </div>
          )}

          {/* Cleaning Fee */}
          {(pricing.cleaning_fee ?? 0) > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Cleaning fee</span>
              <span className="font-medium">
                ${Number(pricing.cleaning_fee).toFixed(2)}
              </span>
            </div>
          )}

          {/* City Fee */}
          {(pricing.city_fee ?? 0) > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">City fee</span>
              <span className="font-medium">
                ${Number(pricing.city_fee).toFixed(2)}
              </span>
            </div>
          )}

          {/* Platform Fee (show to guest only) */}
          {!isHost && (pricing.platform_fee ?? 0) > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Service fee</span>
              <span className="font-medium">
                ${Number(pricing.platform_fee).toFixed(2)}
              </span>
            </div>
          )}

          {/* Lodging Tax */}
          {(pricing.lodging_tax ?? 0) > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Taxes</span>
              <span className="font-medium">
                ${Number(pricing.lodging_tax).toFixed(2)}
              </span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-200 pt-3 mt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>{isHost ? "Total Earnings" : "Total Paid"}</span>
              <span className="text-green-600">
                $
                {Number(
                  booking.grand_total || pricing.grand_total || 0
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      {booking.payment_status && (
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Status</h3>
          <div className="flex items-center gap-3">
            {booking.payment_status === "succeeded" ? (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-5 w-5" />
                <span className="font-medium">Payment Successful</span>
              </div>
            ) : (
              <Tag color="orange">{booking.payment_status}</Tag>
            )}
          </div>

          {/* Amount Charged */}
          {booking.amount_charged && (
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-gray-500">Amount Charged</span>
              <span className="font-medium text-gray-900">
                ${Number(booking.amount_charged).toFixed(2)}{" "}
                {booking.currency?.toUpperCase() || "USD"}
              </span>
            </div>
          )}

          {booking.payment_intent_id && (
            <p className="text-xs text-gray-400 mt-2">
              Transaction ID: {booking.payment_intent_id}
            </p>
          )}

          {/* Receipt Link */}
          {booking.receipt_url && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <a
                href={booking.receipt_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#AF2322] hover:text-[#8a1c1b] font-medium text-sm transition-colors"
              >
                <FileText className="h-4 w-4" />
                View Payment Receipt →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Cancellation Policy Tab
const CancellationPolicyTab = ({
  booking,
  listingSnapshot,
  nights,
  refundInfo,
  applicablePolicy,
}: any) => {
  const stay = booking?.stay || listingSnapshot;
  const shortTermPolicy = stay?.cancellation_policy_short;
  const longTermPolicy = stay?.cancellation_policy_long;
  const isLongTerm = nights >= 28;
  const isCancelled = booking?.status === "cancelled" || booking?.cancelled_at;

  return (
    <div className="space-y-6">
      {/* Cancellation Status - Show actual status if cancelled, or preview if not */}
      {isCancelled ? (
        // Already Cancelled - Show Actual Status
        <div className="p-5 rounded-xl border bg-gray-50 border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Ban className="h-6 w-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-800">
                Booking Cancelled
              </h3>
              {booking.cancelled_at && (
                <p className="text-sm text-gray-600 mt-1">
                  Cancelled on{" "}
                  {dayjs(booking.cancelled_at).format(
                    "MMM D, YYYY [at] h:mm A"
                  )}
                </p>
              )}
              {booking.refund_amount !== undefined &&
              booking.refund_amount > 0 ? (
                <p className="text-sm text-green-700 mt-2">
                  Refund processed:{" "}
                  <strong>${Number(booking.refund_amount).toFixed(2)}</strong>
                  {booking.refund_status && (
                    <span className="ml-2 text-xs">
                      ({booking.refund_status})
                    </span>
                  )}
                </p>
              ) : booking.refund_amount === 0 ? (
                <p className="text-sm text-gray-600 mt-2">
                  No refund was issued for this cancellation.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        // Not Cancelled - Show Preview
        refundInfo && (
          <div
            className={`p-5 rounded-xl border ${
              refundInfo.refundCategory === "full"
                ? "bg-green-50 border-green-200"
                : refundInfo.refundCategory === "partial"
                ? "bg-yellow-50 border-yellow-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-start gap-4">
              {refundInfo.refundCategory === "full" ? (
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              ) : refundInfo.refundCategory === "partial" ? (
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Percent className="h-6 w-6 text-yellow-600" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Ban className="h-6 w-6 text-red-600" />
                </div>
              )}
              <div className="flex-1">
                <h3
                  className={`font-semibold text-lg ${
                    refundInfo.refundCategory === "full"
                      ? "text-green-800"
                      : refundInfo.refundCategory === "partial"
                      ? "text-yellow-800"
                      : "text-red-800"
                  }`}
                >
                  {refundInfo.refundCategory === "full"
                    ? "Full Refund Available"
                    : refundInfo.refundCategory === "partial"
                    ? "Partial Refund Available"
                    : "No Refund Available"}
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    refundInfo.refundCategory === "full"
                      ? "text-green-700"
                      : refundInfo.refundCategory === "partial"
                      ? "text-yellow-700"
                      : "text-red-700"
                  }`}
                >
                  If you cancel now, you would receive{" "}
                  <strong>${refundInfo.refundAmount.toFixed(2)}</strong> (
                  {refundInfo.refundPercentage.toFixed(0)}% of total)
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {refundInfo.isBeforeCheckIn
                    ? refundInfo.daysUntilCheckIn > 0
                      ? `${refundInfo.daysUntilCheckIn} days until check-in`
                      : `${Math.round(
                          refundInfo.hoursUntilCheckIn
                        )} hours until check-in`
                    : "Check-in date has passed"}
                </p>
              </div>
            </div>
          </div>
        )
      )}

      {/* Applicable Policy Highlight */}
      {applicablePolicy && (
        <div className="bg-[#AF2322]/5 border border-[#AF2322]/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-[#AF2322]" />
            <h3 className="font-semibold text-gray-900">
              {isCancelled ? "Policy Applied:" : "Applicable Policy:"}{" "}
              {applicablePolicy.group_name}
            </h3>
            <Tag color={isLongTerm ? "purple" : "blue"}>
              {isLongTerm ? "Long-term (28+ nights)" : "Short-term"}
            </Tag>
          </div>
          {isCancelled && (
            <p className="text-sm text-gray-600 mb-3 italic">
              This policy was used to calculate the refund for this cancelled
              booking.
            </p>
          )}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <h4 className="font-medium text-gray-900">Before Check-in</h4>
              </div>
              <p className="text-sm text-gray-600">
                {applicablePolicy.before_check_in}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <h4 className="font-medium text-gray-900">After Check-in</h4>
              </div>
              <p className="text-sm text-gray-600">
                {applicablePolicy.after_check_in}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Notice */}
      {/* <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-blue-800">Important Information</h4>
          <p className="text-sm text-blue-700 mt-1">
            Refund amounts are estimates and may vary based on the exact time of
            cancellation. Service fees may be non-refundable. The host will be
            notified of any cancellation.
          </p>
        </div>
      </div> */}
    </div>
  );
};

// Loading Skeleton
const BookingDetailSkeleton = () => {
  return (
    <div className="bg-white min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Skeleton.Input active style={{ width: 200, marginBottom: 16 }} />
        <Skeleton.Input active style={{ width: 150 }} />

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Skeleton active paragraph={{ rows: 4 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} active paragraph={{ rows: 2 }} />
          ))}
        </div>

        <Skeleton active paragraph={{ rows: 8 }} className="mt-8" />
      </div>
    </div>
  );
};

/**
 * Host Booking Detail Page - Default export for /dashboard/bookings/[id]
 * Shows booking details from the host's perspective
 */
export default function HostBookingDetailPage() {
  return <BookingDetailPage isAdmin={false} isHost={true} />;
}
