import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * GET /api/admin/users/all
 * Proxies to external API: /users/all
 *
 * Security:
 * - Authentication required (admin role)
 * - Real endpoint hidden from client (obfuscated)
 */
export async function GET(request: NextRequest) {
  // Get search params from request URL
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();

  // Proxy to backend with query params
  return proxyToBackend(
    `/users/all${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
    },
    request
  );
}
