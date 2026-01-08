import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * GET /api/bookings/me/host
 * Get all bookings where the authenticated user is the host
 * Proxies to external API: GET /bookings/me/host
 *
 * Security:
 * - Authentication required
 * - User must be a host with listings
 *
 * Query Parameters:
 * - status?: string - Filter by booking status (pending_payment, confirmed, cancelled, completed)
 * - stay_id?: number - Filter by specific listing/stay
 * - page?: number - Page number for pagination
 * - limit?: number - Number of items per page
 *
 * Expected Response:
 * {
 *   status: true,
 *   message: "Bookings retrieved successfully",
 *   data: [
 *     {
 *       id: number,
 *       booking_reference: string,
 *       stay_id: number,
 *       guest_id: number,
 *       status: string,
 *       arrival_date: string,
 *       departure_date: string,
 *       guests: number,
 *       nights: number,
 *       grand_total: number,
 *       guest: { ... },
 *       stay: { ... },
 *       created_at: string
 *     }
 *   ],
 *   meta?: {
 *     total: number,
 *     page: number,
 *     limit: number,
 *     totalPages: number
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();
  const endpoint = queryString
    ? `/bookings/me/host?${queryString}`
    : `/bookings/me/host`;
  return proxyToBackend(endpoint, { method: "GET" }, request);
}


