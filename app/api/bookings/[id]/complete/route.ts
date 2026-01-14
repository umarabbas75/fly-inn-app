import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * POST /api/bookings/:id/complete
 * Mark a confirmed booking as completed
 * Proxies to external API: POST /bookings/:id/complete
 *
 * Security:
 * - Authentication required
 * - User must be the guest, host, or admin of the booking
 *
 * Expected Payload:
 * None (empty body)
 *
 * Expected Response:
 * {
 *   status: true,
 *   message: "Booking marked as completed successfully",
 *   data: {
 *     booking_id: number,
 *     booking_reference: string,
 *     booking_status: "completed",
 *     payment_status: "succeeded"
 *   }
 * }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Empty body as per API spec
    return proxyToBackend(
      `/bookings/${id}/complete`,
      { method: "POST", body: {} },
      request
    );
  } catch (error) {
    return Response.json(
      { error: "Server error", message: "Failed to complete booking" },
      { status: 500 }
    );
  }
}








