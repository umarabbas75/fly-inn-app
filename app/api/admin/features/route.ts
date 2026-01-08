import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * GET /api/admin/features
 * Get all features
 * Proxies to external API: /feature
 *
 * Security:
 * - Authentication required (admin role checked by backend)
 */
export async function GET(request: NextRequest) {
  return proxyToBackend(`/feature`, { method: "GET" }, request);
}

/**
 * POST /api/admin/features
 * Create a new feature
 * Proxies to external API: /feature
 *
 * Security:
 * - Authentication required (admin role checked by backend)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return proxyToBackend(`/feature`, { method: "POST", body }, request);
  } catch (error) {
    return Response.json(
      { error: "Invalid request", message: "Invalid JSON body" },
      { status: 400 }
    );
  }
}
