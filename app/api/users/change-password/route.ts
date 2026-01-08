import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * PATCH /api/users/change-password
 * Proxies to external API: /auth/me/change-password
 *
 * Security:
 * - Authentication required (user must be logged in)
 * - Token stored server-side only
 * - Real endpoint hidden from client
 *
 * Request Body:
 * {
 *   current_password: string;
 *   new_password: string;
 * }
 */
export async function PATCH(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json();

    // Validate required fields
    if (!body.current_password || !body.new_password) {
      return Response.json(
        {
          error: "Validation error",
          message: "Current password and new password are required",
        },
        { status: 400 }
      );
    }

    // Proxy to external API with authentication
    // Backend endpoint: /auth/me/change-password
    return proxyToBackend(
      "/auth/me/change-password",
      {
        method: "PATCH",
        body: {
          current_password: body.current_password,
          new_password: body.new_password,
        },
      },
      request
    );
  } catch (error) {
    console.error("BFF Change Password Error:", error);
    return Response.json(
      { error: "Server error", message: "Failed to change password" },
      { status: 500 }
    );
  }
}
