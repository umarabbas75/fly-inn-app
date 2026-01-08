"use client";

import BookingsListView from "@/app/(dashboard)/dashboard/bookings/_components/BookingsListView";

/**
 * Admin Bookings Page
 * Shows ALL bookings across the platform
 * API: GET /bookings
 */
export default function AdminBookingsPage() {
  return (
    <BookingsListView
      viewMode="admin"
      title="All Bookings"
      subtitle="Manage all bookings across the platform."
      amountLabel="Total"
    />
  );
}
