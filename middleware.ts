import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authRedirect } from "@/lib/auth-redirect";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Check the Better Auth session cookie before allowing access to protected pages.
  const hasSession =
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("__Secure-better-auth.session_token");

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
