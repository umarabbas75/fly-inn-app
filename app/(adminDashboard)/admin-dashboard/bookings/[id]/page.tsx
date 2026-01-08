"use client";

import { BookingDetailPage } from "@/app/(dashboard)/dashboard/bookings/[id]/page";

/**
 * Admin Booking Detail Page
 * Shows booking details from the admin's perspective with full access
 */
export default function AdminBookingDetailPage() {
  return <BookingDetailPage isAdmin={true} isHost={false} />;
}

