"use client";

import { BookingDetailPage } from "@/app/(dashboard)/dashboard/bookings/[id]/page";

/**
 * Trip Detail Page - Guest View
 * Shows booking details from the guest's perspective
 */
export default function TripDetailPage() {
  return <BookingDetailPage isAdmin={false} isHost={false} />;
}

