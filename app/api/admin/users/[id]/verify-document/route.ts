import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * PATCH /api/admin/users/:id/verify-document
 * Proxies to external API: /users/:id/license-verification
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

  try {
    const body = await request.json();

    // Proxy to backend with body (proxyToBackend will stringify)
    return proxyToBackend(
      `/users/${id}/license-verification`,
      {
        method: "PATCH",
        body: body, // Don't stringify - proxyToBackend does it
        headers: {
          "Content-Type": "application/json",
        },
      },
      request
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid request",
        message: "Invalid JSON body",
      },
      { status: 400 }
    );
  }
}
