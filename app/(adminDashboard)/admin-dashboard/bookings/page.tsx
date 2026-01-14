"use client";

import BookingsListView from "@/app/(dashboard)/dashboard/bookings/_components/BookingsListView";

/**
 * Admin Bookings Page
 * Shows ALL bookings across the platform with advanced filtering
 * API: GET /bookings/admin/all
 *
 * Features:
 * - View all bookings across the platform
 * - Filter by booking status, payment status
 * - Filter by guest ID, host ID, stay ID
 * - Search by reference, guest, host, stay
 * - Pagination support
 */
export default function AdminBookingsPage() {
  return (
    <BookingsListView
      viewMode="admin"
      title="All Bookings"
      subtitle="Manage all bookings across the platform"
      amountLabel="Total"
    />
  );
}
