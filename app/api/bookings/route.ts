import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * POST /api/bookings
 * Create a new booking
 * Proxies to external API: POST /bookings
 *
 * Security:
 * - Authentication required
 *
 * Expected Payload:
 * {
 *   stay_id: number,
 *   payment_method_id: string,
 *   arrival_date: string (YYYY-MM-DD),
 *   departure_date: string (YYYY-MM-DD),
 *   guests: number,
 *   children: number,
 *   infants: number,
 *   pets: number,
 *   pricing: {
 *     base_avg_nightly_price: number,
 *     base_total_price: number,
 *     extra_guest_fee: number,
 *     pet_fee: number,
 *     avg_nightly_price: number,
 *     total_price: number,
 *     nights: number,
 *     cleaning_fee: number,
 *     city_fee: number,
 *     platform_fee: number,
 *     lodging_tax: number,
 *     grand_total: number
 *   },
 *   listing_snapshot: string (JSON stringified stay details)
 * }
 *
 * Expected Response:
 * {
 *   status: true,
 *   message: "Booking created successfully",
 *   data: {
 *     id: number,
 *     booking_reference: string,
 *     status: "pending_payment" | "confirmed" | "cancelled",
 *     ...
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return proxyToBackend(`/bookings`, { method: "POST", body }, request);
  } catch (error) {
    return Response.json(
      { error: "Invalid request", message: "Invalid JSON body" },
      { status: 400 }
    );
  }
}

/**
 * GET /api/bookings
 * Get all bookings for the authenticated user
 * Proxies to external API: GET /bookings
 *
 * Security:
 * - Authentication required
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();
  const endpoint = queryString ? `/bookings?${queryString}` : `/bookings`;
  return proxyToBackend(endpoint, { method: "GET" }, request);
}

