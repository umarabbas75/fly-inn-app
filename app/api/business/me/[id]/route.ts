import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * GET /api/business/me/:id
 * Get single business I own
 * Proxies to external API: GET /business/me/:id
 *
 * Security:
 * - Authentication required
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(`/business/me/${id}`, { method: "GET" }, request);
}


