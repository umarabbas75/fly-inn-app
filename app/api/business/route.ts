import { NextRequest } from "next/server";
import { proxyToBackend, proxyToBackendPublic } from "@/lib/bff-proxy";

/**
 * POST /api/business
 * Create multiple businesses (one per type)
 * Proxies to external API: POST /business/create-multiple
 *
 * Security:
 * - Authentication required
 * - User must be authorized to create businesses
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return proxyToBackend(
      `/business/create-multiple`,
      { method: "POST", body },
      request
    );
  } catch (error) {
    return Response.json(
      { error: "Invalid request", message: "Invalid JSON body" },
      { status: 400 }
    );
  }
}

/**
 * GET /api/business
 * Get all businesses (public endpoint)
 * Proxies to external API: /business
 *
 * Security:
 * - Public endpoint (no authentication required)
 */
export async function GET(request: NextRequest) {
  // Extract query parameters from the request
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();

  // Build endpoint with query parameters
  const endpoint = queryString ? `/business?${queryString}` : `/business`;

  return proxyToBackendPublic(endpoint, { method: "GET" });
}
