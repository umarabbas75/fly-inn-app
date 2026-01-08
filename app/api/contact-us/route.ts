import { NextRequest } from "next/server";
import { proxyToBackendPublic } from "@/lib/bff-proxy";

/**
 * POST /api/contact-us
 * Submit a contact form message
 * Proxies to external API: POST /email/contact-us
 *
 * Security:
 * - No authentication required (public endpoint)
 * - reCAPTCHA v2 verification required
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Just proxy to backend - let external backend handle all validation
    return proxyToBackendPublic("/email/contact-us", {
      method: "POST",
      body: body, // Pass entire payload to backend as-is
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return Response.json(
      { error: "Server error", message: "Failed to send message" },
      { status: 500 }
    );
  }
}
