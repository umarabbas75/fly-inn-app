import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * GET /api/payments/methods
 * Get all payment methods for the current user or a specific user (if admin)
 * Proxies to external API: GET /payments/me/cards or GET /payments/users/:userId/cards
 *
 * Security:
 * - Authentication required
 * - If user_id is provided, requires admin privileges
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  // If user_id is provided, fetch that user's payment methods (admin only)
  if (userId) {
    return proxyToBackend(`/payments/users/${userId}/cards`, {}, request);
  }

  // Otherwise, fetch current user's payment methods
  return proxyToBackend("/payments/me/cards", {}, request);
}

/**
 * POST /api/payments/methods
 * Attach a payment method to the customer after setup intent confirmation
 * Proxies to external API: POST /payments/me/cards
 *
 * Security:
 * - Authentication required
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return proxyToBackend(
      "/payments/me/cards",
      { method: "POST", body },
      request
    );
  } catch (error) {
    console.error("Create Payment Method Error:", error);
    return Response.json(
      {
        error: "Server error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to create payment method",
      },
      { status: 500 }
    );
  }
}
