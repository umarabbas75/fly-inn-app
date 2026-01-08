import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * GET /api/business/me
 * Get MY businesses (in user dashboard)
 * Proxies to external API: GET /business/me
 *
 * Security:
 * - Authentication required
 */
export async function GET(request: NextRequest) {
  // Extract query parameters from the request
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();

  // Build endpoint with query parameters
  const endpoint = queryString ? `/business/me?${queryString}` : `/business/me`;

  return proxyToBackend(endpoint, { method: "GET" }, request);
}


