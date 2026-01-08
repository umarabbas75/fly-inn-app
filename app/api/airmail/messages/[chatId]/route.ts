import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const AIRMAIL_API_URL = process.env.NEXT_PUBLIC_AIRMAIL_URL || "http://localhost:3001";

/**
 * GET /api/airmail/messages/[chatId]
 * Get all messages for a specific chat
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await params;

  const token = await getToken({
    req: request as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return Response.json(
      { error: "Unauthorized", message: "Please log in" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(`${AIRMAIL_API_URL}/getMessages/${chatId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("Airmail API Error:", error);
    return Response.json(
      { error: "Server error", message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}


