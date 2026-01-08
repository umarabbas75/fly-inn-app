import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * PATCH /api/admin/users/:id/verify-email
 * Proxies to external API: /users/:id/verify-email
 *
 * Security:
 * - Authentication required (admin role)
 * - Real endpoint hidden from client (obfuscated)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Proxy to backend
  return proxyToBackend(
    `/users/${id}/verify-email`,
    {
      method: "PATCH",
    },
    request
  );
}
