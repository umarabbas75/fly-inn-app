import { NextRequest } from "next/server";
import { proxyToBackendPublic } from "@/lib/bff-proxy";

/**
 * GET /api/stays/featured
 * Get all featured stays
 * Proxies to external API: GET /stays/featured
 *
 * Security:
 * - Public endpoint (no authentication required)
 */
export async function GET(request: NextRequest) {
  return proxyToBackendPublic("/stays/featured");
}

