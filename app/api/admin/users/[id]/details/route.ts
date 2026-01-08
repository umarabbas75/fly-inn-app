import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * GET /api/admin/users/:id/details
 * Proxies to external API: /users/:id
 *
 * Security:
 * - Authentication required (admin role)
 * - Real endpoint hidden from client (obfuscated)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Proxy to backend
  return proxyToBackend(
    `/users/${id}`,
    {
      method: "GET",
    },
    request
  );
}
