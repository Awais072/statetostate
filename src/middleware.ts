import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "a7f8e329591e1d0c5a2428c9f0e1b2c3d4e5f60718293a4b5c6d7e8f90123456";
const encodedKey = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes, excluding /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, encodedKey);
      return NextResponse.next();
    } catch {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("auth_token");
      return response;
    }
  }

  // If user visits /admin/login
  if (pathname === "/admin/login") {
    const reason = request.nextUrl.searchParams.get("reason");
    // If arriving with a logout/timeout reason, delete the cookie and render login page
    if (reason) {
      const response = NextResponse.next();
      response.cookies.delete("auth_token");
      return response;
    }

    const token = request.cookies.get("auth_token")?.value;
    if (token) {
      try {
        await jwtVerify(token, encodedKey);
        return NextResponse.redirect(new URL("/admin", request.url));
      } catch {
        const response = NextResponse.next();
        response.cookies.delete("auth_token");
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
