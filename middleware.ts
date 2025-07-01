import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    
    // Check if user is trying to access dashboard
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      if (!token) {
        console.log("No token, redirecting to signin");
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }

      // Check if user has proper role  
      if (!token.role || (token.role !== "ADMIN" && token.role !== "VIEWER")) {
        console.log("Invalid role:", token.role);
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

      // Admin-only routes
      if (req.nextUrl.pathname.startsWith("/dashboard/settings") && token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Check admin API routes
    if (req.nextUrl.pathname.startsWith("/api/admin") || req.nextUrl.pathname.startsWith("/api/dashboard")) {
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      if (token.role !== "ADMIN" && token.role !== "VIEWER") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public routes
        if (req.nextUrl.pathname === "/") return true;
        if (req.nextUrl.pathname.startsWith("/tracking")) return true;
        if (req.nextUrl.pathname.startsWith("/auth")) return true;
        if (req.nextUrl.pathname.startsWith("/unauthorized")) return true;
        
        // Allow public complaint submission
        if (req.nextUrl.pathname === "/api/complaints" && req.method === "POST") return true;
        if (req.nextUrl.pathname === "/api/complaints" && req.method === "GET") return true;
        
        // For protected routes, require authentication
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token && (token.role === "ADMIN" || token.role === "VIEWER");
        }
        
        if (req.nextUrl.pathname.startsWith("/api/admin") || req.nextUrl.pathname.startsWith("/api/dashboard")) {
          return !!token && (token.role === "ADMIN" || token.role === "VIEWER");
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/api/dashboard/:path*", 
    "/api/admin/:path*"
  ]
};
