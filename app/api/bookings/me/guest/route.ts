import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * GET /api/bookings/me/guest
 * Get all bookings where the authenticated user is the guest
 * Proxies to external API: GET /bookings/me/guest
 *
 * Security:
 * - Authentication required
 *
 * Query Parameters:
 * - status?: string - Filter by booking status (pending_payment, confirmed, cancelled, completed)
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
 *       status: string,
 *       arrival_date: string,
 *       departure_date: string,
 *       guests: number,
 *       nights: number,
 *       grand_total: number,
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
    ? `/bookings/me/guest?${queryString}`
    : `/bookings/me/guest`;
  return proxyToBackend(endpoint, { method: "GET" }, request);
}


