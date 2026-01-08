import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * GET /api/users/current-user
 * Proxies to external API: /users/me
 *
 * Security:
 * - Token stored server-side only
 * - Authentication required
 * - Real endpoint hidden from client
 */
export async function GET(request: NextRequest) {
  // Proxy to external API with authentication
  return proxyToBackend("/users/me", {}, request);
}

/**
 * PATCH /api/users/current-user
 * Update user profile
 */
export async function PATCH(request: NextRequest) {
  // Check content type
  const contentType = request.headers.get("content-type");

  if (contentType?.includes("multipart/form-data")) {
    // Handle FormData (e.g., image uploads)
    const formData = await request.formData();

    // Forward formData to external API
    // Note: proxyToBackend doesn't support FormData, so we handle it directly
    const token = await import("next-auth/jwt").then((mod) =>
      mod.getToken({
        req: request as any,
        secret: process.env.NEXTAUTH_SECRET,
      })
    );

    if (!token?.accessToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}/users/me`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token.accessToken as string}`,
        },
        body: formData,
      }
    );

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } else {
    // Handle JSON body
    const body = await request.json();

    // Proxy to external API
    return proxyToBackend(
      "/users/me",
      {
        method: "PATCH",
        body,
      },
      request
    );
  }
}
