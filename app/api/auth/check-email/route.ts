import { NextRequest } from "next/server";

/**
 * POST /api/auth/check-email
 * Proxies to external API: /auth/check-user-exists
 *
 * Security:
 * - No rate limiting per user request
 * - Public endpoint (no auth required)
 * - Obfuscated endpoint name
 */
export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json();

    // Forward to external API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}/auth/check-user-exists`,
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
    console.error("BFF Check Email Error:", error);
    return Response.json(
      { error: "Server error", message: "Failed to check email" },
      { status: 500 }
    );
  }
}

