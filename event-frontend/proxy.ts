import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isAuthPage = request.nextUrl.pathname === "/";

  const isTokenMissing = !token || token === "undefined" || token === "null";

  // Redirect to login if accessing protected routes without token
  if (isTokenMissing && request.nextUrl.pathname.startsWith("/events")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect to events if authenticated user tries to access login/register
  if (!isTokenMissing && isAuthPage) {
    return NextResponse.redirect(new URL("/events", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/events/:path*"],
};
