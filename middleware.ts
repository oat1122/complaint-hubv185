import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Check if user is trying to access dashboard
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      const token = req.nextauth.token;
      
      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }

      // Check if user has proper role
      if (!token.role || (token.role !== "admin" && token.role !== "viewer")) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

      // Admin-only routes
      if (req.nextUrl.pathname.startsWith("/dashboard/settings") && token.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (req.nextUrl.pathname.startsWith("/api/complaints") && req.method === "POST") {
          return true;
        }
        if (req.nextUrl.pathname.startsWith("/tracking")) {
          return true;
        }
        if (req.nextUrl.pathname === "/") {
          return true;
        }
        
        // For dashboard routes, require authentication
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/api/dashboard/:path*", "/api/admin/:path*"]
};
