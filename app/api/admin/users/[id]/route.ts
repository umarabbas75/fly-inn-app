import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";
import { getToken } from "next-auth/jwt";

/**
 * GET /api/admin/users/[id]
 * Proxies to external API: /users/:id
 *
 * For admins to view/edit user profiles
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Proxy to external API
  return proxyToBackend(`/users/${id}`, {}, request);
}

/**
 * PATCH /api/admin/users/[id]
 * Update user profile as admin
 * Handles both JSON and FormData (for image uploads)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Get JWT token directly
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.accessToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if request is FormData (multipart/form-data) or JSON
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // Handle FormData (for image uploads)
      const formData = await request.formData();

      // Forward FormData to external API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URI}/users/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token.accessToken as string}`,
            // Don't set Content-Type - let fetch set it with boundary for multipart/form-data
          },
          body: formData,
          cache: "no-store",
        }
      );

      // If unauthorized, session may be invalid
      if (response.status === 401) {
        return Response.json(
          { error: "Session expired", message: "Please log in again" },
          { status: 401 }
        );
      }

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "Unknown error",
          message: `Failed to update user: ${response.status} ${response.statusText}`,
        }));
        return Response.json(errorData, { status: response.status });
      }

      // Return response as-is
      const data = await response.json();
      return Response.json(data, { status: response.status });
    } else {
      // Handle JSON (for regular profile updates)
      const body = await request.json();

      // Proxy to external API
      return proxyToBackend(
        `/users/${id}`,
        {
          method: "PATCH",
          body,
        },
        request
      );
    }
  } catch (error) {
    console.error("BFF Admin User Update Error:", error);
    return Response.json(
      {
        error: "Server error",
        message:
          error instanceof Error ? error.message : "Failed to update user",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete a user by ID (admin only)
 * Proxies to external API: DELETE /users/:id
 *
 * Security:
 * - Authentication required
 * - Admin privileges required
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(`/users/${id}`, { method: "DELETE" }, request);
}
