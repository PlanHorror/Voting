import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get token from cookies or headers
  const token = request.cookies.get("accessToken")?.value || "";
  // const userRole = request.cookies.get("userRole")?.value || "";

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/", "/votes", "/result"];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // // Define role-specific routes
  // const supervisorRoutes = ["/supervisor"];
  // const signerRoutes = ["/signer"];

  // Check if this is a protected route that needs authentication
  const isProtectedRoute = !isPublicRoute;

  // Redirect logic
  if (isProtectedRoute && !token) {
    // Redirect to login if no token for protected routes
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // if (
  //   supervisorRoutes.some((route) =>
  //     request.nextUrl.pathname.startsWith(route)
  //   ) &&
  //   userRole !== "SUPERVISOR"
  // ) {
  //   // Redirect unauthorized supervisor access
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  // if (
  //   signerRoutes.some((route) => request.nextUrl.pathname.startsWith(route)) &&
  //   userRole !== "SIGNER"
  // ) {
  //   // Redirect unauthorized signer access
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
