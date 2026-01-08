import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * POST /api/payments/setup-intent
 * Create a Stripe Setup Intent for adding payment methods
 * Proxies to external API: POST /payments/setup-intent
 *
 * Security:
 * - Authentication required
 * - Returns client_secret for Stripe Elements
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return proxyToBackend(
      "/payments/setup-intent",
      { method: "POST", body },
      request
    );
  } catch (error) {
    console.error("Setup Intent Error:", error);
    return Response.json(
      {
        error: "Server error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to create setup intent",
      },
      { status: 500 }
    );
  }
}
