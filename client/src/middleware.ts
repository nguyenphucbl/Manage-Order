import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const privatePaths = ["/manage"];
const publicPaths = ["/login"];
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("pathname", pathname);
  const isAuth = Boolean(request.cookies.get("accessToken")?.value);
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  const isPrivatePath = privatePaths.some((path) => pathname.startsWith(path));
  if (isPrivatePath && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (isPublicPath && isAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/manage/:path*", "/login"],
};
