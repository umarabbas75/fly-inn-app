import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * GET /api/admin/features/[id]
 * Get a specific feature
 * Proxies to external API: /feature/:id
 *
 * Security:
 * - Authentication required (admin role checked by backend)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyToBackend(`/feature/${params.id}`, { method: "GET" }, request);
}

/**
 * PUT /api/admin/features/[id]
 * Update a feature
 * Proxies to external API: /feature/:id
 *
 * Security:
 * - Authentication required (admin role checked by backend)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    return proxyToBackend(
      `/feature/${params.id}`,
      { method: "PUT", body },
      request
    );
  } catch (error) {
    return Response.json(
      { error: "Invalid request", message: "Invalid JSON body" },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/admin/features/[id]
 * Delete a feature
 * Proxies to external API: /feature/:id
 *
 * Security:
 * - Authentication required (admin role checked by backend)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyToBackend(`/feature/${params.id}`, { method: "DELETE" }, request);
}
