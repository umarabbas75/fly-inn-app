import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * POST /api/business/:id/images
 * Upload images for a business (create mode)
 * Proxies to external API: POST /business/:id/images
 *
 * Security:
 * - Authentication required
 * - User must own the business or be admin
 * Content-Type: multipart/form-data
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get JWT token for authentication
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return Response.json(
        { error: "Unauthorized", message: "Please log in" },
        { status: 401 }
      );
    }

    const accessToken = token.accessToken as string;

    if (!accessToken) {
      return Response.json(
        { error: "Unauthorized", message: "No access token" },
        { status: 401 }
      );
    }

    // Get FormData from request
    const formData = await request.formData();

    // Forward FormData to external API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}/business/${id}/images`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
        message: `Failed to upload images: ${response.status} ${response.statusText}`,
      }));
      return Response.json(errorData, { status: response.status });
    }

    // Return response as-is
    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("BFF Business Image Upload Error:", error);
    return Response.json(
      {
        error: "Server error",
        message:
          error instanceof Error ? error.message : "Failed to upload images",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/business/:id/images
 * Update images for a business (add, update descriptions, reorder, delete)
 * Proxies to external API: PATCH /business/:id/images
 *
 * Security:
 * - Authentication required
 * - User must own the business or be admin
 * Content-Type: multipart/form-data
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get JWT token for authentication
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return Response.json(
        { error: "Unauthorized", message: "Please log in" },
        { status: 401 }
      );
    }

    const accessToken = token.accessToken as string;

    if (!accessToken) {
      return Response.json(
        { error: "Unauthorized", message: "No access token" },
        { status: 401 }
      );
    }

    // Get FormData from request
    const formData = await request.formData();

    // Forward FormData to external API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}/business/${id}/images`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
        message: `Failed to update images: ${response.status} ${response.statusText}`,
      }));
      return Response.json(errorData, { status: response.status });
    }

    // Return response as-is
    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("BFF Business Image Update Error:", error);
    return Response.json(
      {
        error: "Server error",
        message:
          error instanceof Error ? error.message : "Failed to update images",
      },
      { status: 500 }
    );
  }
}

