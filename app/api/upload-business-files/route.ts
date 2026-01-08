import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * POST /api/upload-business-files
 * Upload business images (logo, photos, menus)
 * Proxies to external API: /upload-business-files
 *
 * Security:
 * - Authentication required
 * - User must own the business
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    return proxyToBackend(
      `/upload-business-files`,
      { method: "POST", body: formData },
      request
    );
  } catch (error) {
    return Response.json(
      { error: "Invalid request", message: "Invalid form data" },
      { status: 400 }
    );
  }
}
