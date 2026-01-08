import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * PATCH /api/stays/:id/fake-coordinates
 * Update fake coordinates for a stay listing
 * Proxies to external API: /stay/:id/fake-coordinates
 *
 * Security:
 * - Authentication required
 * - User must own the stay or be admin
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    return proxyToBackend(
      `/stays/${params.id}/fake-coordinates`,
      { method: "PATCH", body },
      request
    );
  } catch (error) {
    return Response.json(
      { error: "Invalid request", message: "Invalid JSON body" },
      { status: 400 }
    );
  }
}
