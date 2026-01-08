import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * POST /api/bookings/:id/authorize
 * Authorize payment for a booking (hold funds without capturing)
 * Proxies to external API: POST /bookings/:id/authorize
 *
 * Security:
 * - Authentication required
 * - User must own the booking
 *
 * Expected Payload:
 * {
 *   payment_method_id: string
 * }
 *
 * Expected Response:
 * {
 *   status: true,
 *   message: "Payment authorized successfully",
 *   data: {
 *     booking_id: number,
 *     payment_intent_id: string,
 *     payment_status: "authorized",
 *     booking_status: "pending_payment",
 *     booking_reference: string
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
      `/bookings/${id}/authorize`,
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









