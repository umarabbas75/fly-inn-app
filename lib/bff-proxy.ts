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

  const fullUrl = `${process.env.NEXT_PUBLIC_API_URI}${endpoint}`;
  const requestMethod = options.method || "GET";
  const requestHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    ...options.headers,
  };

  // Log request details
  console.log("\n========== BFF PROXY REQUEST ==========");
  console.log("📍 External API URL:", fullUrl);
  console.log("🔧 Method:", requestMethod);
  console.log("📋 Headers:", {
    ...requestHeaders,
    Authorization: `Bearer ${accessToken.substring(0, 20)}...`, // Sanitized
  });
  if (options.body) {
    console.log("📦 Request Body:", JSON.stringify(options.body, null, 2));
  }
  console.log("=======================================\n");

  try {
    // Make request to external API with token
    const response = await fetch(fullUrl, {
      method: requestMethod,
      headers: requestHeaders,
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store", // Don't cache authenticated requests
    });

    // Log response details
    console.log("\n========== BFF PROXY RESPONSE ==========");
    console.log("📍 External API URL:", fullUrl);
    console.log("✅ Status Code:", response.status);
    console.log("✅ Status Text:", response.statusText);
    console.log(
      "📋 Response Headers:",
      Object.fromEntries(response.headers.entries())
    );

    // Get response text first to check if it's empty
    const responseText = await response.text();
    console.log("📄 Response Body Length:", responseText.length);
    console.log("📄 Response Body Preview:", responseText.substring(0, 500));
    if (responseText.length > 500) {
      console.log("📄 Response Body (Full):", responseText);
    }
    console.log("========================================\n");

    // If unauthorized, session may be invalid
    if (response.status === 401) {
      return Response.json(
        { error: "Session expired", message: "Please log in again" },
        { status: 401 }
      );
    }

    // If response is empty, return appropriate error
    if (!responseText || responseText.trim().length === 0) {
      console.error(
        "❌ BFF Proxy Error: Empty response from",
        fullUrl,
        `Status: ${response.status}`
      );

      // Provide user-friendly error message based on status code
      let errorMessage =
        "The service is temporarily unavailable. Please try again later.";
      if (response.status === 500) {
        errorMessage =
          "Our servers are experiencing issues. Please try again in a few moments.";
      } else if (response.status === 503) {
        errorMessage =
          "The service is temporarily unavailable. Please try again later.";
      } else if (response.status === 404) {
        errorMessage = "The requested resource was not found.";
      }

      return Response.json(
        {
          error: "Backend Error",
          message: errorMessage,
          statusCode: response.status,
          endpoint: endpoint,
        },
        { status: response.status || 500 }
      );
    }

    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log("✅ Successfully parsed JSON response");
    } catch (parseError) {
      console.error(
        "❌ BFF Proxy Error: Invalid JSON response from",
        fullUrl,
        `Response: ${responseText.substring(0, 200)}`,
        `Status: ${response.status}`,
        `Parse Error: ${parseError}`
      );
      return Response.json(
        {
          error: "Backend Error",
          message:
            "The server returned an invalid response. Please try again later.",
          statusCode: response.status,
          endpoint: endpoint,
        },
        { status: response.status || 500 }
      );
    }

    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("\n❌❌❌ BFF PROXY FETCH ERROR ❌❌❌");
    console.error("📍 External API URL:", fullUrl);
    console.error("🔧 Method:", requestMethod);
    console.error(
      "❌ Error Type:",
      error instanceof Error ? error.constructor.name : typeof error
    );
    console.error(
      "❌ Error Message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "❌ Error Stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    // Check for specific error types
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("🚨 Likely Issue: Network error or CORS issue");
    }
    if (error instanceof Error && error.message.includes("CORS")) {
      console.error("🚨 Likely Issue: CORS policy violation");
    }
    console.error("=====================================\n");

    // Provide user-friendly error message based on error type
    let errorMessage =
      "Unable to connect to the server. Please check your connection and try again.";
    if (error instanceof TypeError && error.message.includes("fetch")) {
      errorMessage =
        "Network error: Unable to reach the server. Please check your internet connection.";
    } else if (error instanceof Error && error.message.includes("CORS")) {
      errorMessage =
        "Connection error: Please contact support if this persists.";
    }

    return Response.json(
      {
        error: "Connection Error",
        message: errorMessage,
        endpoint: endpoint,
      },
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
  const fullUrl = `${process.env.NEXT_PUBLIC_API_URI}${endpoint}`;
  const requestMethod = options.method || "GET";

  // Log request details
  console.log("\n========== BFF PUBLIC PROXY REQUEST ==========");
  console.log("📍 External API URL:", fullUrl);
  console.log("🔧 Method:", requestMethod);
  console.log("📋 Headers:", {
    "Content-Type": "application/json",
    ...options.headers,
  });
  if (options.body) {
    const bodyPreview =
      options.body instanceof FormData
        ? "[FormData]"
        : JSON.stringify(options.body, null, 2);
    console.log("📦 Request Body:", bodyPreview);
  }
  console.log("==============================================\n");

  try {
    // Make request to external API without authentication
    const response = await fetch(fullUrl, {
      method: requestMethod,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body
        ? options.body instanceof FormData
          ? options.body
          : JSON.stringify(options.body)
        : undefined,
    });

    // Log response details
    console.log("\n========== BFF PUBLIC PROXY RESPONSE ==========");
    console.log("📍 External API URL:", fullUrl);
    console.log("✅ Status Code:", response.status);
    console.log("✅ Status Text:", response.statusText);
    console.log(
      "📋 Response Headers:",
      Object.fromEntries(response.headers.entries())
    );

    // Get response text first
    const responseText = await response.text();
    console.log("📄 Response Body Length:", responseText.length);
    console.log("📄 Response Body Preview:", responseText.substring(0, 500));
    if (responseText.length > 500) {
      console.log("📄 Response Body (Full):", responseText);
    }
    console.log("===============================================\n");

    // Handle non-OK responses
    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        // Provide user-friendly error message based on status code
        let errorMessage =
          "The service is temporarily unavailable. Please try again later.";
        if (response.status === 500) {
          errorMessage =
            "Our servers are experiencing issues. Please try again in a few moments.";
        } else if (response.status === 503) {
          errorMessage =
            "The service is temporarily unavailable. Please try again later.";
        } else if (response.status === 404) {
          errorMessage = "The requested resource was not found.";
        }

        errorData = {
          error: "Backend Error",
          message: errorMessage,
          statusCode: response.status,
          endpoint: endpoint,
        };
      }
      return Response.json(errorData, { status: response.status });
    }

    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log("✅ Successfully parsed JSON response");
    } catch (parseError) {
      console.error(
        "❌ BFF Public Proxy Error: Invalid JSON response from",
        fullUrl,
        `Response: ${responseText.substring(0, 200)}`,
        `Parse Error: ${parseError}`
      );
      return Response.json(
        {
          error: "Backend Error",
          message:
            "The server returned an invalid response. Please try again later.",
          statusCode: response.status,
          endpoint: endpoint,
        },
        { status: response.status || 500 }
      );
    }

    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("\n❌❌❌ BFF PUBLIC PROXY FETCH ERROR ❌❌❌");
    console.error("📍 External API URL:", fullUrl);
    console.error("🔧 Method:", requestMethod);
    console.error(
      "❌ Error Type:",
      error instanceof Error ? error.constructor.name : typeof error
    );
    console.error(
      "❌ Error Message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "❌ Error Stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    // Check for specific error types
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("🚨 Likely Issue: Network error or CORS issue");
    }
    if (error instanceof Error && error.message.includes("CORS")) {
      console.error("🚨 Likely Issue: CORS policy violation");
    }
    console.error("==========================================\n");

    // Provide user-friendly error message based on error type
    let errorMessage =
      "Unable to connect to the server. Please check your connection and try again.";
    if (error instanceof TypeError && error.message.includes("fetch")) {
      errorMessage =
        "Network error: Unable to reach the server. Please check your internet connection.";
    } else if (error instanceof Error && error.message.includes("CORS")) {
      errorMessage =
        "Connection error: Please contact support if this persists.";
    }

    return Response.json(
      {
        error: "Connection Error",
        message: errorMessage,
        endpoint: endpoint,
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
