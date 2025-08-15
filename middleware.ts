import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    // Optional: Add custom logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/", // Redirect to your login page
    },
  },
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - / (login page)
     * - /api/auth/* (NextAuth routes)
     * - /api/webhooks/* (webhook routes that don't need auth)
     * - /_next/static (static files)
     * - /_next/image (image optimization files)
     * - /favicon.ico, /sitemap.xml (static files)
     * - /public/* (public assets)
     */
    "/((?!api/auth|api/webhooks|_next/static|_next/image|favicon.ico|sitemap.xml|public|$).*)",
  ],
};
