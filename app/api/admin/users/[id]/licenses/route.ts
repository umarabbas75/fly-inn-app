import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Get JWT token directly
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.accessToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle FormData (license uploads)
    const formData = await request.formData();

    // Forward formData to external API with user ID
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}/users/${id}/licenses`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token.accessToken as string}`,
        },
        body: formData,
      }
    );

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("BFF Admin License Upload Error:", error);
    return Response.json(
      { error: "Server error", message: "Failed to upload license" },
      { status: 500 }
    );
  }
}
