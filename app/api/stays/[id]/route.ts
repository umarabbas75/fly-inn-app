import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * GET /api/stays/[id]
 * Get a single stay by ID
 * Proxies to external API: GET /stays/:id
 *
 * Security:
 * - Authentication required
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(`/stays/${id}`, { method: "GET" }, request);
}

/**
 * PUT /api/stays/[id]
 * Update a single stay by ID
 * Proxies to external API: PUT /stays/:id
 *
 * Security:
 * - Authentication required
 * - User must own the stay or be admin
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    return proxyToBackend(`/stays/${id}`, { method: "PUT", body }, request);
  } catch (error) {
    return Response.json(
      { error: "Invalid request", message: "Invalid JSON body" },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/stays/[id]
 * Delete a single stay by ID
 * Proxies to external API: DELETE /stays/:id
 *
 * Security:
 * - Authentication required
 * - User must own the stay or be admin
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(`/stays/${id}`, { method: "DELETE" }, request);
}
