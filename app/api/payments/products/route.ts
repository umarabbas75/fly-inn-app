import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * GET /api/payments/products
 * Get all Stripe products/plans
 * Proxies to external API: /business/stripe/products
 *
 * Security:
 * - Authentication required
 */
export async function GET(request: NextRequest) {
  return proxyToBackend(
    "/business/stripe/products",
    { method: "GET" },
    request
  );
}
