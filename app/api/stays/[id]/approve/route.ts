import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * PATCH /api/stays/:id/approve
 * Approve a stay listing (change status from pending to approved)
 * Proxies to external API: /stay/:id/status
 *
 * Security:
 * - Authentication required
 * - Admin privileges required
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    return proxyToBackend(
      `/stays/${params.id}/status`,
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
