import { NextResponse } from "next/server";

export function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // Only protect /admin-13 routes EXCEPT login page
  if (pathname.startsWith("/admin-13") && pathname !== "/admin-13/login") {
    const token = req.cookies.get("sb-access-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin-13/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-13/:path*"],
};