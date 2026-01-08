import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * PATCH /api/admin/users/:id/email-verification
 * Proxies to external API: /users/:id/email-verification
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

    // Validate verified is a boolean
    if (typeof body.verified !== "boolean") {
      return NextResponse.json(
        {
          error: "Invalid request",
          message: "verified must be a boolean",
        },
        { status: 400 }
      );
    }

    // Proxy to backend with body (proxyToBackend will stringify)
    return proxyToBackend(
      `/users/${id}/email-verification`,
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

