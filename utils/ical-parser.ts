/**
 * iCal Parser Utility
 * Parses iCal/ICS calendar data and extracts blocked dates
 */

export interface ICalEvent {
  uid: string;
  summary: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  description?: string;
}

/**
 * Parse iCal format date (YYYYMMDD or YYYYMMDDTHHMMSSZ)
 * @param dateString - iCal date string
 * @returns Date string in YYYY-MM-DD format
 */
function parseICalDate(dateString: string): string {
  // Remove any VALUE=DATE: prefix
  const cleanDate = dateString.replace(/^[^:]*:/, "").trim();

  // Handle date-only format (YYYYMMDD)
  if (cleanDate.length === 8) {
    const year = cleanDate.substring(0, 4);
    const month = cleanDate.substring(4, 6);
    const day = cleanDate.substring(6, 8);
    return `${year}-${month}-${day}`;
  }

  // Handle datetime format (YYYYMMDDTHHMMSSZ or YYYYMMDDTHHMMSS)
  if (cleanDate.includes("T")) {
    const datePart = cleanDate.split("T")[0];
    const year = datePart.substring(0, 4);
    const month = datePart.substring(4, 6);
    const day = datePart.substring(6, 8);
    return `${year}-${month}-${day}`;
  }

  // Fallback - try to parse as ISO
  try {
    const date = new Date(cleanDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error("Failed to parse iCal date:", dateString);
    return "";
  }
}

/**
 * Extract value from iCal line
 * @param line - iCal line (e.g., "SUMMARY:My Event")
 * @returns The value part (e.g., "My Event")
 */
function extractValue(line: string): string {
  const colonIndex = line.indexOf(":");
  if (colonIndex === -1) return "";
  return line.substring(colonIndex + 1).trim();
}

/**
 * Parse iCal/ICS content and extract events
 * @param icalContent - Raw iCal string content
 * @returns Array of parsed events
 */
export function parseICalContent(icalContent: string): ICalEvent[] {
  const events: ICalEvent[] = [];
  const lines = icalContent.split(/\r?\n/).map((line) => line.trim());

  let inEvent = false;
  let currentEvent: Partial<ICalEvent> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line === "BEGIN:VEVENT") {
      inEvent = true;
      currentEvent = {};
      continue;
    }

    if (line === "END:VEVENT") {
      inEvent = false;
      // Add event if it has required fields
      if (currentEvent.startDate && currentEvent.endDate) {
        events.push({
          uid: currentEvent.uid || `event-${Date.now()}-${Math.random()}`,
          summary: currentEvent.summary || "Blocked",
          startDate: currentEvent.startDate,
          endDate: currentEvent.endDate,
          description: currentEvent.description,
        });
      }
      continue;
    }

    if (!inEvent) continue;

    // Parse event properties
    if (line.startsWith("UID:")) {
      currentEvent.uid = extractValue(line);
    } else if (line.startsWith("SUMMARY:")) {
      currentEvent.summary = extractValue(line);
    } else if (line.startsWith("DESCRIPTION:")) {
      currentEvent.description = extractValue(line);
    } else if (line.startsWith("DTSTART")) {
      const dateStr = parseICalDate(line);
      if (dateStr) currentEvent.startDate = dateStr;
    } else if (line.startsWith("DTEND")) {
      const dateStr = parseICalDate(line);
      if (dateStr) {
        // iCal DTEND is exclusive, so subtract one day for our inclusive format
        const endDate = new Date(dateStr);
        endDate.setDate(endDate.getDate() - 1);
        const year = endDate.getFullYear();
        const month = String(endDate.getMonth() + 1).padStart(2, "0");
        const day = String(endDate.getDate()).padStart(2, "0");
        currentEvent.endDate = `${year}-${month}-${day}`;
      }
    }
  }

  return events;
}

/**
 * Extract all blocked dates from iCal events
 * @param events - Array of iCal events
 * @returns Array of date strings (YYYY-MM-DD) for all blocked dates
 */
export function extractBlockedDates(events: ICalEvent[]): string[] {
  const allDates = new Set<string>();

  events.forEach((event) => {
    const [startYear, startMonth, startDay] = event.startDate
      .split("-")
      .map(Number);
    const [endYear, endMonth, endDay] = event.endDate.split("-").map(Number);

    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);

    // Generate all dates from start to end (inclusive)
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      allDates.add(`${year}-${month}-${day}`);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return Array.from(allDates).sort();
}

/**
 * Fetch and parse iCal from URL
 * Uses CORS proxy to avoid cross-origin issues
 * @param url - iCal URL
 * @returns Parsed events
 */
export async function fetchAndParseICal(url: string): Promise<ICalEvent[]> {
  try {
    // Use our backend as a proxy to avoid CORS issues
    const response = await fetch(
      `/api/ical-proxy?url=${encodeURIComponent(url)}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch iCal: ${response.statusText}`);
    }

    const icalContent = await response.text();
    return parseICalContent(icalContent);
  } catch (error) {
    console.error("Error fetching iCal:", error);
    throw error;
  }
}
