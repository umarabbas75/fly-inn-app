"use client";

import BookingsListView from "./_components/BookingsListView";
import { useAuth } from "@/providers/AuthProvider";

/**
 * My Bookings Page - Host View (or Admin View)
 * Shows all reservations on properties where the current user is the HOST
 * If user is admin, shows all bookings
 * API: GET /bookings/me/host (or GET /bookings for admin)
 */
export default function BookingsPage() {
  const { user } = useAuth();
  const userRoles = (user as any)?.roles || [];
  const isAdmin = userRoles.includes("admin");

  return (
    <BookingsListView
      viewMode={isAdmin ? "admin" : "host"}
      title={isAdmin ? "All Bookings" : "My Bookings"}
      subtitle={
        isAdmin
          ? "View and manage all reservations across the platform."
          : "Manage reservations for your properties."
      }
      amountLabel={isAdmin ? "Total" : "Earnings"}
    />
  );
}
