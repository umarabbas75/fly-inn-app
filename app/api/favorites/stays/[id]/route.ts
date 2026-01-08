import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * POST /api/favorites/stays/:id
 * Add a stay to favorites
 * Proxies to external API: POST /favorites/stays/:id
 *
 * Security:
 * - Authentication required
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    return proxyToBackend(`/favorites/stays/${id}`, { method: "POST" }, request);
  } catch (error) {
    return Response.json(
      { error: "Invalid request", message: "Invalid stay ID" },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/favorites/stays/:id
 * Remove a stay from favorites
 * Proxies to external API: DELETE /favorites/stays/:id
 *
 * Security:
 * - Authentication required
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    return proxyToBackend(
      `/favorites/stays/${id}`,
      { method: "DELETE" },
      request
    );
  } catch (error) {
    return Response.json(
      { error: "Invalid request", message: "Invalid stay ID" },
      { status: 400 }
    );
  }
}

