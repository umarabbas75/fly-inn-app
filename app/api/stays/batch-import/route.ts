import { NextRequest } from "next/server";
import { getAccessToken } from "@/lib/bff-proxy";
import { transformListingData } from "@/lib/transform-listing-data";
import { listingsStaticData } from "@/listing-static-data";

/**
 * POST /api/stays/batch-import
 * Batch import listings from static data file
 *
 * Security:
 * - Authentication required
 * - Recommended: Admin only
 *
 * Request Body (optional):
 * {
 *   "host_id": 25,
 *   "status": "draft",
 *   "limit": 10  // optional: limit number of listings to process
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body once
    let requestBody: any = {};
    try {
      requestBody = await request.json();
    } catch {
      // Body might be empty, that's okay
    }

    // Check authentication - allow API key OR token in body for batch imports (admin/test mode)
    const apiKey =
      request.headers.get("x-batch-import-key") ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    // Allow API key authentication OR session-based auth OR token from body
    let accessToken: string | null = null;

    if (apiKey && apiKey === process.env.BATCH_IMPORT_API_KEY) {
      // Use API key authentication (for scripts/testing)
      accessToken = apiKey;
      console.log("🔑 Using API key authentication for batch import");
    } else {
      // Try session-based authentication first
      const sessionToken = await getAccessToken(request);
      if (sessionToken) {
        accessToken = sessionToken;
      } else {
        // Fallback: allow token from request body for batch imports (testing/migration)
        const bodyToken = requestBody?.api_token || requestBody?.access_token;
        if (bodyToken && process.env.BATCH_IMPORT_ALLOW_TOKEN !== "false") {
          accessToken = bodyToken;
          console.log("🔑 Using token from request body for batch import");
        }
      }
    }

    // If no valid authentication method found
    if (!accessToken) {
      return Response.json(
        {
          error: "Unauthorized",
          message:
            "Please log in, provide 'api_token' in request body, or set BATCH_IMPORT_API_KEY header.",
        },
        { status: 401 }
      );
    }

    // Parse options from request body
    const options: {
      hostId?: number;
      status?: string;
      limit?: number;
    } = {
      hostId: requestBody.host_id ?? 25,
      status: requestBody.status ?? "draft",
      limit: requestBody.limit ?? null,
    };

    // Get listings from static data
    const allListings = listingsStaticData;

    // Apply limit if specified
    const listingsToProcess = options.limit
      ? allListings.slice(0, options.limit)
      : allListings;

    console.log(
      `Starting batch import: ${listingsToProcess.length} listings to process`
    );

    const results: Array<{
      original_id: number;
      title: string;
      new_id?: number;
      status: "created" | "failed";
      error?: string;
    }> = [];

    const errors: Array<{
      original_id: number;
      title: string;
      error: string;
    }> = [];

    let successful = 0;
    let failed = 0;

    // Process listings sequentially to avoid overwhelming the API
    for (let i = 0; i < listingsToProcess.length; i++) {
      const oldListing = listingsToProcess[i];
      const listingNumber = i + 1;

      try {
        console.log(
          `[${listingNumber}/${listingsToProcess.length}] Processing: ${oldListing.title} (ID: ${oldListing.id})`
        );

        // Transform the listing data
        const transformedListing = transformListingData(oldListing, {
          hostId: options.hostId,
          status: options.status,
        });

        // Validate that title exists (required for draft)
        if (
          !transformedListing.title ||
          transformedListing.title.trim() === ""
        ) {
          throw new Error("Title is required but was empty or missing");
        }

        // Create the listing via backend API directly
        const fullUrl = `${process.env.NEXT_PUBLIC_API_URI}/stays`;
        const response = await fetch(fullUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(transformedListing),
          cache: "no-store",
        });

        // Parse response
        const responseText = await response.text();
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error(
            `Invalid JSON response: ${responseText.substring(0, 200)}`
          );
        }

        // Check if the request was successful
        if (response.ok && responseData) {
          // Extract the new listing ID from response
          const newId =
            responseData?.data?.id ||
            responseData?.data?.stay?.id ||
            responseData?.id ||
            null;

          results.push({
            original_id: oldListing.id,
            title: oldListing.title,
            new_id: newId ?? undefined,
            status: "created",
          });

          successful++;
          console.log(
            `✅ [${listingNumber}/${
              listingsToProcess.length
            }] Successfully created: ${oldListing.title} (New ID: ${
              newId ?? "unknown"
            })`
          );
        } else {
          // Handle error response
          const errorMessage =
            responseData?.message ||
            responseData?.error ||
            `HTTP ${response.status}: ${response.statusText}`;

          throw new Error(errorMessage);
        }
      } catch (error: any) {
        failed++;
        const errorMessage =
          error?.message || error?.toString() || "Unknown error";

        results.push({
          original_id: oldListing.id,
          title: oldListing.title || "Unknown Title",
          status: "failed",
          error: errorMessage,
        });

        errors.push({
          original_id: oldListing.id,
          title: oldListing.title || "Unknown Title",
          error: errorMessage,
        });

        console.error(
          `❌ [${listingNumber}/${listingsToProcess.length}] Failed to create: ${oldListing.title} (ID: ${oldListing.id})`,
          errorMessage
        );
      }

      // Small delay between requests to avoid overwhelming the API
      // Skip delay on last item
      if (i < listingsToProcess.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
      }
    }

    // Prepare summary response
    const summary = {
      total: listingsToProcess.length,
      successful,
      failed,
    };

    console.log(
      `Batch import completed: ${successful} successful, ${failed} failed out of ${listingsToProcess.length} total`
    );

    return Response.json(
      {
        success: true,
        summary,
        results: results.slice(0, 100), // Limit results in response to prevent huge payloads
        errors: errors.slice(0, 100), // Limit errors in response
        message: `Processed ${listingsToProcess.length} listings. ${successful} successful, ${failed} failed.`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Batch import error:", error);
    return Response.json(
      {
        error: "Batch import failed",
        message:
          error?.message || error?.toString() || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
