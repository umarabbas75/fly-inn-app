import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * GET /api/bookings/:id
 * Get a single booking by ID
 * Proxies to external API: GET /bookings/:id
 *
 * Security:
 * - Authentication required
 * - User must own the booking (as guest or host)
 *
 * Query Parameters:
 * - expand: Include related data (e.g., "cancellation_policies,stay")
 *
 * Expected Response:
 * {
 *   status: true,
 *   message: "Booking retrieved successfully",
 *   data: {
 *     id: number,
 *     booking_reference: string,
 *     stay_id: number,
 *     guest_id: number,
 *     status: "pending_payment" | "confirmed" | "cancelled" | "completed",
 *     arrival_date: string,
 *     departure_date: string,
 *     guests: number,
 *     children: number,
 *     infants: number,
 *     pets: number,
 *     nights: number,
 *     grand_total: number,
 *     pricing: object,
 *     listing_snapshot: object,
 *     stay: object (with cancellation_policy_short and cancellation_policy_long if expanded),
 *     created_at: string,
 *     updated_at: string
 *   }
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Get query parameters from the request
  const searchParams = request.nextUrl.searchParams;
  const expand =
    searchParams.get("expand") || "cancellation_policies,stay,guest,host";

  // Build query string
  const queryString = expand ? `?expand=${expand}` : "";

  return proxyToBackend(
    `/bookings/${id}${queryString}`,
    { method: "GET" },
    request
  );
}
