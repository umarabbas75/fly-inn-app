import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * GET /api/business/:id
 * Get a specific business by ID
 * Proxies to external API: /business/:id
 *
 * Security:
 * - Authentication required
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(`/business/${id}`, { method: "GET" }, request);
}

/**
 * PUT /api/business/:id
 * Update a specific business by ID
 * Proxies to external API: /business/:id
 *
 * Security:
 * - Authentication required
 * - User must own the business or be admin
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    return proxyToBackend(`/business/${id}`, { method: "PUT", body }, request);
  } catch (error) {
    return Response.json(
      { error: "Invalid request", message: "Invalid JSON body" },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/business/:id
 * Delete a specific business by ID
 * Proxies to external API: /business/:id
 *
 * Security:
 * - Authentication required
 * - User must own the business or be admin
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(`/business/${id}`, { method: "DELETE" }, request);
}
