import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * POST /api/bookings/:id/check-in
 * Record check-in for a booking (can be initiated by guest or host)
 * Proxies to external API: POST /bookings/:id/check-in
 *
 * Security:
 * - Authentication required
 * - User must be either the guest or host of the booking
 *
 * Expected Payload:
 * {
 *   checked_by?: "guest" | "host" (optional, inferred from auth context)
 *   check_in_method?: "mobile" | "web" | "host_confirmed" (optional)
 * }
 *
 * Expected Response:
 * {
 *   status: true,
 *   message: "Check-in recorded successfully",
 *   data: {
 *     booking_id: number,
 *     checked_in_at: "2026-01-15T14:30:00Z",
 *     checked_in_by: "guest" | "host",
 *     booking_status: "confirmed",
 *     is_in_progress: true
 *   }
 * }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    return proxyToBackend(
      `/bookings/${id}/check-in`,
      { method: "POST", body },
      request
    );
  } catch (error) {
    return Response.json(
      { error: "Invalid request", message: "Invalid JSON body" },
      { status: 400 }
    );
  }
}









