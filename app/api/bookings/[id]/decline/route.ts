import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * POST /api/bookings/:id/decline
 * Host declines a booking request and releases authorized payment
 * Proxies to external API: POST /bookings/:id/decline
 *
 * Security:
 * - Authentication required
 * - User must be the host of the booking
 *
 * Expected Payload:
 * {
 *   reason?: string (Optional decline reason)
 * }
 *
 * Expected Response:
 * {
 *   status: true,
 *   message: "Booking declined",
 *   data: {
 *     booking_id: number,
 *     booking_status: "cancelled",
 *     payment_status: "cancelled"
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
      `/bookings/${id}/decline`,
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









