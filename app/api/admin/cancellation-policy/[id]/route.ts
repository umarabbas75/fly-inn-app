import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * GET /api/admin/cancellation-policy/[id]
 * Get a specific cancellation policy
 * Proxies to external API: /cancellation-policies/:id
 *
 * Security:
 * - Authentication required (admin role checked by backend)
 * - Real endpoint hidden from client (obfuscated)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyToBackend(
    `/cancellation-policies/${params.id}`,
    {
      method: "GET",
    },
    request
  );
}

/**
 * PUT /api/admin/cancellation-policy/[id]
 * Update a cancellation policy
 * Proxies to external API: /cancellation-policies/:id
 *
 * Security:
 * - Authentication required (admin role checked by backend)
 * - Real endpoint hidden from client (obfuscated)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    return proxyToBackend(
      `/cancellation-policies/${params.id}`,
      {
        method: "PUT",
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

/**
 * DELETE /api/admin/cancellation-policy/[id]
 * Delete a cancellation policy
 * Proxies to external API: /cancellation-policies/:id
 *
 * Security:
 * - Authentication required (admin role checked by backend)
 * - Real endpoint hidden from client (obfuscated)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyToBackend(
    `/cancellation-policies/${params.id}`,
    {
      method: "DELETE",
    },
    request
  );
}
