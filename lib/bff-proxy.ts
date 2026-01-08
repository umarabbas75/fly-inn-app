import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

interface ProxyOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

/**
 * BFF Proxy Helper - Securely proxy requests to external API
 * - Gets token from server-side JWT
 * - Adds authentication header
 * - Never exposes token to client
 */
export async function proxyToBackend(
  endpoint: string,
  options: ProxyOptions = {},
  request?: NextRequest
) {
  // Get JWT token directly (contains accessToken)
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

  // Get access token from JWT
  const accessToken = token.accessToken as string;

  if (!accessToken) {
    return Response.json(
      { error: "Unauthorized", message: "No access token" },
      { status: 401 }
    );
  }

  try {
    // Make request to external API with token
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}${endpoint}`,
      {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        cache: "no-store", // Don't cache authenticated requests
      }
    );
    console.log("endpoint", `${process.env.NEXT_PUBLIC_API_URI}${endpoint}`);
    // If unauthorized, session may be invalid
    if (response.status === 401) {
      return Response.json(
        { error: "Session expired", message: "Please log in again" },
        { status: 401 }
      );
    }

    // Return response as-is
    const data = await response.json();

    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("BFF Proxy Error:", error);
    return Response.json(
      { error: "Server error", message: "Failed to process request" },
      { status: 500 }
    );
  }
}

/**
 * Public BFF Proxy Helper - Proxy requests to external API without authentication
 * - No token required
 * - For public endpoints only
 */
export async function proxyToBackendPublic(
  endpoint: string,
  options: ProxyOptions = {}
) {
  try {
    // Make request to external API without authentication
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}${endpoint}`,
      {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: options.body
          ? options.body instanceof FormData
            ? options.body
            : JSON.stringify(options.body)
          : undefined,
      }
    );

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: "Request failed",
        message: `External API returned ${response.status} ${response.statusText}`,
      }));
      return Response.json(errorData, { status: response.status });
    }

    // Return response as-is
    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("BFF Public Proxy Error:", error);
    return Response.json(
      {
        error: "Server error",
        message:
          error instanceof Error ? error.message : "Failed to process request",
      },
      { status: 500 }
    );
  }
}

/**
 * Get access token from JWT (for custom logic)
 */
export async function getAccessToken(request?: NextRequest) {
  const token = await getToken({
    req: request as any,
    secret: process.env.NEXTAUTH_SECRET,
  });
  return token?.accessToken as string | null;
}
