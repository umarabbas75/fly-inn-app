import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * PATCH /api/business/:id/activate
 * Activate a deactivated business
 * Proxies to external API: PATCH /business/:id/activate
 *
 * Security:
 * - Authentication required
 * - Admin only
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(`/business/${id}/activate`, { method: "PATCH" }, request);
}


