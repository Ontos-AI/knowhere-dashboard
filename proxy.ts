import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authCookies } from "@/lib/auth-cookie-config";
import { authRedirect } from "@/lib/auth-redirect";

export function proxy(request: NextRequest): NextResponse {
  const { pathname, search } = request.nextUrl;

  // Check the configured Better Auth session cookie before allowing access to protected pages.
  const hasSession = authCookies.hasSessionCookie(request.cookies);

  const isProtectedPath = authRedirect.isProtectedPath(pathname);

  if (isProtectedPath && !hasSession) {
    const callbackURL = `${pathname}${search}`;
    const loginPath = authRedirect.buildAuthPagePath("/login", { callbackURL });

    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all pages except API routes, Next.js internals, and static assets.
    "/((?!api|proxy|_next/static|_next/image|favicon.ico).*)",
  ],
};
