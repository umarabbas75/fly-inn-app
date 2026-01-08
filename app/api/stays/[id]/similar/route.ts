import { NextRequest } from "next/server";
import { proxyToBackendPublic } from "@/lib/bff-proxy";

/**
 * GET /api/stays/:id/similar
 * Get similar stays near a specific stay
 * Proxies to external API: GET /stays/:id/similar
 *
 * Query Parameters:
 * - radius_km: Search radius in kilometers (default: 100)
 * - limit: Maximum number of results (default: 15)
 *
 * Security:
 * - Public endpoint (no authentication required)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    
    // Get query params from the request URL
    const radiusKm = searchParams.get("radius_km") || "100";
    const limit = searchParams.get("limit") || "15";
    
    console.log("Similar stays API - received params:", { radiusKm, limit, fullUrl: request.url });
    
    const queryString = `?radius_km=${radiusKm}&limit=${limit}`;
    
    console.log("Similar stays API - forwarding to backend:", `/stays/${id}/similar${queryString}`);
    
    return proxyToBackendPublic(`/stays/${id}/similar${queryString}`);
  } catch (error) {
    return Response.json(
      { error: "Invalid request", message: "Invalid stay ID" },
      { status: 400 }
    );
  }
}

