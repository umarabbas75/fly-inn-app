import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * PATCH /api/business/:id/deactivate
 * Soft delete (deactivate) a business
 * Proxies to external API: PATCH /business/:id/deactivate
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
  return proxyToBackend(
    `/business/${id}/deactivate`,
    { method: "PATCH" },
    request
  );
}


