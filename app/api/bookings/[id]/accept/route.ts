import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * POST /api/bookings/:id/accept
 * Host accepts a booking request and captures payment
 * Proxies to external API: POST /bookings/:id/accept
 *
 * Security:
 * - Authentication required
 * - User must be the host of the booking
 *
 * Expected Payload:
 * {
 *   message?: string (Optional message to guest)
 * }
 *
 * Expected Response:
 * {
 *   status: true,
 *   message: "Booking accepted and payment captured",
 *   data: {
 *     booking_id: number,
 *     payment_status: "succeeded",
 *     booking_status: "confirmed",
 *     confirmed_at: "2026-01-15T10:30:00Z"
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
      `/bookings/${id}/accept`,
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









