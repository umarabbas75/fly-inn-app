import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * POST /api/business/payment/setup-intent
 * Create a Stripe setup intent for payment method collection
 * Proxies to external API: /business/payment/setup-intent
 *
 * Security:
 * - Authentication required
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    return proxyToBackend(
      `/business/payment/setup-intent`,
      { method: "POST", body },
      request
    );
  } catch (error) {
    return Response.json(
      { error: "Invalid request", message: "Invalid JSON body" },
      { status: 400 }
    );
  }
}
