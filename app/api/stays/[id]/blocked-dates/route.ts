import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * PATCH /api/stays/:id/blocked-dates
 * Update blocked dates for a stay listing
 * Proxies to external API: /stays/:id/blocked-dates
 *
 * Security:
 * - Authentication required
 * - User must own the stay or be admin
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    return proxyToBackend(
      `/stays/${id}/blocked-dates`,
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
