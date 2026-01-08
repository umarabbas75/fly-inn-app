import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const AIRMAIL_API_URL = process.env.NEXT_PUBLIC_AIRMAIL_URL || "http://localhost:3001";

/**
 * GET /api/airmail/chats
 * Get all chats for the current user
 */
export async function GET(request: NextRequest) {
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

  const userId = (token.user as any)?.id;

  if (!userId) {
    return Response.json(
      { error: "Unauthorized", message: "User ID not found" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(`${AIRMAIL_API_URL}/getUserChats/${userId}`, {
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
      { error: "Server error", message: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}


