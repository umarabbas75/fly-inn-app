import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * GET /api/favorites/stays
 * Get all favorite stays for the current user
 * Proxies to external API: GET /favorites/stays
 *
 * Security:
 * - Authentication required
 */
export async function GET(request: NextRequest) {
  return proxyToBackend("/favorites/stays", {}, request);
}

