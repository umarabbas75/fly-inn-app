import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * POST /api/stays
 * Create a new stay listing
 * Proxies to external API: POST /stays
 *
 * Security:
 * - Authentication required
 * - User must be authorized to create stays
 *
 * Content-Type: application/json
 * Note: Images are uploaded separately via POST /api/stays/:id/images
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log({ body });
    return proxyToBackend(`/stays`, { method: "POST", body }, request);
  } catch (error) {
    return Response.json(
      { error: "Invalid request", message: "Invalid JSON body" },
      { status: 400 }
    );
  }
}

/**
 * GET /api/stays
 * Get all stays for the authenticated user
 * Proxies to external API: /stays
 *
 * Security:
 * - Authentication required
 */
export async function GET(request: NextRequest) {
  // Extract query parameters from the request
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();

  // Build endpoint with query parameters
  const endpoint = queryString ? `/stays?${queryString}` : `/stays`;

  return proxyToBackend(endpoint, { method: "GET" }, request);
}
