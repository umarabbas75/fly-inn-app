import { NextRequest } from "next/server";

/**
 * POST /api/auth/update-password
 * Proxies to external API: /auth/update-password
 *
 * Security:
 * - No authentication required (uses OTP verification)
 * - Real endpoint hidden from client
 */
export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json();

    // Forward to external API (no auth token needed, OTP verified)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}/auth/update-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("BFF Update Password Error:", error);
    return Response.json(
      { error: "Server error", message: "Failed to update password" },
      { status: 500 }
    );
  }
}
