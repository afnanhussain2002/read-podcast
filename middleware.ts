import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow auth-related routes
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"||
          pathname === "/forget-password" ||
          pathname === "/reset-password"
        ) {
          return true;
        }

        // ✅ Allow Stripe webhook route
    if (pathname.startsWith("/api/webhooks/stripe")) {
      return true;
    }

        // Public routes
        if (pathname === "/" ) {
          return true;
        }
        // All other routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
"/((?!_next/static|_next/image|favicon.ico|public/|api/auth|api/forget-password|api/reset-password|api/webhooks/stripe).*)",
  ],
};