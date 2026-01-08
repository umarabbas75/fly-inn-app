import { NextRequest } from "next/server";
import { proxyToBackendPublic } from "@/lib/bff-proxy";

/**
 * GET /api/stays/public
 * Get public stays with search filters
 * Proxies to external API: GET /stays/public
 *
 * Query Parameters (all optional):
 * - city: Filter by city name
 * - arrival_date: Check-in date (YYYY-MM-DD)
 * - departure_date: Check-out date (YYYY-MM-DD)
 * - guests: Number of adult guests
 * - children: Number of children
 * - infants: Number of infants
 * - pets: Number of pets
 * - stay_type: Type of lodging
 * - min_price: Minimum nightly price
 * - max_price: Maximum nightly price
 *
 * Security:
 * - Public endpoint (no authentication required)
 */
export async function GET(request: NextRequest) {
  // Extract query parameters from the request
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();

  // Build endpoint with query parameters
  const endpoint = queryString
    ? `/stays/public?${queryString}`
    : `/stays/public`;

  return proxyToBackendPublic(endpoint);
}
