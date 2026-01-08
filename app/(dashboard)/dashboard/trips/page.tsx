"use client";

import BookingsListView from "@/app/(dashboard)/dashboard/bookings/_components/BookingsListView";
import { useAuth } from "@/providers/AuthProvider";

/**
 * My Trips Page - Guest View (or Admin View)
 * Shows all reservations where the current user is the GUEST
 * If user is admin, shows all bookings
 * API: GET /bookings/me/guest (or GET /bookings for admin)
 */
export default function TripsPage() {
  const { user } = useAuth();
  const userRoles = (user as any)?.roles || [];
  const isAdmin = userRoles.includes("admin");

  return (
    <BookingsListView
      viewMode={isAdmin ? "admin" : "guest"}
      title={isAdmin ? "All Trips" : "My Trips"}
      subtitle={
        isAdmin
          ? "View all travel reservations across the platform."
          : "View your upcoming and past travel reservations."
      }
      amountLabel="Total Paid"
    />
  );
}
