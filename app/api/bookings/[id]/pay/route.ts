import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/bff-proxy";

/**
 * POST /api/bookings/:id/pay
 * Process payment for a booking
 * Proxies to external API: POST /bookings/:id/pay
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
 *   message: "Payment processed successfully",
 *   data: {
 *     booking_id: number,
 *     payment_intent_id: string,
 *     payment_status: "succeeded" | "requires_action" | "failed",
 *     booking_status: "confirmed",
 *     ...
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
      `/bookings/${id}/pay`,
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
