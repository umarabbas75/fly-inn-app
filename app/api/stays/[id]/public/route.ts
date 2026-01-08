import { NextRequest } from "next/server";
import { proxyToBackendPublic } from "@/lib/bff-proxy";

/**
 * GET /api/stays/[id]/public
 * Get public stay details with optional pricing calculation
 * Proxies to external API: GET /stays/{id}/public
 *
 * Query Parameters (all optional):
 * - arrival_date: Check-in date (YYYY-MM-DD)
 * - departure_date: Check-out date (YYYY-MM-DD)
 * - guests: Number of adult guests
 * - children: Number of children
 * - infants: Number of infants
 * - pets: Number of pets
 *
 * Security:
 * - Public endpoint (no authentication required)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Extract query parameters from the request
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();

  // Build endpoint with query parameters
  const endpoint = queryString
    ? `/stays/${id}/public?${queryString}`
    : `/stays/${id}/public`;

  return proxyToBackendPublic(endpoint);
}
