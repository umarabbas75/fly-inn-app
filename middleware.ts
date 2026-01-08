import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow all public routes (including root "/")
  if (pathname === "/" || pathname.startsWith("/public")) {
    return NextResponse.next();
  }

  // Allow NextAuth API routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Check for NextAuth session token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const userRoles = (token?.user as any)?.roles || [];
  const isAdmin = userRoles.includes("admin");

  // Admin routes - require authentication AND admin role
  if (pathname.startsWith("/admin-dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!isAdmin) {
      // Redirect non-admin users to profile page
      return NextResponse.redirect(new URL("/dashboard/profile", req.url));
    }

    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Auth routes - redirect to appropriate dashboard if already authenticated
  if (pathname.startsWith("/auth")) {
    if (isAuthenticated) {
      // Redirect to admin dashboard if user is admin, otherwise profile page
      const redirectPath = isAdmin ? "/admin-dashboard" : "/dashboard/profile";
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }
    return NextResponse.next();
  }

  // For all other routes, allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|assets|favicon.ico).*)"],
};
