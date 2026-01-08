import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * POST /api/connect/onboard
 * Start or continue Stripe Connect onboarding for the authenticated host
 * Proxies to external API: POST /connect/onboard
 *
 * Request Body:
 * {
 *   refresh_url?: string, // Where to redirect if link expires (default: frontend payout page)
 *   return_url?: string   // Where to redirect after completion (default: frontend payout page)
 * }
 *
 * Response:
 * {
 *   status: true,
 *   message: "Onboarding link created",
 *   data: {
 *     url: string,        // Stripe Connect onboarding URL
 *     expires_at: string  // ISO timestamp when link expires
 *   }
 * }
 *
 * Frontend should redirect the user to the returned URL to complete onboarding on Stripe.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return proxyToBackend("/connect/onboard", { method: "POST", body }, request);
  } catch (error) {
    return Response.json(
      { error: "Invalid request", message: "Invalid JSON body" },
      { status: 400 }
    );
  }
}


