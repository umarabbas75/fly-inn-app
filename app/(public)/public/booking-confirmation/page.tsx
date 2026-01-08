"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  Plane,
  Home,
  ArrowRight,
} from "lucide-react";
import dayjs from "dayjs";
import Link from "next/link";

interface BookingDetails {
  booking_reference: string;
  stay_title: string;
  stay_city: string;
  stay_state: string;
  arrival_date: string;
  departure_date: string;
  guests: number;
  children: number;
  pets: number;
  grand_total: number;
}

export default function BookingConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get booking details from URL params or sessionStorage
    const ref = searchParams.get("ref");
    const storedData = sessionStorage.getItem("booking_confirmation");

    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setBookingDetails(parsed);
        // Clear after reading
        sessionStorage.removeItem("booking_confirmation");
      } catch (e) {
        console.error("Failed to parse booking data:", e);
      }
    } else if (ref) {
      // If we only have the reference, show minimal info
      setBookingDetails({
        booking_reference: ref,
        stay_title: searchParams.get("title") || "Your stay",
        stay_city: searchParams.get("city") || "",
        stay_state: searchParams.get("state") || "",
        arrival_date: searchParams.get("arrival") || "",
        departure_date: searchParams.get("departure") || "",
        guests: parseInt(searchParams.get("guests") || "1"),
        children: parseInt(searchParams.get("children") || "0"),
        pets: parseInt(searchParams.get("pets") || "0"),
        grand_total: parseFloat(searchParams.get("total") || "0"),
      });
    }

    setIsLoading(false);
  }, [searchParams]);

  // Redirect if no booking data
  useEffect(() => {
    if (!isLoading && !bookingDetails) {
      router.push("/");
    }
  }, [isLoading, bookingDetails, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!bookingDetails) {
    return null;
  }

  const location = [bookingDetails.stay_city, bookingDetails.stay_state]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20">
        {/* Success Animation */}
        <div className="text-center mb-10">
          <div className="relative inline-block">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-[scale-in_0.5s_ease-out]">
              <CheckCircle2 className="h-12 w-12 sm:h-14 sm:w-14 text-green-600" />
            </div>
            {/* Confetti dots */}
            <div className="absolute -top-2 -left-2 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" />
            <div className="absolute -top-1 -right-3 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
            <div className="absolute -bottom-1 -left-4 w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200" />
            <div className="absolute -bottom-2 right-0 w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-150" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Booking Confirmed! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Your trip to{" "}
            <span className="font-semibold text-gray-900">
              {location || "your destination"}
            </span>{" "}
            is all set
          </p>
        </div>

        {/* Booking Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#AF2322] to-[#8B1C1B] px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">Confirmation Number</span>
              <span className="text-white font-mono font-bold text-lg tracking-wider">
                {bookingDetails.booking_reference}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-5">
            {/* Stay Info */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">
                  {bookingDetails.stay_title}
                </p>
                {location && <p className="text-gray-500">{location}</p>}
              </div>
            </div>

            {/* Dates */}
            {bookingDetails.arrival_date && bookingDetails.departure_date && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {dayjs(bookingDetails.arrival_date).format("ddd, MMM D")} →{" "}
                    {dayjs(bookingDetails.departure_date).format(
                      "ddd, MMM D, YYYY"
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {dayjs(bookingDetails.departure_date).diff(
                      dayjs(bookingDetails.arrival_date),
                      "day"
                    )}{" "}
                    nights
                  </p>
                </div>
              </div>
            )}

            {/* Guests */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {bookingDetails.guests} guest
                  {bookingDetails.guests > 1 ? "s" : ""}
                  {bookingDetails.children > 0 &&
                    `, ${bookingDetails.children} ${
                      bookingDetails.children > 1 ? "children" : "child"
                    }`}
                  {bookingDetails.pets > 0 &&
                    `, ${bookingDetails.pets} pet${
                      bookingDetails.pets > 1 ? "s" : ""
                    }`}
                </p>
              </div>
            </div>

            {/* Total */}
            {bookingDetails.grand_total > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total paid</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${bookingDetails.grand_total.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Email Notice */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
          <p className="text-sm text-blue-800 text-center">
            📧 A confirmation email has been sent to your registered email
            address with all the booking details.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/dashboard/trips"
            className="w-full h-14 rounded-xl bg-[#AF2322] text-white font-semibold hover:bg-[#8B1C1B] transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-200"
          >
            <Plane className="h-5 w-5" />
            View My Trips
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/"
            className="w-full h-14 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-400 mt-8">
          Need help?{" "}
          <Link href="/public/contact" className="text-[#AF2322] hover:underline">
            Contact Support
          </Link>
        </p>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}


