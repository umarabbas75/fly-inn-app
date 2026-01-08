import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * GET /api/connect/status
 * Check Stripe Connect onboarding status for the authenticated host
 * Proxies to external API: GET /connect/status
 *
 * Response:
 * {
 *   status: true,
 *   message: "Connect status retrieved",
 *   data: {
 *     has_connect_account: boolean,
 *     is_onboarded: boolean,
 *     payouts_enabled: boolean,
 *     account_id: string | null
 *   }
 * }
 *
 * States to handle:
 * - has_connect_account: false, is_onboarded: false, payouts_enabled: false → Show "Set Up Payouts"
 * - has_connect_account: true, is_onboarded: false, payouts_enabled: false → Show "Continue Setup"
 * - has_connect_account: true, is_onboarded: true, payouts_enabled: false → Show "Verification Pending"
 * - has_connect_account: true, is_onboarded: true, payouts_enabled: true → Show "Manage Payouts"
 */
export async function GET(request: NextRequest) {
  return proxyToBackend("/connect/status", { method: "GET" }, request);
}


