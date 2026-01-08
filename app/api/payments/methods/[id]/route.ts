import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * PATCH /api/payments/methods/:id
 * Update payment method (e.g., set as default)
 * Proxies to external API: PATCH /payments/me/cards/:id
 *
 * Security:
 * - Authentication required
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    return proxyToBackend(
      `/payments/me/cards/${id}`,
      { method: "PATCH", body },
      request
    );
  } catch (error) {
    console.error("Update Payment Method Error:", error);
    return Response.json(
      {
        error: "Server error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to update payment method",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/payments/methods/:id
 * Delete a payment method
 * Proxies to external API: DELETE /payments/me/cards/:id
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
      `/payments/me/cards/${id}`,
      { method: "DELETE" },
      request
    );
  } catch (error) {
    console.error("Delete Payment Method Error:", error);
    return Response.json(
      {
        error: "Server error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete payment method",
      },
      { status: 500 }
    );
  }
}
