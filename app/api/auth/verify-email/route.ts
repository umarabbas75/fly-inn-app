import { NextRequest } from "next/server";

/**
 * POST /api/auth/verify-email
 * Proxies to external API: /auth/verify-token
 *
 * Security:
 * - No authentication required (public endpoint)
 * - Real endpoint hidden from client (obfuscated name)
 */
export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json();

    // Forward to external API (no auth token needed)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}/auth/verify-token`,
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
    console.error("BFF Verify Token Error:", error);
    return Response.json(
      { error: "Server error", message: "Failed to verify token" },
      { status: 500 }
    );
  }
}
