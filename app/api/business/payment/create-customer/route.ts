import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * POST /api/business/payment/create-customer
 * Create a Stripe customer
 * Proxies to external API: /business/payment/create-customer
 *
 * Security:
 * - Authentication required
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return proxyToBackend(
      `/business/payment/create-customer`,
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
