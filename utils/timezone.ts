/**
 * Utility functions for timezone detection and handling
 */

const GOOGLE_MAPS_API_KEY = "AIzaSyDXJS_VZMhnp0szh92aZGg8RHszz6RMQN8";

export interface TimezoneResponse {
  dstOffset: number;
  rawOffset: number;
  status: string;
  timeZoneId: string;
  timeZoneName: string;
}

/**
 * Fetches timezone information from Google Timezone API based on coordinates
 * @param latitude - Latitude of the location
 * @param longitude - Longitude of the location
 * @returns Promise with timezone ID (IANA format like "America/Los_Angeles")
 */
export async function getTimezoneFromCoordinates(
  latitude: number,
  longitude: number
): Promise<string | null> {
  try {
    const timestamp = Math.floor(Date.now() / 1000); // Current Unix timestamp
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${timestamp}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      console.error("Failed to fetch timezone:", response.statusText);
      return null;
    }

    const data: TimezoneResponse = await response.json();

    if (data.status === "OK" && data.timeZoneId) {
      return data.timeZoneId; // e.g., "America/Los_Angeles"
    } else {
      console.error("Timezone API error:", data.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching timezone:", error);
    return null;
  }
}

/**
 * Common US timezones mapping for fallback
 */
export const US_TIMEZONES = {
  EST: "America/New_York",
  EDT: "America/New_York",
  CST: "America/Chicago",
  CDT: "America/Chicago",
  MST: "America/Denver",
  MDT: "America/Denver",
  PST: "America/Los_Angeles",
  PDT: "America/Los_Angeles",
  AKST: "America/Anchorage",
  AKDT: "America/Anchorage",
  HST: "Pacific/Honolulu",
  HDT: "Pacific/Honolulu",
} as const;

/**
 * Expands blocked date ranges into a Map with source preserved
 * Used when loading blocked dates from backend in edit mode
 *
 * @param ranges - Array of date ranges from backend with source
 * @returns Map of date string to source string
 *
 * @example
 * expandBlockedDateRangesWithSource([
 *   { start_date: "2025-11-05", end_date: "2025-11-06", source: "airbnb" }
 * ])
 * // Returns: Map {
 * //   "2025-11-05" => "airbnb",
 * //   "2025-11-06" => "airbnb"
 * // }
 */
export function expandBlockedDateRangesWithSource(
  ranges: Array<{
    start_date: string;
    end_date: string;
    source?: string;
  }>
): Map<string, string> {
  const dateMap = new Map<string, string>();

  ranges.forEach((range) => {
    // Parse dates manually to avoid timezone conversion issues
    const [startYear, startMonth, startDay] = range.start_date
      .split("-")
      .map(Number);
    const [endYear, endMonth, endDay] = range.end_date.split("-").map(Number);

    // Create dates using local timezone (month is 0-indexed)
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);

    // Get source (default to "custom" if not provided)
    const source = range.source || "custom";

    // Generate all dates from start to end (inclusive)
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      // Format as YYYY-MM-DD using local date components
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      // Set source for this date
      dateMap.set(dateString, source);

      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return dateMap;
}
