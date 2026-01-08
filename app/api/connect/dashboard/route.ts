import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * GET /api/connect/dashboard
 * Get Stripe Express Dashboard link for hosts who have completed onboarding
 * Proxies to external API: GET /connect/dashboard
 *
 * This allows hosts to:
 * - View their payout history
 * - Manage their bank accounts
 * - Update their payout settings
 * - View tax documents
 *
 * Response:
 * {
 *   status: true,
 *   message: "Dashboard link created",
 *   data: {
 *     url: string  // Stripe Express Dashboard URL
 *   }
 * }
 *
 * Frontend should open this URL in a new tab.
 */
export async function GET(request: NextRequest) {
  return proxyToBackend("/connect/dashboard", { method: "GET" }, request);
}
