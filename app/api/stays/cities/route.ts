import { NextRequest } from "next/server";
import { proxyToBackendPublic } from "@/lib/bff-proxy";

/**
 * GET /api/stays/cities
 * Get all distinct cities with stays
 * Proxies to external API: GET /stays/cities
 *
 * Security:
 * - Public endpoint (no authentication required)
 */
export async function GET(request: NextRequest) {
  return proxyToBackendPublic("/stays/cities");
}

