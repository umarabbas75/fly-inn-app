import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * POST /api/business/upgrade-package
 * Upgrade or downgrade a business subscription package
 * Proxies to external API: /business/upgrade-package
 *
 * Security:
 * - Authentication required
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return proxyToBackend(
      `/business/upgrade-package`,
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
