import { NextRequest, NextResponse } from "next/server";

/**
 * iCal Proxy API Route
 * Fetches iCal content from external URLs to avoid CORS issues
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    let icalUrl: URL;
    try {
      icalUrl = new URL(url);
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Only allow http and https protocols
    if (!["http:", "https:"].includes(icalUrl.protocol)) {
      return NextResponse.json(
        { error: "Only HTTP and HTTPS URLs are allowed" },
        { status: 400 }
      );
    }

    // Fetch the iCal content
    const response = await fetch(icalUrl.toString(), {
      headers: {
        "User-Agent": "FlyInn-Calendar/1.0",
        Accept: "text/calendar,text/plain,*/*",
      },
      // Set a timeout
      signal: AbortSignal.timeout(10000), // 10 seconds
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch iCal: ${response.statusText}` },
        { status: response.status }
      );
    }

    const icalContent = await response.text();

    // Validate that it looks like iCal content
    if (!icalContent.includes("BEGIN:VCALENDAR")) {
      return NextResponse.json(
        { error: "Invalid iCal format - missing VCALENDAR" },
        { status: 400 }
      );
    }

    // Return the iCal content with proper content type
    return new NextResponse(icalContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("iCal proxy error:", error);

    if (error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timeout - iCal URL took too long to respond" },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to fetch iCal content" },
      { status: 500 }
    );
  }
}
