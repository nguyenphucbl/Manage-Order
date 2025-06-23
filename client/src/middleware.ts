import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const privatePaths = ["/manage"];
const publicPaths = ["/login"];
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = Boolean(request.cookies.get("accessToken")?.value);
  const refreshToken = Boolean(request.cookies.get("refreshToken")?.value);
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  const isPrivatePath = privatePaths.some((path) => pathname.startsWith(path));

  // If the user is not logged in and tries to access a private page, redirect them to the login page
  if (isPrivatePath && !refreshToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearTokens", "true");
    return NextResponse.redirect(url);
  }

  // if the user expired access token
  if (isPrivatePath && !accessToken && refreshToken) {
    const url = new URL("/refresh-token", request.url);
    url.searchParams.set(
      "refreshToken",
      request.cookies.get("refreshToken")?.value || ""
    );
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // If the user is logged in and tries to access the login page, redirect them to the home page
  if (isPublicPath && refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/manage/:path*", "/login/:path*"],
};
