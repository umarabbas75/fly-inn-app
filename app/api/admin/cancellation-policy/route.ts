import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * GET /api/admin/cancellation-policy
 * Proxies to external API: /cancellation-policies
 *
 * Security:
 * - Authentication required (admin role checked by backend)
 * - Real endpoint hidden from client (obfuscated)
 */
export async function GET(request: NextRequest) {
  return proxyToBackend(
    `/cancellation-policies`,
    {
      method: "GET",
    },
    request
  );
}

/**
 * POST /api/admin/cancellation-policy
 * Create a new cancellation policy
 * Proxies to external API: /cancellation-policies
 *
 * Security:
 * - Authentication required (admin role checked by backend)
 * - Real endpoint hidden from client (obfuscated)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return proxyToBackend(
      `/cancellation-policies`,
      {
        method: "POST",
        body: body,
      },
      request
    );
  } catch (error) {
    return Response.json(
      {
        error: "Invalid request",
        message: "Invalid JSON body",
      },
      { status: 400 }
    );
  }
}
