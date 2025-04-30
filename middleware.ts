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

        // ✅ Public app routes
        const publicRoutes = ["/", "/login", "/register", "/forget-password"];

        if (
          publicRoutes.includes(pathname) ||
          pathname.startsWith("/reset-password")
        ) {
          return true;
        }

        // ✅ Public API routes
        if (
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/api/forget-password") ||
          pathname.startsWith("/api/reset-password") ||
          pathname.startsWith("/api/verify-token") ||
          pathname.startsWith("/api/webhooks/stripe")||
          pathname.startsWith("/api/transcriber")
        ) {
          return true;
        }


        // ✅ All other routes require auth
        return !!token;
      },
    },
  }
);

// ✅ Only match paths that aren't obviously public/static
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
