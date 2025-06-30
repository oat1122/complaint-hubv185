import { withAuth } from "next-auth/middleware";
import { NextResponse, NextRequest } from "next/server";

const rateLimit = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string, limit: number = 100): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  const record = rateLimit.get(ip)!;
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return false;
  }

  record.count++;
  return record.count > limit;
}

export default withAuth(
  function middleware(req) {
    const ip = req.ip ?? "127.0.0.1";
    if (isRateLimited(ip)) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }

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

    const response = NextResponse.next();
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set(
      "Referrer-Policy",
      "strict-origin-when-cross-origin"
    );
    return response;
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
