import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * POST /api/stays/:id/purchase-featured
 * Purchase featured status for a stay ($10 USD)
 * Proxies to external API: POST /stays/:id/purchase-featured
 *
 * Security:
 * - Authentication required
 * - Users can only feature their own stays (unless admin)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    return proxyToBackend(
      `/stays/${id}/purchase-featured`,
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

