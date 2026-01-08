import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * POST /api/bookings/:id/cancel
 * Cancel a booking
 * Proxies to external API: POST /bookings/:id/cancel
 *
 * Security:
 * - Authentication required
 * - User must own the booking (as guest) or be the host
 *
 * Expected Payload (optional):
 * {
 *   reason?: string - Optional cancellation reason
 * }
 *
 * Expected Response:
 * {
 *   status: true,
 *   message: "Booking cancelled successfully",
 *   data: {
 *     booking_id: number,
 *     booking_reference: string,
 *     status: "cancelled",
 *     cancelled_at: string,
 *     refund_amount?: number,
 *     refund_status?: string
 *   }
 * }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let body = {};
    
    try {
      body = await request.json();
    } catch {
      // Body is optional for cancel
    }

    return proxyToBackend(
      `/bookings/${id}/cancel`,
      { method: "POST", body },
      request
    );
  } catch (error) {
    return Response.json(
      { error: "Server error", message: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}


