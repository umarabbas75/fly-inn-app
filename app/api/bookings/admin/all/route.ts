import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * GET /api/bookings/admin/all
 * Get all bookings (admin only)
 * Proxies to external API: GET /bookings/admin/all
 *
 * Security:
 * - Authentication required
 * - Admin role required (checked by backend)
 *
 * Query Parameters:
 * - page: number (default: 1)
 * - per_page: number (default: 10, max: 100)
 * - status: booking status filter (pending_payment, confirmed, cancelled, completed, refunded)
 * - payment_status: payment status filter (pending, succeeded, failed, requires_action, refunded)
 * - guest_id: filter by guest ID
 * - host_id: filter by host ID
 * - stay_id: filter by stay/property ID
 * - search: search term
 *
 * Expected Response:
 * {
 *   status: true,
 *   message: "X booking(s) found",
 *   data: {
 *     bookings: [...],
 *     pagination: {
 *       current_page: number,
 *       per_page: number,
 *       total: number,
 *       last_page: number,
 *       next_page_url: number | null
 *     }
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();
  const endpoint = queryString
    ? `/bookings/admin/all?${queryString}`
    : `/bookings/admin/all`;
  return proxyToBackend(endpoint, { method: "GET" }, request);
}

