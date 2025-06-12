import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (!token) {
          return false;
        }
        // Allow auth-related paths to be accessed without authentication
        if (req.nextUrl.pathname.startsWith("/api/auth") || 
            req.nextUrl.pathname === '/login' ||
            req.nextUrl.pathname === '/register'
        ) {
          return true;
        }
        // Public paths that do not require authentication
        if (req.nextUrl.pathname === '/' ||
            req.nextUrl.pathname.startsWith('/api/products') ||
            req.nextUrl.pathname.startsWith('/products')
        ) {
            return true;
        }
        // Admin routes require admin role
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "admin";
        }
        // All the other routes require authentication
        return !!token;
      },
    },
  },
)

export const config = { matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
] }